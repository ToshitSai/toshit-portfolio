import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generatedSiteSchema } from "@/features/ai/schema";

const publishSchema = z.object({
  site: generatedSiteSchema,
  mode: z.enum(["autosave", "publish"]).default("publish"),
});

export async function POST(request: Request) {
  const { userId } =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
      ? await auth()
      : { userId: "local-preview" };
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const parsed = publishSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    mode: parsed.data.mode,
    url: `/s/${parsed.data.site.slug}`,
    savedAt: new Date().toISOString(),
  });
}
