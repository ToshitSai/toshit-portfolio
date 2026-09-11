import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Plus, Terminal, Code2, Sparkles, Cpu } from "lucide-react";

// FACTUAL EXPERIENCE & CAPABILITIES DATA
interface ExperienceRow {
  id: string;
  number: string;
  title: string;
  role: string;
  timeframe: string;
  description: string;
  highlights: string[];
  techStack: string[];
  links?: { label: string; url: string }[];
}

const FACTUAL_EXPERIENCE_DATA: ExperienceRow[] = [
  {
    id: "ai-projects",
    number: "01",
    title: "AI & Full-Stack Applications",
    role: "CREATOR & LEAD DEVELOPER",
    timeframe: "2024 — PRESENT",
    description:
      "Architecting end-to-end intelligent web platforms that combine modern LLMs, generative APIs, structured JSON workflows, and responsive motion interfaces.",
    highlights: [
      "CourseForge AI — Automated course generator creating full syllabi, quizzes, and curated video lessons.",
      "HireScope AI — Resume & portfolio analyzer computing combined hireability scores with actionable feedback.",
      "Greetly — Personal greeting generator producing dynamic interactive micro-apps in seconds.",
      "Avengers Doomsday — Cinematic WebGL/motion landing page with physics-inspired card interactions.",
    ],
    techStack: ["React 18", "TypeScript", "Tailwind CSS", "Gemini API", "Node.js", "Framer Motion", "GSAP"],
    links: [
      { label: "View All Projects Archive", url: "/projects" },
      { label: "GitHub Profile ↗", url: "https://github.com/ToshitSai" },
    ],
  },
  {
    id: "tech-capabilities",
    number: "02",
    title: "Core Technical Capabilities",
    role: "AI / ML & SOFTWARE DEVELOPMENT",
    timeframe: "CORE FOCUS",
    description:
      "Specializing in modern web engineering, generative AI workflows, frontend design systems, and software performance optimization.",
    highlights: [
      "Generative AI & Agentic Workflows: Prompt engineering, Gemini API integration, structured outputs, RAG concepts.",
      "Full-Stack Web Engineering: React, TypeScript, Vite, Tailwind CSS, REST APIs, Node.js environment.",
      "Creative Motion & UI: Framer Motion, GSAP ScrollTrigger, micro-interactions, responsive minimalism.",
    ],
    techStack: ["Python", "TypeScript", "React", "Node.js", "Gemini API", "Tailwind CSS", "Git / GitHub"],
  },
  {
    id: "academic-journey",
    number: "03",
    title: "Academic & Computer Science Foundation",
    role: "ENGINEERING STUDENT (AI / ML SPECIALIZATION)",
    timeframe: "ACADEMIC JOURNEY",
    description:
      "Pursuing Computer Science Engineering with a specialization in Artificial Intelligence and Machine Learning. Combining core algorithms with hands-on application development.",
    highlights: [
      "Data Structures & Algorithms in C++ and Python.",
      "Machine Learning principles, neural network concepts, and data preprocessing.",
      "Database Systems, Web Architectures, and Object-Oriented Software Design.",
    ],
    techStack: ["C++", "Python", "Data Structures", "Machine Learning", "SQL", "OOP"],
  },
  {
    id: "design-philosophy",
    number: "04",
    title: "Design & Building Philosophy",
    role: "CREATIVE ENGINEER",
    timeframe: "ONGOING MINDSET",
    description:
      "I believe great technology should feel simple, useful, and human. Code should be clean, interfaces should be intuitive, and motion should serve clarity.",
    highlights: [
      "Aesthetic Minimalism — Clean editorial typography, generous whitespace, and curated color palettes.",
      "Purposeful Motion — Hardware-accelerated transitions that guide user attention without distraction.",
      "Performance-First — Fast page loads, lazy loading, lightweight assets, and responsive layout integrity.",
    ],
    techStack: ["Editorial UX", "Performance Optimization", "Human-Centered Design", "Responsive Layouts"],
  },
];

