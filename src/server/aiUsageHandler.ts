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
