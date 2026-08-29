/**
 * Production Security Utilities for Contact API & Server Routes
 * Durable Upstash Redis Rate Limiting, Input Sanitization, Anti-Spam Guards, & Header Injection Prevention.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis durable rate limiter if credentials exist
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/portfolio",
    });
  } catch (err: unknown) {
    console.error("[Upstash Init Error]:", err instanceof Error ? err.message : err);
  }
}

// In-memory fallback rate limiter for local dev / unconfigured environments
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Checks whether an IP address is rate-limited (5 requests per 15 mins).
 * Uses Upstash Redis when configured, otherwise falls back to an in-memory limiter.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(ip);
      return !success;
    } catch (err: unknown) {
      console.error(
        "[Upstash RateLimit Error]: Redis unreachable. Failing safe (blocking request).",
        err instanceof Error ? err.message : err
      );
      // Fail safe in production: block request if Redis fails
      if (isProd) {
        return true;
      }
    }
  }

  // Fallback in-memory limiter keeps unconfigured deployments usable.
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((ts) => now - ts < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

/**
 * Sanitizes input to prevent SMTP Header Injection (strips \r and \n from single-line fields)
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, " ").trim();
}

/**
 * Escapes HTML characters to prevent XSS in HTML email templates and external webhooks
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strict Input Validation, Length Constraints, Anti-Bot Timestamp, and Server-Side HTML Sanitization
 */
export interface ValidatedContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function validateAndSanitizeContactInput(
  body: unknown
): {
  isValid: boolean;
  error?: string;
  isSpamBot?: boolean;
  data?: ValidatedContactData;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid form payload." };
  }

  const payload = body as Record<string, unknown>;
  const stringFields = ["name", "email", "subject", "message", "website"];

  for (const field of stringFields) {
    if (payload[field] !== undefined && typeof payload[field] !== "string") {
      return { isValid: false, error: "Invalid form payload." };
    }
  }

  // 1. Anti-Spam Honeypot Check
  const website = String(payload.website ?? "").trim();
  if (website.length > 0) {
    return {
      isValid: false,
      isSpamBot: true,
    };
  }

  // 2. Anti-Bot Time-based Latency Check (Reject submissions completed in < 3000ms from form mount)
  const MIN_FORM_FILL_MS = 3000;
  const now = Date.now();
  const formTimestamp = Number(payload._ts);
  if (formTimestamp && (!Number.isFinite(formTimestamp) || formTimestamp > now || now - formTimestamp < MIN_FORM_FILL_MS)) {
    return {
      isValid: false,
      isSpamBot: true,
    };
  }

  // 3. Extract & Sanitize Input Fields
  const rawName = String(payload.name ?? "").trim();
  const rawEmail = String(payload.email ?? "").trim();
  const rawSubject = String(payload.subject ?? "").trim();
  const rawMessage = String(payload.message ?? "").trim();

  // 4. Required Field Validation
  if (!rawName) {
    return { isValid: false, error: "Name is required." };
  }
  if (!rawEmail) {
    return { isValid: false, error: "Email address is required." };
  }
  if (!rawMessage) {
    return { isValid: false, error: "Message cannot be empty." };
  }

  // 5. Maximum Length Enforcement
  if (rawName.length > 100) {
    return { isValid: false, error: "Name cannot exceed 100 characters." };
  }
  if (rawEmail.length > 254) {
    return { isValid: false, error: "Email cannot exceed 254 characters." };
  }
  if (rawSubject.length > 200) {
    return { isValid: false, error: "Subject cannot exceed 200 characters." };
  }
  if (rawMessage.length > 5000) {
    return { isValid: false, error: "Message cannot exceed 5000 characters." };
  }

  // 6. Strict Email Format Regex Validation (RFC 5322 Compliant subset)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(rawEmail)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  // 7. Header Injection Protection & Complete Server-Side HTML Sanitization
  const name = escapeHtml(sanitizeHeaderValue(rawName));
  const email = escapeHtml(sanitizeHeaderValue(rawEmail));
  const subject = escapeHtml(sanitizeHeaderValue(rawSubject));
  const message = escapeHtml(rawMessage);

  return {
    isValid: true,
    data: {
      name,
      email,
      subject,
      message,
    },
  };
}
