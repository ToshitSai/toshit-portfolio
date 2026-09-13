import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

export type AiUsageProvider = "openai" | "antigravity";
export type AiUsageMetricType = "tokens_processed" | "quota_remaining";
export type AiUsagePeriod = "all_time" | "today" | "this_month";

export interface AiUsageEvent {
  id: string;
  provider: AiUsageProvider;
  metric_type: AiUsageMetricType;
  model: string;
  input_tokens?: number;
  output_tokens?: number;
  thinking_tokens?: number;
  cache_read_tokens?: number;
  total_tokens?: number;
  quota_percentage?: number;
  timestamp: string;
  request_id?: string;
  source_app: string;
}

export interface MetricSummary {
  type: AiUsageMetricType;
  value: number;
  unit: "tokens" | "%";
  models?: Record<string, number>;
  lastEventTime?: string;
  source: "usage_events";
}

export interface AiUsageResponseData {
  success: true;
  updatedAt: string;
  lastEventTime?: string;
  period: AiUsagePeriod;
  periodStart?: string;
  periodEnd: string;
  isLive: boolean;
  freshness: "LIVE" | "RECENT" | "STALE" | "NO_DATA";
  source: "redis" | "local_json" | "memory";
  eventCount: number;
  metrics: {
    openai: MetricSummary | null;
    antigravity: MetricSummary | null;
    combined: MetricSummary | null;
  };
}

let memoryEvents: AiUsageEvent[] = [];
let isInitialized = false;
let activeSource: AiUsageResponseData["source"] = "memory";

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (err) {
    console.error("[AiUsageStore] Redis init error:", err);
  }
}

function getStorageFilePath(): string {
  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "ai_usage_db.json");
}

async function withTimeout<T>(promise: Promise<T>, ms: number = 1500): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Redis operation timed out")), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidIsoTimestamp(value: string): boolean {
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value;
}

function normalizeOptionalToken(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (!isNonNegativeInteger(value)) {
    throw new Error("Token counts must be non-negative integers.");
  }
  return value;
}

export function normalizeUsageEvent(payload: Partial<AiUsageEvent>): AiUsageEvent {
  if (!payload.id || typeof payload.id !== "string" || !payload.id.trim()) {
    throw new Error("A stable unique event id is required.");
  }

  if (payload.provider !== "openai" && payload.provider !== "antigravity") {
    throw new Error("Provider must be 'openai' or 'antigravity'.");
  }

  if (payload.metric_type !== "tokens_processed" && payload.metric_type !== "quota_remaining") {
    throw new Error("Metric type must be 'tokens_processed' or 'quota_remaining'.");
  }

  if (!payload.model || typeof payload.model !== "string" || !payload.model.trim()) {
    throw new Error("Model identifier string is required.");
  }

  if (!payload.timestamp || typeof payload.timestamp !== "string" || !isValidIsoTimestamp(payload.timestamp)) {
    throw new Error("Timestamp must be an ISO 8601 UTC string.");
  }

  const event: AiUsageEvent = {
    id: payload.id.trim(),
    provider: payload.provider,
    metric_type: payload.metric_type,
    model: payload.model.trim(),
    timestamp: payload.timestamp,
    request_id: typeof payload.request_id === "string" ? payload.request_id.trim() : undefined,
    source_app: typeof payload.source_app === "string" && payload.source_app.trim() ? payload.source_app.trim() : "usage-ingest",
  };

  if (event.metric_type === "tokens_processed") {
    event.input_tokens = normalizeOptionalToken(payload.input_tokens);
    event.output_tokens = normalizeOptionalToken(payload.output_tokens);
    event.thinking_tokens = normalizeOptionalToken(payload.thinking_tokens);
    event.cache_read_tokens = normalizeOptionalToken(payload.cache_read_tokens);

    if (payload.total_tokens !== undefined) {
      event.total_tokens = normalizeOptionalToken(payload.total_tokens);
    } else if (event.input_tokens !== undefined || event.output_tokens !== undefined) {
      event.total_tokens = (event.input_tokens || 0) + (event.output_tokens || 0);
    }

    if (!isNonNegativeInteger(event.total_tokens)) {
      throw new Error("A non-negative integer total_tokens value is required for token usage events.");
    }

    const visibleTokenSum = (event.input_tokens || 0) + (event.output_tokens || 0);
    if ((event.input_tokens !== undefined || event.output_tokens !== undefined) && visibleTokenSum !== event.total_tokens) {
      throw new Error("total_tokens must equal input_tokens + output_tokens when both are provided.");
    }
  }

  if (event.metric_type === "quota_remaining") {
    if (!isNonNegativeInteger(payload.quota_percentage) || payload.quota_percentage > 100) {
      throw new Error("quota_percentage must be an integer from 0 to 100.");
    }
    event.quota_percentage = payload.quota_percentage;
  }

  return event;
}

function normalizeStoredEvents(rawEvents: unknown): AiUsageEvent[] {
  if (!Array.isArray(rawEvents)) return [];

  const normalized: AiUsageEvent[] = [];
  const seen = new Set<string>();

  for (const rawEvent of rawEvents) {
    try {
      const event = normalizeUsageEvent(rawEvent as Partial<AiUsageEvent>);
      if (!seen.has(event.id)) {
        normalized.push(event);
        seen.add(event.id);
      }
    } catch (err) {
      console.warn("[AiUsageStore] Ignoring invalid stored usage event:", err instanceof Error ? err.message : err);
    }
  }

  return normalized;
}

