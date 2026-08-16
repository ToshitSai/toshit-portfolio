import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillItem {
  id: string;
  code: string;
  name: string;
  role: string;
  category: "ai" | "dev" | "backend";
  lineX: number; // percentage X relative to section canvas
  lineY: number; // percentage Y relative to section canvas
}

const SKILL_GROUPS: {
  title: string;
  category: "ai" | "dev" | "backend";
  items: SkillItem[];
}[] = [
  {
    title: "AI / ML",
    category: "ai",
    items: [
      { id: "genai", code: "01", name: "GENERATIVE AI", role: "APPLIED LLM SOLUTIONS", category: "ai", lineX: 22, lineY: 76 },
      { id: "prompt", code: "02", name: "PROMPT ENGINEERING", role: "SYSTEM CONTEXT & PROMPTS", category: "ai", lineX: 22, lineY: 79 },
      { id: "llmapps", code: "03", name: "LLM APPLICATIONS", role: "END-TO-END AI PRODUCTS", category: "ai", lineX: 22, lineY: 82 },
      { id: "langchain", code: "04", name: "LANGCHAIN", role: "LLM WORKFLOWS & CHAINS", category: "ai", lineX: 22, lineY: 85 },
      { id: "gemini", code: "05", name: "GEMINI API", role: "MULTIMODAL MODEL INTEGRATION", category: "ai", lineX: 22, lineY: 88 },
      { id: "whisper", code: "06", name: "WHISPER", role: "SPEECH RECOGNITION", category: "ai", lineX: 22, lineY: 91 },
    ],
  },
  {
    title: "DEVELOPMENT",
    category: "dev",
    items: [
      { id: "python", code: "01", name: "PYTHON", role: "BACKEND & CORE AI LOGIC", category: "dev", lineX: 50, lineY: 76 },
      { id: "react", code: "02", name: "REACT", role: "INTERFACES & UI COMPONENTS", category: "dev", lineX: 50, lineY: 79 },
      { id: "nextjs", code: "03", name: "NEXT.JS", role: "FULL-STACK SSR FRAMEWORK", category: "dev", lineX: 50, lineY: 82 },
      { id: "fastapi", code: "04", name: "FASTAPI", role: "HIGH-PERFORMANCE PYTHON APIS", category: "dev", lineX: 50, lineY: 85 },
      { id: "js", code: "05", name: "JAVASCRIPT", role: "WEB & EVENT SCRIPTING", category: "dev", lineX: 50, lineY: 88 },
      { id: "tailwind", code: "06", name: "TAILWIND CSS", role: "EDITORIAL UI STYLING", category: "dev", lineX: 50, lineY: 91 },
    ],
  },
  {
    title: "BACKEND / PLATFORM",
    category: "backend",
    items: [
      { id: "postgres", code: "01", name: "POSTGRESQL", role: "RELATIONAL DATABASE", category: "backend", lineX: 78, lineY: 76 },
      { id: "supabase", code: "02", name: "SUPABASE", role: "DATABASE & AUTHENTICATION", category: "backend", lineX: 78, lineY: 79 },
      { id: "rest", code: "03", name: "REST APIs", role: "HTTP API PROTOCOLS", category: "backend", lineX: 78, lineY: 82 },
      { id: "github", code: "04", name: "GITHUB", role: "VERSION CONTROL & CI/CD", category: "backend", lineX: 78, lineY: 85 },
      { id: "vercel", code: "05", name: "VERCEL", role: "CLOUD EDGE DEPLOYMENT", category: "backend", lineX: 78, lineY: 88 },
      { id: "ollama", code: "06", name: "OLLAMA", role: "LOCAL LLM INFERENCE", category: "backend", lineX: 78, lineY: 91 },
    ],
  },
];

const TICKER_ITEMS = [
  "PYTHON",
  "GENERATIVE AI",
  "LANGCHAIN",
  "GEMINI API",
  "LLM APPS",
  "PROMPT ENGINEERING",
  "REACT",
  "FASTAPI",
  "SUPABASE",
  "VERCEL",
];

