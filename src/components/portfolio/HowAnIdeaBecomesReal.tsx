import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown, Sparkles, AlertTriangle, Cpu, Wrench, CheckCircle2, RefreshCw, Rocket, Lightbulb } from "lucide-react";

export interface ProcessStageStep {
  stepNumber: string;
  stageKey: "IDEA" | "THINK" | "BREAK" | "BUILD" | "TEST" | "BREAK AGAIN" | "SHIP";
  label: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "yellow" | "dark" | "normal";
}

export interface ProjectProcessStory {
  id: "hirescope" | "courseforge";
  name: string;
  shortName: string;
  subtitle: string;
  stages: ProcessStageStep[];
}

export const PROJECT_STORIES: Record<string, ProjectProcessStory> = {
  hirescope: {
    id: "hirescope",
    name: "HireScope AI",
    shortName: "HIRESCOPE AI",
    subtitle: "AI Resume & Portfolio Evaluator",
    stages: [
      {
        stepNumber: "01",
        stageKey: "IDEA",
        label: "IDEA",
        content: "Make resume evaluation more useful.",
        icon: Lightbulb,
      },
      {
        stepNumber: "02",
        stageKey: "THINK",
        label: "THINK",
        content: "How can AI compare a person's resume and portfolio against a target role?",
        icon: Cpu,
      },
      {
        stepNumber: "03",
        stageKey: "BREAK",
        label: "BREAK",
        content: "What information actually matters?",
        icon: AlertTriangle,
      },
      {
        stepNumber: "04",
        stageKey: "BUILD",
        label: "BUILD",
        content: "Resume analysis + Portfolio analysis + AI evaluation",
        icon: Wrench,
        accent: "yellow",
      },
      {
        stepNumber: "05",
        stageKey: "TEST",
        label: "TEST",
        content: "Check whether the generated evaluation is useful.",
        icon: CheckCircle2,
      },
      {
        stepNumber: "06",
        stageKey: "BREAK AGAIN",
        label: "BREAK AGAIN",
        content: "Refine scoring and recommendations.",
        icon: RefreshCw,
      },
      {
        stepNumber: "07",
        stageKey: "SHIP",
        label: "SHIP",
        content: "HireScope AI",
        icon: Rocket,
        accent: "dark",
      },
    ],
  },
  courseforge: {
    id: "courseforge",
    name: "CourseForge AI",
    shortName: "COURSEFORGE AI",
    subtitle: "Generative AI Course Creator",
    stages: [
      {
        stepNumber: "01",
        stageKey: "IDEA",
        label: "IDEA",
        content: "Make learning content easier to generate.",
        icon: Lightbulb,
      },
      {
        stepNumber: "02",
        stageKey: "THINK",
        label: "THINK",
        content: "Can AI create a structured learning experience instead of isolated answers?",
        icon: Cpu,
      },
      {
        stepNumber: "03",
        stageKey: "BREAK",
        label: "BREAK",
        content: "What should a useful AI-generated course contain?",
        icon: AlertTriangle,
      },
      {
        stepNumber: "04",
        stageKey: "BUILD",
        label: "BUILD",
        content: "Course structure + Lessons + Quizzes + Video resources",
        icon: Wrench,
        accent: "yellow",
      },
      {
        stepNumber: "05",
        stageKey: "TEST",
        label: "TEST",
        content: "Improve the generated learning flow.",
        icon: CheckCircle2,
      },
      {
        stepNumber: "06",
        stageKey: "BREAK AGAIN",
        label: "BREAK AGAIN",
        content: "Refine the experience.",
        icon: RefreshCw,
      },
      {
        stepNumber: "07",
        stageKey: "SHIP",
        label: "SHIP",
        content: "CourseForge AI",
        icon: Rocket,
        accent: "dark",
      },
    ],
  },
};

interface HowAnIdeaBecomesRealProps {
  isExpanded?: boolean;
}

