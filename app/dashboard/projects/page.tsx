import { GitBranch, GitPullRequest, Lock, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const repos = [
  ["acme/payments-api", "TypeScript", "94", "3 open findings", "Private"],
  ["acme/mobile-gateway", "Go", "88", "7 open findings", "Private"],
  ["acme/infra-policy", "Python", "91", "2 open findings", "Internal"],
  ["acme/frontend", "TypeScript", "96", "1 open finding", "Private"],
];

export default function ProjectsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge variant="outline">Repositories</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">GitHub-style repository review.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Import repositories, scan branches, review pull requests, and keep quality scores visible to every team.
          </p>
        </div>
        <Button>
          <GitPullRequest className="h-4 w-4" />
          Connect GitHub
        </Button>
      </div>
      <Card className="overflow-hidden rounded-xl border-border bg-card/75">
        {repos.map(([name, language, score, findings, visibility]) => (
          <div key={name} className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[1fr_120px_120px_150px_110px] md:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <GitBranch className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="font-mono font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">Last scanned 12 minutes ago</p>
              </div>
            </div>
            <Badge variant="outline">{language}</Badge>
            <span className="font-mono text-sm">{score}/100</span>
            <span className="text-sm text-muted-foreground">{findings}</span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              {visibility === "Private" ? <Lock className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              {visibility}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
