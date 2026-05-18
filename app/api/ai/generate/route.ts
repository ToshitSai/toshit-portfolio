import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { generateWebsite } from "@/features/ai/generator";
import { generationPromptSchema } from "@/features/ai/schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { userId } =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
      ? await auth()
      : { userId: null };
  const limiter = rateLimit(userId ?? request.headers.get("x-forwarded-for") ?? "anonymous", 8, 60_000);

  if (!limiter.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = generationPromptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const site = await generateWebsite(parsed.data);
  return NextResponse.json({ site });
}
