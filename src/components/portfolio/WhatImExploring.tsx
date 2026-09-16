import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface ExploringTopic {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  nodeType: "pill" | "rect" | "mono" | "badge";
  // Radial offset coordinates for desktop constellation (px relative to center)
  x: number;
  y: number;
}

export const EXPLORING_TOPICS: ExploringTopic[] = [
  {
    id: "ai-agents",
    title: "AI AGENTS",
    shortTitle: "AI AGENTS",
    description: "Exploring autonomous workflows, tool use and multi-step AI systems.",
    nodeType: "pill",
    x: 0,
    y: -135, // 12 o'clock
  },
  {
    id: "llms",
    title: "LLMs",
    shortTitle: "LLMs",
    description: "Working with structured prompts, model APIs and intelligent interfaces.",
    nodeType: "mono",
    x: 160,
    y: -80, // 2 o'clock
  },
  {
    id: "generative-ai",
    title: "GENERATIVE AI",
    shortTitle: "GENERATIVE AI",
    description: "Building applications around modern generative models.",
    nodeType: "pill",
    x: 215,
    y: 15, // 3 o'clock
  },
  {
    id: "ai-apps",
    title: "AI APPLICATIONS",
    shortTitle: "AI APPS",
    description: "Turning AI capabilities into usable products.",
    nodeType: "badge",
    x: 145,
    y: 105, // 4 o'clock
  },
  {
    id: "product",
    title: "PRODUCT BUILDING",
    shortTitle: "PRODUCT",
    description: "Turning ideas into complete digital experiences.",
    nodeType: "rect",
    x: 0,
    y: 145, // 6 o'clock
  },
  {
    id: "web",
    title: "WEB ENGINEERING",
    shortTitle: "WEB",
    description: "Building polished React / TypeScript interfaces.",
    nodeType: "mono",
    x: -145,
    y: 105, // 8 o'clock
  },
  {
    id: "automation",
    title: "AUTOMATION",
    shortTitle: "AUTOMATION",
    description: "Connecting AI systems with useful real-world workflows.",
    nodeType: "rect",
    x: -210,
    y: 15, // 9 o'clock
  },
  {
    id: "rag",
    title: "RAG",
    shortTitle: "RAG",
    description: "Exploring retrieval, context and grounded generation.",
    nodeType: "mono",
    x: -160,
    y: -80, // 10 o'clock
  },
];

interface WhatImExploringProps {
  isExpanded?: boolean;
}