export const HowAnIdeaBecomesReal: React.FC<HowAnIdeaBecomesRealProps> = ({ isExpanded = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedProjectId, setSelectedProjectId] = useState<"hirescope" | "courseforge">("hirescope");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeProject = PROJECT_STORIES[selectedProjectId];

  // Trigger yellow signal progression when card opens or project switches
  useEffect(() => {
    if (!isExpanded) {
      setActiveStepIndex(0);
      return;
    }

    if (shouldReduceMotion) {
      setActiveStepIndex(activeProject.stages.length - 1);
      return;
    }

    setActiveStepIndex(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < activeProject.stages.length) {
        setActiveStepIndex(step);
      } else {
        clearInterval(interval);
      }
    }, 220);

    return () => clearInterval(interval);
  }, [isExpanded, selectedProjectId, shouldReduceMotion, activeProject.stages.length]);

  return (
    <div className="w-full font-sans select-none">
      {/* EXPANDED CONTENT AREA */}
      <div className="mt-6 pt-5 border-t border-[#1E2024]/14">
        {/* PROJECT SELECTOR TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1E2024]/70">
              BUILD STORY:
            </span>
            <div className="flex items-center bg-[#1E2024]/6 p-1 rounded-xl border border-[#1E2024]/10 font-mono text-xs font-bold">
              {(["hirescope", "courseforge"] as const).map((projId) => {
                const proj = PROJECT_STORIES[projId];
                const isActive = selectedProjectId === projId;
                return (
                  <button
                    key={projId}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(projId);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#1E2024] text-[#F7F1E5] shadow-xs"
                        : "text-[#1E2024]/70 hover:text-[#1E2024]"
                    }`}
                  >
                    {proj.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="font-mono text-[11px] font-semibold text-[#1E2024]/60 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD21F]" />
            <span>ITERATIVE PROCESS</span>
          </div>
        </div>

        {/* PROJECT STAGES STORY SEQUENCE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProjectId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {activeProject.stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPassedOrActive = idx <= activeStepIndex;
              const isCurrentSignalNode = idx === activeStepIndex;
              const isLast = idx === activeProject.stages.length - 1;

              return (
                <div key={stage.stageKey} className="relative">
                  {/* STAGE STEP CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: shouldReduceMotion ? 0 : idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 font-mono relative overflow-hidden flex items-start gap-4 ${
                      stage.accent === "dark"
                        ? "bg-[#1E2024] text-[#F7F1E5] border-[#1E2024] shadow-md"
                        : stage.accent === "yellow"
                        ? "bg-[#FFD21F]/15 border-[#FFD21F]/70 text-[#1E2024] shadow-xs"
                        : isCurrentSignalNode
                        ? "bg-[#1E2024]/8 border-[#FFD21F] text-[#1E2024] shadow-xs"
                        : "bg-[#1E2024]/5 border-[#1E2024]/12 text-[#1E2024]"
                    }`}
                  >
                    {/* YELLOW SIGNAL INDICATOR DOT */}
                    {isCurrentSignalNode && (
                      <motion.span
                        layoutId="yellow-signal-indicator"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="absolute top-3.5 right-3.5 flex h-3 w-3"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD21F] opacity-80" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD21F] border border-[#1E2024]/20 shadow-[0_0_10px_rgba(255,210,31,0.8)]" />
                      </motion.span>
                    )}

                    {/* STAGE ICON & NUMBER */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                        stage.accent === "dark"
                          ? "bg-[#FFD21F] text-[#1E2024]"
                          : stage.accent === "yellow" || isCurrentSignalNode
                          ? "bg-[#FFD21F] text-[#1E2024]"
                          : "bg-[#1E2024]/12 text-[#1E2024]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* STAGE CONTENT */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                            stage.accent === "dark" ? "text-[#FFD21F]" : "text-[#1E2024]/60"
                          }`}
                        >
                          {stage.stepNumber} // {stage.label}
                        </span>
                      </div>

                      <div
                        className={`font-sans text-sm sm:text-base font-semibold leading-snug ${
                          stage.accent === "dark" ? "text-[#F7F1E5]" : "text-[#1E2024]"
                        }`}
                      >
                        {stage.content}
                      </div>
                    </div>
                  </motion.div>

                  {/* CONNECTING STEP ARROW */}
                  {!isLast && (
                    <div className="flex justify-center my-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isPassedOrActive
                            ? "bg-[#FFD21F]/20 border-[#FFD21F] text-[#1E2024]"
                            : "bg-[#1E2024]/5 border-[#1E2024]/10 text-[#1E2024]/40"
                        }`}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* PERSONAL PHILOSOPHY STATEMENT FOOTER */}
        <div className="mt-6 pt-4 border-t border-[#1E2024]/10 flex items-center justify-center text-center">
          <p className="font-mono text-xs sm:text-sm text-[#1E2024]/75 italic font-medium">
            &ldquo;I don&apos;t stop when it works. I stop when it feels right.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowAnIdeaBecomesReal;
