import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillItem {
  id: string;
  code: string;
  name: string;
  role: string;
  category: "ai" | "dev" | "backend";
}

const SKILL_GROUPS: {
  title: string;
  category: "ai" | "dev" | "backend";
  items: SkillItem[];
}[] = [
  {
    title: "AI / LLM",
    category: "ai",
    items: [
      { id: "gemini", code: "01", name: "GEMINI API", role: "MULTIMODAL MODEL INTEGRATION", category: "ai" },
      { id: "claude", code: "02", name: "CLAUDE API", role: "ADVANCED PROMPTING & ANALYSIS", category: "ai" },
      { id: "langchain", code: "03", name: "LANGCHAIN", role: "LLM WORKFLOWS & CHAINS", category: "ai" },
      { id: "langgraph", code: "04", name: "LANGGRAPH", role: "STATEFUL MULTI-AGENT ORCHESTRATION", category: "ai" },
      { id: "llmapps", code: "05", name: "LLM APPLICATIONS", role: "END-TO-END AI PRODUCTS", category: "ai" },
      { id: "prompt", code: "06", name: "PROMPT ENGINEERING", role: "SYSTEM CONTEXT & PROMPTS", category: "ai" },
    ],
  },
  {
    title: "FRONTEND & BACKEND",
    category: "dev",
    items: [
      { id: "react", code: "01", name: "REACT / NEXT.JS", role: "FULL-STACK SSR & UI COMPONENTS", category: "dev" },
      { id: "python", code: "02", name: "PYTHON", role: "BACKEND & CORE AI LOGIC", category: "dev" },
      { id: "fastapi", code: "03", name: "FASTAPI / FLASK", role: "HIGH-PERFORMANCE PYTHON APIS", category: "dev" },
      { id: "tailwind", code: "04", name: "TAILWIND CSS", role: "EDITORIAL UI & STYLING", category: "dev" },
      { id: "js", code: "05", name: "JAVASCRIPT", role: "WEB & EVENT SCRIPTING", category: "dev" },
      { id: "webgl", code: "06", name: "THREE.JS / R3F", role: "3D SCENE GRAPH & ANIMATION", category: "dev" },
    ],
  },
  {
    title: "INFRASTRUCTURE & TOOLS",
    category: "backend",
    items: [
      { id: "postgres", code: "01", name: "POSTGRESQL", role: "RELATIONAL DATABASE & SQL", category: "backend" },
      { id: "supabase", code: "02", name: "SUPABASE", role: "DATABASE & AUTHENTICATION", category: "backend" },
      { id: "docker", code: "03", name: "DOCKER / VERCEL", role: "CONTAINERS & EDGE DEPLOYMENT", category: "backend" },
      { id: "github", code: "04", name: "GITHUB / CI-CD", role: "VERSION CONTROL & AUTOMATION", category: "backend" },
      { id: "ollama", code: "05", name: "OLLAMA / WHISPER", role: "LOCAL INFERENCE & SPEECH AI", category: "backend" },
      { id: "cursor", code: "06", name: "CURSOR / CODEX", role: "AI ASSISTED ENGINEERING", category: "backend" },
    ],
  },
];

