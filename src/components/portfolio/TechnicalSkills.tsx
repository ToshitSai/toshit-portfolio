import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechObject {
  id: string;
  name: string;
  size: "large" | "medium" | "small";
  detail: string;
  x: number; // percentage (14% - 84%) for main canvas positioning
  y: number; // percentage (18% - 88%) for main canvas positioning
  floatDuration: number;
}

// Strictly 10 Primary Technologies visible on the default canvas
const PRIMARY_TECH_OBJECTS: TechObject[] = [
  {
    id: "genai",
    name: "GENERATIVE AI",
    size: "large",
    detail: "APPLIED LLM SOLUTIONS",
    x: 32,
    y: 18,
    floatDuration: 8.5,
  },
  {
    id: "langchain",
    name: "LANGCHAIN",
    size: "medium",
    detail: "LLM WORKFLOWS & ORCHESTRATION",
    x: 74,
    y: 22,
    floatDuration: 9.2,
  },
  {
    id: "gemini",
    name: "GEMINI API",
    size: "medium",
    detail: "AI MODEL INTEGRATION",
    x: 82,
    y: 48,
    floatDuration: 7.8,
  },
  {
    id: "python",
    name: "PYTHON",
    size: "medium",
    detail: "BACKEND & CORE AI LOGIC",
    x: 20,
    y: 52,
    floatDuration: 8.1,
  },
  {
    id: "prompt",
    name: "PROMPT ENGINEERING",
    size: "large",
    detail: "CONTEXT & SYSTEM PROMPTS",
    x: 34,
    y: 84,
    floatDuration: 10.2,
  },
  {
    id: "llmapps",
    name: "LLM APPLICATIONS",
    size: "large",
    detail: "END-TO-END AI PRODUCTS",
    x: 72,
    y: 84,
    floatDuration: 7.5,
  },
  {
    id: "react",
    name: "REACT",
    size: "medium",
    detail: "INTERFACES & UI",
    x: 14,
    y: 34,
    floatDuration: 9.8,
  },
  {
    id: "nextjs",
    name: "NEXT.JS",
    size: "medium",
    detail: "FULL-STACK FRAMEWORK",
    x: 84,
    y: 34,
    floatDuration: 8.7,
  },
  {
    id: "fastapi",
    name: "FASTAPI",
    size: "small",
    detail: "HIGH-SPEED PYTHON APIS",
    x: 18,
    y: 72,
    floatDuration: 9.4,
  },
  {
    id: "supabase",
    name: "SUPABASE",
    size: "small",
    detail: "DATABASE & AUTH",
    x: 52,
    y: 88,
    floatDuration: 8.9,
  },
];

// Secondary Technologies (Revealed through "+ MORE TOOLS" drawer interaction)
const SECONDARY_TECH_ITEMS = [
  { name: "PostgreSQL", role: "Relational Data" },
  { name: "Vercel", role: "Cloud Deployment" },
  { name: "JavaScript", role: "Web Scripting" },
  { name: "Tailwind CSS", role: "UI Styling" },
  { name: "REST APIs", role: "HTTP Protocols" },
  { name: "GitHub", role: "Version Control" },
  { name: "Whisper", role: "Speech Recognition" },
  { name: "Ollama", role: "Local LLM Inference" },
  { name: "Google AI Studio", role: "Model Prototyping" },
  { name: "Antigravity", role: "Agent Workflows" },
  { name: "Lovable", role: "AI Web Creation" },
];

const BUILD_WITH_WORDS = ["AI", "CODE", "APIs", "IDEAS"];

