/**
 * Antigravity Usage Local Collector Script
 * Reads local environment / agent usage metadata and pushes non-secret usage metrics
 * to the backend API endpoint (/api/ai-usage).
 *
 * Usage:
 *   node scripts/sync-antigravity-usage.js tokens [input_tokens] [output_tokens] [model] [event-id]
 *   node scripts/sync-antigravity-usage.js quota [quota_percentage] [model] [event-id]
 *
 * Example:
 *   node scripts/sync-antigravity-usage.js tokens 9000 6000 gemini-1.5-pro antigravity-run-2026-09-13T08-30-00Z
 *   node scripts/sync-antigravity-usage.js quota 72 gemini-1.5-pro antigravity-quota-2026-09-13
 */

import http from "http";
import https from "https";

const args = process.argv.slice(2);
const mode = args[0] || "tokens"; // 'tokens' or 'quota'
const firstValue = Number.parseInt(args[1], 10);
const outputTokens = mode === "tokens" ? Number.parseInt(args[2], 10) : undefined;
const model = mode === "tokens" ? args[3] || "gemini-1.5-pro" : args[2] || "gemini-1.5-pro";
const eventId = mode === "tokens" ? args[4] || "" : args[3] || "";

const apiUrl = process.env.PORTFOLIO_API_URL || "http://localhost:8080/api/ai-usage";
const ingestSecret = process.env.USAGE_INGEST_SECRET || "";

if (!Number.isInteger(firstValue) || firstValue < 0) {
  console.error("✖ [Antigravity Collector] input_tokens/quota_percentage must be a non-negative integer.");
  process.exit(1);
}

if (mode === "tokens" && (!Number.isInteger(outputTokens) || outputTokens < 0)) {
  console.error("✖ [Antigravity Collector] output_tokens must be a non-negative integer.");
  process.exit(1);
}

if (!eventId) {
  console.error("✖ [Antigravity Collector] a stable event-id is required to prevent duplicate counting.");
  process.exit(1);
}

const timestamp = new Date().toISOString();
const payload = mode === "quota"
  ? {
      id: eventId,
      provider: "antigravity",
      metric_type: "quota_remaining",
      model: model,
      quota_percentage: firstValue,
      timestamp,
      source_app: "antigravity-cli-collector",
    }
  : {
      id: eventId,
      provider: "antigravity",
      metric_type: "tokens_processed",
      model: model,
      input_tokens: firstValue,
      output_tokens: outputTokens,
      total_tokens: firstValue + outputTokens,
      timestamp,
      source_app: "antigravity-cli-collector",
    };

console.log(`[Antigravity Collector] Sending ${mode} metric for model ${model} to ${apiUrl}...`);

const urlObj = new URL(apiUrl);
const isHttps = urlObj.protocol === "https:";
const client = isHttps ? https : http;

const postData = JSON.stringify(payload);

const req = client.request(
  apiUrl,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      ...(ingestSecret ? { Authorization: `Bearer ${ingestSecret}` } : {}),
    },
  },
  (res) => {
    let responseBody = "";
    res.on("data", (chunk) => {
      responseBody += chunk;
    });
    res.on("end", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log("✔ [Antigravity Collector] Sync successful:", responseBody);
      } else {
        console.error(`✖ [Antigravity Collector] Sync failed (HTTP ${res.statusCode}):`, responseBody);
      }
    });
  }
);

req.on("error", (err) => {
  console.error("✖ [Antigravity Collector] Network error:", err.message);
});

req.write(postData);
req.end();
