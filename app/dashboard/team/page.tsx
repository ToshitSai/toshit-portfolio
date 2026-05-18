import { MailPlus, Shield, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const members = [
  ["Maya Chen", "Admin", "Security lead"],
  ["Sam Rivera", "Developer", "Platform"],
  ["Iris Okafor", "Viewer", "Compliance"],
];

export default function TeamPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge variant="outline">Team workspace</Badge>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Shared scans with role-based access.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Invite admins, developers, and viewers. Keep reports, activity logs, and analytics scoped to each workspace.
          </p>
        </div>
        <Button>
          <MailPlus className="h-4 w-4" />
          Invite member
        </Button>
      </div>
      <Card className="overflow-hidden rounded-xl border-border bg-card/75">
        {members.map(([name, role, team]) => (
          <div key={name} className="flex items-center justify-between border-b border-border p-5 last:border-b-0">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
                <Users className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{team}</p>
              </div>
            </div>
            <Badge variant="outline">
              <Shield className="h-3.5 w-3.5" />
              {role}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}
