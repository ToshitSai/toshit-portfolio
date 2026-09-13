import {
  getAggregatedMetrics,
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
  // Optional security check: if USAGE_INGEST_SECRET is defined, verify header
  const requiredSecret = process.env.USAGE_INGEST_SECRET?.trim();
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

  const payload = body as Partial<AiUsageEvent>;

  if (!payload.provider || (payload.provider !== "openai" && payload.provider !== "antigravity")) {
    return {
      status: 400,
      data: { success: false, error: "Provider must be 'openai' or 'antigravity'." },
    };
  }

  if (!payload.metric_type || (payload.metric_type !== "tokens_processed" && payload.metric_type !== "quota_remaining")) {
    return {
      status: 400,
      data: { success: false, error: "Metric type must be 'tokens_processed' or 'quota_remaining'." },
    };
  }

  if (!payload.model || typeof payload.model !== "string") {
    return {
      status: 400,
      data: { success: false, error: "Model identifier string is required." },
    };
  }

  const event: AiUsageEvent = {
    id: payload.id || `evt_${payload.provider}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    provider: payload.provider,
    metric_type: payload.metric_type,
    model: payload.model.trim(),
    input_tokens: typeof payload.input_tokens === "number" ? Math.max(0, payload.input_tokens) : undefined,
    output_tokens: typeof payload.output_tokens === "number" ? Math.max(0, payload.output_tokens) : undefined,
    thinking_tokens: typeof payload.thinking_tokens === "number" ? Math.max(0, payload.thinking_tokens) : undefined,
    cache_read_tokens: typeof payload.cache_read_tokens === "number" ? Math.max(0, payload.cache_read_tokens) : undefined,
    total_tokens: typeof payload.total_tokens === "number" ? Math.max(0, payload.total_tokens) : undefined,
    quota_percentage: typeof payload.quota_percentage === "number" ? Math.min(100, Math.max(0, payload.quota_percentage)) : undefined,
    timestamp: payload.timestamp || new Date().toISOString(),
    source_app: typeof payload.source_app === "string" ? payload.source_app : "api-recorder",
  };

  const result = await recordUsageEvent(event);
  if (!result.success) {
    return {
      status: 400,
      data: { success: false, error: result.error || "Failed to record usage event." },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      isDuplicate: result.isDuplicate,
    },
  };
}
