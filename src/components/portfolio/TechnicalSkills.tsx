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

  // Current physical motion state for frame-by-frame lerping
  const currentMotion = useRef({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    opacity: 0,
    initialized: false,
  });

  // Sync refs for RAF loop access without state re-binding
  const hoveredSkillRef = useRef<SkillItem | null>(null);
  const selectedSkillRef = useRef<SkillItem | null>(null);
  const selectedCategoryRef = useRef<"ai" | "dev" | "backend" | null>(null);
  const semanticActiveSkillRef = useRef<SkillItem>(SKILL_GROUPS[1].items[0]);

  hoveredSkillRef.current = hoveredSkill;
  selectedSkillRef.current = selectedSkill;
  selectedCategoryRef.current = selectedCategory;
  semanticActiveSkillRef.current = semanticActiveSkill;

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
          if (rect.width > 20 && rect.height > 10) {
            itemBoundsRef.current[c][r] = {
              x: rect.left - containerRect.left,
              y: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height,
            };
          }
        }
      }
    }
  }, []);

  // Helper to safely retrieve or on-demand measure item bounds
  const getBound = useCallback((col: number, row: number): ItemBound | null => {
    const existing = itemBoundsRef.current[col]?.[row];
    if (existing && existing.width > 20 && existing.height > 10) {
      return existing;
    }
    const itemId = SKILL_GROUPS[col]?.items[row]?.id;
    if (itemId && listGridRef.current) {
      const el = document.getElementById(`skill-btn-${itemId}`);
      if (el) {
        const containerRect = listGridRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        if (rect.width > 20 && rect.height > 10) {
          const measured: ItemBound = {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height,
          };
          itemBoundsRef.current[col][row] = measured;
          return measured;
        }
      }
    }
    return null;
  }, []);

  // Single Continuous RAF Animation Loop for Highlight Position & Lerp Smoothing
  useEffect(() => {
    let animationFrameId: number;

    measureLayout();
    const timer = setTimeout(measureLayout, 100);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measureLayout);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && listGridRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureLayout();
      });
      resizeObserver.observe(listGridRef.current);
    }

    const handleResize = () => {
      measureLayout();
    };
    window.addEventListener("resize", handleResize);

    const LERP_FACTOR = 0.16; // Responsive smoothing factor per frame

    const updateFrame = () => {
      if (listGridRef.current && highlightRef.current) {
        const gridRect = listGridRef.current.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const isMobile = window.innerWidth < 768;

        let targetX = 0;
        let targetY = 0;
        let targetW = 0;
        let targetH = 0;
        let targetOpacity = 1;
        let activeSemanticItem: SkillItem | null = null;

        const hovered = hoveredSkillRef.current;
        const selected = selectedSkillRef.current;
        const selCat = selectedCategoryRef.current;

        if (hovered) {
          const c = CATEGORY_MAP[hovered.category];
          const r = SKILL_GROUPS[c].items.findIndex((it) => it.id === hovered.id);
          const bound = getBound(c, r);
          if (bound) {
            targetX = bound.x;
            targetY = bound.y;
            targetW = bound.width;
            targetH = bound.height;
            activeSemanticItem = hovered;
          }
        } else if (selected) {
          const c = CATEGORY_MAP[selected.category];
          const r = SKILL_GROUPS[c].items.findIndex((it) => it.id === selected.id);
          const bound = getBound(c, r);
          if (bound) {
            targetX = bound.x;
            targetY = bound.y;
            targetW = bound.width;
            targetH = bound.height;
            activeSemanticItem = selected;
          }
        } else {
          // Continuous local section scroll progress calculation
          const startThreshold = isMobile ? vh * 0.70 : vh * 0.55;
          const endThreshold = isMobile ? vh * -0.40 : vh * 0.15;
          const rawProgress = (startThreshold - gridRect.top) / (startThreshold - endThreshold);
          const clampedT = Math.max(0, Math.min(1, rawProgress));

          if (isMobile) {
            // Mobile stacked 1-column layout (18 total items)
            const TOTAL_ITEMS = 18;
            const progressVal = clampedT * (TOTAL_ITEMS - 1);
            const indexA = Math.floor(progressVal);
            const indexB = Math.min(TOTAL_ITEMS - 1, indexA + 1);
            const frac = progressVal - indexA;

            const colA = Math.floor(indexA / 6);
            const rowA = indexA % 6;
            const colB = Math.floor(indexB / 6);
            const rowB = indexB % 6;

            const boundA = getBound(colA, rowA);
            const boundB = getBound(colB, rowB);

            if (boundA && boundB) {
              targetX = boundA.x + (boundB.x - boundA.x) * frac;
              targetY = boundA.y + (boundB.y - boundA.y) * frac;
              targetW = boundA.width + (boundB.width - boundA.width) * frac;
              targetH = boundA.height + (boundB.height - boundA.height) * frac;
            } else if (boundA) {
              targetX = boundA.x;
              targetY = boundA.y;
              targetW = boundA.width;
              targetH = boundA.height;
            } else if (boundB) {
              targetX = boundB.x;
              targetY = boundB.y;
              targetW = boundB.width;
              targetH = boundB.height;
            }

            const closestIdx = Math.round(progressVal);
            const closestCol = Math.floor(closestIdx / 6);
            const closestRow = closestIdx % 6;
            activeSemanticItem = SKILL_GROUPS[closestCol]?.items[closestRow] || null;
          } else {
            // Desktop 3-column layout (6 items per column)
            let activeCol = 1; // Default to dev column
            if (selCat) {
              activeCol = CATEGORY_MAP[selCat];
            } else if (semanticActiveSkillRef.current) {
              activeCol = CATEGORY_MAP[semanticActiveSkillRef.current.category];
            }

            const NUM_ROWS = 6;
            const progressVal = clampedT * (NUM_ROWS - 1);
            const rowA = Math.floor(progressVal);
            const rowB = Math.min(NUM_ROWS - 1, rowA + 1);
            const frac = progressVal - rowA;

            const boundA = getBound(activeCol, rowA);
            const boundB = getBound(activeCol, rowB);

            if (boundA && boundB) {
              targetX = boundA.x + (boundB.x - boundA.x) * frac;
              targetY = boundA.y + (boundB.y - boundA.y) * frac;
              targetW = boundA.width + (boundB.width - boundA.width) * frac;
              targetH = boundA.height + (boundB.height - boundA.height) * frac;
            } else if (boundA) {
              targetX = boundA.x;
              targetY = boundA.y;
              targetW = boundA.width;
              targetH = boundA.height;
            } else if (boundB) {
              targetX = boundB.x;
              targetY = boundB.y;
              targetW = boundB.width;
              targetH = boundB.height;
            }

            const closestRow = Math.round(progressVal);
            activeSemanticItem = SKILL_GROUPS[activeCol]?.items[closestRow] || null;
          }
        }

        // Apply strict min bounds to prevent any zero-width or zero-height collapse
        const safeW = Math.max(120, targetW);
        const safeH = Math.max(36, targetH);

        // Initialize motion state directly on first frame with valid measurements
        if (!currentMotion.current.initialized && safeW > 120) {
          currentMotion.current.x = targetX;
          currentMotion.current.y = targetY;
          currentMotion.current.w = safeW;
          currentMotion.current.h = safeH;
          currentMotion.current.opacity = targetOpacity;
          currentMotion.current.initialized = true;
        } else if (currentMotion.current.initialized) {
          currentMotion.current.x += (targetX - currentMotion.current.x) * LERP_FACTOR;
          currentMotion.current.y += (targetY - currentMotion.current.y) * LERP_FACTOR;
          currentMotion.current.w += (safeW - currentMotion.current.w) * LERP_FACTOR;
          currentMotion.current.h += (safeH - currentMotion.current.h) * LERP_FACTOR;
          currentMotion.current.opacity += (targetOpacity - currentMotion.current.opacity) * LERP_FACTOR;
        }

        if (currentMotion.current.initialized) {
          const el = highlightRef.current;
          el.style.transform = `translate3d(${currentMotion.current.x.toFixed(2)}px, ${currentMotion.current.y.toFixed(2)}px, 0)`;
          el.style.width = `${currentMotion.current.w.toFixed(2)}px`;
          el.style.height = `${currentMotion.current.h.toFixed(2)}px`;
          el.style.opacity = currentMotion.current.opacity.toFixed(2);
        }

        if (
          activeSemanticItem &&
          activeSemanticItem.id !== semanticActiveSkillRef.current?.id
        ) {
          setSemanticActiveSkill(activeSemanticItem);
        }
      }

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [measureLayout, getBound]);

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
    (selectedSkill ? selectedSkill.category : semanticActiveSkill.category);

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
              <span className="absolute top-3 left-4 sm:top-4 sm:left-5 text-[8px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                CORE
              </span>
              <span className="absolute top-3 right-4 sm:top-4 sm:right-5 text-[8px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                LLM
              </span>
              <span className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 text-[8px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
                API
              </span>
              <span className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 text-[8px] sm:text-[10px] font-mono text-ink/75 font-bold uppercase tracking-widest">
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
          {/* SINGLE PERSISTENT HIGHLIGHT WRAPPER (Layer 1: Position & Dimensions) */}
          <div
            ref={highlightRef}
            className="absolute top-0 left-0 pointer-events-none z-10 transition-opacity duration-200"
            style={{
              willChange: "transform, width, height, opacity",
              opacity: 0,
            }}
          >
            {/* Layer 2: HighlightVisual (Geometry, Border, Background) */}
            <div className="w-full h-full bg-cream rounded-lg shadow-xs border border-ink/25 flex items-center justify-end pr-3">
              {/* Layer 3: YellowDot */}
              <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-[0_0_8px_#FFD42A] shrink-0" />
            </div>
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
