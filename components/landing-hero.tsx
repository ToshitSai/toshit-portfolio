"use client";

import { useRef, useState } from "react";

type LandingHeroProps = {
  stats: Array<{ label: string; value: string }>;
  isBusy: boolean;
  error: string;
  onFileUpload: (file: File) => void;
};

export function LandingHero({ stats, isBusy, error, onFileUpload }: LandingHeroProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleSelect = (file?: File) => {
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setSelectedFileName("Please choose a PDF resume.");
      return;
    }

    setSelectedFileName(file.name);
    onFileUpload(file);
  };

  return (
    <section className="grid items-center gap-6 pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:pt-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Production-ready AI resume intelligence
        </div>
        <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
          AI Resume Analyzer
          <span className="block bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-300 bg-clip-text text-transparent">
            + Career Coach
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          Upload a resume PDF and get an ATS score, skill gap analysis, improvement suggestions,
          portfolio-grade project ideas, job match scoring, and a playful roast that still stays professional.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <p className="mono text-[11px] uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel mesh-border rounded-[2rem] p-6 sm:p-8">
        <p className="mono text-xs uppercase tracking-[0.28em] text-cyan-300/85">Upload Resume</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">Start with your PDF</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          We extract the text, run a structured AI analysis, and turn the output into a clean coaching dashboard.
        </p>

        <div className="mt-8 rounded-[1.75rem] border border-dashed border-emerald-300/30 bg-emerald-400/5 p-6">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleSelect(event.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isBusy}
            className="loading-ring inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isBusy ? "Analyzing resume..." : "Upload Resume PDF"}
          </button>

          <p className="mt-4 text-sm text-slate-300">
            {selectedFileName || "No file selected yet. PDF only."}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {[
            "ATS score and recruiter-style feedback",
            "Role-specific skill gap analysis",
            "Project ideas to strengthen your profile",
            "Job description fit and missing keywords",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <p className="text-sm text-slate-200">{feature}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm leading-7 text-rose-100">
            {error}
          </div>
        ) : null}
      </div>
    </section>
  );
}
