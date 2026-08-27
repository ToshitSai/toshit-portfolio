import React, { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Globe, Monitor, Tablet, Smartphone } from "lucide-react";
import { ProjectItemData } from "@/data/projectsData";

interface ProjectCardProps {
  project: ProjectItemData;
  onOpenStory?: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenStory }) => {
  const [isTouched, setIsTouched] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Mobile tap handler
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a") || (e.target as HTMLElement).closest("button")) return;

    if (window.matchMedia("(max-width: 768px)").matches) {
      if (!isTouched) {
        setIsTouched(true);
        return;
      }
    }

    if (onOpenStory) {
      onOpenStory(project.slug);
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Project showcase card: ${project.title}`}
      onBlur={() => setIsTouched(false)}
      onClick={handleCardClick}
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      }}
      className={`project-card group relative w-full rounded-2xl overflow-hidden cursor-pointer select-none bg-[#0e1116] text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD42A] ${
        isTouched ? "is-touched" : ""
      } ${!shouldReduceMotion ? "hover:scale-[1.02] focus-visible:scale-[1.02] hover:-translate-y-1" : ""}`}
    >
      {/* Brand Accent Border Glow on Hover/Focus */}
      <div
        style={{
          boxShadow: `0 0 35px ${project.accentGlow}, 0 0 0 1.5px ${project.accentColor}`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none z-30"
      />

      <div className="p-5 sm:p-7 flex flex-col justify-between h-full min-h-[500px] sm:min-h-[540px] relative z-20">
        {/* 1. EDITORIAL HEADER BAR: Project Number & Category Pill */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: project.accentColor }}
              className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
            />
            <span className="font-bold text-white/90 text-sm tracking-wider font-mono">
              {project.number} <span className="text-white/40 font-normal">/ 05</span>
            </span>
          </div>

          <span
            style={{
              backgroundColor: `${project.accentColor}20`,
              color: project.accentColor === "#F6C545" ? "#FFE885" : project.accentColor,
              borderColor: `${project.accentColor}50`,
            }}
            className="px-3 py-1 rounded-full border text-[11px] font-mono tracking-widest font-semibold uppercase backdrop-blur-md"
          >
            {project.category}
          </span>
        </div>

        {/* 2. PROJECT TITLE & TAGLINE */}
        <div className="mb-3">
          <h3
            style={{
              fontFamily: project.motifType === "doomsday" ? "'Inter', sans-serif" : "'Instrument Sans', sans-serif",
            }}
            className={`text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-2 ${
              project.motifType === "doomsday" ? "uppercase tracking-wider text-[#C0392B]" : ""
            }`}
          >
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl font-normal line-clamp-2">
            {project.tagline}
          </p>
        </div>

        {/* 3. MULTI-DEVICE RESPONSIVE MOCKUP STAGE (DESKTOP + TABLET + MOBILE) */}
        <div className="relative w-full my-3 py-2 flex items-center justify-center">
          {/* DESKTOP BROWSER FRAME (MAIN HERO) */}
          <div className="relative w-full rounded-xl overflow-hidden border border-white/15 bg-[#14181f] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
            {/* Desktop Window Header */}
            <div className="px-3 py-2 bg-[#1b2029] border-b border-white/10 flex items-center justify-between font-mono text-[11px] text-white/50 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
              </div>

              {/* Clean Domain URL Bar */}
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-black/50 text-white/80 text-[10px] tracking-wide border border-white/10">
                <Globe className="w-3 h-3 text-white/40" />
                <span>{project.domain}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-white/40">
                <Monitor className="w-3 h-3" />
                <span>DESKTOP</span>
              </div>
            </div>

            {/* Desktop Real Screenshot */}
            <div className="relative w-full h-[190px] sm:h-[220px] overflow-hidden bg-[#0a0c0f]">
              <img
                src={project.bgImage}
                alt={`Real desktop screenshot of ${project.title}`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1116]/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* TABLET OUTLINE OVERLAY (RIGHT FLANK) */}
          <div className="hidden sm:flex absolute right-[-10px] bottom-[-8px] w-[130px] h-[160px] rounded-lg border-2 border-white/20 bg-[#161a22] shadow-2xl overflow-hidden flex-col pointer-events-none transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1">
            <div className="h-3 bg-[#1f242d] border-b border-white/10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
            <div className="relative flex-1 overflow-hidden">
              <img
                src={project.bgImage}
                alt={`Tablet outline preview of ${project.title}`}
                loading="lazy"
                className="w-full h-full object-cover object-left-top opacity-90"
              />
            </div>
          </div>

          {/* MOBILE PHONE OUTLINE OVERLAY (CORNER) */}
          <div className="absolute left-3 bottom-[-10px] w-[75px] sm:w-[85px] h-[135px] sm:h-[145px] rounded-xl border-2 border-white/30 bg-[#0d0f14] shadow-2xl overflow-hidden flex flex-col pointer-events-none transition-transform duration-700 group-hover:-translate-x-1 group-hover:translate-y-0.5">
            {/* Phone Speaker Notch */}
            <div className="h-3 bg-[#1b2029] border-b border-white/10 flex items-center justify-center">
              <div className="w-5 h-1 rounded-full bg-white/40" />
            </div>
            <div className="relative flex-1 overflow-hidden">
              <img
                src={project.bgImage}
                alt={`Mobile outline preview of ${project.title}`}
                loading="lazy"
                className="w-full h-full object-cover object-center scale-125"
              />
            </div>
          </div>
        </div>

        {/* 4. FOOTER: TECH STACK PILLS & EDITORIAL LINKS BAR */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded bg-white/10 text-white/75 font-mono text-[10px] tracking-wider uppercase border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links Bar */}
          <div className="relative flex items-center justify-between font-mono text-xs tracking-widest uppercase pt-1">
            <div
              style={{ backgroundColor: project.accentColor }}
              className="absolute top-0 left-0 h-[1.5px] w-8 group-hover:w-full transition-all duration-700 ease-out"
            />

            <div className="flex items-center gap-4 pt-2">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-1.5 text-white hover:text-[#FFD42A] font-semibold transition-colors"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>

            {onOpenStory && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStory(project.slug);
                }}
                className="mt-2 px-3 py-1.5 rounded-md bg-white/15 hover:bg-white text-white hover:text-black font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1"
              >
                <span>STORY REEL</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. HOVER & KEYBOARD FOCUS TITLE REVEAL OVERLAY */}
      <div
        className={`overlay absolute inset-0 bg-[#0a0c10]/85 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 ${
          isTouched
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-full pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <span className="font-mono text-xs tracking-widest text-white/60 uppercase">
            {project.number} // {project.category}
          </span>
          <span
            style={{ backgroundColor: project.accentColor }}
            className="w-3 h-3 rounded-full shadow-[0_0_12px_currentColor]"
          />
        </div>

        <div className="my-auto space-y-4">
          <h2
            style={{
              color: project.accentColor === "#F6C545" ? "#FFE885" : project.accentColor,
            }}
            className="title text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-none transition-all duration-500 delay-100"
          >
            {project.title}
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-lg font-normal">
            {project.tagline}
          </p>

          {/* Device indicator badges */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-white/60 pt-2">
            <span className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-white/80" /> Desktop
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Tablet className="w-3.5 h-3.5 text-white/80" /> Tablet
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-white/80" /> Mobile
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/15 flex items-center justify-between font-mono text-xs tracking-widest uppercase">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: project.accentColor }}
            className="px-4 py-2 rounded-lg text-black font-bold flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
          >
            <span>EXPLORE LIVE APP</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {onOpenStory && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStory(project.slug);
              }}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white text-white hover:text-black font-bold transition-all cursor-pointer"
            >
              STORY REEL ↗
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