const TechnicalSkills: React.FC = () => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [hoveredTech, setHoveredTech] = useState<TechObject | null>(null);
  const [hoveredCore, setHoveredCore] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
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
    setMousePos({ x: x * 10, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredTech(null);
    setHoveredCore(false);
  };

  return (
    <section
      id="playground"
      className="relative w-full min-h-[85vh] sm:min-h-[92vh] py-20 sm:py-28 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none flex flex-col justify-between"
    >
      <div id="skills" className="absolute -top-10 left-0" />

      {/* Atmospheric Background Noise & Clouds */}
      <div className="absolute top-20 right-[-8%] w-96 opacity-20 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#82BCE5"
          />
        </svg>
      </div>

      <div className="container-narrow relative z-10 px-4 sm:px-6 md:px-8">
        {/* SECTION HEADER & EDITORIAL INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
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

        {/* DESKTOP & TABLET INTERACTIVE "TOOL DESK" WORKSPACE (hidden on mobile < 640px) */}
        <div
          ref={workspaceRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="hidden sm:block relative w-full h-[640px] md:h-[700px] rounded-3xl bg-cream border border-ink/15 shadow-soft-card overflow-hidden p-6 md:p-10 max-w-full"
        >
          {/* GIGANTIC OVERSIZED LOW-OPACITY BACKGROUND WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span className="text-[clamp(8rem,24vw,20rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
              STACK
            </span>
          </div>

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:28px_28px]" />

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

          {/* CENTRAL ENLARGED VISUAL ANCHOR NODE: [ AI ] (190-210px diameter on desktop) */}
          <motion.div
            style={{
              x: mousePos.x * 0.4,
              y: mousePos.y * 0.4,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            onMouseEnter={() => setHoveredCore(true)}
            onMouseLeave={() => setHoveredCore(false)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center cursor-pointer group"
          >
            <motion.div
              animate={{
                scale: hoveredTech || hoveredCore ? 1.08 : [1, 1.03, 1],
                boxShadow: hoveredTech || hoveredCore
                  ? "0 0 30px rgba(255, 212, 42, 0.5)"
                  : "0 6px 24px rgba(32, 37, 43, 0.08)",
              }}
              transition={{
                scale: hoveredTech || hoveredCore ? { duration: 0.3 } : { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-cream-paper border-2 border-ink flex flex-col items-center justify-center text-center p-3 relative shadow-xl"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-accent mb-1.5 shadow-[0_0_8px_#FFD42A] animate-pulse" />
              <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">
                [ AI ]
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-ink-light uppercase mt-1 font-bold">
                {hoveredCore ? "AI / CORE STACK" : "CORE TOOL"}
              </span>
            </motion.div>
          </motion.div>

          {/* FLOATING PRIMARY TECHNOLOGY OBJECTS MAP (10 ITEMS ONLY) */}
          {PRIMARY_TECH_OBJECTS.map((tech) => {
            const isHovered = hoveredTech?.id === tech.id;
            const isAnyHovered = hoveredTech !== null;
            const opacity = isAnyHovered ? (isHovered ? 1 : 0.3) : 1;

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
                  x: mousePos.x * 0.6,
                  y: mousePos.y * 0.6 + (isHovered ? -4 : 0),
                  scale: isHovered ? (tech.size === "large" ? 1.12 : 1.1) : 1,
                  rotate: isHovered ? -2 : 0,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none max-w-max"
              >
                {/* Calmer Floating Motion Loop (7.5s - 10.2s) */}
                <motion.div
                  animate={{
                    y: [-3, 3, -3],
                    rotate: [-0.8, 0.8, -0.8],
                  }}
                  transition={{
                    duration: tech.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative group/object"
                >
                  {/* VARYING SIZE STYLING FOR Visual HIERARCHY */}
                  <div
                    className={`border transition-all duration-300 shadow-sm flex items-center gap-2 whitespace-nowrap ${
                      tech.size === "large"
                        ? "px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-base font-mono font-bold tracking-wider uppercase"
                        : tech.size === "medium"
                        ? "px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase"
                        : "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase"
                    } ${
                      isHovered
                        ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-xl"
                        : "bg-cream-paper border-ink/25 text-ink hover:border-yellow-accent hover:shadow-md"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_6px_#FFD42A]" />
                    <span>{tech.name}</span>
                  </div>

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

        {/* MOBILE REFLOW LAYOUT (< 640px) — Clean 10-Item Core Stack */}
        <div className="block sm:hidden w-full rounded-2xl bg-cream border border-ink/15 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-ink/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream-paper border border-ink flex items-center justify-center font-serif text-sm font-bold">
                AI
              </div>
              <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                CORE TOOLKIT
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {PRIMARY_TECH_OBJECTS.map((tech) => (
              <div
                key={tech.id}
                className="px-3.5 py-2 rounded-xl bg-cream-paper border border-ink/25 text-ink text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-accent" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECONDARY "MORE TOOLS" EXPANDABLE DRAWER */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={() => setShowMoreTools(!showMoreTools)}
            className="group px-5 py-2.5 rounded-full bg-cream border border-ink/20 text-xs font-mono font-bold tracking-widest text-ink uppercase hover:border-yellow-accent hover:bg-cream-paper transition-all duration-300 flex items-center gap-2 shadow-sm"
          >
            <span>{showMoreTools ? "- LESS TOOLS" : "+ MORE TOOLS"}</span>
            <span className="text-yellow-accent group-hover:rotate-90 transition-transform duration-300">
              {showMoreTools ? "↑" : "→"}
            </span>
          </button>

          {/* Secondary Skill Pills Container */}
          <AnimatePresence>
            {showMoreTools && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden w-full max-w-2xl mt-6 pt-4 border-t border-ink/10"
              >
                <div className="text-center mb-4 text-[10px] font-mono tracking-widest text-ink/60 uppercase font-bold">
                  ADDITIONAL TECHNOLOGIES & LIBRARIES
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {SECONDARY_TECH_ITEMS.map((item) => (
                    <div
                      key={item.name}
                      className="px-3 py-1.5 rounded-lg bg-cream-paper border border-ink/15 text-xs font-mono text-ink/80 tracking-wider uppercase hover:border-yellow-accent hover:text-ink transition-colors flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      <span className="text-[9px] text-ink/40 font-normal">({item.role})</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