export const WhatImExploring: React.FC<WhatImExploringProps> = ({ isExpanded = true }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedTopicId, setSelectedTopicId] = useState<string>("ai-agents");
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);

  // Active topic is hovered if present, otherwise selected
  const activeTopicId = hoveredTopicId || selectedTopicId;
  const activeTopic = EXPLORING_TOPICS.find((t) => t.id === activeTopicId) || EXPLORING_TOPICS[0];

  const handleSelectTopic = (id: string, e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setSelectedTopicId(id);
  };

  return (
    <div className="w-full select-none pt-4 font-sans">
      {/* EXPANDED INTERACTIVE CONSTELLATION AREA */}
      <div className="mt-2 pt-4 border-t border-[#1E2024]/12">
        {/* DESKTOP RADIAL CONSTELLATION MAP (hidden md:block) */}
        <div className="hidden md:block relative w-full h-[360px] mx-auto overflow-hidden">
          {/* SVG CONNECTION LINES FROM CENTER TO TOPICS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {EXPLORING_TOPICS.map((topic) => {
              const isActive = topic.id === activeTopicId;
              // Center coordinates: 50% width, 50% height (180px)
              return (
                <line
                  key={`line-${topic.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${topic.x}px)`}
                  y2={`calc(50% + ${topic.y}px)`}
                  stroke="#1E2024"
                  strokeWidth={isActive ? "1.5" : "1"}
                  strokeOpacity={isActive ? 0.35 : 0.12}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* CENTER OBJECT (TOSHIT SAI ANCHOR CARD) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="w-28 h-28 rounded-full bg-[#FFF8E8] border-2 border-[#1E2024] shadow-md flex flex-col items-center justify-center text-center p-2 relative">
              <span className="w-7 h-7 rounded-full bg-[#1E2024] text-[#F7F1E5] flex items-center justify-center font-bold text-xs font-sans mb-1 shadow-xs">
                T
              </span>
              <span className="font-sans font-bold text-xs text-[#1E2024] tracking-tight">
                Toshit Sai
              </span>
              <span className="font-mono text-[9px] font-semibold text-[#1E2024]/60 uppercase tracking-tight mt-0.5">
                AI / ML BUILDER
              </span>
            </div>
          </div>

          {/* RADIAL SURROUNDING TOPIC OBJECTS */}
          {EXPLORING_TOPICS.map((topic) => {
            const isActive = topic.id === activeTopicId;
            const isSelected = topic.id === selectedTopicId;

            return (
              <div
                key={topic.id}
                style={{
                  left: `calc(50% + ${topic.x}px)`,
                  top: `calc(50% + ${topic.y}px)`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  type="button"
                  onClick={(e) => handleSelectTopic(topic.id, e)}
                  onMouseEnter={() => setHoveredTopicId(topic.id)}
                  onMouseLeave={() => setHoveredTopicId(null)}
                  onFocus={() => setHoveredTopicId(topic.id)}
                  onBlur={() => setHoveredTopicId(null)}
                  aria-label={`Explore topic ${topic.title}`}
                  aria-selected={isSelected}
                  className={`group relative flex items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none ${
                    topic.nodeType === "pill"
                      ? "rounded-full px-3.5 py-1.5"
                      : topic.nodeType === "mono"
                      ? "rounded-lg px-3 py-1 font-mono"
                      : topic.nodeType === "rect"
                      ? "rounded-md px-3.5 py-1.5"
                      : "rounded-full px-3 py-1 font-mono text-[11px]"
                  } ${
                    isActive
                      ? "bg-[#FFF8E8] border-2 border-[#1E2024] text-[#1E2024] shadow-md scale-105 -translate-y-0.5"
                      : "bg-[#FFF8E8]/90 border border-[#1E2024]/20 text-[#1E2024]/80 hover:border-[#1E2024]/60 hover:text-[#1E2024]"
                  }`}
                >
                  {/* YELLOW ACTIVE INDICATOR DOT */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A] shrink-0" />
                  )}

                  <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                    {topic.shortTitle}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* MOBILE CONSTELLATION LAYOUT (block md:hidden) */}
        <div className="block md:hidden py-2 space-y-4">
          {/* MOBILE CENTER ANCHOR */}
          <div className="flex justify-center mb-4">
            <div className="px-4 py-2 rounded-2xl bg-[#FFF8E8] border border-[#1E2024]/20 shadow-xs flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#1E2024] text-[#F7F1E5] flex items-center justify-center font-bold text-xs font-sans">
                T
              </span>
              <div>
                <span className="font-sans font-bold text-xs text-[#1E2024] block">
                  Toshit Sai
                </span>
                <span className="font-mono text-[9px] text-[#1E2024]/60 uppercase font-semibold">
                  AI / ML + Product Builder
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE TOPIC GRID (2 COLUMNS) */}
          <div className="grid grid-cols-2 gap-2">
            {EXPLORING_TOPICS.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const isSelected = topic.id === selectedTopicId;

              return (
                <button
                  key={`mobile-${topic.id}`}
                  type="button"
                  onClick={(e) => handleSelectTopic(topic.id, e)}
                  aria-label={`Explore topic ${topic.title}`}
                  aria-selected={isSelected}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFF8E8] border-[#1E2024] text-[#1E2024] shadow-xs"
                      : "bg-[#FFF8E8]/70 border-[#1E2024]/12 text-[#1E2024]/80"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? "bg-[#FFD42A] shadow-[0_0_6px_#FFD42A]" : "bg-[#1E2024]/30"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider truncate">
                    {topic.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* INFORMATION CONTENT PANEL FOR SELECTED TOPIC */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#1E2024]/6 border border-[#1E2024]/12 min-h-[76px] flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic.id}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-lg mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A] shrink-0" />
                <span className="font-mono text-xs font-bold text-[#1E2024] uppercase tracking-widest">
                  {activeTopic.title}
                </span>
              </div>
              <p className="font-sans text-sm sm:text-base font-semibold text-[#1E2024] leading-relaxed">
                &ldquo;{activeTopic.description}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SUBTLE SIGNATURE FOOTER */}
        <div className="mt-4 pt-3 border-t border-[#1E2024]/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono font-semibold text-[#1E2024]/50 uppercase tracking-widest">
          <span>TAP OR HOVER TOPIC TO EXPLORE</span>
          <span>EXPERIMENT / BUILD / SHIP</span>
        </div>
      </div>
    </div>
  );
};

export default WhatImExploring;
