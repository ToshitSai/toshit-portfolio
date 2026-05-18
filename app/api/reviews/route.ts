import { NextRequest, NextResponse } from "next/server";

import { runCodeReview } from "@/lib/ai-review";
import { rateLimit } from "@/lib/rate-limit";
import { scanRequestSchema } from "@/types/codeguardian";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const limited = rateLimit(`review:${ip}`, 12, 60_000);

  if (!limited.success) {
    return NextResponse.json({ error: "Too many review requests. Please wait a minute and try again." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = scanRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review request.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const report = await runCodeReview(parsed.data);
    return NextResponse.json(report, { headers: { "x-ratelimit-remaining": String(limited.remaining) } });
  } catch (error) {
    console.error("Code review failed", error);
    return NextResponse.json({ error: "AI review failed. Check server logs and environment configuration." }, { status: 500 });
  }
}
