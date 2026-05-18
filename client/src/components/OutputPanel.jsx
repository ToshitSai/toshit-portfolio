import { Check, Clipboard, Download, Loader2, Play } from "lucide-react";
import ActionTabs from "./ActionTabs";
import { targetLanguages } from "../config/languages";

const taskCopy = {
  explain: {
    title: "Line-by-line explanation",
    button: "Explain code",
    empty: "Run an explanation to get a readable walkthrough."
  },
  convert: {
    title: "Language conversion",
    button: "Convert code",
    empty: "Choose a target language and generate a clean conversion."
  },
  debug: {
    title: "Bug detection and fix",
    button: "Debug code",
    empty: "Find runtime errors, logic bugs, and safer fixes."
  },
  optimize: {
    title: "Optimization pass",
    button: "Optimize code",
    empty: "Get a faster, cleaner version with reasoning."
  }
};

export default function OutputPanel({
  activeTask,
  copied,
  isLoading,
  output,
  targetLanguage,
  onCopy,
  onDownload,
  onRun,
  onTargetLanguageChange,
  onTaskChange
}) {
  const meta = taskCopy[activeTask];

  return (
    <section className="flex min-h-[680px] flex-col rounded-[28px] border border-white/10 bg-white/[0.055] shadow-panel backdrop-blur-2xl">
      <div className="space-y-4 border-b border-white/10 px-5 py-4">
        <ActionTabs activeTask={activeTask} onTaskChange={onTaskChange} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">{meta.title}</h2>
            <p className="text-sm text-slate-400">Output is formatted for direct review and reuse.</p>
          </div>

          {activeTask === "convert" && (
            <select
              className="h-10 rounded-xl border border-white/10 bg-[#0a0d1b] px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60"
              value={targetLanguage}
              onChange={(event) => onTargetLanguageChange(event.target.value)}
            >
              {targetLanguages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-300 px-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.015] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="button"
            onClick={onRun}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            {isLoading ? "Processing" : meta.button}
          </button>

          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-slate-100 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!output || isLoading}
            type="button"
            onClick={onCopy}
          >
            {copied ? <Check className="size-4 text-emerald-300" /> : <Clipboard className="size-4" />}
            Copy
          </button>

          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-slate-100 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!output || isLoading}
            type="button"
            onClick={onDownload}
          >
            <Download className="size-4" />
            Download
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#080a15]/90">
          {isLoading && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-[#080a15]/85 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
                  <Loader2 className="size-7 animate-spin text-cyan-200" />
                </div>
                <p className="font-medium text-white">Reasoning through your code</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="size-2 animate-pulse-soft rounded-full bg-cyan-300" />
                  <span className="size-2 animate-pulse-soft rounded-full bg-violet-300 [animation-delay:160ms]" />
                  <span className="size-2 animate-pulse-soft rounded-full bg-blue-300 [animation-delay:320ms]" />
                </div>
              </div>
            </div>
          )}

          {output ? (
            <pre className="h-full overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-slate-100">
              {output}
            </pre>
          ) : (
            <div className="grid h-full min-h-[420px] place-items-center p-8 text-center">
              <div>
                <div className="mx-auto mb-5 size-16 rounded-3xl border border-violet-300/20 bg-violet-300/10 shadow-glow" />
                <p className="text-lg font-semibold text-white">{meta.empty}</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Results appear here with copy and download actions once the AI completes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
