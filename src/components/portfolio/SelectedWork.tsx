import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, CheckCircle2, Play, Activity, Cpu } from "lucide-react";

// --- ABSTRACT INTERACTIVE PROJECT PREVIEWS ---

// 1. HireScope AI Preview Component
const HireScopePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EEF5FC] border border-[#5B9BD5]/30 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#5B9BD5]/60 transition-colors">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-[#5B9BD5]/20 pb-3 font-mono text-[11px] tracking-wider text-[#2B6090]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
          <span className="font-semibold uppercase">RESUME ANALYSIS ENGINE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#2B6090]/65 uppercase font-semibold">
          SAMPLE OUTPUT
        </span>
      </div>

      {/* Score & Matching Metrics */}
      <div className="my-auto py-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs font-mono text-[#2B6090]/70 uppercase tracking-widest block">Overall Match</span>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-[#1E40AF]">92.4%</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#2B6090]/70 uppercase tracking-widest block font-medium">Scoring Metric</span>
            <span className="text-sm font-mono font-semibold text-[#1E40AF]">87 / 100 PTS</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#5B9BD5]/20 rounded-full overflow-hidden p-0.5">
          <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full w-[92%] transition-all duration-1000 group-hover:w-[96%]" />
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

// 2. Greetly Preview Component
const GreetlyPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#FFFBF0] border border-[#FFD42A]/50 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#FFD42A] transition-colors">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#FFD42A]/30 pb-3 font-mono text-[11px] tracking-wider text-[#8A6A00]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A700]" />
          <span className="font-semibold uppercase">GROQ API INFERENCE</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#8A6A00]/70 uppercase font-semibold">
          SAMPLE OUTPUT // 42MS LATENCY
        </span>
      </div>

      {/* Greeting Preview Card */}
      <div className="my-auto bg-white/80 backdrop-blur-xs border border-[#FFD42A]/30 p-4 rounded-md shadow-xs">
        <span className="text-[10px] font-mono tracking-widest text-[#8A6A00] uppercase block mb-1">Generated Output</span>
        <p className="font-sans text-sm sm:text-base text-[#1D2024] font-medium leading-snug">
          "Wishing you an inspiring year filled with breakthrough ideas and seamless code!"
        </p>
      </div>

      {/* Audio/Video Waveform Graphic */}
      <div className="flex items-center justify-between pt-3 border-t border-[#FFD42A]/30 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#8A6A00]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>READY FOR RENDER</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-[#FFD42A] rounded-full animate-pulse" />
          <div className="w-1 h-5 bg-[#D9A700] rounded-full animate-pulse delay-75" />
          <div className="w-1 h-2 bg-[#FFD42A] rounded-full animate-pulse delay-150" />
          <div className="w-1 h-6 bg-[#D9A700] rounded-full animate-pulse delay-100" />
          <div className="w-1 h-4 bg-[#FFD42A] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 3. CourseForge AI Preview Component
const CourseForgePreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EBF6F4] border border-[#0F766E]/30 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-xs group-hover:border-[#0F766E]/60 transition-colors">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#0F766E]/20 pb-3 font-mono text-[11px] tracking-wider text-[#0D5C56]">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#0F766E]" />
          <span className="font-semibold uppercase">AI CURRICULUM GENERATOR</span>
        </div>
        <span className="text-[10px] tracking-widest text-[#0D5C56]/70 uppercase font-semibold">
          SAMPLE OUTPUT // 4 LESSONS
        </span>
      </div>

      {/* Generated Modules Tree */}
      <div className="my-auto space-y-2">
        {[
          "01. Introduction to Applied AI Systems",
          "02. Neural Architectures & Transformers",
          "03. Context Windowing & Vector Search",
        ].map((module, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/75 border border-[#0F766E]/15 px-3 py-1.5 rounded text-xs font-mono text-[#0D5C56]">
            <span className="truncate pr-2">{module}</span>
            <Play className="w-3 h-3 text-[#0F766E] flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#0F766E]/20 font-mono text-[11px] text-[#0D5C56]">
        <span className="font-semibold">QUIZ GENERATED</span>
        <span className="opacity-80">YOUTUBE CURATED</span>
      </div>
    </div>
  );
};

// 4. Doom Protocol WebGL 3D Preview Component (Sophisticated Deep Crimson Integration)
const DoomProtocolPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-[#8A1334] border border-[#BE123C]/50 rounded-lg p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md group-hover:border-[#FB7185]/80 transition-colors text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3 font-mono text-[11px] tracking-widest text-white/90">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#FFE4E6] animate-pulse" />
          <span className="font-semibold uppercase">3D MULTIVERSE CANVAS</span>
        </div>
        <span className="text-[10px] tracking-widest text-white/75 uppercase font-semibold">
          SAMPLE OUTPUT // 60 FPS
        </span>
      </div>

      {/* Central 3D Wireframe Visual Effect */}
      <div className="my-auto flex items-center justify-center relative py-2">
        <div className="w-20 h-20 rounded-full border border-white/30 border-dashed animate-[spin_12s_linear_infinite] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#FFE4E6] shadow-[0_0_12px_#FFF]" />
          </div>
        </div>
        <span className="absolute font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase font-medium">DOOM PROTOCOL</span>
      </div>

      {/* Tech Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/20 font-mono text-[11px] text-white/80">
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
  layoutVariant: "wide" | "compact";
}

const projects: ProjectItem[] = [
  {
    id: "hirescope",
    number: "01",
    category: "AI CAREER TOOL",
    titleMain: "HireScope",
    titleSub: "/ Job Gem Grader",
    description: "AI-powered resume evaluation and job matching with automated scoring, analysis, and intelligent candidate-to-role recommendations.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: HireScopePreview,
    layoutVariant: "wide",
  },
  {
    id: "greetly",
    number: "02",
    category: "AI GREETING TOOL",
    titleMain: "Greetly",
    titleSub: "",
    description: "Personalized AI greetings and messages generated from contextual inputs using high-speed inference and a lightweight Flask service.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    PreviewComponent: GreetlyPreview,
    layoutVariant: "compact",
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
    layoutVariant: "compact",
  },
  {
    id: "doom-protocol",
    number: "04",
    category: "WEBGL & 3D EXPERIENCE",
    titleMain: "Doom Protocol",
    titleSub: "",
    description: "Cinematic WebGL experience combining 3D scenes, scroll-driven storytelling, animation systems, and immersive interactive environments.",
    tech: ["NEXT.JS", "R3F", "THREE.JS", "GSAP", "LENIS"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    PreviewComponent: DoomProtocolPreview,
    layoutVariant: "wide",
  },
];

const SelectedWork: React.FC = () => {
  return (
    <section
      id="work"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-28 sm:py-36 lg:py-44 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      <div id="projects" className="absolute -top-12 left-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <div className="border-b border-[#1D2024]/15 pb-10 mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#1D2024]/60 uppercase font-semibold">
              02 // SELECTED WORK
            </span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            className="font-semibold text-[clamp(34px,4.8vw,68px)] leading-[1.04] tracking-[-0.035em] text-[#1D2024] max-w-3xl"
          >
            Projects that turn <br className="hidden sm:block" />
            ideas into working systems.
          </h2>
        </div>

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
                    className={`lg:col-span-6 flex flex-col justify-between ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div>
                      <h3
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                        className="text-[clamp(32px,4vw,56px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1D2024] mb-4 group-hover:text-black transition-colors"
                      >
                        <span>{project.titleMain} </span>
                        <span className="opacity-50 font-normal">
                          {project.titleSub}
                        </span>
                      </h3>

                      <p
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                        className="text-[17px] sm:text-[18px] leading-[1.45] text-[#1D2024]/85 max-w-[520px] min-h-[76px] mb-8 font-normal"
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* EDITORIAL TECH TAGS (MONOSPACE / NO SaaS PILLS) */}
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

                  {/* INTERACTIVE ABSTRACT PREVIEW VISUAL */}
                  <div
                    className={`lg:col-span-6 transition-transform duration-500 ease-out group-hover:scale-[1.015] ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <PreviewComp />
                  </div>
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
