import type { LucideIcon } from "lucide-react";
import { KeyRound, Palette, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const settingsCards: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Security policies", text: "Require critical findings to be resolved before merge.", icon: Shield },
  { title: "API access", text: "Create scoped API keys for CI and repository scanning.", icon: KeyRound },
  { title: "Theme customization", text: "Tune dark mode, accent color, and report branding.", icon: Palette },
];

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Badge variant="outline">Settings</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Workspace configuration.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage API keys, review policies, theme preferences, security posture, and audit retention.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <Card key={card.title} className="rounded-xl border-border bg-card/75 p-6">
            <card.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
