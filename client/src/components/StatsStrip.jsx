import { Activity, Braces, ShieldCheck } from "lucide-react";

export default function StatsStrip() {
  const items = [
    { icon: Braces, label: "REST endpoints", value: "4" },
    { icon: ShieldCheck, label: "Error handling", value: "Built in" },
    { icon: Activity, label: "Workflow", value: "AI assisted" }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl"
            key={item.label}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-white/[0.06] text-cyan-200">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="font-semibold text-slate-100">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
