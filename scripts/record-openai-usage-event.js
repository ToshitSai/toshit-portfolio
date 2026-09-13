#!/usr/bin/env node
/**
 * Makes one real OpenAI request through the portfolio backend and records its
 * actual response.usage token counts in the verified usage store.
 *
 * Usage:
 *   node scripts/record-openai-usage-event.js
 *
 * Required environment variables:
 *   PORTFOLIO_API_URL       Example: http://127.0.0.1:8080 or https://toshit-portfolio.vercel.app
 *   USAGE_INGEST_SECRET     Server-side shared ingest secret
 */

import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

const baseUrl = (process.env.PORTFOLIO_API_URL || "http://127.0.0.1:8080").replace(/\/+$/, "");
const ingestSecret = process.env.USAGE_INGEST_SECRET?.trim();

if (!ingestSecret) {
  console.error("Missing required server variable: USAGE_INGEST_SECRET");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/ai-usage-control-request`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${ingestSecret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});

const data = await response.json().catch(() => null);

if (!response.ok) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        status: response.status,
        error: data?.error || "OpenAI usage control request failed.",
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      status: response.status,
      event: data.event,
      isDuplicate: data.isDuplicate,
    },
    null,
    2
  )
);
