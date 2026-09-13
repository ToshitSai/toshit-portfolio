import {
  getAggregatedMetrics,
  hasPersistentUsageStore,
  normalizeUsageEvent,
  recordUsageEvent,
  AiUsageEvent,
  AiUsageResponseData,
} from "./aiUsageStore.js";
import { isRateLimited } from "./security.js";

export interface AiUsageApiResult {
  status: number;
  data: AiUsageResponseData | { success: boolean; error?: string; isDuplicate?: boolean };
}

export async function handleGetAiUsage(
  queryParams: Record<string, string | undefined>
): Promise<AiUsageApiResult> {
  try {
    const rawPeriod = queryParams.period?.toLowerCase();
    let period: "all_time" | "today" | "this_month" = "all_time";
    if (rawPeriod === "today" || rawPeriod === "this_month") {
      period = rawPeriod;
    }

    const data = await getAggregatedMetrics(period);
    return {
      status: 200,
      data,
    };
  } catch (err: unknown) {
    console.error("[AiUsageHandler] GET Error:", err);
    return {
      status: 500,
      data: {
        success: false,
        error: "Unable to retrieve AI usage data.",
      },
    };
  }
}

export async function handleRecordAiUsage(
  body: unknown,
  clientIp: string = "127.0.0.1",
  authHeader?: string
): Promise<AiUsageApiResult> {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  // Production ingest must be authenticated so the public site cannot forge usage totals.
  const requiredSecret = process.env.USAGE_INGEST_SECRET?.trim();
  if (isProd && !requiredSecret) {
    return {
      status: 503,
      data: { success: false, error: "Usage ingest is not configured." },
    };
  }

  if (isProd && !hasPersistentUsageStore()) {
    return {
      status: 503,
      data: { success: false, error: "Usage store is not configured. Missing GITHUB_USAGE_STORE_TOKEN and GITHUB_USAGE_STORE_REPO." },
    };
  }

  if (requiredSecret) {
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (token !== requiredSecret) {
      return {
        status: 401,
        data: { success: false, error: "Unauthorized usage ingest request." },
      };
    }
  }

  // Rate limit ingest attempts to prevent spam
  if (await isRateLimited(clientIp)) {
    return {
      status: 429,
      data: { success: false, error: "Too many usage recording requests." },
    };
  }

  if (!body || typeof body !== "object") {
    return {
      status: 400,
      data: { success: false, error: "Invalid usage payload." },
    };
  }

  let event: AiUsageEvent;
  try {
    event = normalizeUsageEvent(body as Partial<AiUsageEvent>);
  } catch (err) {
    return {
      status: 400,
      data: {
        success: false,
        error: err instanceof Error ? err.message : "Invalid usage payload.",
      },
    };
  }

  const result = await recordUsageEvent(event);
  return {
    status: 200,
    data: {
      success: true,
      isDuplicate: result.isDuplicate,
    },
  };
}

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

/**
 * Log real Gemini / AI API token usage to the persistent store.
 * Gate logging behind NODE_ENV === 'production' or VERCEL_ENV === 'production' to exclude dev/testing calls.
 */
export async function logGeminiApiUsage(params: {
  source: string;
  model: string;
  usageMetadata?: GeminiUsageMetadata;
  requestId?: string;
  provider?: "antigravity" | "openai";
}): Promise<{ success: boolean; isDuplicate?: boolean; skipped?: boolean }> {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  if (!isProd) {
    console.log(`[AiUsage] Skipping local dev call logging for source: ${params.source}`);
    return { success: true, skipped: true };
  }

  const input_tokens = params.usageMetadata?.promptTokenCount || 0;
  const output_tokens = params.usageMetadata?.candidatesTokenCount || 0;
  const total_tokens = params.usageMetadata?.totalTokenCount || (input_tokens + output_tokens);

  if (total_tokens <= 0) {
    return { success: true, skipped: true };
  }

  const event: AiUsageEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    provider: params.provider || "antigravity",
    metric_type: "tokens_processed",
    model: params.model,
    input_tokens,
    output_tokens,
    total_tokens,
    timestamp: new Date().toISOString(),
    source_app: params.source,
    request_id: params.requestId,
  };

  return await recordUsageEvent(event);
}