export async function initializeStore(): Promise<void> {
  if (isInitialized) return;

  if (redis) {
    try {
      const redisData = await withTimeout(redis.get<AiUsageEvent[]>("ai_usage:events"), 1500);
      memoryEvents = normalizeStoredEvents(redisData);
      activeSource = "redis";
      isInitialized = true;
      return;
    } catch (err) {
      console.warn("[AiUsageStore] Redis load warning:", err instanceof Error ? err.message : err);
    }
  }

  const filePath = getStorageFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      memoryEvents = normalizeStoredEvents(parsed);
      activeSource = "local_json";
      isInitialized = true;
      return;
    } catch (err) {
      console.warn("[AiUsageStore] File read warning:", err instanceof Error ? err.message : err);
    }
  }

  memoryEvents = [];
  activeSource = "memory";
  isInitialized = true;
}

function saveStoreLocally(): void {
  const filePath = getStorageFilePath();
  fs.writeFileSync(filePath, JSON.stringify(memoryEvents, null, 2), "utf-8");

  if (redis) {
    redis.set("ai_usage:events", memoryEvents).catch((err) => {
      console.error("[AiUsageStore] Redis sync error:", err);
    });
  }
}

export async function recordUsageEvent(event: AiUsageEvent): Promise<{ success: true; isDuplicate: boolean }> {
  await initializeStore();

  const normalizedEvent = normalizeUsageEvent(event);
  if (memoryEvents.some((existing) => existing.id === normalizedEvent.id)) {
    return { success: true, isDuplicate: true };
  }

  memoryEvents.push(normalizedEvent);
  saveStoreLocally();

  return { success: true, isDuplicate: false };
}

function getPeriodBounds(period: AiUsagePeriod): { start?: Date; end: Date } {
  const end = new Date();
  if (period === "all_time") return { end };

  const start = new Date(end);
  start.setUTCHours(0, 0, 0, 0);

  if (period === "this_month") {
    start.setUTCDate(1);
  }

  return { start, end };
}

function summarizeProvider(events: AiUsageEvent[]): MetricSummary | null {
  if (events.length === 0) return null;

  const metricTypes = new Set(events.map((event) => event.metric_type));
  if (metricTypes.size > 1) {
    throw new Error("Provider has mixed usage metric types in the selected period.");
  }

  const metricType = events[0].metric_type;
  const lastEventTime = events
    .map((event) => event.timestamp)
    .sort()
    .at(-1);

  if (metricType === "quota_remaining") {
    const latestQuotaEvent = [...events].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];
    return {
      type: "quota_remaining",
      value: latestQuotaEvent.quota_percentage || 0,
      unit: "%",
      lastEventTime,
      source: "usage_events",
    };
  }

  const models: Record<string, number> = {};
  let total = 0;
  for (const event of events) {
    const tokens = event.total_tokens;
    if (!isNonNegativeInteger(tokens)) {
      throw new Error("Token usage event is missing a valid total_tokens value.");
    }
    total += tokens;
    models[event.model] = (models[event.model] || 0) + tokens;
  }

  const modelTotal = Object.values(models).reduce((sum, value) => sum + value, 0);
  if (modelTotal !== total) {
    throw new Error("Model breakdown total does not equal provider total.");
  }

  return {
    type: "tokens_processed",
    value: total,
    unit: "tokens",
    models,
    lastEventTime,
    source: "usage_events",
  };
}

function getFreshness(lastEventTime?: string): AiUsageResponseData["freshness"] {
  if (!lastEventTime) return "NO_DATA";

  const ageMs = Date.now() - Date.parse(lastEventTime);
  if (ageMs < 5 * 60 * 1000) return "LIVE";
  if (ageMs < 30 * 60 * 1000) return "RECENT";
  return "STALE";
}

export async function getAggregatedMetrics(period: AiUsagePeriod = "all_time"): Promise<AiUsageResponseData> {
  await initializeStore();

  const { start, end } = getPeriodBounds(period);
  const filteredEvents = memoryEvents.filter((event) => {
    const eventMs = Date.parse(event.timestamp);
    if (!Number.isFinite(eventMs)) return false;
    return (!start || eventMs >= start.getTime()) && eventMs <= end.getTime();
  });

  const openaiSummary = summarizeProvider(filteredEvents.filter((event) => event.provider === "openai"));
  const antigravitySummary = summarizeProvider(filteredEvents.filter((event) => event.provider === "antigravity"));

  let combinedSummary: MetricSummary | null = null;
  if (
    openaiSummary?.type === "tokens_processed" &&
    antigravitySummary?.type === "tokens_processed"
  ) {
    combinedSummary = {
      type: "tokens_processed",
      value: openaiSummary.value + antigravitySummary.value,
      unit: "tokens",
      models: {
        ...(openaiSummary.models || {}),
        ...(antigravitySummary.models || {}),
      },
      lastEventTime: [openaiSummary.lastEventTime, antigravitySummary.lastEventTime].filter(Boolean).sort().at(-1),
      source: "usage_events",
    };

    if (combinedSummary.value !== openaiSummary.value + antigravitySummary.value) {
      throw new Error("Combined total does not equal provider totals.");
    }
  }

  const lastEventTime = filteredEvents
    .map((event) => event.timestamp)
    .sort()
    .at(-1);
  const freshness = getFreshness(lastEventTime);

  return {
    success: true,
    updatedAt: new Date().toISOString(),
    lastEventTime,
    period,
    periodStart: start?.toISOString(),
    periodEnd: end.toISOString(),
    isLive: freshness === "LIVE",
    freshness,
    source: activeSource,
    eventCount: filteredEvents.length,
    metrics: {
      openai: openaiSummary,
      antigravity: antigravitySummary,
      combined: combinedSummary,
    },
  };
}
