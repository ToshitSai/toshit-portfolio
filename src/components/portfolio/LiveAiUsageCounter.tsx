import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowDown, Lightbulb, Database, Sparkles, Code2, Rocket } from "lucide-react";

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
    icon: Sparkles,
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
  const shouldReduceMotion = useReducedMotion();
  const [autoActiveIndex, setAutoActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Smooth 800ms stage rotation cycle (4000ms total for 5 stages) without continuous 60fps state updates
  useEffect(() => {
    if (shouldReduceMotion || hoveredIndex !== null) return;

    const interval = setInterval(() => {
      setAutoActiveIndex((prev) => (prev + 1) % STAGES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, hoveredIndex]);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : autoActiveIndex;
  const activeStage = STAGES[activeIndex];

  // Visual position for the pulse dot along the wire track
  const pulseLeftPercent = (activeIndex / (STAGES.length - 1)) * 100;


  return (
    <div className="mt-6 pt-5 border-t border-[#1E2024]/14 select-none font-mono">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD42A]" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E2024]">
            AI PRODUCT WORKFLOW
          </span>
        </div>

        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/60">
          SIGNAL CHAIN PIPELINE
        </span>
      </div>

      {/* DESKTOP HORIZONTAL SIGNAL-CHAIN LAYOUT (hidden md:block) */}
      <div className="hidden md:block py-4 px-2 select-none">
        {/* ROW OF 5 CIRCULAR ICON NODES */}
        <div className="relative flex items-center justify-between max-w-xl mx-auto z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeIndex === idx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setHoveredIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`Stage ${stage.number}: ${stage.title}`}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* STAGE LABEL ABOVE NODE */}
                <span
                  className={`font-mono text-[10px] font-bold tracking-widest uppercase mb-2.5 transition-colors duration-300 ${
                    isActive ? "text-[#1E2024]" : "text-[#1E2024]/50 group-hover:text-[#1E2024]/80"
                  }`}
                >
                  {stage.number} {stage.title}
                </span>

                {/* CIRCULAR ICON NODE */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                    isActive
                      ? "bg-[#FFD42A] border-[#1E2024] text-[#1E2024] shadow-[0_0_22px_rgba(255,212,42,0.85)] scale-110 ring-4 ring-[#FFD42A]/35"
                      : "bg-[#F7F1E5] border-[#1E2024]/20 text-[#1E2024]/60 group-hover:border-[#1E2024]/50 group-hover:text-[#1E2024]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTINUOUS HORIZONTAL WIRE BENEATH THE NODES WITH PULSING DOT */}
        <div className="relative max-w-xl mx-auto mt-4 mb-6 px-6">
          {/* Wire Track Line */}
          <div className="relative w-full h-[3px] bg-[#1E2024]/15 rounded-full">
            {/* Active wire progress line fill */}
            <div
              className="h-full bg-[#FFD42A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pulseLeftPercent}%` }}
            />

            {/* Pulsing Dot moving continuously along wire */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFD42A] border-2 border-[#1E2024] shadow-[0_0_14px_#FFD42A] pointer-events-none transition-all duration-500 ease-out flex items-center justify-center z-20"
              style={{ left: `${pulseLeftPercent}%` }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-80" />
            </div>
          </div>
        </div>

        {/* ONE-LINE CAPTION BELOW THE CHAIN */}
        <div className="min-h-[46px] flex items-center justify-center text-center max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 py-2 rounded-xl bg-[#1E2024]/6 border border-[#1E2024]/12 font-mono text-xs sm:text-sm font-semibold text-[#1E2024] flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A] shrink-0" />
              <span className="font-bold text-[#1E2024]/60 uppercase">[{activeStage.number} {activeStage.title}]</span>
              <span className="font-sans font-medium text-[#1E2024]">— {activeStage.description}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE FALLBACK VERTICAL STACKED LAYOUT (block md:hidden) */}
      <div className="block md:hidden space-y-2.5">
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
                    ? "bg-[#FFD42A]/12 border-[#FFD42A]/60 text-[#1E2024] shadow-xs"
                    : "bg-[#1E2024]/5 border-[#1E2024]/12 text-[#1E2024] hover:border-[#1E2024]/25"
                }`}
              >
                {/* ICON & STAGE BADGE */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    stage.accent
                      ? "bg-[#FFD42A] text-[#1E2024]"
                      : stage.highlight
                      ? "bg-[#FFD42A] text-[#1E2024]"
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
                        stage.accent ? "text-[#FFD42A]" : "text-[#1E2024]/60"
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