const TechnicalSkills: React.FC = () => {
  // Single Source of Truth States for Selection & Hover
  const [selectedCategory, setSelectedCategory] = useState<"ai" | "dev" | "backend" | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [hoveredCore, setHoveredCore] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Active Skill & Active Category derived cleanly
  const activeSkill = hoveredSkill || selectedSkill;
  const activeCategory = hoveredSkill?.category || selectedCategory || (selectedSkill ? selectedSkill.category : null);

  const handleCategoryClick = (category: "ai" | "dev" | "backend", firstItem: SkillItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSkill(null);
    } else {
      setSelectedCategory(category);
      setSelectedSkill(firstItem);
    }
  };

  const handleSkillClick = (item: SkillItem, e: React.MouseEvent) => {
    e.preventDefault();
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
      className="relative w-full min-h-[90vh] py-20 sm:py-28 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none flex flex-col justify-between"
    >
      <div id="skills" className="absolute -top-10 left-0" />

      {/* GIGANTIC OVERSIZED EDITORIAL BACKGROUND WATERMARK: "TOOLKIT" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[clamp(10rem,28vw,24rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
          TOOLKIT
        </span>
      </div>

      {/* Subtle Blueprint Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Blueprint Technical Corner Marks */}
      <div className="absolute top-6 left-6 text-[9px] font-mono text-ink/30 tracking-widest hidden md:block select-none pointer-events-none">
        + SYS: ACTIVE // 12.04° N 77.59° E
      </div>
      <div className="absolute top-6 right-6 text-[9px] font-mono text-ink/30 tracking-widest hidden md:block select-none pointer-events-none">
        REF: BLUEPRINT_03 +
      </div>

      {/* SVG SECTION CONNECTION LINES OVERLAY (Absolute on full root section, zero layout impact) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block">
        <AnimatePresence>
          {activeSkill && (
            <motion.line
              key={activeSkill.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              x1="50%"
              y1="40%"
              x2={`${activeSkill.lineX}%`}
              y2={`${activeSkill.lineY}%`}
              stroke="#FFD42A"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
        </AnimatePresence>
      </svg>

      <div className="container-narrow relative z-10 px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-between">
        {/* 1. HEADER SECTION & CURRENT STACK ANNOTATION */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12 lg:mb-16">
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
              className="text-display text-[clamp(2.4rem,5.8vw,4.8rem)] text-ink leading-[0.95] tracking-[-0.02em] font-serif uppercase font-bold"
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
            <div className="flex items-center gap-2 text-[10px] text-ink/50 uppercase tracking-widest font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-yellow-accent animate-pulse shadow-[0_0_6px_#FFD42A]" />
              <span>CURRENTLY BUILDING WITH</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-ink tracking-wider">
              PYTHON · GEMINI · LANGCHAIN · REACT
            </div>
          </motion.div>
        </div>

        {/* 2. CENTRAL INTERACTIVE CORE SYSTEM AI ARTIFACT (Fixed Geometry) */}
        <div className="relative w-full flex items-center justify-center my-6 lg:my-10 min-h-[280px] sm:min-h-[320px]">
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
                scale: hoveredCore ? 1.06 : [1, 1.03, 1],
              }}
              transition={{
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -inset-6 sm:-inset-8 rounded-full border border-dashed border-ink/25 pointer-events-none"
            />

            {/* Inner Technical Artifact Disc */}
            <motion.div
              animate={{
                boxShadow: hoveredCore || activeSkill
                  ? "0 0 35px rgba(255, 212, 42, 0.55)"
                  : "0 8px 30px rgba(32, 37, 43, 0.08)",
                scale: hoveredCore || activeSkill ? 1.04 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-cream-paper border-2 border-ink flex flex-col items-center justify-center text-center p-4 relative shadow-2xl"
            >
              {/* Technical Corner Micro Marks */}
              <span className="absolute top-4 left-6 text-[8px] font-mono text-ink/40 font-bold uppercase tracking-widest">
                CORE
              </span>
              <span className="absolute top-4 right-6 text-[8px] font-mono text-ink/40 font-bold uppercase tracking-widest">
                LLM
              </span>
              <span className="absolute bottom-4 left-6 text-[8px] font-mono text-ink/40 font-bold uppercase tracking-widest">
                API
              </span>
              <span className="absolute bottom-4 right-6 text-[8px] font-mono text-ink/40 font-bold uppercase tracking-widest">
                BUILD
              </span>

              {/* Status Dot */}
              <div className="w-3 h-3 rounded-full bg-yellow-accent mb-2 shadow-[0_0_10px_#FFD42A] animate-pulse" />

              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-ink-light uppercase mb-1">
                ● CORE SYSTEM
              </span>

              <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">
                [ AI ]
              </span>

              {/* Role Indicator - Clean Single Line Centered Container */}
              <div className="mt-2 h-6 px-3 flex items-center justify-center w-full max-w-[210px]">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-ink/75 uppercase font-bold truncate text-center">
                  {activeSkill ? activeSkill.role : "GENERATIVE AI ENGINE"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. THREE GROUPED TECHNOLOGY COLUMNS (Fixed Widths, Strict Layout Boundaries) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-8 lg:mt-12 pt-8 border-t border-ink/10">
          {SKILL_GROUPS.map((group) => {
            const isGroupActive = activeCategory === group.category;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(group.category, group.items[0], e)}
                  className={`w-full flex items-center justify-between pb-3 border-b transition-colors duration-300 text-left focus:outline-none ${
                    isGroupActive ? "border-yellow-accent" : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isGroupActive
                          ? "bg-yellow-accent shadow-[0_0_8px_#FFD42A] scale-110"
                          : "bg-ink/30"
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
                  <span className="text-[10px] font-mono text-ink/40 font-bold uppercase">
                    [{group.items.length}]
                  </span>
                </button>

                {/* Typographic Skill List (Fixed Bounded Row Heights & Structure) */}
                <div className="space-y-2 pt-1 min-h-[260px]">
                  {group.items.map((item) => {
                    const isItemActive = activeSkill?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setHoveredSkill(item)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        onClick={(e) => handleSkillClick(item, e)}
                        className={`w-full text-left group relative flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer h-10 border ${
                          isItemActive
                            ? "bg-cream border-ink/25 shadow-xs"
                            : "bg-transparent border-transparent hover:bg-cream/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-[10px] font-mono text-ink/40 font-bold shrink-0">
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

                        {/* Right Indicator (Fixed Width, No Text Layout Overflow) */}
                        <div className="flex items-center justify-end shrink-0 ml-2">
                          <span
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              isItemActive
                                ? "bg-yellow-accent shadow-[0_0_8px_#FFD42A] scale-110"
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

      {/* 4. BOTTOM CONTINUOUS MARQUEE TECH TICKER */}
      <div className="w-full bg-cream-paper border-t border-ink/10 py-4 overflow-hidden select-none mt-12">
        <div className="flex w-max animate-marquee-x">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-10 px-4">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-ink uppercase">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
