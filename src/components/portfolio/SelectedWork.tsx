import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  category: string;
  title: string;
  subtitle: string;
  description: string;
  headerBgClass: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  isYellowHeader?: boolean;
}

const projectsData: ProjectCardProps[] = [
  {
    category: "AI CAREER TOOL",
    title: "HireScope AI / Job Gem Grader",
    subtitle: "Automated Resume Evaluation & Matching Engine",
    description:
      "Advanced AI tool evaluating candidate resumes against job descriptions with real-time scraping, feedback analysis, and scoring metrics powered by Claude API.",
    headerBgClass: "bg-gradient-to-br from-[#5B9BD5] via-[#82BCE5] to-[#A9D5EE]",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    isYellowHeader: false,
  },
  {
    category: "AI GREETING TOOL",
    title: "Greetly AI",
    subtitle: "Personalized AI Video & Message Generator",
    description:
      "Context-aware personalized greeting generator utilizing high-speed Groq API inference and Flask micro-service architecture for customized messages.",
    headerBgClass: "bg-gradient-to-br from-[#FFD42A] via-[#F5C542] to-[#FFE066]",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    isYellowHeader: true,
  },
];

const SelectedWork: React.FC = () => {
  return (
    <section id="work" className="relative w-full py-24 sm:py-32 bg-cream-paper text-ink overflow-hidden z-10">
      <div id="projects" className="absolute -top-10 left-0" />
      <div className="container-narrow">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          <span className="label-mono text-ink-light">02 // SELECTED WORK</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <h2 className="text-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
            Featured Software Projects
          </h2>
          <p className="text-sm font-mono text-ink-light uppercase tracking-wider max-w-xs">
            Handcrafted applications combining modern design & applied AI
          </p>
        </div>

        {/* Two-Column Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projectsData.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-3xl bg-cream border border-ink/10 shadow-soft-card overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300"
            >
              {/* 224px Gradient Header with White Radial Wash */}
              <div className={`relative h-[224px] w-full ${project.headerBgClass} p-6 flex flex-col justify-between overflow-hidden`}>
                {/* White radial wash overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none" />

                {/* Top Category Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-cream text-ink text-[10px] font-mono tracking-[0.18em] font-semibold uppercase shadow-sm">
                    {project.category}
                  </span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-cream/90 text-ink flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="View Live Project"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>

                {/* Animated Header Title */}
                <div className="relative z-10">
                  <h3
                    className={`text-2xl sm:text-3xl font-serif tracking-tight transition-transform duration-300 group-hover:-translate-y-1 ${
                      project.isYellowHeader ? "text-ink" : "text-cream"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-xs font-mono tracking-wider mt-1 uppercase ${
                      project.isYellowHeader ? "text-ink/75" : "text-cream/80"
                    }`}
                  >
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-cream-paper border border-ink/10 text-ink text-[11px] font-mono tracking-wider uppercase font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="pt-4 border-t border-ink/10 flex items-center gap-6 text-xs font-mono tracking-wider font-semibold uppercase">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink hover:text-yellow-accent underline underline-offset-4 decoration-yellow-accent transition-colors"
                  >
                    <span>LIVE DEMO</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-light hover:text-ink transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GITHUB CODE</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
