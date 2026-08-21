import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, CheckCircle2, Play, Activity, Cpu } from "lucide-react";

// --- ABSTRACT INTERACTIVE PROJECT PREVIEWS ---

// 1. HireScope AI Preview Component
const HireScopePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[180px] sm:h-[210px] bg-[#EEF5FC] border border-[#5B9BD5]/30 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-[#5B9BD5]/20 pb-2.5 font-mono text-[10px] tracking-wider text-[#2B6090]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
          <span className="font-semibold uppercase">RESUME ANALYSIS ENGINE</span>
        </div>
        <span className="text-[9px] tracking-widest text-[#2B6090]/65 uppercase font-semibold">
          SAMPLE OUTPUT
        </span>
      </div>

      <div className="my-auto py-1">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <span className="text-[10px] font-mono text-[#2B6090]/70 uppercase tracking-widest block">Overall Match</span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#1E40AF]">92.4%</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#2B6090]/70 uppercase tracking-widest block font-medium">Score</span>
            <span className="text-xs font-mono font-semibold text-[#1E40AF]">87 / 100 PTS</span>
          </div>
        </div>
        <div className="w-full h-2 bg-[#5B9BD5]/20 rounded-full overflow-hidden p-0.5">
          <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full w-[92%]" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#5B9BD5]/20 font-mono text-[10px]">
        <div className="flex items-center gap-1 text-[#1E40AF]">
          <CheckCircle2 className="w-3 h-3" />
          <span>Claude Scored</span>
        </div>
        <div className="flex gap-1.5 text-[#2B6090]/80">
          <span>REACT</span>
          <span>•</span>
          <span>PUPPETEER</span>
        </div>
      </div>
    </div>
  );
};

