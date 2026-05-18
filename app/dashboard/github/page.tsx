import type { LucideIcon } from "lucide-react";
import { GitPullRequest, MessageSquareCode, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const githubFeatures: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Repository import", text: "Index source files and default branches.", icon: ShieldCheck },
  { title: "PR review comments", text: "Generate line-specific comments and fix suggestions.", icon: MessageSquareCode },
  { title: "Checks workflow", text: "Block risky merges with severity thresholds.", icon: GitPullRequest },
];

export default function GithubPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Badge variant="outline">Integration</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">GitHub pull request reviews.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Connect GitHub OAuth, import repositories, scan pull requests, and draft AI comments with security context.
        </p>
      </div>
      <Card className="rounded-xl border-border bg-card/75 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
              <GitPullRequest className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">GitHub OAuth</h2>
              <p className="text-sm text-muted-foreground">Scopes: repo, read:org, pull_request:write</p>
            </div>
          </div>
          <Button>Connect GitHub</Button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {githubFeatures.map((feature) => (
          <Card key={feature.title} className="rounded-xl border-border bg-card/75 p-5">
            <feature.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
