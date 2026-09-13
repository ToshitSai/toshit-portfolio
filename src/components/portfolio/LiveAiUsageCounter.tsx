import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Lightbulb, Database, Cpu, Code2, Rocket } from "lucide-react";

export interface WorkflowStage {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  highlight?: boolean;
}

const STAGES: WorkflowStage[] = [
  {
    id: "idea",
    number: "01",
    title: "IDEA",
    description: "Turn a problem into a clear product concept",
    icon: Lightbulb,
  },
  {
    id: "context",
    number: "02",
    title: "CONTEXT",
    description: "Research • data • prompts • constraints",
    icon: Database,
  },
  {
    id: "ai",
    number: "03",
    title: "AI",
    description: "LLMs • Gemini • RAG • structured outputs",
    icon: Cpu,
    highlight: true,
  },
  {
    id: "logic",
    number: "04",
    title: "LOGIC",
    description: "APIs • automation • validation • frontend",
    icon: Code2,
  },
  {
    id: "product",
    number: "05",
    title: "PRODUCT",
    description: "A working experience people can actually use",
    icon: Rocket,
    accent: true,
  },
];

export const LiveAiUsageCounter: React.FC = () => {
  return (
    <div className="mt-6 pt-5 border-t border-[#1E2024]/14 select-none">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD21F] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD21F]" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E2024]">
            AI PRODUCT WORKFLOW
          </span>
        </div>

        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/60">
          5-STAGE PIPELINE
        </span>
      </div>

      {/* 5-STAGE WORKFLOW PIPELINE */}
      <div className="space-y-2.5">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === STAGES.length - 1;

          return (
            <React.Fragment key={stage.id}>
              {/* STAGE CARD */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2 }}
                className={`p-4 rounded-2xl border transition-all duration-300 font-mono flex items-center gap-4 ${
                  stage.accent
                    ? "bg-[#1E2024] text-[#F7F1E5] border-[#1E2024] shadow-md"
                    : stage.highlight
                    ? "bg-[#FFD21F]/12 border-[#FFD21F]/60 text-[#1E2024] shadow-xs"
                    : "bg-[#1E2024]/5 border-[#1E2024]/12 text-[#1E2024] hover:border-[#1E2024]/25"
                }`}
              >
                {/* ICON & STAGE BADGE */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    stage.accent
                      ? "bg-[#FFD21F] text-[#1E2024]"
                      : stage.highlight
                      ? "bg-[#FFD21F] text-[#1E2024]"
                      : "bg-[#1E2024]/10 text-[#1E2024]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* TITLE & DESCRIPTION */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                        stage.accent ? "text-[#FFD21F]" : "text-[#1E2024]/60"
                      }`}
                    >
                      {stage.number} // STAGE
                    </span>
                  </div>

                  <div
                    className={`font-sans font-bold text-base sm:text-lg tracking-[-0.02em] leading-tight ${
                      stage.accent ? "text-[#F7F1E5]" : "text-[#1E2024]"
                    }`}
                  >
                    {stage.title}
                  </div>

                  <div
                    className={`text-xs sm:text-sm font-medium mt-0.5 leading-snug font-sans ${
                      stage.accent ? "text-[#F7F1E5]/80" : "text-[#1E2024]/75"
                    }`}
                  >
                    {stage.description}
                  </div>
                </div>
              </motion.div>

              {/* CONNECTOR ARROW */}
              {!isLast && (
                <div className="flex justify-center my-0.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1E2024]/6 text-[#1E2024]/50 border border-[#1E2024]/10">
                    <ArrowDown className="w-3 h-3 text-[#1E2024]/70 animate-bounce" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LiveAiUsageCounter;
