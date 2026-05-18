import type { LucideIcon } from "lucide-react";
import { BarChart3, LineChart, PieChart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const analyticsCards: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Severity trend", text: "Critical issues down 22% after auth hardening.", icon: LineChart },
  { title: "Language mix", text: "TypeScript accounts for 64% of scanned files.", icon: PieChart },
  { title: "Review throughput", text: "Median review time is 38 seconds.", icon: BarChart3 },
];

export default function AnalyticsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Badge variant="outline">Analytics</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Scan analytics and trends.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track review volume, severity mix, model usage, and remediation velocity.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {analyticsCards.map((card) => (
          <Card key={card.title} className="rounded-xl border-border bg-card/75 p-6">
            <card.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
            <div className="mt-6 h-36 rounded-lg border border-border bg-secondary/45" />
          </Card>
        ))}
      </div>
    </div>
  );
}
