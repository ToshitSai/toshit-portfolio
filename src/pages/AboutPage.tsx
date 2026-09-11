import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";

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
      <main className="relative z-10 pt-20 sm:pt-28 pb-20 sm:pb-28 select-none">
        {/* TOP BACK TO HOME BREADCRUMB */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 mb-10 sm:mb-16"
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

        {/* SECTION 1: EDITORIAL 2-COLUMN ABOUT INTRO (MATCHING REFERENCE COMPOSITION) */}
        <section className="relative z-10 pb-20 sm:pb-28">
          <AbstractEditorialCanvas />

          <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
              {/* LEFT COLUMN: LARGE BOLD VERTICAL ABOUT LABEL */}
              <div className="lg:col-span-3 flex flex-col justify-start items-center text-center">
                <div className="w-full flex justify-center items-center text-center pt-2 lg:pt-4">
                  {/* Desktop Vertical Heading */}
                  <div className="hidden lg:flex items-center justify-center w-full text-center">
                    <span
                      className="font-sans font-bold text-[clamp(56px,5.5vw,80px)] tracking-[-0.03em] text-[#1D2024] uppercase select-none leading-none inline-block mx-auto text-center"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      ABOUT
                    </span>
                  </div>

                  {/* Mobile Horizontal Heading */}
                  <div className="lg:hidden mb-6 border-b border-[#1D2024]/14 pb-4 w-full text-center">
                    <h2 className="font-sans text-4xl sm:text-5xl text-[#1D2024] font-bold uppercase tracking-[-0.04em]">
                      About
                    </h2>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: EDITORIAL PERSONAL STATEMENT & FOCUS PILLARS */}
              <div className="lg:col-span-9 flex flex-col justify-center">
                {/* SMALL MONOSPACE METADATA BADGE */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A]" />
                  <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#1D2024]/70">
                    01 // ABOUT INTRO
                  </span>
                </motion.div>

                {/* LARGE PERSONAL STATEMENT */}
                <motion.h1
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    color: "#1D2024",
                  }}
                  className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] leading-[1.3] tracking-[-0.03em] max-w-[960px] mb-8 sm:mb-12"
                >
                  I’m Toshit Sai — a Computer Science Engineering student specializing in AI &amp; Machine Learning. I build complete AI applications, experiment with Generative AI, and turn ideas into useful digital products.
                </motion.h1>

                {/* SUPPORTING DETAIL & FOCUS PILLARS */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pt-6 sm:pt-8 border-t border-[#1D2024]/12"
                >
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[#1D2024]/60 mb-3 font-semibold">
                      AI &amp; MACHINE LEARNING FOCUS
                    </h3>
                    <p className="font-sans text-base sm:text-lg text-[#1D2024]/85 leading-relaxed font-normal">
                      Deeply focused on Generative AI workflows, LLM applications, intelligent automation, Gemini API integrations, structured JSON outputs, and prompt engineering.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[#1D2024]/60 mb-3 font-semibold">
                      WEB ENGINEERING &amp; PRODUCTS
                    </h3>
                    <p className="font-sans text-base sm:text-lg text-[#1D2024]/85 leading-relaxed font-normal">
                      Architecting full-stack React &amp; TypeScript applications, building responsive design systems, hardware-accelerated motion, and performance-optimized digital experiences.
                    </p>
                  </div>
                </motion.div>

                {/* SMALL METADATA PILLARS / TAGS */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10"
                >
                  <span className="px-3.5 py-1.5 rounded-full border border-[#1D2024]/15 bg-[#1D2024]/4 font-mono text-xs font-semibold uppercase tracking-wider text-[#1D2024]/80">
                    AI / ML
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#1D2024]/15 bg-[#1D2024]/4 font-mono text-xs font-semibold uppercase tracking-wider text-[#1D2024]/80">
                    GENERATIVE AI
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#1D2024]/15 bg-[#1D2024]/4 font-mono text-xs font-semibold uppercase tracking-wider text-[#1D2024]/80">
                    LLM APPLICATIONS
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#1D2024]/15 bg-[#1D2024]/4 font-mono text-xs font-semibold uppercase tracking-wider text-[#1D2024]/80">
                    WEB DEVELOPMENT
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#1D2024]/15 bg-[#1D2024]/4 font-mono text-xs font-semibold uppercase tracking-wider text-[#1D2024]/80">
                    PRODUCT BUILDING
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: EDITORIAL 2-COLUMN EXPERIENCE ARCHIVE (IMAGE 1 VISUAL REFERENCE) */}
        <section id="experience" className="relative z-10 pt-20 sm:pt-28 border-t border-[#1D2024]/14">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
              {/* LEFT COLUMN: LARGE BOLD VERTICAL EXPERIENCE LABEL (STATIONARY ANCHORED) */}
              <div className="lg:col-span-3 flex flex-col justify-start items-center text-center">
                <div className="w-full flex justify-center items-center text-center pt-4 lg:pt-8">
                  {/* Desktop Vertical Heading */}
                  <div className="hidden lg:flex items-center justify-center w-full text-center">
                    <span
                      className="font-sans font-bold text-[clamp(56px,5.5vw,80px)] tracking-[-0.03em] text-[#1D2024] uppercase select-none leading-none inline-block mx-auto text-center"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      EXPERIENCE
                    </span>
                  </div>

                  {/* Mobile Horizontal Heading */}
                  <div className="lg:hidden mb-6 border-b border-[#1D2024]/14 pb-4 w-full text-center">
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
