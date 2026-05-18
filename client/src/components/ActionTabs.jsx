import { Bug, Gauge, Languages, ListTree } from "lucide-react";

const tabs = [
  { id: "explain", label: "Explain", icon: ListTree },
  { id: "convert", label: "Convert", icon: Languages },
  { id: "debug", label: "Debug", icon: Bug },
  { id: "optimize", label: "Optimize", icon: Gauge }
];

export default function ActionTabs({ activeTask, onTaskChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTask === tab.id;

        return (
          <button
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
              isActive
                ? "bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.28)]"
                : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
            }`}
            key={tab.id}
            type="button"
            onClick={() => onTaskChange(tab.id)}
          >
            <Icon className="size-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
