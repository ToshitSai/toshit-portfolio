"use client";

import { useState } from "react";

import { type AnalyzeResponse, type JobMatchResponse } from "@/types/resume";

const tabs = ["Analysis", "Improvements", "Skill Gap", "Job Match", "Roast Mode"] as const;

type DashboardProps = {
  analysis: AnalyzeResponse;
  jobMatch: JobMatchResponse | null;
  isBusy: boolean;
  onRunJobMatch: (jobDescription: string) => void;
  resumeName: string;
};

export function Dashboard({
  analysis,
  jobMatch,
  isBusy,
  onRunJobMatch,
  resumeName,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Analysis");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <section className="grid gap-6 pb-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="glass-panel mesh-border rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mono text-xs uppercase tracking-[0.28em] text-emerald-300/80">
                Resume Intelligence
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Analysis dashboard</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Your resume has been parsed and scored. Use the tabs below to explore improvement
                opportunities, skill gaps, role fit, and a playful roast.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="mono text-[11px] uppercase tracking-[0.22em] text-slate-400">Uploaded File</p>
              <p className="mt-2 max-w-52 truncate text-sm font-medium text-slate-100">{resumeName}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="mono text-xs uppercase tracking-[0.24em] text-emerald-300">ATS Score</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-6xl font-bold tracking-tight text-white">{analysis.ats_score}</span>
                <span className="pb-2 text-sm text-emerald-200">/100</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 transition-all duration-700"
                  style={{ width: `${analysis.ats_score}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-emerald-100/85">
                A fast proxy for keyword relevance, clarity, measurable impact, and structure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat
                label="Strengths"
                value={analysis.strengths.length}
                helper="Signals already working in your favor"
              />
              <MiniStat
                label="Skill Gaps"
                value={analysis.missing_skills.length}
                helper="Missing or under-evidenced capabilities"
              />
              <MiniStat
                label="Projects"
                value={analysis.suggested_projects.length}
                helper="Portfolio ideas matched to your trajectory"
              />
            </div>
          </div>
        </article>

        <article className="glass-panel mesh-border rounded-[2rem] p-6 sm:p-8">
          <p className="mono text-xs uppercase tracking-[0.28em] text-cyan-300/80">Career Coach</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Quick guidance snapshot</h3>
          <div className="mt-6 space-y-4">
            {analysis.improvements.slice(0, 3).map((tip) => (
              <div key={tip} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm leading-7 text-slate-200">{tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
            <p className="mono text-xs uppercase tracking-[0.24em] text-rose-200">Roast Preview</p>
            <p className="mt-3 text-sm leading-7 text-rose-100/90">
              {analysis.roast.length > 0 ? analysis.roast[0] : "Roast mode is standing by."}
            </p>
          </div>
        </article>
      </div>

      <div className="glass-panel mesh-border rounded-[2rem] p-4 sm:p-6">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-emerald-400 text-slate-950 shadow-[0_10px_30px_rgba(52,211,153,0.28)]"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "Analysis" ? (
            <GridColumns
              leftTitle="Strengths"
              leftItems={analysis.strengths}
              rightTitle="Weaknesses"
              rightItems={analysis.weaknesses}
            />
          ) : null}

          {activeTab === "Improvements" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card title="Suggested improvements" items={analysis.improvements} />
              <Card title="Rewritten bullet points" items={analysis.rewritten_bullets} />
            </div>
          ) : null}

          {activeTab === "Skill Gap" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card title="Missing skills" items={analysis.missing_skills} />
              <ProjectIdeas projects={analysis.suggested_projects} />
            </div>
          ) : null}

          {activeTab === "Job Match" ? (
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
                <p className="mono text-xs uppercase tracking-[0.24em] text-slate-400">
                  Paste Job Description
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Paste the target role here to see alignment, missing skills, and next steps..."
                  className="mt-4 min-h-72 w-full rounded-3xl border border-white/10 bg-black/30 px-4 py-4 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-400/40"
                />
                <button
                  type="button"
                  disabled={isBusy || !jobDescription.trim()}
                  onClick={() => onRunJobMatch(jobDescription)}
                  className="mt-4 inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? "Comparing..." : "Run Job Match"}
                </button>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
                <p className="mono text-xs uppercase tracking-[0.24em] text-slate-400">Match Result</p>
                {jobMatch ? (
                  <div>
                    <div className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                      <p className="text-sm text-cyan-100/80">Match Percentage</p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-5xl font-bold text-white">{jobMatch.match_percentage}</span>
                        <span className="pb-2 text-sm text-cyan-100/80">%</span>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-5">
                      <Card title="Missing skills" items={jobMatch.missing_skills} compact />
                      <Card title="Suggestions" items={jobMatch.suggestions} compact />
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No job match yet"
                    description="Paste a job description and run the comparison to see how closely your resume aligns."
                  />
                )}
              </article>
            </div>
          ) : null}

          {activeTab === "Roast Mode" ? <Card title="Roast My Resume" items={analysis.roast} /> : null}
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="mono text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{helper}</p>
    </div>
  );
}

function GridColumns({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}: {
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title={leftTitle} items={leftItems} />
      <Card title={rightTitle} items={rightItems} />
    </div>
  );
}

function Card({
  title,
  items,
  compact = false,
}: {
  title: string;
  items: string[];
  compact?: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
      <p className="mono text-xs uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className={`${compact ? "mt-4 space-y-3" : "mt-5 space-y-4"}`}>
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className={`rounded-2xl border border-white/8 bg-white/[0.04] ${
                compact ? "p-3" : "p-4"
              }`}
            >
              <p className="text-sm leading-7 text-slate-200">{item}</p>
            </div>
          ))
        ) : (
          <EmptyState
            title="Nothing surfaced here"
            description="The AI did not return an item for this section yet."
          />
        )}
      </div>
    </article>
  );
}

function ProjectIdeas({
  projects,
}: {
  projects: AnalyzeResponse["suggested_projects"];
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
      <p className="mono text-xs uppercase tracking-[0.24em] text-slate-400">Suggested projects</p>
      <div className="mt-5 space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.title} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-base font-semibold text-white">{project.title}</h4>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  {project.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{project.summary}</p>
              <p className="mt-3 text-sm font-medium text-cyan-200">Why it helps: {project.impact}</p>
            </div>
          ))
        ) : (
          <EmptyState
            title="No project ideas yet"
            description="Project recommendations will appear here after analysis."
          />
        )}
      </div>
    </article>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5">
      <p className="text-sm font-medium text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}