// 2. Greetly Preview Component
const GreetlyPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[180px] sm:h-[210px] bg-[#FFFBF0] border border-[#FFD42A]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-[#FFD42A]/30 pb-2.5 font-mono text-[10px] tracking-wider text-[#8A6A00]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D9A700]" />
          <span className="font-semibold uppercase">GROQ API INFERENCE</span>
        </div>
        <span className="text-[9px] tracking-widest text-[#8A6A00]/70 uppercase font-semibold">
          42MS LATENCY
        </span>
      </div>

      <div className="my-auto bg-white/90 backdrop-blur-xs border border-[#FFD42A]/40 p-3 rounded-lg shadow-xs">
        <span className="text-[9px] font-mono tracking-widest text-[#8A6A00] uppercase block mb-1">Generated Output</span>
        <p className="font-sans text-xs sm:text-sm text-[#1D2024] font-medium leading-snug">
          "Wishing you an inspiring year filled with breakthrough ideas and seamless code!"
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#FFD42A]/30 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-[#8A6A00]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>READY TO RENDER</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-[#FFD42A] rounded-full animate-pulse" />
          <div className="w-1 h-5 bg-[#D9A700] rounded-full animate-pulse delay-75" />
          <div className="w-1 h-2 bg-[#FFD42A] rounded-full animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

// 3. CourseForge AI Preview Component
const CourseForgePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[180px] sm:h-[210px] bg-[#EBF6F4] border border-[#0F766E]/30 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-[#0F766E]/20 pb-2.5 font-mono text-[10px] tracking-wider text-[#0D5C56]">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-[#0F766E]" />
          <span className="font-semibold uppercase">AI CURRICULUM ENGINE</span>
        </div>
        <span className="text-[9px] tracking-widest text-[#0D5C56]/70 uppercase font-semibold">
          4 LESSONS
        </span>
      </div>

      <div className="my-auto space-y-1.5">
        {[
          "01. Applied AI Systems",
          "02. Neural Architectures & Transformers",
        ].map((module, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/80 border border-[#0F766E]/15 px-2.5 py-1 rounded text-[11px] font-mono text-[#0D5C56]">
            <span className="truncate pr-2">{module}</span>
            <Play className="w-2.5 h-2.5 text-[#0F766E] flex-shrink-0" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#0F766E]/20 font-mono text-[10px] text-[#0D5C56]">
        <span className="font-semibold">QUIZ GENERATED</span>
        <span className="opacity-80">YOUTUBE CURATED</span>
      </div>
    </div>
  );
};

// 4. Doom Protocol WebGL Preview Component
const DoomProtocolPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[180px] sm:h-[210px] bg-[#8A1334] border border-[#BE123C]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-md text-white">
      <div className="flex items-center justify-between border-b border-white/20 pb-2.5 font-mono text-[10px] tracking-widest text-white/90">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-[#FFE4E6] animate-pulse" />
          <span className="font-semibold uppercase">3D MULTIVERSE CANVAS</span>
        </div>
        <span className="text-[9px] tracking-widest text-white/75 uppercase font-semibold">
          60 FPS
        </span>
      </div>

      <div className="my-auto flex items-center justify-center relative py-1">
        <div className="w-14 h-14 rounded-full border border-white/30 border-dashed animate-[spin_12s_linear_infinite] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#FFE4E6] shadow-[0_0_10px_#FFF]" />
          </div>
        </div>
        <span className="absolute font-mono text-[9px] tracking-[0.2em] text-white/70 uppercase font-medium">DOOM PROTOCOL</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/20 font-mono text-[10px] text-white/80">
        <span>REACT THREE FIBER</span>
        <span>GSAP LENIS</span>
      </div>
    </div>
  );
};

// --- MAIN PROJECTS CASE-STUDY COMPOSITION ---

interface ProjectItem {
  id: string;
  number: string;
  category: string;
  titleMain: string;
  titleSub: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  PreviewComponent: React.FC;
}

const projects: ProjectItem[] = [
  {
    id: "hirescope",
    number: "01",
    category: "AI CAREER TOOL",
    titleMain: "HireScope",
    titleSub: "/ Job Gem Grader",
    description: "AI-powered resume evaluation and job matching with automated scoring, analysis, and candidate recommendations.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai/job-gem-grader",
    PreviewComponent: HireScopePreview,
  },
  {
    id: "greetly",
    number: "02",
    category: "AI GREETING TOOL",
    titleMain: "Greetly",
    titleSub: "",
    description: "Personalized AI greetings generated from contextual inputs using high-speed Groq inference and a Flask service.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai/greetly",
    PreviewComponent: GreetlyPreview,
  },
  {
    id: "courseforge",
    number: "03",
    category: "AI COURSE BUILDER",
    titleMain: "CourseForge",
    titleSub: "/ Curriculum Engine",
    description: "AI-generated courses with structured lessons, automated quizzes, and curated educational content for faster learning.",
    tech: ["REACT", "VITE", "PYTHON", "AI ENGINE"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    PreviewComponent: CourseForgePreview,
  },
  {
    id: "doom-protocol",
    number: "04",
    category: "WEBGL & 3D EXPERIENCE",
    titleMain: "Doom Protocol",
    titleSub: "",
    description: "Cinematic WebGL experience combining 3D scenes, scroll-driven storytelling, and interactive environments.",
    tech: ["NEXT.JS", "R3F", "THREE.JS", "GSAP", "LENIS"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    PreviewComponent: DoomProtocolPreview,
  },
];

const SelectedWork: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCount = projects.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Fast & Smooth Auto Rotation Timer (2.0s)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, handleNext]);

  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % totalCount;
    if (diff < -Math.floor(totalCount / 2)) diff += totalCount;
    if (diff > Math.floor(totalCount / 2)) diff -= totalCount;
    return diff;
  };

  const progressPercent = ((activeIndex + 1) / totalCount) * 100;

  return (
    <section
      id="work"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-24 sm:py-32 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      <div id="projects" className="absolute -top-12 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <div className="border-b border-[#1D2024]/15 pb-8 mb-12 sm:mb-16">
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1D2024]"
          >
            Projects that turn ideas into working systems.
          </h2>
        </div>

        {/* 3D ANIMATED STACKED CAROUSEL STAGE */}
        <div
          className="relative w-full min-h-[500px] sm:min-h-[540px] flex items-center justify-center py-6 my-4"
          style={{ perspective: "1200px" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full max-w-[760px] h-[460px] sm:h-[480px] flex items-center justify-center">
            {projects.map((project, index) => {
              const diff = getOffset(index);
              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              const PreviewComp = project.PreviewComponent;

              let xPos = "0%";
              let scale = 1;
              let rotateY = 0;
              let opacity = 1;
              let zIndex = 30;

              if (isLeft) {
                xPos = isMobile ? "-68%" : "-56%";
                scale = 0.88;
                rotateY = 12;
                opacity = 0.55;
                zIndex = 10;
              } else if (isRight) {
                xPos = isMobile ? "68%" : "56%";
                scale = 0.88;
                rotateY = -12;
                opacity = 0.55;
                zIndex = 10;
              } else if (!isCenter) {
                xPos = diff > 0 ? "115%" : "-115%";
                scale = 0.75;
                rotateY = 0;
                opacity = 0;
                zIndex = 0;
              }

              return (
                <motion.div
                  key={project.id}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -30) handleNext();
                    if (info.offset.x > 30) handlePrev();
                  }}
                  animate={{
                    x: xPos,
                    scale: scale,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  whileHover={
                    isCenter
                      ? {
                          scale: 1.02,
                          y: -5,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                      : { opacity: 0.8, cursor: "pointer" }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.1 }
                      : {
                          duration: 0.55,
                          ease: [0.25, 1, 0.5, 1],
                        }
                  }
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                  className={`absolute top-0 w-full max-w-[680px] h-full p-6 sm:p-8 rounded-3xl border border-[#1D2024]/15 bg-[#FFF8E8] text-[#1D2024] shadow-[0_20px_50px_rgba(27,27,24,0.12)] flex flex-col justify-between select-none ${
                    isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  }`}
                >
                  {/* TOP BAR METADATA */}
                  <div className="flex items-center justify-between font-mono text-xs tracking-widest text-[#1D2024]/60 uppercase border-b border-[#1D2024]/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[#1D2024]">{project.number}</span>
                      <span>/</span>
                      <span className="font-semibold text-[#1D2024]">{project.category}</span>
                    </div>
                    <span className="text-[#1D2024]/40 text-[10px]">CASE STUDY</span>
                  </div>

                  {/* TITLE & PREVIEW */}
                  <div className="my-auto py-2 space-y-3">
                    <div>
                      <h3
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                        className="text-2xl sm:text-3xl font-bold leading-tight text-[#1D2024]"
                      >
                        {project.titleMain} <span className="opacity-50 font-normal">{project.titleSub}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1D2024]/80 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* INTERACTIVE PREVIEW */}
                    <div className="w-full">
                      <PreviewComp />
                    </div>
                  </div>

                  {/* BOTTOM TECH & LINKS */}
                  <div className="pt-3 border-t border-[#1D2024]/10 flex items-center justify-between">
                    <div className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#1D2024]/60 uppercase flex flex-wrap gap-2">
                      {project.tech.map((t, tIdx) => (
                        <span key={t}>
                          {t}
                          {tIdx < project.tech.length - 1 ? " /" : ""}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs font-bold uppercase">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#1D2024] hover:text-black hover:underline"
                      >
                        <span>DEMO</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#1D2024]/70 hover:text-[#1D2024] hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>CODE</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FOOTER NAVIGATION & DOTS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-2">
          {/* PROGRESS BAR & COUNTER */}
          <div className="font-mono text-xs text-[#1D2024]/60 flex items-center gap-3">
            <span>
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
            </span>
            <div className="w-[120px] h-[3px] bg-[#1D2024]/12 rounded-full relative overflow-hidden">
              <motion.div
                className="h-full bg-[#FFD42A] rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              />
            </div>
          </div>

          {/* PAGINATION DOT INDICATORS */}
          <div className="flex items-center gap-2">
            {projects.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to project card ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "w-7 bg-[#FFD42A]" : "w-2.5 bg-[#1D2024]/25 hover:bg-[#1D2024]/50"
                  }`}
                />
              );
            })}
          </div>

          {/* ARROW CONTROLS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              aria-label="Previous project card"
              className="w-10 h-10 rounded-full border border-[#1D2024]/20 bg-white/40 flex items-center justify-center text-[#1D2024] text-sm hover:bg-[#1D2024] hover:text-[#FFF8E8] transition-all shadow-xs"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next project card"
              className="w-10 h-10 rounded-full border border-[#1D2024]/20 bg-white/40 flex items-center justify-center text-[#1D2024] text-sm hover:bg-[#1D2024] hover:text-[#FFF8E8] transition-all shadow-xs"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SelectedWork;
