import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Plus, Cpu, Sparkles, Code2, Layers, Compass } from "lucide-react";

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

// INTERACTIVE CREATIVE DESK ARTIFACT INTERFACE
interface WorkspaceArtifact {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  detail: string;
  desktopPosition: string; // Tailwind grid / relative class
  rotation: string;
}

const WORKSPACE_ARTIFACTS: WorkspaceArtifact[] = [
  {
    id: "ai-ml-nodes",
    badge: "01 // SYSTEM",
    title: "AI / ML SYSTEMS",
    subtitle: "Neural Nets & Architectures",
    icon: <Cpu className="w-4 h-4 text-[#FFD21F]" />,
    detail: "Architecting intelligent systems with neural networks, machine learning algorithms, and data preprocessing pipelines.",
    desktopPosition: "lg:col-span-4 lg:col-start-1 lg:row-start-1",
    rotation: "hover:-rotate-1",
  },
  {
    id: "generative-ai",
    badge: "02 // LLM",
    title: "GENERATIVE AI",
    subtitle: "Gemini API & Workflows",
    icon: <Sparkles className="w-4 h-4 text-[#FFD21F]" />,
    detail: "Creating dynamic AI applications with structured JSON outputs, RAG concepts, and agentic prompt workflows.",
    desktopPosition: "lg:col-span-4 lg:col-start-9 lg:row-start-1",
    rotation: "hover:rotate-1",
  },
  {
    id: "web-engineering",
    badge: "03 // FRONTEND",
    title: "WEB ENGINEERING",
    subtitle: "React 18 & TypeScript",
    icon: <Code2 className="w-4 h-4 text-[#FFD21F]" />,
    detail: "Full-stack React engineering with modern design systems, Framer Motion, and performance optimization.",
    desktopPosition: "lg:col-span-4 lg:col-start-1 lg:row-start-2",
    rotation: "hover:rotate-1",
  },
  {
    id: "product-building",
    badge: "04 // ARCHITECTURE",
    title: "PRODUCT BUILDING",
    subtitle: "Idea → Execution → Ship",
    icon: <Layers className="w-4 h-4 text-[#FFD21F]" />,
    detail: "Turning raw concepts into complete, responsive, user-centered digital products with editorial UI polish.",
    desktopPosition: "lg:col-span-4 lg:col-start-9 lg:row-start-2",
    rotation: "hover:-rotate-1",
  },
  {
    id: "academic-archive",
    badge: "05 // FOUNDATION",
    title: "CS & AI SPECIALIZATION",
    subtitle: "Engineering Degree Student",
    icon: <Compass className="w-4 h-4 text-[#FFD21F]" />,
    detail: "Computer Science Engineering student focusing on data structures, algorithms, and AI/ML principles.",
    desktopPosition: "lg:col-span-12 lg:row-start-3 lg:w-[600px] lg:mx-auto",
    rotation: "hover:-rotate-0.5",
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
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleArtifactClick = (id: string) => {
    setActiveArtifactId((prev) => (prev === id ? null : id));
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

        {/* SECTION 1: VISUAL CREATIVE WORKSPACE COMPOSITION */}
        <section className="relative z-10 pb-20 sm:pb-28">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16">
            {/* SMALL TOP MONOSPACE BADGE */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5 mb-8 sm:mb-12"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21F] animate-pulse" />
              <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#1E2024]/70">
                01 // ABOUT ME — CREATIVE ENGINEER DESK
              </span>
            </motion.div>

            {/* CREATIVE WORKSPACE OBJECT COMPOSITION GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative">
              {/* CENTRAL IDENTITY CARD OBJECT (THE PRIMARY ANCHOR) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.012 }}
                className="lg:col-span-4 lg:col-start-5 lg:row-start-1 z-20 w-full max-w-[460px] mx-auto rounded-3xl bg-[#F7F1E5] border border-[#1E2024]/16 p-6 sm:p-8 shadow-[0_16px_48px_rgba(30,32,36,0.08)] relative group transition-all duration-300"
              >
                {/* Micro Ambient Glow Accent */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FFD21F]/25 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                {/* Identity Header */}
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

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono text-[10px] font-semibold text-[#1E2024]/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
                    ACTIVE
                  </span>
                </div>

                {/* Identity Body */}
                <div className="space-y-4">
                  <p className="font-sans text-sm sm:text-base text-[#1E2024]/85 leading-relaxed font-medium">
                    Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning.
                  </p>

                  <div className="pt-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/50 block mb-2">
                      BUILDING PHILOSOPHY
                    </span>
                    {/* PROCESS SIGNATURE: EXPERIMENT → BUILD → SHIP */}
                    <div className="flex items-center justify-between bg-[#1E2024]/5 p-3 rounded-xl border border-[#1E2024]/10 font-mono text-xs font-bold text-[#1E2024]">
                      <span>EXPERIMENT</span>
                      <span className="text-[#FFD21F]">→</span>
                      <span>BUILD</span>
                      <span className="text-[#FFD21F]">→</span>
                      <span>SHIP</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SURROUNDING INTERACTIVE CREATIVE ARTIFACTS */}
              {WORKSPACE_ARTIFACTS.map((artifact, idx) => {
                const isActive = activeArtifactId === artifact.id;

                return (
                  <motion.div
                    key={artifact.id}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleArtifactClick(artifact.id)}
                    className={`${artifact.desktopPosition} relative z-10 cursor-pointer group`}
                  >
                    <div
                      className={`p-5 sm:p-6 rounded-2xl bg-[#F7F1E5] border border-[#1E2024]/14 shadow-[0_8px_24px_rgba(30,32,36,0.04)] transition-all duration-300 ${artifact.rotation} group-hover:-translate-y-1 group-hover:border-[#1E2024]/30 ${
                        isActive ? "border-[#1E2024] bg-white/60 shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                          {artifact.badge}
                        </span>
                        <div className="p-1.5 rounded-lg bg-[#1E2024]/6 border border-[#1E2024]/10">
                          {artifact.icon}
                        </div>
                      </div>

                      <h3 className="font-sans font-semibold text-lg text-[#1E2024] tracking-[-0.02em]">
                        {artifact.title}
                      </h3>
                      <span className="font-mono text-xs text-[#1E2024]/60 block mt-0.5">
                        {artifact.subtitle}
                      </span>

                      {/* MICRO TOOLTIP / DETAIL POPOVER ON HOVER / TAP */}
                      <AnimatePresence>
                        {(isActive || undefined) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 pt-3 border-t border-[#1E2024]/12 text-xs font-sans text-[#1E2024]/80 leading-relaxed overflow-hidden"
                          >
                            {artifact.detail}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ALWAYS VISIBLE HOVER TOOLTIP ON DESKTOP */}
                      <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 pt-3 border-t border-[#1E2024]/10 text-xs font-sans text-[#1E2024]/80 leading-relaxed">
                        {artifact.detail}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
