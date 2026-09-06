import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillItem {
  id: string;
  code: string;
  name: string;
  role: string;
  category: "ai" | "dev" | "backend";
}

interface ItemBound {
  x: number;
  y: number;
  width: number;
  height: number;
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

const CATEGORY_MAP: Record<"ai" | "dev" | "backend", number> = {
  ai: 0,
  dev: 1,
  backend: 2,
};

const TechnicalSkills: React.FC = () => {
  // Semantic State for Accessibility & Active Role Text
  const [selectedCategory, setSelectedCategory] = useState<"ai" | "dev" | "backend" | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [hoveredCore, setHoveredCore] = useState(false);
  const [semanticActiveSkill, setSemanticActiveSkill] = useState<SkillItem>(SKILL_GROUPS[1].items[0]);

  // Section & Layout Refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const listGridRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const categoryDotsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Item bounds table: [colIndex 0..2][rowIndex 0..5]
  const itemBoundsRef = useRef<(ItemBound | null)[][]>([
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ]);

  // Motion target & current visual position values (in pixels)
  const targetMotion = useRef({ x: 0, y: 0, w: 0, h: 0, opacity: 0 });
  const currentMotion = useRef({ x: 0, y: 0, w: 0, h: 0, opacity: 0 });

  // Hover & Scroll status refs
  const hoveredSkillRef = useRef<SkillItem | null>(null);
  const selectedSkillRef = useRef<SkillItem | null>(null);
  const selectedCategoryRef = useRef<"ai" | "dev" | "backend" | null>(null);
  const currentColIndexRef = useRef<number>(1);
  const lastSemanticIdRef = useRef<string>("");
  const rafIdRef = useRef<number | null>(null);

  // Sync state refs for RAF loop access without re-binding
  hoveredSkillRef.current = hoveredSkill;
  selectedSkillRef.current = selectedSkill;
  selectedCategoryRef.current = selectedCategory;

  // Measure all row button positions inside the list grid
  const measureLayout = useCallback(() => {
    if (!listGridRef.current) return;
    const containerRect = listGridRef.current.getBoundingClientRect();

    for (let c = 0; c < SKILL_GROUPS.length; c++) {
      for (let r = 0; r < SKILL_GROUPS[c].items.length; r++) {
        const itemId = SKILL_GROUPS[c].items[r].id;
        const el = document.getElementById(`skill-btn-${itemId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          itemBoundsRef.current[c][r] = {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height,
          };
        }
      }
    }
  }, []);

  // Main Coordinated RAF Animation Loop
  useEffect(() => {
    measureLayout();

    const handleResize = () => {
      measureLayout();
    };
    window.addEventListener("resize", handleResize);

    // Continuous motion tick
    const tick = () => {
      // 1. Calculate target scroll progress through skills section
      if (sectionRef.current && listGridRef.current) {
        const secRect = sectionRef.current.getBoundingClientRect();
        const winHeight = window.innerHeight;

        // Continuous normalized scroll progress (0.0 to 5.0 across 6 rows)
        const startOffset = winHeight * 0.7;
        const endOffset = -secRect.height + winHeight * 0.3;
        const totalDist = startOffset - endOffset;
        const currentDist = startOffset - secRect.top;

        let rawProgress = Math.max(0, Math.min(1, currentDist / totalDist));
        // Continuous float row index (0.00 -> 5.00)
        let floatRowProgress = rawProgress * 5.0;

        // Determine active category column (default 'dev' = 1)
        let col = 1;
        if (hoveredSkillRef.current) {
          col = CATEGORY_MAP[hoveredSkillRef.current.category];
        } else if (selectedCategoryRef.current) {
          col = CATEGORY_MAP[selectedCategoryRef.current];
        } else if (selectedSkillRef.current) {
          col = CATEGORY_MAP[selectedSkillRef.current.category];
        }
        currentColIndexRef.current = col;

        // Determine target Y, X, W, H
        let targetX = 0;
        let targetY = 0;
        let targetW = 0;
        let targetH = 0;
        let targetOpacity = 1;

        if (hoveredSkillRef.current) {
          // Mouse hover target position
          const hCol = CATEGORY_MAP[hoveredSkillRef.current.category];
          const hRow = SKILL_GROUPS[hCol].items.findIndex((i) => i.id === hoveredSkillRef.current?.id);
          const bound = itemBoundsRef.current[hCol][Math.max(0, hRow)];
          if (bound) {
            targetX = bound.x;
            targetY = bound.y;
            targetW = bound.width;
            targetH = bound.height;
          }
        } else if (selectedSkillRef.current) {
          // Selected skill target position
          const sCol = CATEGORY_MAP[selectedSkillRef.current.category];
          const sRow = SKILL_GROUPS[sCol].items.findIndex((i) => i.id === selectedSkillRef.current?.id);
          const bound = itemBoundsRef.current[sCol][Math.max(0, sRow)];
          if (bound) {
            targetX = bound.x;
            targetY = bound.y;
            targetW = bound.width;
            targetH = bound.height;
          }
        } else {
          // CONTINUOUS SCROLL INTERPOLATION BETWEEN ROWS
          const baseRow = Math.min(4, Math.floor(floatRowProgress));
          const nextRow = Math.min(5, baseRow + 1);
          const rowFraction = floatRowProgress - baseRow;

          const bound1 = itemBoundsRef.current[col][baseRow];
          const bound2 = itemBoundsRef.current[col][nextRow];

          if (bound1 && bound2) {
            targetX = bound1.x + (bound2.x - bound1.x) * rowFraction;
            targetY = bound1.y + (bound2.y - bound1.y) * rowFraction;
            targetW = bound1.width + (bound2.width - bound1.width) * rowFraction;
            targetH = bound1.height + (bound2.height - bound1.height) * rowFraction;
          } else if (bound1) {
            targetX = bound1.x;
            targetY = bound1.y;
            targetW = bound1.width;
            targetH = bound1.height;
          }
        }

        targetMotion.current = {
          x: targetX,
          y: targetY,
          w: targetW,
          h: targetH,
          opacity: targetOpacity,
        };

        // 2. Smooth Lerp Interpolation (Responsive 0.16 smoothing factor)
        const lerp = 0.16;
        currentMotion.current.x += (targetMotion.current.x - currentMotion.current.x) * lerp;
        currentMotion.current.y += (targetMotion.current.y - currentMotion.current.y) * lerp;
        currentMotion.current.w += (targetMotion.current.w - currentMotion.current.w) * lerp;
        currentMotion.current.h += (targetMotion.current.h - currentMotion.current.h) * lerp;
        currentMotion.current.opacity += (targetMotion.current.opacity - currentMotion.current.opacity) * lerp;

        // Apply GPU transform directly to single floating highlight element
        if (highlightRef.current && currentMotion.current.w > 0) {
          const el = highlightRef.current;
          el.style.transform = `translate3d(${currentMotion.current.x}px, ${currentMotion.current.y}px, 0)`;
          el.style.width = `${currentMotion.current.w}px`;
          el.style.height = `${currentMotion.current.h}px`;
          el.style.opacity = `${currentMotion.current.opacity}`;
        }

        // 3. Derived Semantic Skill for Core AI Disc Role Label
        const nearestRow = Math.min(5, Math.max(0, Math.round(floatRowProgress)));
        const activeItem =
          hoveredSkillRef.current ||
          selectedSkillRef.current ||
          SKILL_GROUPS[col].items[nearestRow];

        if (activeItem && activeItem.id !== lastSemanticIdRef.current) {
          lastSemanticIdRef.current = activeItem.id;
          setSemanticActiveSkill(activeItem);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [measureLayout]);

  const handleMouseEnterSkill = (item: SkillItem) => {
    setHoveredSkill(item);
  };

  const handleMouseLeaveSkill = () => {
    setHoveredSkill(null);
  };

  const handleCategoryClick = (category: "ai" | "dev" | "backend", firstItem: SkillItem, e: React.SyntheticEvent) => {
    e.preventDefault();
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
    if (selectedSkill?.id === item.id) {
      setSelectedSkill(null);
      setSelectedCategory(null);
    } else {
      setSelectedSkill(item);
      setSelectedCategory(item.category);
    }
  };

  const activeCategory =
    hoveredSkill?.category ||
    selectedCategory ||
    (selectedSkill ? selectedSkill.category : "dev");

  return (
    <section
      id="skills-section"
      ref={sectionRef}
      className="relative w-full min-h-[85vh] py-16 sm:py-28 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10 select-none flex flex-col justify-between"
    >
      <div id="skills" className="absolute -top-10 left-0" />

      {/* OVERSIZED EDITORIAL BACKGROUND WATERMARK: "TOOLKIT" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[clamp(9rem,26vw,24rem)] font-serif text-ink opacity-[0.035] leading-none uppercase tracking-widest font-bold">
          TOOLKIT
        </span>
      </div>

      {/* Blueprint Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="container-narrow relative z-10 px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-between">
        {/* 1. HEADER SECTION & INTRO */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10 lg:mb-16">
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
                04 // TOOLKIT
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
        </div>

        {/* 2. CENTRAL INTERACTIVE CORE SYSTEM AI ARTIFACT */}
        <div className="relative w-full flex items-center justify-center my-6 lg:my-10 min-h-[260px] sm:min-h-[320px]">
          <motion.div
            onMouseEnter={() => setHoveredCore(true)}
            onMouseLeave={() => setHoveredCore(false)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center justify-center cursor-pointer group"
          >
            {/* Outer Slow-Breathe Blueprint Dashed Ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: hoveredCore || semanticActiveSkill ? 1.04 : [1, 1.02, 1],
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
                boxShadow: hoveredCore || semanticActiveSkill
                  ? "0 0 40px rgba(255, 212, 42, 0.6)"
                  : "0 8px 30px rgba(32, 37, 43, 0.08)",
                scale: hoveredCore || semanticActiveSkill ? 1.02 : 1,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-cream-paper border-2 border-ink flex flex-col items-center justify-center text-center p-4 relative shadow-2xl transition-transform"
            >
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

              <div className="w-3 h-3 rounded-full mb-2 bg-yellow-accent shadow-[0_0_14px_#FFD42A] scale-125 animate-pulse" />

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
                    key={semanticActiveSkill ? semanticActiveSkill.id : "idle-state"}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[9px] sm:text-[10px] font-mono tracking-wider text-ink/85 uppercase font-bold truncate text-center block"
                  >
                    {semanticActiveSkill ? semanticActiveSkill.role : "Backend & Core AI Logic"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. THREE GROUPED TECHNOLOGY COLUMNS */}
        <div
          ref={listGridRef}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-6 lg:mt-12 pt-6 sm:pt-8 border-t border-ink/10"
        >
          {/* SINGLE CONTINUOUS REUSABLE HIGHLIGHT ELEMENT */}
          <div
            ref={highlightRef}
            className="absolute top-0 left-0 bg-cream rounded-lg shadow-xs border border-ink/25 pointer-events-none z-10 flex items-center justify-end pr-3 transition-opacity duration-200"
            style={{
              willChange: "transform, width, height, opacity",
              opacity: 0,
            }}
          >
            {/* SINGLE CONTINUOUS YELLOW ACCENT DOT INSIDE HIGHLIGHT */}
            <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A]" />
          </div>

          {SKILL_GROUPS.map((group, colIdx) => {
            const isGroupActive = activeCategory === group.category;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3 sm:space-y-4"
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(group.category, group.items[0], e)}
                  className={`w-full flex items-center justify-between pb-3 border-b transition-colors duration-300 text-left focus:outline-none focus:ring-1 focus:ring-ink/20 ${
                    isGroupActive ? "border-yellow-accent" : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      ref={(el) => { categoryDotsRef.current[colIdx] = el; }}
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
                  {group.items.map((item, rowIdx) => {
                    const isItemActive = semanticActiveSkill?.id === item.id;

                    return (
                      <button
                        id={`skill-btn-${item.id}`}
                        key={item.id}
                        type="button"
                        data-col={colIdx}
                        data-row={rowIdx}
                        onMouseEnter={() => handleMouseEnterSkill(item)}
                        onMouseLeave={handleMouseLeaveSkill}
                        onFocus={() => handleMouseEnterSkill(item)}
                        onBlur={handleMouseLeaveSkill}
                        onClick={(e) => handleSkillClick(item, e)}
                        className={`w-full text-left group relative flex items-center justify-between px-3 py-2 sm:py-2 rounded-lg transition-colors duration-200 cursor-pointer h-10 border border-transparent focus:outline-none focus:ring-1 focus:ring-ink/30 ${
                          isItemActive
                            ? "text-ink font-bold"
                            : "text-ink/75 font-semibold hover:text-ink hover:bg-cream/30"
                        }`}
                      >
                        <div className="relative z-20 flex items-center gap-3 overflow-hidden">
                          <span
                            className={`text-[10px] font-mono font-bold shrink-0 transition-colors duration-200 ${
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

                        {/* Inactive Dot Placeholder */}
                        <div className="relative z-20 flex items-center justify-end shrink-0 ml-2">
                          {!isItemActive && (
                            <span className="w-2 h-2 rounded-full border border-ink/30 group-hover:border-ink/60 bg-transparent transition-colors duration-200" />
                          )}
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
