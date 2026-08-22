import {
  isRateLimited,
  validateAndSanitizeContactInput,
} from "./security.js";

export interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // Honeypot field
}

export interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function processContactSubmission(
  body: ContactRequestBody,
  clientIp: string = "127.0.0.1",
  siteOrigin: string = "https://toshit-portfolio.vercel.app"
): Promise<{ status: number; data: ContactApiResponse }> {
  // 1. Rate Limiting Guard (5 requests per IP per 15 minutes via Upstash Redis or Memory Fallback)
  if (await isRateLimited(clientIp)) {
    return {
      status: 429,
      data: {
        success: false,
        error: "Too many submission attempts. Please wait 15 minutes before sending another message.",
      },
    };
  }

  // 2. Server-side Validation, Sanitization, Length & Honeypot Checks
  const validation = validateAndSanitizeContactInput(body);

  // Honeypot Protection: suppress bot submission without sending email.
  if (validation.isSpamBot) {
    console.info(`[Spam Guard] Suppressed honeypot submission from IP: ${clientIp}`);
    return {
      status: 200,
      data: { success: false, error: "Unable to send message" },
    };
  }

  if (!validation.isValid || !validation.data) {
    return {
      status: 400,
      data: { success: false, error: validation.error || "Invalid form submission." },
    };
  }

  const { name, email, subject, message } = validation.data;
  const recipientEmail = process.env.CONTACT_EMAIL?.trim();

  if (!recipientEmail) {
    console.error("[Contact Configuration Error]: CONTACT_EMAIL is not configured.");
    return {
      status: 503,
      data: {
        success: false,
        error: "Contact delivery is not configured. Please try again later.",
      },
    };
  }

  // 3. Email Delivery via FormSubmit
  try {
    const emailSubject = subject || `New Portfolio Message from ${name}`;
    const normalizedOrigin = siteOrigin.replace(/\/$/, "");
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: normalizedOrigin,
        Referer: `${normalizedOrigin}/contact`,
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: emailSubject,
        _captcha: "false",
        _template: "table",
        message: [
          "New Portfolio Contact Inquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${emailSubject}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean | string;
      message?: string;
    } | null;

    if (!response.ok || data?.success !== true && data?.success !== "true") {
      console.error("[FormSubmit Error]:", data?.message || `HTTP ${response.status}`);
      return {
        status: 502,
        data: {
          success: false,
          error: "Unable to send message",
        },
      };
    }

    console.log("[FormSubmit Email Sent Successfully]");
    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully",
      },
    };
  } catch (err: unknown) {
    console.error("[FormSubmit Exception]:", err instanceof Error ? err.message : err);
    return {
      status: 502,
      data: {
        success: false,
        error: "Unable to send message",
      },
    };
  }
}
