import dotenv from "dotenv";
import { handleOpenAiUsageControlRequest } from "../src/server/openAiUsageControl.js";

dotenv.config({ path: [".env.local", ".env"] });

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
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
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

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

  const result = await handleOpenAiUsageControlRequest(body, clientIp, authHeader);
  return res.status(result.status).json(result.data);
}
