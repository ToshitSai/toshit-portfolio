import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechObject {
  id: string;
  name: string;
  isCore: boolean;
  detail: string;
  x: number; // percentage (12-84%) for desktop floating canvas
  y: number; // percentage (12-88%) for desktop floating canvas
  floatDuration: number;
}

const TECH_OBJECTS: TechObject[] = [
  // CORE STACK (isCore: true — bold text, filled yellow dot, prominent size)
  {
    id: "genai",
    name: "GENERATIVE AI",
    isCore: true,
    detail: "APPLIED LLM SOLUTIONS",
    x: 28,
    y: 28,
    floatDuration: 5.2,
  },
  {
    id: "langchain",
    name: "LANGCHAIN",
    isCore: true,
    detail: "LLM WORKFLOWS & ORCHESTRATION",
    x: 72,
    y: 28,
    floatDuration: 6.1,
  },
  {
    id: "python",
    name: "PYTHON",
    isCore: true,
    detail: "BACKEND & CORE AI LOGIC",
    x: 24,
    y: 58,
    floatDuration: 4.8,
  },
  {
    id: "gemini",
    name: "GEMINI API",
    isCore: true,
    detail: "AI MODEL INTEGRATION",
    x: 76,
    y: 56,
    floatDuration: 5.6,
  },
  {
    id: "prompt",
    name: "PROMPT ENGINEERING",
    isCore: true,
    detail: "CONTEXT & SYSTEM PROMPTS",
    x: 35,
    y: 84,
    floatDuration: 6.4,
  },
  {
    id: "llmapps",
    name: "LLM APPLICATIONS",
    isCore: true,
    detail: "END-TO-END AI PRODUCTS",
    x: 70,
    y: 84,
    floatDuration: 5.0,
  },
  {
    id: "react",
    name: "REACT",
    isCore: true,
    detail: "INTERFACES & UI",
    x: 16,
    y: 42,
    floatDuration: 6.8,
  },
  {
    id: "nextjs",
    name: "NEXT.JS",
    isCore: true,
    detail: "FULL-STACK FRAMEWORK",
    x: 80,
    y: 40,
    floatDuration: 4.5,
  },
  {
    id: "fastapi",
    name: "FASTAPI",
    isCore: true,
    detail: "HIGH-SPEED PYTHON APIS",
    x: 18,
    y: 74,
    floatDuration: 5.9,
  },
  {
    id: "postgresql",
    name: "POSTGRESQL",
    isCore: true,
    detail: "RELATIONAL DATA",
    x: 80,
    y: 72,
    floatDuration: 6.3,
  },
  {
    id: "supabase",
    name: "SUPABASE",
    isCore: true,
    detail: "DATABASE & AUTH",
    x: 44,
    y: 90,
    floatDuration: 5.4,
  },

  // FAMILIAR WITH / ALSO USING (isCore: false — muted text, thin border, no dot)
  {
    id: "js",
    name: "JAVASCRIPT",
    isCore: false,
    detail: "WEB SCRIPTING",
    x: 14,
    y: 22,
    floatDuration: 7.2,
  },
  {
    id: "tailwind",
    name: "TAILWIND CSS",
    isCore: false,
    detail: "UI STYLING",
    x: 84,
    y: 22,
    floatDuration: 5.8,
  },
  {
    id: "vercel",
    name: "VERCEL",
    isCore: false,
    detail: "DEPLOYMENT",
    x: 56,
    y: 90,
    floatDuration: 4.9,
  },
  {
    id: "github",
    name: "GITHUB",
    isCore: false,
    detail: "VERSION CONTROL & CI",
    x: 84,
    y: 88,
    floatDuration: 5.1,
  },
  {
    id: "ollama",
    name: "OLLAMA",
    isCore: false,
    detail: "LOCAL LLM INFERENCE",
    x: 48,
    y: 15,
    floatDuration: 6.9,
  },
  {
    id: "whisper",
    name: "WHISPER",
    isCore: false,
    detail: "SPEECH RECOGNITION",
    x: 62,
    y: 15,
    floatDuration: 5.3,
  },
  {
    id: "aistudio",
    name: "GOOGLE AI STUDIO",
    isCore: false,
    detail: "MODEL PROTOTYPING",
    x: 30,
    y: 15,
    floatDuration: 6.0,
  },
  {
    id: "antigravity",
    name: "ANTIGRAVITY",
    isCore: false,
    detail: "AGENT WORKFLOWS",
    x: 76,
    y: 15,
    floatDuration: 7.0,
  },
  {
    id: "rest",
    name: "REST APIs",
    isCore: false,
    detail: "API PROTOCOLS",
    x: 12,
    y: 88,
    floatDuration: 6.5,
  },
  {
    id: "lovable",
    name: "LOVABLE",
    isCore: false,
    detail: "AI WEB CREATION",
    x: 50,
    y: 8,
    floatDuration: 5.7,
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

const BUILD_WITH_WORDS = ["AI", "CODE", "APIs", "IDEAS"];

const TechnicalSkills: React.FC = () => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [hoveredTech, setHoveredTech] = useState<TechObject | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Cycle "BUILD WITH" word every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % BUILD_WITH_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Handle subtle magnetic mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 14, y: y * 14 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredTech(null);
  };

  return (
    <section
      id="playground"
      className="relative w-full py-20 sm:py-32 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none"
    >
      <div id="skills" className="absolute -top-10 left-0" />

      {/* Atmospheric Background Noise & Clouds */}
      <div className="absolute top-20 right-[-8%] w-96 opacity-25 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#82BCE5"
          />
        </svg>
      </div>

      {/* Side Vertical Editorial Annotation */}
      <div className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 hidden xl:block select-none pointer-events-none z-10">
        <span className="inline-block text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-ink/40 font-bold uppercase -rotate-90 origin-center whitespace-nowrap">
          LEARN / BUILD / EXPERIMENT
        </span>
      </div>

      <div className="container-narrow relative z-10 px-4 sm:px-6 md:px-8">
        {/* SECTION HEADER & EDITORIAL INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-14">
          <div>
            {/* Section Eyebrow */}
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

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-[clamp(2.2rem,5.5vw,4.5rem)] text-ink leading-[0.95] tracking-[-0.02em] font-serif uppercase"
            >
              THE THINGS <br />
              <span className="text-ink">I BUILD WITH.</span>
            </motion.h2>

            {/* Editorial Sub-statement */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-lg text-ink/75 font-sans italic mt-3 max-w-lg"
            >
              AI tools, code, APIs and ideas — the ingredients behind everything I build.
            </motion.p>
          </div>

          {/* Dynamic "BUILD WITH" Cycling Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-cream border border-ink/15 shadow-sm self-start md:self-auto"
          >
            <span className="text-xs font-mono text-ink/60 uppercase tracking-widest font-bold">
              BUILD WITH
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-accent" />
            <div className="h-5 overflow-hidden relative min-w-[60px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={BUILD_WITH_WORDS[activeWordIndex]}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 text-xs font-mono text-ink font-bold uppercase tracking-widest flex items-center"
                >
                  {BUILD_WITH_WORDS[activeWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* STACK HIERARCHY LEGEND (Requirement 2) */}
        <div className="flex items-center justify-between gap-4 mb-4 px-2">
          <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-cream border border-ink/15 text-[11px] font-mono tracking-wider text-ink shadow-sm">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-accent shadow-[0_0_6px_#FFD42A]" />
              <span>● CORE STACK</span>
            </div>
            <span className="text-ink/25">|</span>
            <div className="flex items-center gap-1.5 text-ink/65">
              <span className="w-2 h-2 rounded-full border border-ink/40 bg-transparent" />
              <span>○ ALSO USING</span>
            </div>
          </div>
        </div>

        {/* DESKTOP & TABLET INTERACTIVE "TOOL DESK" CONSTELLATION WORKSPACE (hidden on mobile < 640px) */}
        <div
          ref={workspaceRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="hidden sm:block relative w-full h-[620px] md:h-[680px] rounded-3xl bg-cream border border-ink/15 shadow-soft-card overflow-hidden p-6 md:p-10 max-w-full"
        >
          {/* GIGANTIC OVERSIZED LOW-OPACITY BACKGROUND WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span className="text-[clamp(8rem,24vw,20rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
              STACK
            </span>
          </div>

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Dynamic SVG Constellation Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <AnimatePresence>
              {hoveredTech && (
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  x1="50%"
                  y1="50%"
                  x2={`${hoveredTech.x}%`}
                  y2={`${hoveredTech.y}%`}
                  stroke="#FFD42A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* CENTRAL VISUAL ANCHOR NODE: [ AI ] */}
          <motion.div
            style={{
              x: mousePos.x * 0.4,
              y: mousePos.y * 0.4,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center cursor-pointer group"
          >
            <motion.div
              animate={{
                scale: hoveredTech ? 1.12 : [1, 1.04, 1],
                boxShadow: hoveredTech
                  ? "0 0 25px rgba(255, 212, 42, 0.6)"
                  : "0 4px 20px rgba(32, 37, 43, 0.08)",
              }}
              transition={{
                scale: hoveredTech ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cream-paper border-2 border-ink flex flex-col items-center justify-center text-center p-2 relative shadow-lg"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-accent mb-1 shadow-sm" />
              <span className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                [ AI ]
              </span>
              <span className="text-[8px] font-mono tracking-widest text-ink-light uppercase mt-0.5">
                CORE TOOL
              </span>
            </motion.div>
          </motion.div>

          {/* FLOATING TECHNOLOGY OBJECTS MAP */}
          {TECH_OBJECTS.map((tech) => {
            const isHovered = hoveredTech?.id === tech.id;
            const isAnyHovered = hoveredTech !== null;
            const opacity = isAnyHovered ? (isHovered ? 1 : 0.32) : 1;

            return (
              <motion.div
                key={tech.id}
                tabIndex={0}
                onMouseEnter={() => setHoveredTech(tech)}
                onFocus={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
                onBlur={() => setHoveredTech(null)}
                style={{
                  left: `${tech.x}%`,
                  top: `${tech.y}%`,
                }}
                animate={{
                  x: mousePos.x * (tech.isCore ? 0.7 : 0.4),
                  y: mousePos.y * (tech.isCore ? 0.7 : 0.4) + (isHovered ? -4 : 0),
                  scale: isHovered ? (tech.isCore ? 1.15 : 1.08) : 1,
                  rotate: isHovered ? -2 : 0,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none max-w-max"
              >
                {/* Independent Floating Animation Wrapper */}
                <motion.div
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [-1, 1, -1],
                  }}
                  transition={{
                    duration: tech.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative group/object"
                >
                  {/* TIER 1: CORE STACK (Bold text, filled dot, prominent visual styling) */}
                  {tech.isCore ? (
                    <div
                      className={`px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center gap-2 whitespace-nowrap ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-xl"
                          : "bg-cream-paper border-ink/30 text-ink font-bold hover:border-yellow-accent hover:shadow-md"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_6px_#FFD42A]" />
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
                        {tech.name}
                      </span>
                    </div>
                  ) : (
                    /* TIER 2: ALSO USING / FAMILIAR WITH (Lighter border, muted text, no dot) */
                    <div
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-xs font-mono tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-md font-bold"
                          : "bg-cream-paper/80 border-ink/15 text-ink/70 font-normal hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {tech.name}
                    </div>
                  )}

                  {/* Contextual Role Tooltip on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#20252B] text-[#FFF8E8] border border-white/20 shadow-xl pointer-events-none whitespace-nowrap z-40 flex items-center gap-1.5"
                      >
                        <span className="text-[8px] font-mono text-yellow-accent font-bold uppercase tracking-widest">
                          ROLE:
                        </span>
                        <span className="text-[10px] font-mono text-white/95 uppercase tracking-wider font-semibold">
                          {tech.detail}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* MOBILE REFLOW LAYOUT (< 640px) — Clean wrapped flex container with clear reading order */}
        <div className="block sm:hidden w-full rounded-2xl bg-cream border border-ink/15 p-5 space-y-6">
          {/* Central AI Badge Header */}
          <div className="flex items-center justify-between pb-4 border-b border-ink/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream-paper border border-ink flex items-center justify-center font-serif text-sm font-bold">
                AI
              </div>
              <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                CORE TOOLKIT
              </span>
            </div>
          </div>

          {/* Section 1: Core Stack */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
              <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
                CORE STACK
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_OBJECTS.filter((t) => t.isCore).map((tech) => (
                <div
                  key={tech.id}
                  className="px-3 py-1.5 rounded-xl bg-cream-paper border border-ink/30 text-ink text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-accent" />
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Also Using / Familiar With */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full border border-ink/40" />
              <span className="text-xs font-mono text-ink/70 font-semibold tracking-widest uppercase">
                ALSO USING / FAMILIAR WITH
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_OBJECTS.filter((t) => !t.isCore).map((tech) => (
                <div
                  key={tech.id}
                  className="px-2.5 py-1.5 rounded-lg bg-cream-paper/70 border border-ink/15 text-ink/75 text-xs font-mono tracking-wider uppercase"
                >
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTINUOUS MARQUEE TECH TICKER */}
        <div className="w-full bg-cream-paper border-y border-ink/10 py-4 overflow-hidden select-none my-8 sm:my-10 rounded-full shadow-inner">
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
      </div>
    </section>
  );
};

export default TechnicalSkills;
