import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Plus, Terminal, Code2, Sparkles, Cpu } from "lucide-react";
import ContactFooter from "@/components/portfolio/ContactFooter";
import CustomCursor from "@/components/portfolio/CustomCursor";

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
    role: "Creator & Lead Developer",
    timeframe: "2024 – Present",
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
    role: "AI / ML & Software Development",
    timeframe: "Core Focus",
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
    role: "Engineering Student (AI / ML Specialization)",
    timeframe: "Academic Journey",
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
    role: "Creative Engineer",
    timeframe: "Ongoing Mindset",
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
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[600px] rounded-full bg-gradient-to-b from-[#FFD42A]/18 via-[#FFF8E8]/40 to-transparent blur-3xl" />

      {/* Organic Sun / Geometric Circle Accent */}
      <div className="absolute top-[12%] right-[8%] w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-[#20252B]/10 bg-[#FFD42A]/15 blur-xs animate-pulse duration-10000" />

      {/* Hand-Drawn Editorial Linework & Abstract Shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Organic Ground Curve */}
        <path
          d="M-100 450 Q 300 320, 800 480 T 1800 380"
          fill="none"
          stroke="#20252B"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          d="M-50 520 Q 500 390, 1100 550 T 2000 440"
          fill="none"
          stroke="#20252B"
          strokeWidth="1"
        />

        {/* Corner Cross Accents */}
        <circle cx="12%" cy="22%" r="4" fill="#20252B" />
        <circle cx="88%" cy="38%" r="6" fill="#FFD42A" stroke="#20252B" strokeWidth="1" />
        <line x1="8%" y1="18%" x2="16%" y2="18%" stroke="#20252B" strokeWidth="1.5" />
        <line x1="12%" y1="14%" x2="12%" y2="22%" stroke="#20252B" strokeWidth="1.5" />

        {/* Decorative Grid Accent Lines */}
        <line x1="85%" y1="65%" x2="95%" y2="65%" stroke="#20252B" strokeWidth="1" />
        <line x1="85%" y1="70%" x2="92%" y2="70%" stroke="#20252B" strokeWidth="1" />
        <line x1="85%" y1="75%" x2="90%" y2="75%" stroke="#20252B" strokeWidth="1" />
      </svg>
    </div>
  );
};