// HANDCRAFTED ABSTRACT EDITORIAL SVG BACKGROUND CANVAS
const AbstractEditorialCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Ambient Radial Warm Glow */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[600px] rounded-full bg-gradient-to-b from-[#FFD42A]/18 via-[#F7F1E5]/40 to-transparent blur-3xl" />

      {/* Organic Sun / Geometric Circle Accent */}
      <div className="absolute top-[6%] right-[-6%] sm:top-[12%] sm:right-[8%] w-36 h-36 sm:w-72 sm:h-72 rounded-full border border-[#1D2024]/10 bg-[#FFD42A]/15 blur-xs animate-pulse duration-10000" />

      {/* Hand-Drawn Editorial Linework & Abstract Shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-100 450 Q 300 320, 800 480 T 1800 380"
          fill="none"
          stroke="#1D2024"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          d="M-50 520 Q 500 390, 1100 550 T 2000 440"
          fill="none"
          stroke="#1D2024"
          strokeWidth="1"
        />

        <circle cx="12%" cy="22%" r="4" fill="#1D2024" />
        <circle cx="88%" cy="38%" r="6" fill="#FFD42A" stroke="#1D2024" strokeWidth="1" />
        <line x1="8%" y1="18%" x2="16%" y2="18%" stroke="#1D2024" strokeWidth="1.5" />
        <line x1="12%" y1="14%" x2="12%" y2="22%" stroke="#1D2024" strokeWidth="1.5" />

        <line x1="85%" y1="65%" x2="95%" y2="65%" stroke="#1D2024" strokeWidth="1" />
        <line x1="85%" y1="70%" x2="92%" y2="70%" stroke="#1D2024" strokeWidth="1" />
        <line x1="85%" y1="75%" x2="90%" y2="75%" stroke="#1D2024" strokeWidth="1" />
      </svg>
    </div>
  );
};

// HANDCRAFTED EDITORIAL AI ENGINE TERMINAL (CENTRAL PERSONAL VISUAL)
const AIEngineTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"build" | "stack" | "status">("build");

  return (
    <div className="relative w-full max-w-[680px] mx-auto rounded-[22px] sm:rounded-[28px] bg-[#121417] text-white p-4 sm:p-7 shadow-[0_25px_70px_rgba(29,32,36,0.18)] border border-white/12 overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD42A]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-0 border-b border-white/12 pb-3.5 mb-4 sm:mb-5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F]" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] text-white/50 ml-1 sm:ml-2 truncate">
            toshit_engine.v2.sh
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/6 p-0.5 sm:p-1 rounded-full border border-white/10 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase self-end xs:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("build")}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
              activeTab === "build" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            Build
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stack")}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
              activeTab === "stack" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("status")}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
              activeTab === "status" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            Status
          </button>
        </div>
      </div>

      <div className="min-h-[150px] sm:min-h-[160px] font-mono text-xs sm:text-sm text-white/85 leading-relaxed flex flex-col justify-between">
        {activeTab === "build" && (
          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center gap-2 text-[#FFD42A] text-[11px] sm:text-xs md:text-sm">
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-all sm:break-normal">toshit-sai@portfolio:~$ build-experience --mode=creative</span>
            </div>
            <p className="text-white/70 pl-4 sm:pl-6 border-l border-white/15 text-[11px] sm:text-xs md:text-sm">
              &gt; Initializing Generative AI models &amp; web architecture...
            </p>
            <p className="text-white/70 pl-4 sm:pl-6 border-l border-white/15 text-[11px] sm:text-xs md:text-sm">
              &gt; Connecting Gemini API + React 18 + Framer Motion.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold pl-4 sm:pl-6 text-[11px] sm:text-xs md:text-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
              <span>[OK] Experience Engine Compiled Successfully.</span>
            </div>
          </div>
        )}

        {activeTab === "stack" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#FFD42A] text-[11px] sm:text-xs">
              <Code2 className="w-4 h-4" />
              <span>SELECTED TOOLKIT &amp; STACK</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[9px] sm:text-[10px] uppercase">AI / ML</span>
                <span className="font-semibold text-white text-[11px] sm:text-xs">Gemini API, Python, LLMs</span>
              </div>
              <div className="bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[9px] sm:text-[10px] uppercase">Frontend</span>
                <span className="font-semibold text-white text-[11px] sm:text-xs">React, TypeScript, Tailwind</span>
              </div>
              <div className="bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[9px] sm:text-[10px] uppercase">Motion</span>
                <span className="font-semibold text-white text-[11px] sm:text-xs">Framer Motion, GSAP</span>
              </div>
              <div className="bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[9px] sm:text-[10px] uppercase">Architecture</span>
                <span className="font-semibold text-white text-[11px] sm:text-xs">Vite, REST APIs, Git</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#FFD42A] text-[11px] sm:text-xs">
              <Cpu className="w-4 h-4" />
              <span>CURRENT DISPATCH &amp; FOCUS</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70 text-[11px] sm:text-xs">Location</span>
                <span className="text-white font-medium text-[11px] sm:text-xs">Hyderabad, India</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70 text-[11px] sm:text-xs">Specialization</span>
                <span className="text-white font-medium text-[11px] sm:text-xs">AI Engineering &amp; Web</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70 text-[11px] sm:text-xs">Status</span>
                <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">● Available for Work</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0 text-[10px] sm:text-[11px] text-white/45">
          <span>IDENTITY: TOSHIT SAI GALAM</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FFD42A]" />
            AI &amp; CREATIVE CODE
          </span>
        </div>
      </div>
    </div>
  );
};

const pageCanvasVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const AboutPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, shouldReduceMotion ? 0 : -35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, shouldReduceMotion ? 1 : 0.4]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : pageCanvasVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      ref={containerRef}
      className="min-h-screen bg-[#F7F1E5] text-[#1D2024] selection:bg-[#FFD42A] selection:text-[#1D2024] font-sans relative overflow-x-hidden"
    >
      {/* MAIN ABOUT PAGE CONTENT */}
      <main className="relative z-10 pt-24 sm:pt-32 pb-24 sm:pb-32 select-none">
        {/* TOP BACK TO HOME BREADCRUMB */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between border-b border-[#1D2024]/12 pb-4 sm:pb-5">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#1D2024]/75 transition-colors hover:text-[#1D2024]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>

        {/* SECTION 1: FULL-SCREEN ABOUT HERO / INTRO */}
        <section className="relative min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 pt-2 pb-16 sm:pb-24">
          <AbstractEditorialCanvas />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="w-full max-w-[1040px] mx-auto text-center relative z-10 flex flex-col items-center"
          >
            {/* PRIMARY ABOUT HERO STATEMENT IN REFINED SANS-SERIF */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif',
                fontWeight: 500,
                color: "#1D2024",
              }}
              className="text-xl sm:text-3xl md:text-[32px] leading-[1.45] max-w-[900px] mx-auto mb-8 sm:mb-12 text-center tracking-[-0.02em]"
            >
              I’m Toshit Sai, a Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning. I build complete AI applications, experiment relentlessly, and turn ideas into useful digital products.
            </motion.h1>

            {/* CENTRAL PERSONAL VISUAL ELEMENT */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.65, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-2 mb-8"
            >
              <AIEngineTerminal />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: EDITORIAL 2-COLUMN EXPERIENCE ARCHIVE (IMAGE 1 VISUAL REFERENCE) */}
        <section id="experience" className="relative z-10 pt-20 sm:pt-28 border-t border-[#1D2024]/14">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
              {/* LEFT COLUMN: LARGE BOLD VERTICAL EXPERIENCE LABEL (STATICALLY ANCHORED) */}
              <div className="lg:col-span-3 flex flex-col justify-start">
                <div>
                  {/* Desktop Vertical Heading */}
                  <div className="hidden lg:block pt-4">
                    <span
                      className="font-sans font-bold text-[clamp(44px,4.5vw,64px)] tracking-[-0.03em] text-[#1D2024] uppercase select-none leading-none block"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      EXPERIENCE
                    </span>
                  </div>

                  {/* Mobile Horizontal Heading */}
                  <div className="lg:hidden mb-6 border-b border-[#1D2024]/14 pb-4">
                    <h2 className="font-sans text-4xl sm:text-5xl text-[#1D2024] font-bold uppercase tracking-[-0.04em]">
                      Experience
                    </h2>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: REFINED EDITORIAL ACCORDION ROWS (IMAGE 1 REFERENCE) */}
              <div className="lg:col-span-9 flex flex-col">
                {FACTUAL_EXPERIENCE_DATA.map((row, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={row.id}
                      className="group border-b border-[#1D2024]/14 transition-colors duration-300"
                    >
                      {/* ACCORDION ROW HEADER BUTTON */}
                      <button
                        type="button"
                        id={`accordion-button-${row.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`accordion-content-${row.id}`}
                        onClick={() => toggleAccordion(index)}
                        className={`w-full flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1D2024] py-8 sm:py-10 px-2 sm:px-4 rounded-2xl transition-all duration-300 ${
                          isOpen ? "bg-white/40" : "hover:bg-white/20"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1">
                          {/* TITLE & ROLE */}
                          <div>
                            <h3
                              style={{ fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif' }}
                              className="text-2xl sm:text-3xl font-semibold text-[#1D2024] leading-tight transition-transform duration-300 group-hover:translate-x-1 tracking-[-0.02em]"
                            >
                              {row.title}
                            </h3>
                            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#1D2024]/55 block mt-1">
                              {row.role}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT METADATA & CIRCULAR PLUS BUTTON */}
                        <div className="flex items-center gap-6 flex-shrink-0 pt-1 sm:pt-0">
                          <span className="hidden sm:inline-block font-mono text-xs font-medium tracking-[0.18em] text-[#1D2024]/60 uppercase whitespace-nowrap">
                            {row.timeframe}
                          </span>

                          {/* ELEGANT CIRCULAR PLUS CONTROL */}
                          <div
                            className={`w-11 h-11 rounded-full border border-[#1D2024]/20 flex items-center justify-center bg-transparent text-[#1D2024] transition-all duration-350 ease-out ${
                              isOpen ? "rotate-45 bg-[#1D2024] text-white border-transparent shadow-xs" : "group-hover:border-[#1D2024] group-hover:scale-105"
                            }`}
                          >
                            <Plus className="w-5 h-5" />
                          </div>
                        </div>
                      </button>

                      {/* EXPANDABLE ACCORDION CONTENT */}
                      <div
                        id={`accordion-content-${row.id}`}
                        role="region"
                        aria-labelledby={`accordion-button-${row.id}`}
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                        className={`grid transition-all duration-400 ${
                          isOpen ? "grid-rows-[1fr] opacity-100 mb-8" : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-4 px-2 sm:px-6 space-y-6">
                            <p
                              style={{ fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif' }}
                              className="text-base sm:text-lg text-[#1D2024]/85 leading-relaxed font-normal"
                            >
                              {row.description}
                            </p>

                            {/* Key Highlights List */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1D2024]/60 block mb-3">
                                KEY HIGHLIGHTS &amp; OUTCOMES
                              </span>
                              <ul className="space-y-2.5">
                                {row.highlights.map((highlight, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#1D2024]/85 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A] mt-2 flex-shrink-0" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Tech Stack Pills */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1D2024]/60 block mb-3">
                                TECHNOLOGIES &amp; TOOLKIT
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {row.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="font-mono text-xs font-semibold px-3.5 py-1 rounded-full bg-[#1D2024]/6 text-[#1D2024] border border-[#1D2024]/10"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Links if available */}
                            {row.links && (
                              <div className="pt-2 flex flex-wrap items-center gap-5">
                                {row.links.map((link) => (
                                  <Link
                                    key={link.label}
                                    to={link.url.startsWith("/") ? link.url : "#"}
                                    onClick={(e) => {
                                      if (link.url.startsWith("http")) {
                                        e.preventDefault();
                                        window.open(link.url, "_blank", "noopener,noreferrer");
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#1D2024] hover:underline"
                                  >
                                    <span>{link.label}</span>
                                    <ArrowUpRight className="w-4 h-4 text-[#FFD42A]" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default AboutPage;
