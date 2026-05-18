import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;

  const Icon = toast.type === "error" ? XCircle : CheckCircle2;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-white/10 bg-[#0d1020]/95 px-4 py-3 text-sm text-white shadow-panel backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <Icon className={toast.type === "error" ? "mt-0.5 size-5 text-rose-300" : "mt-0.5 size-5 text-emerald-300"} />
        <p className="leading-6 text-slate-100">{toast.message}</p>
      </div>
    </div>
  );
}
