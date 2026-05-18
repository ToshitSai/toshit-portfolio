import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { absoluteUrl } from "@/lib/utils";
import { getStripe } from "@/services/stripe";

export async function POST() {
  const { userId } =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
      ? await auth()
      : { userId: "local-preview" };
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const customer = process.env.STRIPE_DEMO_CUSTOMER_ID;

  if (!customer) {
    return NextResponse.json({ error: "No Stripe customer configured yet" }, { status: 400 });
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer,
    return_url: absoluteUrl("/dashboard/billing"),
  });

  return NextResponse.json({ url: session.url });
}
