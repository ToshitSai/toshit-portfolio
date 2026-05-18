import { Activity, ArrowUpRight, Bot, Bug, Gauge, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Bugs Detected", value: "1,284", change: "+18% this week", icon: Bug },
  { label: "Security Vulnerabilities", value: "73", change: "12 critical fixed", icon: ShieldAlert },
  { label: "Performance Issues", value: "218", change: "-9% unresolved", icon: Gauge },
  { label: "AI Suggestions", value: "4,916", change: "81% accepted", icon: Sparkles },
  { label: "Code Quality Score", value: "92", change: "+7 points", icon: Bot },
];

const recentScans = [
  ["api/auth/session.ts", "Critical", "JWT expiry bypass", "2 min ago"],
  ["packages/billing/webhook.ts", "High", "Missing signature branch", "18 min ago"],
  ["apps/web/editor.tsx", "Medium", "Unbounded render loop", "1 hr ago"],
  ["services/github/pr-review.go", "Low", "Missing retry telemetry", "3 hrs ago"],
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge variant="outline">Command center</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">AI review operations, at a glance.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor bugs, security risk, performance regressions, team activity, and AI remediation across every repository.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/scan">
            New scan
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-xl border-border bg-card/75">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-emerald-500">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-xl border-border bg-card/75 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent scans</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects">View all</Link>
            </Button>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            {recentScans.map(([file, severity, issue, time]) => (
              <div key={file} className="grid gap-3 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_100px_1.1fr_90px]">
                <span className="font-mono text-sm">{file}</span>
                <Badge variant={severity === "Critical" ? "destructive" : "outline"}>{severity}</Badge>
                <span className="text-sm text-muted-foreground">{issue}</span>
                <span className="text-sm text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-xl border-border bg-card/75 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Activity className="h-5 w-5 text-primary" />
            AI insights
          </h2>
          <div className="mt-5 grid gap-3">
            {[
              "Payment service risk increased after webhook refactor.",
              "TypeScript projects have 31% fewer high-severity findings.",
              "Three repositories need dependency update reviews.",
              "Unit test generation acceptance rose to 74% this sprint.",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-secondary/45 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
