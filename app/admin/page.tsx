import type { LucideIcon } from "lucide-react";
import { Activity, DollarSign, Server, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const adminMetrics: Array<{ label: string; value: string; change: string; icon: LucideIcon }> = [
  { label: "Users", value: "18,240", change: "+12%", icon: Users },
  { label: "MRR", value: "$284k", change: "+18%", icon: DollarSign },
  { label: "Scans", value: "1.8M", change: "+31%", icon: Activity },
  { label: "Uptime", value: "99.98%", change: "30 days", icon: Server },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div>
          <Badge variant="outline">Admin</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">System operations.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor users, subscriptions, scan throughput, API usage, and platform health.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {adminMetrics.map((metric) => (
            <Card key={metric.label} className="rounded-xl border-border bg-card/75 p-5">
              <metric.icon className="h-5 w-5 text-primary" />
              <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-emerald-500">{metric.change}</p>
            </Card>
          ))}
        </div>
        <Card className="rounded-xl border-border bg-card/75 p-6">
          <h2 className="text-xl font-semibold">System monitoring</h2>
          <div className="mt-5 grid gap-3">
            {["OpenAI latency p95: 2.4s", "PostgreSQL pool: healthy", "Webhook queue depth: 12", "Rate limit blocks today: 418"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-secondary/45 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
