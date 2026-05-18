import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { plans } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";
import { getStripe } from "@/services/stripe";

const checkoutSchema = z.object({
  planId: z.enum(["pro", "team"]),
});

export async function POST(request: Request) {
  const { userId } =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
      ? await auth()
      : { userId: "local-preview" };
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const plan = plans.find((item) => item.id === parsed.data.planId);
  const priceId = plan?.priceIdEnv ? process.env[plan.priceIdEnv] : undefined;
  if (!priceId) return NextResponse.json({ error: "Stripe price is not configured" }, { status: 400 });

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: absoluteUrl("/dashboard/billing?success=true"),
    cancel_url: absoluteUrl("/dashboard/billing?canceled=true"),
    client_reference_id: userId,
  });

  return NextResponse.json({ url: session.url });
}
