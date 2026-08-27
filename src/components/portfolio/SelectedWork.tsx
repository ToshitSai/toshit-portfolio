import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, CheckCircle2, Play, Activity, Cpu, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectsCarousel from "./ProjectsCarousel";
import ProjectStoryViewer from "./ProjectStoryViewer";
import ProjectGrid from "./ProjectGrid";

gsap.registerPlugin(ScrollTrigger);

// --- DYNAMIC ANIMATED PROJECT PREVIEWS ---

// 1. CourseForge AI Preview Component
const CourseForgePreview: React.FC = () => {
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    "01. Introduction to Applied AI Systems",
    "02. Neural Architectures & Transformers",
    "03. Context Windowing & Vector Search",
  ];

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EBF5FF] border border-[#3B82F6]/30 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#3B82F6]/70 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-[#3B82F6]/20 pb-3 font-mono text-[11px] tracking-wider text-[#1E40AF]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="font-semibold uppercase">AI CURRICULUM GENERATOR</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#1E40AF]/70 uppercase font-semibold">
          GEMINI 1.5 PRO
        </span>
      </div>

      <div className="my-auto space-y-2">
        {modules.map((modTitle, idx) => {
          const isActive = idx === activeModule;
          return (
            <motion.div
              key={idx}
              animate={{
                backgroundColor: isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.65)",
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between border px-3 py-2 rounded text-xs font-mono transition-all ${
                isActive ? "border-[#3B82F6] text-[#1E40AF] shadow-xs font-bold" : "border-[#3B82F6]/15 text-[#1E40AF]/70"
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#3B82F6] animate-pulse" : "bg-[#3B82F6]/30"}`} />
                <span className="truncate">{modTitle}</span>
              </div>
              <Play className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? "text-[#3B82F6] scale-110" : "text-[#3B82F6]/40"}`} />
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#3B82F6]/20 font-mono text-[11px] text-[#1E40AF]">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
          <span>QUIZZES GENERATED</span>
        </span>
        <span className="opacity-80">YOUTUBE CURATED</span>
      </div>
    </div>
  );
};

// 2. Personal Portfolio Preview Component
const PortfolioPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#FFFBEB] border border-[#F6C545]/40 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#F6C545]/80 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-[#F6C545]/30 pb-3 font-mono text-[11px] tracking-wider text-[#92400E]">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-[#B45309]" />
          <span className="font-semibold uppercase">EDITORIAL PORTFOLIO ENGINE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#92400E]/80 uppercase font-semibold">
          REACT + VITE
        </span>
      </div>

      <div className="my-auto py-2 flex flex-col justify-center">
        <span className="text-xs font-mono text-[#92400E]/70 uppercase tracking-widest block mb-1">Architecture</span>
        <span className="text-2xl sm:text-3xl font-mono font-bold text-[#78350F] block">
          Editorial Typography & Pin Stage
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#F6C545]/30 font-mono text-[11px] text-[#92400E]">
        <span>REACT 18</span>
        <span>•</span>
        <span>GSAP SCROLLTRIGGER</span>
        <span>•</span>
        <span>TAILWIND</span>
      </div>
    </div>
  );
};

// 3. HireScope AI Preview Component
const HireScopePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#E6F4F1] border border-[#38B2AC]/40 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#38B2AC]/70 transition-all duration-300">
      <motion.div
        animate={{ y: ["0%", "260px", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38B2AC] to-transparent opacity-60 pointer-events-none z-10 shadow-[0_0_12px_#38B2AC]"
      />

      <div className="flex items-center justify-between border-b border-[#38B2AC]/20 pb-3 font-mono text-[11px] tracking-wider text-[#0D5C56]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38B2AC] animate-ping" />
          <span className="font-semibold uppercase">RESUME ANALYSIS ENGINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-[#0D5C56]/80 uppercase font-semibold">
          <span>LIVE EVALUATION</span>
        </div>
      </div>

      <div className="my-auto py-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs font-mono text-[#0D5C56]/70 uppercase tracking-widest block">Overall Match</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-mono font-bold text-[#0F766E] block"
            >
              92.4%
            </motion.span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#0D5C56]/70 uppercase tracking-widest block font-medium">Scoring Metric</span>
            <span className="text-sm font-mono font-semibold text-[#0F766E]">87 / 100 PTS</span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#38B2AC]/20 rounded-full overflow-hidden p-0.5 relative">
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "92.4%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-[#38B2AC] to-[#2DD4BF] rounded-full relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#FFF] animate-pulse" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#38B2AC]/20 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#0F766E]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Claude API Scored</span>
        </div>
        <div className="flex gap-2 text-[#0D5C56]/80">
          <span>REACT</span>
          <span>•</span>
          <span>PUPPETEER</span>
          <span>•</span>
          <span>SERPER</span>
        </div>
      </div>
    </div>
  );
};

// 4. Greetly Preview Component
const GreetlyPreview: React.FC = () => {
  const quotes = [
    "Wishing you an inspiring year filled with breakthrough ideas and seamless code!",
    "Congratulations on the launch! May your product scale to millions effortlessly.",
    "Happy Birthday! Crafting wonderful memories and building awesome tech together.",
  ];

  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#FFF0F0] border border-[#F06C64]/40 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#F06C64]/80 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-[#F06C64]/30 pb-3 font-mono text-[11px] tracking-wider text-[#991B1B]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F06C64] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="font-semibold uppercase">GROQ API INFERENCE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#991B1B]/80 uppercase font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>42MS LATENCY</span>
        </span>
      </div>

      <div className="my-auto bg-white/90 backdrop-blur-xs border border-[#F06C64]/30 p-4 rounded-md shadow-xs min-h-[100px] flex flex-col justify-center">
        <span className="text-[10px] font-mono tracking-widest text-[#991B1B] uppercase block mb-1">
          GENERATED OUTPUT
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-sans text-xs sm:text-sm text-[#1D2024] font-medium leading-relaxed"
          >
            "{quotes[quoteIdx]}"
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#F06C64]/30 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#991B1B]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>READY FOR RENDER</span>
        </div>
        <div className="flex items-center gap-1 h-5">
          {[0.6, 1.2, 0.4, 1.6, 0.8].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ height: ["8px", "20px", "8px"] }}
              transition={{
                duration: delay + 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 bg-[#F06C64] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Avengers Doomsday Preview Component
const DoomProtocolPreview: React.FC = () => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(59 + Math.floor(Math.random() * 3));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#4C0519] border border-[#C0392B]/50 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md group-hover:border-[#E11D48]/80 transition-all duration-300 text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ["260px", "-20px"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + i * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
            className="absolute w-1 h-1 rounded-full bg-[#FFE4E6]"
            style={{ left: `${15 + i * 16}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-white/20 pb-3 font-mono text-[11px] tracking-widest text-white/90 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#FFE4E6] animate-pulse" />
          <span className="font-semibold uppercase">3D MULTIVERSE CANVAS</span>
        </div>
        <span className="text-[10px] tracking-widest text-white/80 uppercase font-semibold">
          {fps} FPS // LIVE RENDER
        </span>
      </div>

      <div className="my-auto flex items-center justify-center relative py-2 z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-white/30 border-dashed flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-[#FFE4E6] shadow-[0_0_16px_#FFF]"
            />
          </motion.div>
        </motion.div>
        <span className="absolute font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase font-bold">
          AVENGERS DOOMSDAY
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/20 font-mono text-[11px] text-white/80 z-10">
        <span>THREE.JS WEBGL</span>
        <span>GSAP LENIS</span>
      </div>
    </div>
  );
};

// --- MAIN PROJECTS CASE-STUDY DATA ---

interface ProjectItem {
  id: string;
  number: string;
  category: string;
  titleMain: string;
  description: string;
  accentColor: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  PreviewComponent: React.FC;
  layoutVariant: "wide" | "compact";
}

const projects: ProjectItem[] = [
  {
    id: "courseforge-ai",
    number: "01",
    category: "AI COURSE GENERATOR",
    titleMain: "CourseForge AI",
    accentColor: "#3B82F6",
    description: "AI-powered course generator that creates complete lesson plans, quizzes, and syllabi in seconds powered by Gemini API.",
    tech: ["REACT", "GEMINI API", "VERCEL", "YOUTUBE API"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    PreviewComponent: CourseForgePreview,
    layoutVariant: "compact",
  },
  {
    id: "personal-portfolio",
    number: "02",
    category: "PORTFOLIO & EDITORIAL",
    titleMain: "Personal Portfolio",
    accentColor: "#F6C545",
    description: "My web portfolio – AI/ML & web development projects showcased with creative typography and fluid physics animations.",
    tech: ["REACT", "VITE", "TAILWIND CSS", "FRAMER MOTION"],
    liveUrl: "https://toshitsai.dev",
    githubUrl: "https://github.com/ToshitSai/toshit-portfolio",
    PreviewComponent: PortfolioPreview,
    layoutVariant: "compact",
  },
  {
    id: "hirescope-ai",
    number: "03",
    category: "AI RESUME ANALYZER",
    titleMain: "HireScope AI",
    accentColor: "#38B2AC",
    description: "Smart resume & portfolio analyzer delivering instant AI-driven ATS match scoring, gap analysis, and keyword feedback.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: HireScopePreview,
    layoutVariant: "wide",
  },
  {
    id: "greetly",
    number: "04",
    category: "NEO-BRUTALIST AI TOOL",
    titleMain: "Greetly",
    accentColor: "#F06C64",
    description: "AI-powered greeting generator crafting personalized messages for any celebration or milestone using Groq Llama 3.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: GreetlyPreview,
    layoutVariant: "compact",
  },
  {
    id: "avengers-doomsday",
    number: "05",
    category: "CINEMATIC DESIGN DEMO",
    titleMain: "Avengers Doomsday",
    accentColor: "#C0392B",
    description: "Cinematic Marvel web experience exploring 3D WebGL dynamics, GLSL green particle portals, and scroll-scrubbed trailers.",
    tech: ["NEXT.JS", "THREE.JS", "GSAP", "LENIS PHYSICS"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    PreviewComponent: DoomProtocolPreview,
    layoutVariant: "wide",
  },
];

// --- EDITORIAL PROJECTS INTRO HEADER ---
const ProjectsHeader: React.FC<{ projectCount: number }> = ({ projectCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const headingLines = [
    "Things I built",
    "because I had",
    "to know if they worked.",
  ];

  return (
    <div ref={containerRef} className="relative pb-4 mb-12 sm:mb-16">
      <div className="flex items-center gap-2.5 font-mono text-xs sm:text-[13px] tracking-[0.18em] text-[#1D2024]/75 uppercase mb-6 sm:mb-8">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={isInView ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block flex-shrink-0"
        />
        <span className="font-semibold text-[#1D2024]/80">02 // SELECTED WORK ({projectCount} PROJECTS)</span>
      </div>

      <div className="max-w-[760px] mb-6 sm:mb-8">
        <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,50px)] leading-[1.15] tracking-[-0.01em] text-[#1D2024] flex flex-col items-start gap-0.5">
          {headingLines.map((line, idx) => (
            <div key={idx} className="overflow-hidden py-0.5">
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.75,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={isInView || shouldReduceMotion ? { scaleX: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[1px] bg-[#1D2024]/12 origin-left"
      />
    </div>
  );
};

const SelectedWork: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "carousel" | "stacked">("grid");
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const activeSlug = slug || "";

  const handleOpenStory = (projectSlug: string) => {
    navigate(`/work/${projectSlug}`);
  };

  const handleCloseStory = () => {
    navigate("/");
  };

  // GSAP SCROLLTRIGGER PINNED SHOWCASE STAGE FOR STACKED VIEW MODE
  useEffect(() => {
    if (viewMode !== "stacked") return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const stage = document.querySelector(".projects-stage");
    if (!stage) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stacked-card");
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top+=100",
          end: `+=${window.innerHeight * (cards.length - 1)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i > 0) {
          tl.fromTo(
            card,
            { opacity: 0, y: 60, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
          );
        }
      });
    }, stage);

    return () => ctx.revert();
  }, [viewMode]);

  return (
    <section
      id="work"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-20 sm:py-28 lg:py-32 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      {/* STORY VIEWER OVERLAY */}
      <ProjectStoryViewer
        projectSlug={activeSlug}
        isOpen={Boolean(activeSlug)}
        onClose={handleCloseStory}
        onSelectProject={handleOpenStory}
      />

      <div id="projects" className="absolute -top-12 left-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <ProjectsHeader projectCount={projects.length} />

        {/* VIEW MODE TOGGLE BAR */}
        <div className="flex items-center justify-between mb-10 border-b border-[#1D2024]/10 pb-4">
          <div className="font-mono text-xs tracking-[0.18em] text-[#1D2024]/60 uppercase">
            <span>SHOWCASE DISPLAY MODE</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#EFE6D6] border border-[#1D2024]/15">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-[#1D2024] text-[#F8F2E6] shadow-xs font-semibold"
                  : "text-[#1D2024]/70 hover:text-[#1D2024]"
              }`}
            >
              ✦ MULTI-DEVICE GRID
            </button>
            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={`px-3 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all duration-200 ${
                viewMode === "carousel"
                  ? "bg-[#1D2024] text-[#F8F2E6] shadow-xs font-semibold"
                  : "text-[#1D2024]/70 hover:text-[#1D2024]"
              }`}
            >
              ↻ CAROUSEL
            </button>
            <button
              type="button"
              onClick={() => setViewMode("stacked")}
              className={`px-3 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all duration-200 ${
                viewMode === "stacked"
                  ? "bg-[#1D2024] text-[#F8F2E6] shadow-xs font-semibold"
                  : "text-[#1D2024]/70 hover:text-[#1D2024]"
              }`}
            >
              ≡ PINNED STAGE
            </button>
          </div>
        </div>

        {/* RENDER VIEW BASED ON SELECTION */}
        {viewMode === "grid" ? (
          <ProjectGrid onOpenStory={handleOpenStory} />
        ) : viewMode === "carousel" ? (
          <ProjectsCarousel
            projects={projects}
            autoRotate={true}
            rotateInterval={5000}
            onOpenStory={handleOpenStory}
          />
        ) : (
          /* PINNED SCROLL-DRIVEN STAGE / STACKED CASE STUDY INDEX */
          <div className="projects-stage space-y-24 sm:space-y-32 lg:space-y-40">
            {projects.map((project, idx) => {
              const PreviewComp = project.PreviewComponent;
              const isEven = idx % 2 === 0;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.85,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="stacked-card group relative border-b border-[#1D2024]/10 pb-16 sm:pb-24"
                >
                  {/* TOP METADATA BAR */}
                  <div className="flex items-center justify-between mb-8 font-mono text-xs tracking-[0.18em] text-[#1D2024]/60 uppercase">
                    <div className="flex items-center gap-4">
                      <span
                        style={{ color: project.accentColor }}
                        className="font-mono font-bold text-sm"
                      >
                        {project.number}
                      </span>
                      <span>/</span>
                      <span className="font-semibold text-[#1D2024]/80">
                        {project.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenStory(project.id)}
                      className="text-xs font-mono font-bold tracking-widest text-[#1D2024] hover:text-black uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <span>OPEN STORY REEL</span>
                      <ArrowUpRight style={{ color: project.accentColor }} className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* MAIN GRID CONTENT */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div
                      className={`lg:col-span-6 flex flex-col justify-between ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div>
                        <h3
                          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                          onClick={() => handleOpenStory(project.id)}
                          className="text-[clamp(32px,4vw,56px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1D2024] mb-4 group-hover:text-black transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <span>{project.titleMain}</span>
                          <ArrowUpRight style={{ color: project.accentColor }} className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>

                        <p
                          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                          className="text-[17px] sm:text-[18px] leading-[1.45] text-[#1D2024]/85 max-w-[520px] min-h-[76px] mb-8 font-normal"
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* TECH TAGS */}
                      <div className="mb-8 font-mono text-[11px] sm:text-xs tracking-wider text-[#1D2024]/60 uppercase flex flex-wrap gap-x-3 gap-y-1">
                        {project.tech.map((t, tIdx) => (
                          <React.Fragment key={t}>
                            <span>{t}</span>
                            {tIdx < project.tech.length - 1 && (
                              <span className="text-[#1D2024]/30">/</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* LINKS */}
                      <div className="flex flex-wrap items-center gap-6 font-mono text-xs tracking-widest font-semibold uppercase">
                        <button
                          type="button"
                          onClick={() => handleOpenStory(project.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D2024] text-[#F8F2E6] hover:bg-black transition-all cursor-pointer shadow-xs"
                        >
                          <span>VIEW STORY</span>
                          <ArrowUpRight style={{ color: project.accentColor }} className="w-4 h-4" />
                        </button>

                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link relative inline-flex items-center gap-1.5 text-[#1D2024] hover:text-black py-1"
                        >
                          <span>LIVE DEMO</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                          <span
                            style={{ backgroundColor: project.accentColor }}
                            className="absolute bottom-0 left-0 w-full h-[1.5px] transition-all origin-left scale-x-100 group-hover/link:scale-x-110"
                          />
                        </a>

                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link relative inline-flex items-center gap-1.5 text-[#1D2024]/80 hover:text-[#1D2024] py-1"
                        >
                          <Github className="w-4 h-4 text-[#1D2024]" />
                          <span>GITHUB CODE</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleOpenStory(project.id)}
                      className={`lg:col-span-6 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      } cursor-pointer relative group/preview`}
                    >
                      <PreviewComp />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none rounded-lg">
                        <span className="px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold tracking-widest uppercase shadow-lg">
                          CLICK TO OPEN STORY ↗
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