const TechnicalSkills: React.FC = () => {
  // Single Source of Truth States
  const [selectedCategory, setSelectedCategory] = useState<"ai" | "dev" | "backend" | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [hoveredCore, setHoveredCore] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Debounce Timer Refs for Flicker-Free Fast Cursor Skimming
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active Skill & Category derived cleanly
  const activeSkill = hoveredSkill || selectedSkill;
  const activeCategory = hoveredSkill?.category || selectedCategory || (selectedSkill ? selectedSkill.category : null);

  const clearTimers = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const handleMouseEnterSkill = (item: SkillItem) => {
    clearTimers();
    // 80ms activation debounce to eliminate rapid flickering during fast skimming
    hoverTimer.current = setTimeout(() => {
      setHoveredSkill(item);
    }, 80);
  };

  const handleMouseLeaveSkill = () => {
    clearTimers();
    // 120ms deactivation delay before returning to idle state
    leaveTimer.current = setTimeout(() => {
      setHoveredSkill(null);
    }, 120);
  };

  const handleCategoryClick = (category: "ai" | "dev" | "backend", firstItem: SkillItem, e: React.SyntheticEvent) => {
    e.preventDefault();
    clearTimers();
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSkill(null);
    } else {
      setSelectedCategory(category);
      setSelectedSkill(firstItem);
    }
  };

  const handleSkillClick = (item: SkillItem, e: React.SyntheticEvent) => {
    e.preventDefault();
    clearTimers();
    // Tap / Click toggle behavior
    if (selectedSkill?.id === item.id) {
      setSelectedSkill(null);
      setSelectedCategory(null);
    } else {
      setSelectedSkill(item);
      setSelectedCategory(item.category);
    }
  };

  return (
    <section
      id="playground"
      ref={sectionRef}
      className="relative w-full min-h-[85vh] py-16 sm:py-28 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none flex flex-col justify-between"
    >
      <div id="skills" className="absolute -top-10 left-0" />

      {/* GIGANTIC OVERSIZED EDITORIAL BACKGROUND WATERMARK: "TOOLKIT" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[clamp(9rem,26vw,24rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
          TOOLKIT
        </span>
      </div>

      {/* Subtle Blueprint Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Blueprint Technical Corner Marks */}
      <div className="absolute top-6 left-6 text-[9px] font-mono text-ink/40 tracking-widest hidden md:block select-none pointer-events-none font-bold">
        + SYS: ACTIVE // 12.04° N 77.59° E
      </div>
      <div className="absolute top-6 right-6 text-[9px] font-mono text-ink/40 tracking-widest hidden md:block select-none pointer-events-none font-bold">
        REF: BLUEPRINT_03 +
      </div>

      <div className="container-narrow relative z-10 px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-between">
        {/* 1. HEADER SECTION & CURRENT STACK ANNOTATION */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10 lg:mb-16">
          {/* Left Editorial Intro */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A]" />
              <span className="label-mono text-ink-light tracking-[0.2em] uppercase font-bold">
                03 // TOOLKIT
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-[clamp(2.2rem,5.5vw,4.8rem)] text-ink leading-[0.95] tracking-[-0.02em] font-serif uppercase font-bold"
            >
              THE TOOLS <br />
              BEHIND MY BUILDS.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base md:text-lg text-ink/75 font-sans italic mt-4 max-w-xl"
            >
              A mix of AI, code, APIs and platforms I use to turn ideas into working products.
            </motion.p>
          </div>

          {/* Right Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="self-start lg:self-auto p-4 rounded-2xl bg-cream border border-ink/15 shadow-sm font-mono"
          >
            <div className="flex items-center gap-2 text-[10px] text-ink/60 uppercase tracking-widest font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-yellow-accent animate-pulse shadow-[0_0_6px_#FFD42A]" />
              <span>CURRENTLY BUILDING WITH</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-ink tracking-wider">
              PYTHON · GEMINI · LANGCHAIN · REACT
            </div>
          </motion.div>
        </div>

        {/* 2. CENTRAL INTERACTIVE CORE SYSTEM AI ARTIFACT */}
        <div className="relative w-full flex items-center justify-center my-6 lg:my-10 min-h-[260px] sm:min-h-[320px]">
          <motion.div
            onMouseEnter={() => setHoveredCore(true)}
            onMouseLeave={() => setHoveredCore(false)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center justify-center cursor-pointer group"
          >
            {/* Outer Slow-Breathe Blueprint Dashed Ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: hoveredCore || activeSkill ? 1.05 : [1, 1.03, 1],
              }}
              transition={{
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -inset-6 sm:-inset-8 rounded-full border border-dashed border-ink/30 pointer-events-none"
            />

            {/* Inner Technical Artifact Disc */}
            <motion.div
              animate={{
                boxShadow: hoveredCore || activeSkill
                  ? "0 0 40px rgba(255, 212, 42, 0.6)"
                  : "0 8px 30px rgba(32, 37, 43, 0.08)",
                scale: hoveredCore || activeSkill ? 1.02 : 1,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-cream-paper border-2 border-ink flex flex-col items-center justify-center text-center p-4 relative shadow-2xl transition-transform"
            >
              {/* Technical Corner Micro Marks (High Contrast & Readable) */}
              <span className="absolute top-4 left-5 text-[9px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                CORE
              </span>
              <span className="absolute top-4 right-5 text-[9px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                LLM
              </span>
              <span className="absolute bottom-4 left-5 text-[9px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                API
              </span>
              <span className="absolute bottom-4 right-5 text-[9px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                BUILD
              </span>

              {/* Status Dot */}
              <div
                className={`w-3 h-3 rounded-full mb-2 transition-all duration-300 ${
                  activeSkill
                    ? "bg-yellow-accent shadow-[0_0_14px_#FFD42A] scale-125 animate-pulse"
                    : "bg-yellow-accent shadow-[0_0_8px_#FFD42A]"
                }`}
              />

              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-ink-light uppercase mb-1">
                ● CORE SYSTEM
              </span>

              <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">
                [ AI ]
              </span>

              {/* Role Indicator - Smooth Fade & Motion Transition Container */}
              <div className="mt-2 h-6 px-3 flex items-center justify-center w-full max-w-[210px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeSkill ? activeSkill.id : "idle-state"}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[9px] sm:text-[10px] font-mono tracking-wider text-ink/85 uppercase font-bold truncate text-center block"
                  >
                    {activeSkill ? activeSkill.role : "Backend & Core AI Logic"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. THREE GROUPED TECHNOLOGY COLUMNS (Desktop: 3 Cols, Mobile: 1 Stacked Sequence) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-6 lg:mt-12 pt-6 sm:pt-8 border-t border-ink/10">
          {SKILL_GROUPS.map((group) => {
            const isGroupActive = activeCategory === group.category;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Consistent Category Header */}
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(group.category, group.items[0], e)}
                  className={`w-full flex items-center justify-between pb-3 border-b transition-all duration-300 text-left focus:outline-none focus:ring-1 focus:ring-ink/20 ${
                    isGroupActive ? "border-yellow-accent" : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Consistent Indicator: Yellow dot when active, hollow/muted dot when inactive */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isGroupActive
                          ? "bg-yellow-accent shadow-[0_0_8px_#FFD42A] scale-110"
                          : "border border-ink/40 bg-transparent"
                      }`}
                    />
                    <h3
                      className={`text-xs font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                        isGroupActive ? "text-ink" : "text-ink/70"
                      }`}
                    >
                      {group.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-ink/50 font-bold uppercase">
                    [{group.items.length}]
                  </span>
                </button>

                {/* Typographic Skill List */}
                <div className="space-y-1.5 sm:space-y-2 pt-1 min-h-[240px] sm:min-h-[260px]">
                  {group.items.map((item) => {
                    const isItemActive = activeSkill?.id === item.id;
                    const isAnyActive = activeSkill !== null;
                    const isItemDimmed = isAnyActive && !isItemActive;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => handleMouseEnterSkill(item)}
                        onMouseLeave={handleMouseLeaveSkill}
                        onFocus={() => handleMouseEnterSkill(item)}
                        onBlur={handleMouseLeaveSkill}
                        onClick={(e) => handleSkillClick(item, e)}
                        className={`w-full text-left group relative flex items-center justify-between px-3 py-2 sm:py-2 rounded-lg transition-all duration-300 cursor-pointer h-10 border focus:outline-none focus:ring-1 focus:ring-ink/30 ${
                          isItemActive
                            ? "bg-cream border-ink/25 shadow-xs opacity-100 scale-[1.01]"
                            : isItemDimmed
                            ? "bg-transparent border-transparent opacity-65 hover:opacity-100 hover:bg-cream/30"
                            : "bg-transparent border-transparent hover:bg-cream/40 opacity-100"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span
                            className={`text-[10px] font-mono font-bold shrink-0 transition-colors ${
                              isItemActive ? "text-ink" : "text-ink/40"
                            }`}
                          >
                            {item.code}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-mono tracking-wider truncate transition-colors duration-200 ${
                              isItemActive ? "text-ink font-bold" : "text-ink/80 font-semibold"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {/* Right Active Indicator */}
                        <div className="flex items-center justify-end shrink-0 ml-2">
                          <span
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isItemActive
                                ? "bg-yellow-accent shadow-[0_0_8px_#FFD42A] scale-125"
                                : "border border-ink/30 group-hover:border-ink/60 bg-transparent"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
