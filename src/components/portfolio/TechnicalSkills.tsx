import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechObject {
  id: string;
  name: string;
  category: "primary" | "secondary" | "supporting";
  detail: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  styleType: "paper" | "badge" | "circle" | "disc" | "pill" | "tag" | "tile";
  floatDuration: number;
}

const TECH_OBJECTS: TechObject[] = [
  // Primary Technologies (Largest visual weight)
  {
    id: "genai",
    name: "GENERATIVE AI",
    category: "primary",
    detail: "APPLIED LLM SOLUTIONS",
    x: 28,
    y: 22,
    styleType: "paper",
    floatDuration: 5.2,
  },
  {
    id: "langchain",
    name: "LANGCHAIN",
    category: "primary",
    detail: "LLM WORKFLOWS & ORCHESTRATION",
    x: 74,
    y: 20,
    styleType: "tag",
    floatDuration: 6.1,
  },
  {
    id: "python",
    name: "PYTHON",
    category: "primary",
    detail: "BACKEND & CORE AI LOGIC",
    x: 20,
    y: 50,
    styleType: "circle",
    floatDuration: 4.8,
  },
  {
    id: "gemini",
    name: "GEMINI API",
    category: "primary",
    detail: "AI MODEL INTEGRATION",
    x: 80,
    y: 48,
    styleType: "disc",
    floatDuration: 5.6,
  },
  {
    id: "prompt",
    name: "PROMPT ENGINEERING",
    category: "primary",
    detail: "CONTEXT & SYSTEM PROMPTS",
    x: 30,
    y: 78,
    styleType: "tile",
    floatDuration: 6.4,
  },
  {
    id: "llmapps",
    name: "LLM APPLICATIONS",
    category: "primary",
    detail: "END-TO-END AI PRODUCTS",
    x: 70,
    y: 78,
    styleType: "paper",
    floatDuration: 5.0,
  },

  // Secondary Technologies
  {
    id: "react",
    name: "REACT",
    category: "secondary",
    detail: "INTERFACES & UI",
    x: 12,
    y: 34,
    styleType: "badge",
    floatDuration: 6.8,
  },
  {
    id: "nextjs",
    name: "NEXT.JS",
    category: "secondary",
    detail: "FULL-STACK FRAMEWORK",
    x: 86,
    y: 30,
    styleType: "tile",
    floatDuration: 4.5,
  },
  {
    id: "fastapi",
    name: "FASTAPI",
    category: "secondary",
    detail: "HIGH-SPEED PYTHON APIS",
    x: 14,
    y: 68,
    styleType: "pill",
    floatDuration: 5.9,
  },
  {
    id: "postgresql",
    name: "POSTGRESQL",
    category: "secondary",
    detail: "RELATIONAL DATA",
    x: 84,
    y: 68,
    styleType: "disc",
    floatDuration: 6.3,
  },
  {
    id: "supabase",
    name: "SUPABASE",
    category: "secondary",
    detail: "DATABASE / AUTH",
    x: 40,
    y: 90,
    styleType: "pill",
    floatDuration: 5.4,
  },
  {
    id: "vercel",
    name: "VERCEL",
    category: "secondary",
    detail: "DEPLOYMENT",
    x: 60,
    y: 90,
    styleType: "tile",
    floatDuration: 4.9,
  },

  // Supporting Technologies
  {
    id: "js",
    name: "JAVASCRIPT",
    category: "supporting",
    detail: "WEB SCRIPTING",
    x: 8,
    y: 16,
    styleType: "tag",
    floatDuration: 7.2,
  },
  {
    id: "tailwind",
    name: "TAILWIND CSS",
    category: "supporting",
    detail: "UI STYLING",
    x: 90,
    y: 14,
    styleType: "tag",
    floatDuration: 5.8,
  },
  {
    id: "rest",
    name: "REST APIs",
    category: "supporting",
    detail: "API PROTOCOLS",
    x: 5,
    y: 86,
    styleType: "tag",
    floatDuration: 6.5,
  },
  {
    id: "github",
    name: "GITHUB",
    category: "supporting",
    detail: "VERSION CONTROL & CI",
    x: 93,
    y: 86,
    styleType: "tag",
    floatDuration: 5.1,
  },
  {
    id: "ollama",
    name: "OLLAMA",
    category: "supporting",
    detail: "LOCAL LLM INFERENCE",
    x: 42,
    y: 10,
    styleType: "tag",
    floatDuration: 6.9,
  },
  {
    id: "whisper",
    name: "WHISPER",
    category: "supporting",
    detail: "SPEECH RECOGNITION",
    x: 58,
    y: 10,
    styleType: "tag",
    floatDuration: 5.3,
  },
  {
    id: "aistudio",
    name: "GOOGLE AI STUDIO",
    category: "supporting",
    detail: "MODEL PROTOTYPING",
    x: 22,
    y: 8,
    styleType: "tag",
    floatDuration: 6.0,
  },
  {
    id: "antigravity",
    name: "ANTIGRAVITY",
    category: "supporting",
    detail: "AGENT WORKFLOWS",
    x: 78,
    y: 8,
    styleType: "tag",
    floatDuration: 7.0,
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
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x: x * 16, y: y * 16 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredTech(null);
  };

  return (
    <section
      id="playground"
      className="relative w-full py-24 sm:py-32 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none"
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

      {/* Side Vertical Editorial Annotation: LEARN / BUILD / EXPERIMENT */}
      <div className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 hidden xl:block select-none pointer-events-none z-10">
        <span className="inline-block text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-ink/40 font-bold uppercase -rotate-90 origin-center whitespace-nowrap">
          LEARN / BUILD / EXPERIMENT
        </span>
      </div>

      <div className="container-narrow relative z-10">
        {/* SECTION HEADER & EDITORIAL INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
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
              className="text-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-[0.95] tracking-[-0.02em] font-serif uppercase"
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
              className="text-base sm:text-lg text-ink/75 font-sans italic mt-4 max-w-lg"
            >
              AI tools, code, APIs and ideas — the ingredients behind everything I build.
            </motion.p>
          </div>

          {/* Dynamic "BUILD WITH" Cycling Editorial Label */}
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

        {/* INTERACTIVE "TOOL DESK" CONSTELLATION WORKSPACE */}
        <div
          ref={workspaceRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[620px] sm:h-[700px] rounded-3xl bg-cream border border-ink/15 shadow-soft-card overflow-hidden p-4 sm:p-8"
        >
          {/* GIGANTIC OVERSIZED LOW-OPACITY BACKGROUND WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span className="text-[clamp(8rem,25vw,22rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
              STACK
            </span>
          </div>

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Floating Status Badge Top-Right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cream-paper border border-ink/10 text-[11px] font-mono tracking-widest text-ink/80 uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A] animate-pulse" />
            <span>● CURRENTLY USING: GEMINI API · LANGCHAIN · PYTHON · REACT</span>
          </div>

          {/* DYNAMIC SVG CONSTELLATION CONNECTION LINES */}
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
            const opacity = isAnyHovered ? (isHovered ? 1 : 0.35) : 1;

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
                  x: mousePos.x * (tech.category === "primary" ? 0.8 : 0.5),
                  y: mousePos.y * (tech.category === "primary" ? 0.8 : 0.5) + (isHovered ? -4 : 0),
                  scale: isHovered ? (tech.category === "primary" ? 1.18 : 1.12) : 1,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none"
              >
                {/* Independent Floating Animation Wrapper */}
                <motion.div
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [-1.5, 1.5, -1.5],
                  }}
                  transition={{
                    duration: tech.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative group/object"
                >
                  {/* STYLE VARIATION 1: PAPER TILE (Primary) */}
                  {tech.styleType === "paper" && (
                    <div
                      className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center gap-2 ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-lg"
                          : "bg-cream-paper border-ink/20 text-ink hover:border-yellow-accent"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
                        {tech.name}
                      </span>
                    </div>
                  )}

                  {/* STYLE VARIATION 2: CIRCLE BADGE (Python) */}
                  {tech.styleType === "circle" && (
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center text-center p-1 transition-all duration-300 shadow-sm relative ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-yellow-accent shadow-xl"
                          : "bg-cream-paper border-ink/25 text-ink"
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
                        {tech.name}
                      </span>
                      <div className="absolute inset-0 rounded-full border border-yellow-accent/40 animate-ping opacity-25 pointer-events-none" />
                    </div>
                  )}

                  {/* STYLE VARIATION 3: GLOWING DISC (Gemini API / Postgres) */}
                  {tech.styleType === "disc" && (
                    <div
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-300 shadow-sm flex items-center gap-2 ${
                        isHovered
                          ? "bg-yellow-accent text-ink border-yellow-accent shadow-lg font-bold"
                          : "bg-cream-paper border-ink/20 text-ink"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-ink" />
                      <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
                        {tech.name}
                      </span>
                    </div>
                  )}

                  {/* STYLE VARIATION 4: TAG WITH CONNECTING LINE (LangChain) */}
                  {tech.styleType === "tag" && (
                    <div
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-md"
                          : tech.category === "supporting"
                          ? "bg-cream-paper/70 border-ink/10 text-ink/70 hover:border-ink/30"
                          : "bg-cream-paper border-ink/20 text-ink"
                      }`}
                    >
                      {tech.name}
                    </div>
                  )}

                  {/* STYLE VARIATION 5: MINIMAL TILE / PILL */}
                  {(tech.styleType === "tile" || tech.styleType === "pill" || tech.styleType === "badge") && (
                    <div
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 ${
                        isHovered
                          ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-md font-bold"
                          : "bg-cream-paper border-ink/20 text-ink hover:border-yellow-accent"
                      }`}
                    >
                      {tech.name}
                    </div>
                  )}

                  {/* CONTEXTUAL DESCRIPTOR POPUP (Requirement 9) */}
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

        {/* CONTINUOUS MARQUEE TECH TICKER */}
        <div className="w-full bg-cream-paper border-y border-ink/10 py-4 overflow-hidden select-none my-10 rounded-full shadow-inner">
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