// HANDCRAFTED EDITORIAL AI ENGINE TERMINAL (CENTRAL PERSONAL VISUAL)
const AIEngineTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"build" | "stack" | "status">("build");

  return (
    <div className="relative w-full max-w-[680px] mx-auto rounded-[28px] bg-[#121417] text-white p-5 sm:p-7 shadow-[0_25px_70px_rgba(32,37,43,0.22)] border border-white/12 overflow-hidden group">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD42A]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/12 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 ml-2">
            toshit_engine.v2.sh
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-white/6 p-1 rounded-full border border-white/10 font-mono text-[10px] tracking-wider uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("build")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === "build" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
              }`}
          >
            Build
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stack")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === "stack" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
              }`}
          >
            Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("status")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeTab === "status" ? "bg-[#FFD42A] text-[#121417] font-bold" : "text-white/70 hover:text-white"
              }`}
          >
            Status
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="min-h-[160px] font-mono text-xs sm:text-sm text-white/85 leading-relaxed flex flex-col justify-between">
        {activeTab === "build" && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#FFD42A]">
              <Terminal className="w-4 h-4" />
              <span>toshit-sai@portfolio:~$ build-experience --mode=creative</span>
            </div>
            <p className="text-white/70 pl-6 border-l border-white/15">
              &gt; Initializing Generative AI models &amp; web architecture...
            </p>
            <p className="text-white/70 pl-6 border-l border-white/15">
              &gt; Connecting Gemini API + React 18 + Framer Motion.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold pl-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>[OK] Experience Engine Compiled Successfully.</span>
            </div>
          </div>
        )}

        {activeTab === "stack" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#FFD42A]">
              <Code2 className="w-4 h-4" />
              <span>SELECTED TOOLKIT &amp; STACK</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[10px] uppercase">AI / ML</span>
                <span className="font-semibold text-white">Gemini API, Python, LLMs</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[10px] uppercase">Frontend</span>
                <span className="font-semibold text-white">React, TypeScript, Tailwind</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[10px] uppercase">Motion</span>
                <span className="font-semibold text-white">Framer Motion, GSAP</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/8">
                <span className="text-white/50 block text-[10px] uppercase">Architecture</span>
                <span className="font-semibold text-white">Vite, REST APIs, Git</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#FFD42A]">
              <Cpu className="w-4 h-4" />
              <span>CURRENT DISPATCH &amp; FOCUS</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70">Location</span>
                <span className="text-white font-medium">Hyderabad, India</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70">Specialization</span>
                <span className="text-white font-medium">AI Engineering &amp; Web</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                <span className="text-white/70">Status</span>
                <span className="text-emerald-400 font-bold">● Available for Work</span>
              </div>
            </div>
          </div>
        )}

        {/* Terminal Footer info line */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/45">
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

// SAFE ELEGANT PAGE VARIANTS FOR ROUTE TRANSITIONS (NO BLANK SCREEN CLIP-PATH)
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
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First row open by default

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
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : pageCanvasVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      ref={containerRef}
      className="min-h-screen bg-[#FFF8E8] text-[#20252B] selection:bg-[#FFD42A] selection:text-[#20252B] font-sans relative overflow-x-hidden"
    >
      <CustomCursor />

      {/* MAIN ABOUT PAGE CONTENT */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-24 sm:pb-32 select-none">

        {/* TOP BACK TO HOME BREADCRUMB + ABOUT ME BADGE */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16 mb-8"
        >
          <div className="flex items-center justify-between border-b border-[#20252B]/12 pb-5">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#20252B]/75 transition-colors hover:text-[#20252B]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            {/* TOP-LEFT ABOUT BADGE */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/80">
              <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block" />
              <span>ABOUT ME</span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 1: FULL-SCREEN ABOUT HERO */}
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 pt-4 pb-16">
          <AbstractEditorialCanvas />

          {/* VERTICAL SIDE EDITORIAL LABEL (DESKTOP ONLY) */}
          <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-10">
            <span
              className="font-mono text-[11px] font-semibold tracking-[0.25em] text-[#20252B]/45 uppercase select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              AI / CODE / BUILD / EXPLORE
            </span>
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="w-full max-w-[1040px] mx-auto text-center relative z-10 flex flex-col items-center"
          >
            {/* STAGGER 1: PRIMARY EDITORIAL HEADLINE STATEMENT IN INSTRUMENT SERIF — REFRESHED */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -35 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-medium text-[clamp(2.4rem,5.2vw,4.8rem)] leading-[1.1] tracking-tight text-[#20252B] max-w-[980px] mx-auto mb-6 sm:mb-8 text-center"
            >
              I’m Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and{" "}
              <span className="italic font-normal underline decoration-[#FFD42A] decoration-wavy decoration-2">
                Generative AI
              </span>{" "}
              systems to experiences designed for real people.
            </motion.h1>

            {/* STAGGER 3: CENTRAL PERSONAL VISUAL ELEMENT */}
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

        {/* SECTION 2: EDITORIAL EXPERIENCE & ACCORDION ARCHIVE */}
        <section id="experience" className="relative z-10 pt-16 sm:pt-24 border-t border-[#20252B]/12">
          <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

              {/* LEFT COLUMN: VERTICAL / HORIZONTAL SECTION TITLE */}
              <div className="lg:col-span-3 flex flex-col justify-start">
                <div className="lg:sticky lg:top-36">
                  {/* Desktop Vertical Heading */}
                  <div className="hidden lg:block">
                    <span
                      className="font-serif font-bold text-[clamp(52px,5.5vw,72px)] tracking-widest text-[#20252B]/22 uppercase select-none block"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      EXPERIENCE
                    </span>
                  </div>

                  {/* Mobile Horizontal Heading */}
                  <div className="lg:hidden">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#20252B]/60 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFD42A]" />
                      <span>CURATED ARCHIVE</span>
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl text-[#20252B] font-bold uppercase tracking-tight">
                      Experience
                    </h2>
                  </div>

                  <p className="mt-4 font-sans text-sm text-[#20252B]/65 leading-relaxed max-w-[280px]">
                    Factual background, AI software projects, technical capabilities, and building philosophy.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: EXPANDABLE ACCORDION ROWS */}
              <div className="lg:col-span-9 flex flex-col gap-6">

                {FACTUAL_EXPERIENCE_DATA.map((row, index) => {
                  const isOpen = expandedIndex === index;

                  return (
                    <div
                      key={row.id}
                      className={`group border-b border-[#20252B]/16 pb-6 transition-all duration-300 ${isOpen ? "bg-white/40 p-6 sm:p-8 rounded-[24px] border border-[#20252B]/12 shadow-xs" : "hover:bg-white/20 px-2 py-3 rounded-2xl"
                        }`}
                    >
                      {/* ACCORDION ROW HEADER BUTTON */}
                      <button
                        type="button"
                        id={`accordion-button-${row.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`accordion-content-${row.id}`}
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#20252B] rounded-xl p-1"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 flex-1">
                          <span className="font-mono text-xs font-bold tracking-widest text-[#FFD42A] bg-[#121417] px-2.5 py-1 rounded-md">
                            {row.number}
                          </span>
                          <div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#20252B] leading-tight group-hover:text-black transition-colors">
                              {row.title}
                            </h3>
                            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#20252B]/55 block mt-1">
                              {row.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0 pt-1">
                          <span className="hidden sm:inline-block font-mono text-xs font-medium tracking-wider text-[#20252B]/60 uppercase">
                            {row.timeframe}
                          </span>

                          {/* ACCORDION TOGGLE ICON (+ to ×) */}
                          <div
                            className={`w-9 h-9 rounded-full border border-[#20252B]/20 flex items-center justify-center bg-white/80 text-[#20252B] transition-transform duration-350 ease-out ${isOpen ? "rotate-45 bg-[#121417] text-white border-transparent" : "group-hover:scale-105"
                              }`}
                          >
                            <Plus className="w-5 h-5" />
                          </div>
                        </div>
                      </button>

                      {/* EXPANDABLE ACCORDION CONTENT (GRID 0fr -> 1fr) */}
                      <div
                        id={`accordion-content-${row.id}`}
                        role="region"
                        aria-labelledby={`accordion-button-${row.id}`}
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                        className={`grid transition-all duration-350 ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-2 border-t border-[#20252B]/10 space-y-5">

                            <p className="font-sans text-base sm:text-lg text-[#20252B]/85 leading-relaxed font-normal">
                              {row.description}
                            </p>

                            {/* Key Highlights List */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#20252B]/60 block mb-2.5">
                                KEY HIGHLIGHTS &amp; OUTCOMES
                              </span>
                              <ul className="space-y-2">
                                {row.highlights.map((highlight, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#20252B]/80 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A] mt-2 flex-shrink-0" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Tech Stack Pills */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#20252B]/60 block mb-2.5">
                                TECHNOLOGIES &amp; TOOLKIT
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {row.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#20252B]/8 text-[#20252B] border border-[#20252B]/10"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Links if available */}
                            {row.links && (
                              <div className="pt-3 flex flex-wrap items-center gap-4">
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
                                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#20252B] hover:underline"
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

            {/* SECTION 3: PERSONAL DETAILS GRID */}
            <div className="mt-20 pt-12 border-t border-[#20252B]/16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/50 block mb-2">
                    BASED IN
                  </span>
                  <p className="font-sans text-base font-semibold text-[#20252B]">
                    Hyderabad, India
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/50 block mb-2">
                    FOCUS
                  </span>
                  <p className="font-sans text-base font-semibold text-[#20252B]">
                    AI Engineering &amp; Web
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/50 block mb-2">
                    BUILDING
                  </span>
                  <p className="font-sans text-base font-semibold text-[#20252B]">
                    Generative Applications
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/50 block mb-2">
                    INTERESTS
                  </span>
                  <p className="font-sans text-base font-semibold text-[#20252B]">
                    AI · Motion · Open Source
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: EDITORIAL FOOTER STATEMENT */}
            <div className="mt-20 pt-12 border-t border-[#20252B]/16 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="font-serif italic text-2xl text-[#20252B]/70 font-normal">
                  Still building. More to come.
                </span>
              </div>
              <Link
                to="/#work"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                  setTimeout(() => {
                    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                className="group inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full bg-[#121417] text-white hover:bg-black transition-all cursor-pointer shadow-sm"
              >
                <span>BACK TO WORK</span>
                <ArrowUpRight className="w-4 h-4 text-[#FFD42A] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      <ContactFooter isDrawerOpen={isContactDrawerOpen} setIsDrawerOpen={setIsContactDrawerOpen} />
    </motion.div>
  );
};

export default AboutPage;
