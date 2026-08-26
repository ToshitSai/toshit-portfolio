import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, CheckCircle2, Play, Activity, Cpu } from "lucide-react";

// --- DYNAMIC ANIMATED PROJECT PREVIEWS ---

// 1. HireScope AI Preview Component (Radar Scan + Animated Score Gauge)
const HireScopePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EEF5FC] border border-[#5B9BD5]/30 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#5B9BD5]/70 transition-all duration-300">
      {/* Laser Scanning Line Overlay */}
      <motion.div
        animate={{ y: ["0%", "260px", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-60 pointer-events-none z-10 shadow-[0_0_12px_#3B82F6]"
      />

      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-[#5B9BD5]/20 pb-3 font-mono text-[11px] tracking-wider text-[#2B6090]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
          <span className="font-semibold uppercase">RESUME ANALYSIS ENGINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-[#2B6090]/80 uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          <span>LIVE EVALUATION</span>
        </div>
      </div>

      {/* Score & Matching Metrics with Animated Gauge */}
      <div className="my-auto py-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs font-mono text-[#2B6090]/70 uppercase tracking-widest block">Overall Match</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-mono font-bold text-[#1E40AF] block"
            >
              92.4%
            </motion.span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#2B6090]/70 uppercase tracking-widest block font-medium">Scoring Metric</span>
            <span className="text-sm font-mono font-semibold text-[#1E40AF]">87 / 100 PTS</span>
          </div>
        </div>

        {/* Progress Bar with Animated Fill */}
        <div className="w-full h-2.5 bg-[#5B9BD5]/20 rounded-full overflow-hidden p-0.5 relative">
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "92.4%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full relative"
          >
            {/* Glowing lead edge */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#FFF] animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* Extracted Skills Badges */}
      <div className="flex items-center justify-between pt-3 border-t border-[#5B9BD5]/20 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#1E40AF]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Claude API Scored</span>
        </div>
        <div className="flex gap-2 text-[#2B6090]/80">
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

// 2. Greetly Preview Component (Typewriter Output & Voice Wave Equalizer)
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
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#FFFBF0] border border-[#FFD42A]/50 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#FFD42A] transition-all duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#FFD42A]/30 pb-3 font-mono text-[11px] tracking-wider text-[#8A6A00]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A700] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="font-semibold uppercase">GROQ API INFERENCE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#8A6A00]/80 uppercase font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>42MS LATENCY</span>
        </span>
      </div>

      {/* Greeting Preview Box with Cycling Animations */}
      <div className="my-auto bg-white/90 backdrop-blur-xs border border-[#FFD42A]/40 p-4 rounded-md shadow-xs min-h-[100px] flex flex-col justify-center">
        <span className="text-[10px] font-mono tracking-widest text-[#8A6A00] uppercase block mb-1">
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

      {/* Animated Equalizer Waveform Graphic */}
      <div className="flex items-center justify-between pt-3 border-t border-[#FFD42A]/30 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#8A6A00]">
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
              className="w-1 bg-[#D9A700] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. CourseForge AI Preview Component (Interactive Stepper & Active Module Highlighting)
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
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EBF6F4] border border-[#0F766E]/30 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#0F766E]/60 transition-all duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#0F766E]/20 pb-3 font-mono text-[11px] tracking-wider text-[#0D5C56]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#0F766E]" />
          <span className="font-semibold uppercase">CURRICULUM GENERATOR</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#0D5C56]/70 uppercase font-semibold">
          4 LESSONS
        </span>
      </div>

      {/* Generated Modules Tree with Active Highlight */}
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
              className={`flex items-center justify-between border px-3 py-2 rounded text-xs font-mono transition-all ${isActive ? "border-[#0F766E] text-[#0D5C56] shadow-xs font-bold" : "border-[#0F766E]/15 text-[#0D5C56]/70"
                }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#0F766E] animate-pulse" : "bg-[#0F766E]/30"}`} />
                <span className="truncate">{modTitle}</span>
              </div>
              <Play className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? "text-[#0F766E] scale-110" : "text-[#0F766E]/40"}`} />
            </motion.div>
          );
        })}
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#0F766E]/20 font-mono text-[11px] text-[#0D5C56]">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>QUIZ GENERATED</span>
        </span>
        <span className="opacity-80">YOUTUBE CURATED</span>
      </div>
    </div>
  );
};

// 4. Doom Protocol WebGL 3D Preview Component (Dynamic 3D Concentric Orbit & Particle Burst)
const DoomProtocolPreview: React.FC = () => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(59 + Math.floor(Math.random() * 3));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#8A1334] border border-[#BE123C]/50 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md group-hover:border-[#FB7185]/80 transition-all duration-300 text-white">
      {/* Floating Particles Animation */}
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

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3 font-mono text-[11px] tracking-widest text-white/90 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#FFE4E6] animate-pulse" />
          <span className="font-semibold uppercase">3D MULTIVERSE CANVAS</span>
        </div>
        <span className="text-[10px] tracking-widest text-white/80 uppercase font-semibold">
          {fps} FPS // LIVE RENDER
        </span>
      </div>

      {/* Central 3D Concentric Rotating Orbit Visual */}
      <div className="my-auto flex items-center justify-center relative py-2 z-10">
        {/* Outer Orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-white/30 border-dashed flex items-center justify-center"
        >
          {/* Inner Counter-Orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center"
          >
            {/* Glowing Core */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-[#FFE4E6] shadow-[0_0_16px_#FFF]"
            />
          </motion.div>
        </motion.div>
        <span className="absolute font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase font-bold">
          DOOM PROTOCOL
        </span>
      </div>

      {/* Tech Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/20 font-mono text-[11px] text-white/80 z-10">
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
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  PreviewComponent: React.FC;
  layoutVariant: "wide" | "compact";
}

const projects: ProjectItem[] = [
  {
    id: "hirescope",
    number: "01",
    category: "CAREER TOOL",
    titleMain: "HireScope",
    description: "Resume evaluation and job matching with automated scoring, analysis, and intelligent candidate-to-role recommendations.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: HireScopePreview,
    layoutVariant: "wide",
  },
  {
    id: "greetly",
    number: "02",
    category: "GREETING TOOL",
    titleMain: "Greetly",
    description: "Personalized greetings and messages generated from contextual inputs using high-speed inference and a lightweight Flask service.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: GreetlyPreview,
    layoutVariant: "compact",
  },
  {
    id: "courseforge",
    number: "03",
    category: "COURSE BUILDER",
    titleMain: "CourseForge",
    description: "Interactive courses with structured lessons, automated quizzes, and curated educational content for faster learning.",
    tech: ["REACT", "VITE", "PYTHON", "INTELLIGENCE ENGINE"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    PreviewComponent: CourseForgePreview,
    layoutVariant: "compact",
  },
  {
    id: "doom-protocol",
    number: "04",
    category: "WEBGL & 3D EXPERIENCE",
    titleMain: "Doom Protocol",
    description: "Cinematic WebGL experience combining 3D scenes, scroll-driven storytelling, animation systems, and immersive interactive environments.",
    tech: ["NEXT.JS", "R3F", "THREE.JS", "GSAP", "LENIS"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    PreviewComponent: DoomProtocolPreview,
    layoutVariant: "wide",
  },
];

// --- EDITORIAL PROJECTS INTRO HEADER WITH SCROLL REVEAL & SKETCH ACCENT ---
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
      {/* 1. TOP METADATA BAR: Refined Monospace Section Label */}
      <div className="flex items-center gap-2.5 font-mono text-xs sm:text-[13px] tracking-[0.18em] text-[#1D2024]/75 uppercase mb-6 sm:mb-8">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={isInView ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block flex-shrink-0"
        />
        <span className="font-semibold text-[#1D2024]/80">02 // SELECTED WORK</span>
      </div>

      {/* 2. MAIN HEADING & RIGHT ANNOTATION COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-6 sm:mb-8">
        {/* Left Column: Refined Editorial Heading */}
        <div className="lg:col-span-8 max-w-[760px]">
          <h2
            style={{
              fontFamily: "'Instrument Sans', 'Inter', 'Helvetica Neue', sans-serif",
              fontWeight: 650,
            }}
            className="text-[38px] sm:text-[56px] lg:text-[68px] xl:text-[76px] leading-[0.99] tracking-[-0.035em] text-[#1D2024] flex flex-col items-start gap-0.5"
          >
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

        {/* Right Column: Hand-Drawn Yellow Line & "built → tested → shipped" Annotation */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end space-y-2 pt-2 lg:pt-0">
          <div className="relative">
            <svg
              width="140"
              height="30"
              viewBox="0 0 180 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-28 sm:w-36 h-auto opacity-90"
            >
              <path
                d="M6 30 C 40 10, 90 35, 145 14 C 158 10, 168 12, 172 18"
                stroke="#FFC700"
                strokeWidth="3"
                strokeLinecap="round"
                className={`transition-opacity duration-700 delay-300 ${isInView ? "opacity-100" : "opacity-0"
                  }`}
              />
            </svg>
          </div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-mono text-[11px] sm:text-[12px] tracking-[0.16em] text-[#1D2024]/60 uppercase flex items-center gap-1.5"
          >
            <span className="text-[#FFC700] font-bold text-xs">↳</span>
            <span>built → tested → shipped</span>
          </motion.div>
        </div>
      </div>

      {/* 3. SUBTLE 1PX HORIZONTAL DIVIDER */}
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
  return (
    <section
      id="work"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-20 sm:py-28 lg:py-32 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      <div id="projects" className="absolute -top-12 left-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <ProjectsHeader projectCount={projects.length} />

        {/* CASE STUDY INDEX - ASYMMETRIC SPACING & LAYOUT */}
        <div className="space-y-24 sm:space-y-32 lg:space-y-40">
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
                className="group relative border-b border-[#1D2024]/10 pb-16 sm:pb-24"
              >
                {/* TOP METADATA BAR */}
                <div className="flex items-center justify-between mb-8 font-mono text-xs tracking-[0.18em] text-[#1D2024]/60 uppercase">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sm text-[#1D2024]">
                      {project.number}
                    </span>
                    <span>/</span>
                    <span className="font-semibold text-[#1D2024]/80">
                      {project.category}
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-[#1D2024]/40">
                    CASE STUDY PREVIEW
                  </span>
                </div>

                {/* MAIN GRID CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* LEFT / RIGHT ALTERNATING TITLE & DESCRIPTION */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-between ${isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                  >
                    <div>
                      <h3
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                        className="text-[clamp(32px,4vw,56px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1D2024] mb-4 group-hover:text-black transition-colors"
                      >
                        <span>{project.titleMain}</span>
                      </h3>

                      <p
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                        className="text-[17px] sm:text-[18px] leading-[1.45] text-[#1D2024]/85 max-w-[520px] min-h-[76px] mb-8 font-normal"
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* EDITORIAL TECH TAGS */}
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

                    {/* EDITORIAL UNDERLINE LINKS */}
                    <div className="flex items-center gap-8 font-mono text-xs tracking-widest font-semibold uppercase">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link relative inline-flex items-center gap-1.5 text-[#1D2024] hover:text-black py-1"
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                        <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1D2024] transition-all origin-left scale-x-100 group-hover/link:scale-x-110" />
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
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1D2024]/40 transition-all origin-left scale-x-0 group-hover/link:scale-x-100" />
                      </a>
                    </div>
                  </div>

                  {/* INTERACTIVE ABSTRACT ANIMATED PREVIEW VISUAL */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <PreviewComp />
                  </motion.div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
