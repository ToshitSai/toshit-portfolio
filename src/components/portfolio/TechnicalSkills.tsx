import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillItem {
  name: string;
  isPrimary: boolean;
  detail: string;
}

interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "01",
    title: "AI & GENERATIVE AI",
    skills: [
      { name: "Generative AI", isPrimary: true, detail: "Applied LLM solutions" },
      { name: "Prompt Engineering", isPrimary: true, detail: "Context & system prompts" },
      { name: "LLM Applications", isPrimary: true, detail: "End-to-end AI products" },
      { name: "LangChain", isPrimary: true, detail: "LLM workflows & orchestration" },
      { name: "Gemini API", isPrimary: true, detail: "Google AI model integration" },
      { name: "AI APIs", isPrimary: false, detail: "REST & streaming endpoints" },
      { name: "Multimodal AI", isPrimary: false, detail: "Vision & audio reasoning" },
      { name: "Whisper", isPrimary: false, detail: "Speech-to-text audio processing" },
    ],
  },
  {
    id: "02",
    title: "DEVELOPMENT",
    skills: [
      { name: "Python", isPrimary: true, detail: "Core AI backend logic" },
      { name: "React", isPrimary: true, detail: "UI component architecture" },
      { name: "Next.js", isPrimary: true, detail: "Full-stack React framework" },
      { name: "FastAPI", isPrimary: true, detail: "High-speed Python APIs" },
      { name: "JavaScript", isPrimary: false, detail: "Async web scripting" },
      { name: "REST APIs", isPrimary: false, detail: "HTTP protocol integration" },
      { name: "HTML", isPrimary: false, detail: "Semantic web markup" },
      { name: "CSS", isPrimary: false, detail: "Custom responsive styling" },
      { name: "Tailwind CSS", isPrimary: false, detail: "Utility-first CSS styling" },
    ],
  },
  {
    id: "03",
    title: "DATA & BACKEND",
    skills: [
      { name: "PostgreSQL", isPrimary: true, detail: "Relational database storage" },
      { name: "Supabase", isPrimary: true, detail: "Database & authentication" },
      { name: "MongoDB", isPrimary: false, detail: "NoSQL document database" },
      { name: "JSON", isPrimary: false, detail: "Structured data interchange" },
      { name: "APIs", isPrimary: false, detail: "Backend communication" },
      { name: "Database Integration", isPrimary: false, detail: "ORMs & query design" },
    ],
  },
  {
    id: "04",
    title: "TOOLS & DEPLOYMENT",
    skills: [
      { name: "Git", isPrimary: true, detail: "Version control system" },
      { name: "GitHub", isPrimary: true, detail: "Code repository & CI/CD" },
      { name: "Vercel", isPrimary: true, detail: "Production cloud deployment" },
      { name: "Google AI Studio", isPrimary: true, detail: "Model testing & tuning" },
      { name: "Ollama", isPrimary: false, detail: "Local LLM execution" },
      { name: "Antigravity", isPrimary: false, detail: "AI agentic workflow tool" },
      { name: "Lovable", isPrimary: false, detail: "AI web app generation" },
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<{ rowId: string; techName: string } | null>(null);

  return (
    <section id="playground" className="relative w-full py-24 sm:py-32 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10">
      <div id="skills" className="absolute -top-10 left-0" />

      {/* Background Atmosphere: Organic Clouds & Noise */}
      <div className="absolute bottom-10 left-[-5%] w-80 sm:w-96 opacity-20 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#A9D5EE"
          />
        </svg>
      </div>

      {/* Side Vertical Annotation: LEARN / BUILD / EXPERIMENT */}
      <div className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 hidden xl:block select-none pointer-events-none z-10">
        <span className="inline-block text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-ink/40 font-bold uppercase -rotate-90 origin-center whitespace-nowrap">
          LEARN / BUILD / EXPERIMENT
        </span>
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A]" />
          <span className="label-mono text-ink-light tracking-[0.2em] uppercase font-bold">
            04 // SKILLS & STACK
          </span>
        </motion.div>

        {/* Main Display Serif Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-display text-[clamp(2.5rem,6.5vw,4.8rem)] text-ink leading-[0.95] tracking-[-0.02em] font-serif uppercase mb-16 sm:mb-20 max-w-3xl"
        >
          TOOLS I USE TO BUILD.
        </motion.h2>

        {/* EDITORIAL SKILL INDEX LIST */}
        <div className="w-full space-y-0">
          {SKILL_CATEGORIES.map((cat, index) => {
            const isHovered = hoveredRow === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredRow(cat.id)}
                onMouseLeave={() => {
                  setHoveredRow(null);
                  setHoveredTech(null);
                }}
                className="group relative w-full border-t border-ink/15 py-7 sm:py-9 transition-colors duration-500 cursor-pointer"
              >
                {/* Background Highlight Wash */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 pointer-events-none rounded-xl ${
                    isHovered ? "bg-cream opacity-100 shadow-sm" : "opacity-0"
                  }`}
                />

                <div className="relative z-10 px-2 sm:px-4">
                  {/* Category Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-5">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      {/* Number Label */}
                      <span
                        className={`text-sm sm:text-base font-mono font-bold tracking-wider transition-colors duration-300 ${
                          isHovered ? "text-yellow-accent" : "text-ink/40"
                        }`}
                      >
                        {cat.id}
                      </span>

                      {/* Category Title */}
                      <motion.h3
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl sm:text-2xl md:text-3xl font-serif text-ink tracking-tight uppercase"
                      >
                        {cat.title}
                      </motion.h3>
                    </div>

                    {/* Expand Indicator */}
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-ink/40 tracking-widest uppercase">
                      <span>{cat.skills.length} TECHS</span>
                      <span className={`transition-transform duration-300 ${isHovered ? "rotate-45 text-yellow-accent" : ""}`}>
                        +
                      </span>
                    </div>
                  </div>

                  {/* Thin Animated Accent Line */}
                  <div className="relative w-full h-[1px] bg-ink/10 mb-6 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 w-full bg-yellow-accent origin-left"
                    />
                  </div>

                  {/* Skills Pill List Viewport */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
                    {cat.skills.map((tech) => {
                      const isTechHovered =
                        hoveredTech?.rowId === cat.id && hoveredTech?.techName === tech.name;

                      return (
                        <div
                          key={tech.name}
                          onMouseEnter={() => setHoveredTech({ rowId: cat.id, techName: tech.name })}
                          onMouseLeave={() => setHoveredTech(null)}
                          className="relative group/tech"
                        >
                          <motion.div
                            whileHover={{ y: -2, scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-mono tracking-wider transition-all duration-300 flex items-center gap-2 ${
                              tech.isPrimary
                                ? isHovered
                                  ? "bg-[#20252B] text-[#FFF8E8] border-[#20252B] shadow-md"
                                  : "bg-[#20252B]/90 text-[#FFF8E8] border-[#20252B]/90 font-bold"
                                : "bg-cream-paper border-ink/15 text-ink/80 hover:border-yellow-accent hover:bg-yellow-accent/20"
                            }`}
                          >
                            {tech.isPrimary && (
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-accent shadow-[0_0_6px_#FFD42A]" />
                            )}
                            <span className={tech.isPrimary ? "font-bold" : "font-medium"}>
                              {tech.name}
                            </span>
                          </motion.div>

                          {/* Tiny Contextual Hover Tooltip (Section 11) */}
                          <AnimatePresence>
                            {isTechHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#20252B] text-[#FFF8E8] border border-white/20 shadow-lg pointer-events-none whitespace-nowrap z-30 flex items-center gap-1.5"
                              >
                                <span className="text-[8px] font-mono text-yellow-accent font-bold uppercase tracking-widest">
                                  USED FOR:
                                </span>
                                <span className="text-[10px] font-mono text-white/90 uppercase tracking-wider font-semibold">
                                  {tech.detail}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Bottom Divider */}
          <div className="w-full border-t border-ink/15" />
        </div>

        {/* FEATURED SKILL MOMENT (Section 10) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="py-16 sm:py-24 my-12 border-y border-ink/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12"
        >
          <div className="max-w-xl">
            <span className="text-xs font-mono tracking-[0.2em] text-ink-light uppercase block mb-3 font-bold">
              CURRENTLY BUILDING WITH
            </span>
            <h3 className="text-display text-[clamp(2.6rem,7vw,5.2rem)] text-ink leading-[0.9] font-serif uppercase tracking-tight">
              GENERATIVE <br className="hidden sm:inline" />
              <span className="text-ink underline decoration-yellow-accent decoration-4 underline-offset-8">AI</span>
            </h3>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-base sm:text-lg font-sans text-ink/85 leading-relaxed font-normal">
              I use modern AI APIs, LLM frameworks, and scalable web technologies to turn complex ideas into intuitive, production-ready products.
            </p>
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-ink font-bold uppercase pt-2">
              <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A] animate-pulse" />
              <span>EXPLORING AUTONOMOUS AGENTS & MULTIMODAL INFERENCE</span>
            </div>
          </div>
        </motion.div>

        {/* CONTINUOUS SKILL TICKER (Section 9) */}
        <div className="w-full bg-cream-paper border-y border-ink/10 py-4 overflow-hidden select-none my-6 rounded-full shadow-inner">
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
