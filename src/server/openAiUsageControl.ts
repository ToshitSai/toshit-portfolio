import { isRateLimited } from "./security.js";
import { hasPersistentUsageStore, recordUsageEvent, type AiUsageEvent } from "./aiUsageStore.js";

interface ControlResult {
  status: number;
  data:
    | {
        success: true;
        isDuplicate: boolean;
        event: Pick<
          AiUsageEvent,
          "id" | "provider" | "model" | "input_tokens" | "output_tokens" | "total_tokens" | "timestamp" | "request_id"
        >;
      }
    | { success: false; error: string };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function handleOpenAiUsageControlRequest(
  body: unknown,
  clientIp: string = "127.0.0.1",
  authHeader?: string
): Promise<ControlResult> {
  const requiredSecret = process.env.USAGE_INGEST_SECRET?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (!requiredSecret) {
    return { status: 503, data: { success: false, error: "Missing server variable: USAGE_INGEST_SECRET." } };
  }

  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (token !== requiredSecret) {
    return { status: 401, data: { success: false, error: "Unauthorized OpenAI usage control request." } };
  }

  if (!openAiKey) {
    return { status: 503, data: { success: false, error: "Missing server variable: OPENAI_API_KEY." } };
  }

  if (isProd && !hasPersistentUsageStore()) {
    return {
      status: 503,
      data: {
        success: false,
        error: "Missing durable production usage store: GITHUB_USAGE_STORE_TOKEN and GITHUB_USAGE_STORE_REPO.",
      },
    };
  }

  if (await isRateLimited(clientIp)) {
    return { status: 429, data: { success: false, error: "Too many OpenAI usage control requests." } };
  }

  const requestBody = isRecord(body) ? body : {};
  const model = typeof requestBody.model === "string" && requestBody.model.trim() ? requestBody.model.trim() : process.env.OPENAI_USAGE_MODEL || "gpt-4.1-mini";
  const input =
    typeof requestBody.input === "string" && requestBody.input.trim()
      ? requestBody.input.trim()
      : "Reply with exactly: portfolio usage check.";

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      max_output_tokens: 16,
    }),
  });

  const openAiJson = (await openAiResponse.json().catch(() => null)) as unknown;
  if (!openAiResponse.ok) {
    const message =
      isRecord(openAiJson) && isRecord(openAiJson.error) && typeof openAiJson.error.message === "string"
        ? openAiJson.error.message
        : "OpenAI request failed.";
    return { status: 502, data: { success: false, error: message } };
  }

  if (!isRecord(openAiJson) || typeof openAiJson.id !== "string" || !isRecord(openAiJson.usage)) {
    return { status: 502, data: { success: false, error: "OpenAI response did not include a usable usage payload." } };
  }

  const usage = openAiJson.usage;
  const inputTokens = readNumber(usage, "input_tokens");
  const outputTokens = readNumber(usage, "output_tokens");
  const totalTokens = readNumber(usage, "total_tokens");

  if (!Number.isInteger(inputTokens) || !Number.isInteger(outputTokens) || !Number.isInteger(totalTokens)) {
    return { status: 502, data: { success: false, error: "OpenAI usage payload did not include integer token counts." } };
  }

  const event: AiUsageEvent = {
    id: `openai:${openAiJson.id}`,
    provider: "openai",
    metric_type: "tokens_processed",
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
    timestamp: new Date().toISOString(),
    request_id: openAiJson.id,
    source_app: "portfolio-openai-control-request",
  };

  const result = await recordUsageEvent(event);
  return {
    status: 200,
    data: {
      success: true,
      isDuplicate: result.isDuplicate,
      event: {
        id: event.id,
        provider: event.provider,
        model: event.model,
        input_tokens: event.input_tokens,
        output_tokens: event.output_tokens,
        total_tokens: event.total_tokens,
        timestamp: event.timestamp,
        request_id: event.request_id,
      },
    },
  };
}
