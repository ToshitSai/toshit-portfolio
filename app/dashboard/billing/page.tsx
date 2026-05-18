import { Check, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { plans } from "@/config/site";

export default function BillingPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Badge variant="outline">Subscription</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Plans for every review workflow.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Stripe-ready billing for free, pro, and enterprise workspaces with usage enforcement hooks.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`rounded-xl border-border bg-card/75 p-6 ${plan.featured ? "ring-1 ring-primary" : ""}`}>
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-4 text-4xl font-semibold">${plan.price}</p>
            <Button className="mt-6 w-full" variant={plan.featured ? "default" : "outline"}>
              <CreditCard className="h-4 w-4" />
              {plan.cta}
            </Button>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {feature}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
