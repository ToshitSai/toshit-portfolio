import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { processContactSubmission } from "../src/server/contactHandler";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  // Extract client IP address securely for rate limiting
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const result = await processContactSubmission(body, clientIp);
    return res.status(result.status).json(result.data);
  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
      return res.status(400).json({ success: false, error: "Request body must be valid JSON." });
    }
    return res.status(500).json({ success: false, error: "An unexpected error occurred." });
  }
}
