import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_missing", {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }

  return stripe;
}
