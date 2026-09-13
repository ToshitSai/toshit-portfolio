import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import LiveAiUsageCounter from "@/components/portfolio/LiveAiUsageCounter";

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



const pageCanvasVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
};

const AboutPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isFeaturedExpanded, setIsFeaturedExpanded] = useState<boolean>(false);
  const [hasOpenedFeatured, setHasOpenedFeatured] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleFeaturedCard = () => {
    setIsFeaturedExpanded((prev) => {
      const next = !prev;
      if (next) setHasOpenedFeatured(true);
      return next;
    });
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : pageCanvasVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      ref={containerRef}
      className="min-h-screen bg-[#F7F1E5] text-[#1E2024] selection:bg-[#FFD21F] selection:text-[#1E2024] font-sans relative overflow-x-hidden"
    >
      {/* MAIN ABOUT PAGE CONTENT */}
      <main className="relative z-10 pt-20 sm:pt-28 pb-20 sm:pb-28 select-none">
        {/* TOP BACK TO HOME BREADCRUMB */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16 mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between border-b border-[#1E2024]/12 pb-4 sm:pb-5">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#1E2024]/70 transition-colors hover:text-[#1E2024]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>

        {/* SECTION 1: ASYMMETRIC BENTO GRID ABOUT / SKILLS WORKSPACE */}
        <section className="relative z-10 pb-20 sm:pb-28">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16">

            {/* BENTO GRID CONTAINER WITH EXPLICIT STACKING & SPANS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch relative">
              
              {/* 1. CENTER PROFILE CARD (PRIMARY ANCHOR — ORDER 1 ON MOBILE, SPANS 5 COLS ON DESKTOP) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="order-1 lg:col-span-5 rounded-3xl bg-[#F7F1E5] border border-[#1E2024]/16 p-6 sm:p-8 shadow-[0_12px_36px_rgba(30,32,36,0.06)] flex flex-col justify-between relative group transition-all duration-300"
              >
                {/* Identity Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#1E2024]/12 pb-5 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E2024] text-[#F7F1E5] flex items-center justify-center font-bold text-base font-sans shadow-xs">
                        T
                      </div>
                      <div>
                        <h2 className="font-sans font-bold text-xl sm:text-2xl text-[#1E2024] tracking-[-0.02em]">
                          Toshit Sai
                        </h2>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E2024]/60 block mt-0.5">
                          CREATIVE ENGINEER
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-sm sm:text-base text-[#1E2024]/85 leading-relaxed font-medium">
                    Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning.
                  </p>
                </div>

                {/* Building Philosophy Pill Signature */}
                <div className="pt-6">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/50 block mb-2">
                    BUILDING PHILOSOPHY
                  </span>
                  <div className="flex items-center justify-between bg-[#1E2024]/5 p-3 sm:p-3.5 rounded-xl border border-[#1E2024]/10 font-mono text-xs font-bold text-[#1E2024]">
                    <span>EXPERIMENT</span>
                    <div className="arrow-viewport relative inline-flex items-center justify-center overflow-hidden w-[32px] h-6 select-none pointer-events-none align-middle text-[#FFD21F]">
                      <div className="arrow-track arrow-track-anim-1 flex items-center w-max">
                        <span className="inline-block w-[32px] text-center flex-shrink-0 text-[18px] font-bold leading-none">→</span>
                        <span className="inline-block w-[32px] text-center flex-shrink-0 text-[18px] font-bold leading-none">→</span>
                      </div>
                    </div>
                    <span>BUILD</span>
                    <div className="arrow-viewport relative inline-flex items-center justify-center overflow-hidden w-[32px] h-6 select-none pointer-events-none align-middle text-[#FFD21F]">
                      <div className="arrow-track arrow-track-anim-2 flex items-center w-max">
                        <span className="inline-block w-[32px] text-center flex-shrink-0 text-[18px] font-bold leading-none">→</span>
                        <span className="inline-block w-[32px] text-center flex-shrink-0 text-[18px] font-bold leading-none">→</span>
                      </div>
                    </div>
                    <span>SHIP</span>
                  </div>
                </div>
              </motion.div>

              {/* 2. FEATURED GENERATIVE AI CARD (ORDER 2 ON MOBILE, SPANS 7 COLS / 2 COLS WIDTH ON DESKTOP) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                role="button"
                tabIndex={0}
                aria-expanded={isFeaturedExpanded}
                onClick={toggleFeaturedCard}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFeaturedCard();
                  }
                }}
                className="order-2 lg:col-span-7 rounded-3xl bg-[#F7F1E5] border border-[#1E2024]/16 p-6 sm:p-8 shadow-[0_12px_36px_rgba(30,32,36,0.06)] flex flex-col justify-between relative group cursor-pointer transition-all duration-300 hover:border-[#1E2024]/30 select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1E2024]/60">
                      02 // FEATURED FOCUS
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#1E2024] tracking-[-0.025em]">
                    Generative AI &amp; LLM Workflows
                  </h3>
                  <span className="font-mono text-xs text-[#1E2024]/65 block mt-1">
                    Structured JSON Schemas · Gemini API Integration · RAG Concepts
                  </span>

                  <p className="font-sans text-sm sm:text-base text-[#1E2024]/80 leading-relaxed font-normal mt-3">
                    Architecting end-to-end generative workflows that produce structured JSON data, power automated syllabi generators, resume evaluators, and dynamic micro-apps.
                  </p>
                </div>

                {/* EXPANDABLE REAL DATA-DRIVEN LIVE AI USAGE COUNTER */}
                <AnimatePresence initial={false}>
                  {hasOpenedFeatured && (
                    <motion.div
                      key="usage-panel"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={
                        isFeaturedExpanded
                          ? shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, height: "auto" }
                          : shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`overflow-hidden ${isFeaturedExpanded ? "" : "pointer-events-none"}`}
                    >
                      <LiveAiUsageCounter />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 3. COMPACT CARD: AI/ML SYSTEMS (ORDER 3 ON MOBILE, SPANS 4 COLS ON DESKTOP) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="order-3 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border border-[#1E2024]/14 p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-all duration-300 hover:border-[#1E2024]/28"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                      01 // SYSTEM
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em]">
                    AI / ML Systems
                  </h3>
                  <span className="font-mono text-xs text-[#1E2024]/60 block mt-0.5">
                    Neural Nets &amp; Preprocessing
                  </span>
                </div>
              </motion.div>

              {/* 4. COMPACT CARD: WEB ENGINEERING (ORDER 4 ON MOBILE, SPANS 4 COLS ON DESKTOP) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="order-4 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border border-[#1E2024]/14 p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-all duration-300 hover:border-[#1E2024]/28"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                      03 // FRONTEND
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em]">
                    Web Engineering
                  </h3>
                  <span className="font-mono text-xs text-[#1E2024]/60 block mt-0.5">
                    React 18 &amp; TypeScript Systems
                  </span>
                </div>
              </motion.div>

              {/* 5. COMPACT CARD: PRODUCT BUILDING (ORDER 5 ON MOBILE, SPANS 4 COLS ON DESKTOP) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="order-5 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border border-[#1E2024]/14 p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-all duration-300 hover:border-[#1E2024]/28"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                      04 // ARCHITECTURE
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em]">
                    Product Building
                  </h3>
                  <span className="font-mono text-xs text-[#1E2024]/60 block mt-0.5">
                    Idea → Execution → Ship
                  </span>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* THIN SUBTLE SEPARATOR LINE */}
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16">
          <div className="border-t border-[#1E2024]/15 w-full" />
        </div>

        {/* SECTION 2: EDITORIAL EXPERIENCE ARCHIVE */}
        <section id="experience" className="relative z-10 pt-20 sm:pt-28">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* LEFT COLUMN: SUBTLE VERTICAL EXPERIENCE LABEL */}
              <div className="lg:col-span-2 flex flex-col justify-start items-center text-center">
                <div className="w-full flex justify-center items-center text-center pt-4 lg:pt-6">
                  {/* Desktop Vertical Heading */}
                  <div className="hidden lg:flex items-center justify-center w-full text-center">
                    <span
                      className="font-sans font-bold text-[clamp(44px,4vw,60px)] tracking-[-0.03em] text-[#1E2024]/40 uppercase select-none leading-none inline-block mx-auto text-center"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      EXPERIENCE
                    </span>
                  </div>

                  {/* Mobile Horizontal Heading */}
                  <div className="lg:hidden mb-6 border-b border-[#1E2024]/14 pb-3 w-full text-left">
                    <h2 className="font-sans text-3xl sm:text-4xl text-[#1E2024] font-bold uppercase tracking-[-0.03em]">
                      Experience
                    </h2>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: REFINED EDITORIAL ACCORDION ROWS */}
              <div className="lg:col-span-10 flex flex-col">
                {FACTUAL_EXPERIENCE_DATA.map((row, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={row.id}
                      className="group border-b border-[#1E2024]/15 transition-colors duration-300"
                    >
                      {/* ACCORDION ROW HEADER BUTTON */}
                      <button
                        type="button"
                        id={`accordion-button-${row.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`accordion-content-${row.id}`}
                        onClick={() => toggleAccordion(index)}
                        className={`w-full flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer outline-none py-7 sm:py-9 px-2 sm:px-3 rounded-xl transition-all duration-300 ${
                          isOpen ? "bg-white/30" : "hover:bg-white/15"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1">
                          <div>
                            <h3
                              style={{ fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif' }}
                              className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1E2024] leading-tight transition-transform duration-300 group-hover:translate-x-1 tracking-[-0.02em]"
                            >
                              {row.title}
                            </h3>
                            <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#1E2024]/55 block mt-1">
                              {row.role}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT METADATA & CIRCULAR PLUS BUTTON */}
                        <div className="flex items-center gap-6 flex-shrink-0 pt-1 sm:pt-0">
                          <span className="hidden sm:inline-block font-mono text-xs font-medium tracking-[0.16em] text-[#1E2024]/60 uppercase whitespace-nowrap">
                            {row.timeframe}
                          </span>

                          {/* ELEGANT CIRCULAR PLUS CONTROL */}
                          <div
                            className={`w-10 h-10 rounded-full border border-[#1E2024]/20 flex items-center justify-center bg-[#F7F1E5] text-[#1E2024] transition-all duration-300 ease-out ${
                              isOpen ? "rotate-45 bg-[#1E2024] text-white border-transparent" : "group-hover:border-[#1E2024]"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
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
                          <div className="pt-4 px-2 sm:px-4 space-y-6">
                            <p
                              style={{ fontFamily: 'Manrope, "Plus Jakarta Sans", sans-serif' }}
                              className="text-base sm:text-lg text-[#1E2024]/85 leading-relaxed font-normal"
                            >
                              {row.description}
                            </p>

                            {/* Key Highlights List */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E2024]/60 block mb-3">
                                KEY HIGHLIGHTS &amp; OUTCOMES
                              </span>
                              <ul className="space-y-2.5">
                                {row.highlights.map((highlight, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#1E2024]/85 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F] mt-2 flex-shrink-0" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Tech Stack Pills */}
                            <div>
                              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E2024]/60 block mb-3">
                                TECHNOLOGIES &amp; TOOLKIT
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {row.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#1E2024]/6 text-[#1E2024] border border-[#1E2024]/10"
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
                                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#1E2024] hover:underline"
                                  >
                                    <span>{link.label}</span>
                                    <ArrowUpRight className="w-4 h-4 text-[#FFD21F]" />
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
