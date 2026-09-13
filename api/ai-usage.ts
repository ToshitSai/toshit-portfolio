import dotenv from "dotenv";
import { handleGetAiUsage, handleRecordAiUsage } from "../src/server/aiUsageHandler.js";

dotenv.config({ path: [".env.local", ".env"] });

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: {
    remoteAddress?: string;
  };
}

interface VercelResponse {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): {
    json(data: unknown): void;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Disable CDN caching so live metric queries and manual refreshes always return real fresh server state
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");

  if (req.method === "GET") {
    const queryParams: Record<string, string | undefined> = {};
    if (req.query) {
      for (const [k, v] of Object.entries(req.query)) {
        queryParams[k] = Array.isArray(v) ? v[0] : v;
      }
    }
    const result = await handleGetAiUsage(queryParams);
    return res.status(result.status).json(result.data);
  }

  if (req.method === "POST") {
    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const authHeader = req.headers.authorization as string | undefined;
    let body: unknown;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      return res.status(400).json({ success: false, error: "Request body must be valid JSON." });
    }

    const result = await handleRecordAiUsage(body, clientIp, authHeader);
    return res.status(result.status).json(result.data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
