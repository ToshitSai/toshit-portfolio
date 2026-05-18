import { Check, Shield } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { plans } from "@/config/site";

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-60" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400">
            <Shield className="h-4 w-4" />
          </span>
          CodeGuardian AI
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/scan">Start Free</Link>
          </Button>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline">Pricing</Badge>
          <h1 className="neon-text mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            Scale code review without scaling review fatigue.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Minimal plans for solo builders, growing teams, and enterprise review programs.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`p-6 ${plan.featured ? "neon-border" : ""}`}>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-5 text-5xl font-semibold">${plan.price}</p>
              <p className="mt-1 text-sm text-slate-500">per month</p>
              <Button className="mt-6 w-full" variant={plan.featured ? "default" : "outline"} asChild>
                <Link href="/dashboard/scan">{plan.cta}</Link>
              </Button>
              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-sky-300" />
                    {feature}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
