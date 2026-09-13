/**
 * Antigravity Usage Local Collector Script
 * Reads local environment / agent usage metadata and pushes non-secret usage metrics
 * to the backend API endpoint (/api/ai-usage).
 *
 * Usage:
 *   node scripts/sync-antigravity-usage.js [tokens|quota] [amount] [model]
 *
 * Example:
 *   node scripts/sync-antigravity-usage.js tokens 15000 gemini-1.5-pro
 *   node scripts/sync-antigravity-usage.js quota 72 gemini-1.5-pro
 */

import http from "http";
import https from "https";

const args = process.argv.slice(2);
const mode = args[0] || "tokens"; // 'tokens' or 'quota'
const amount = parseInt(args[1], 10) || 5000;
const model = args[2] || "gemini-1.5-pro";

const apiUrl = process.env.PORTFOLIO_API_URL || "http://localhost:8080/api/ai-usage";
const ingestSecret = process.env.USAGE_INGEST_SECRET || "";

const payload = mode === "quota"
  ? {
      id: `evt_cli_quota_${Date.now()}`,
      provider: "antigravity",
      metric_type: "quota_remaining",
      model: model,
      quota_percentage: amount,
      timestamp: new Date().toISOString(),
      source_app: "antigravity-cli-collector",
    }
  : {
      id: `evt_cli_tokens_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      provider: "antigravity",
      metric_type: "tokens_processed",
      model: model,
      input_tokens: Math.floor(amount * 0.7),
      output_tokens: Math.floor(amount * 0.3),
      total_tokens: amount,
      timestamp: new Date().toISOString(),
      source_app: "antigravity-cli-collector",
    };

console.log(`[Antigravity Collector] Sending ${mode} metric (${amount}) for model ${model} to ${apiUrl}...`);

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
