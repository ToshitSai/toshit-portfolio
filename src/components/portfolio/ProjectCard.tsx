import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Globe } from "lucide-react";
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
      aria-label={`Project showcase: ${project.title}`}
      onBlur={() => setIsTouched(false)}
      onClick={handleCardClick}
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      }}
      className={`group relative w-full rounded-2xl overflow-hidden cursor-pointer select-none bg-[#0e1116] text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD42A] ${
        isTouched ? "is-touched" : ""
      } ${!shouldReduceMotion ? "hover:scale-[1.02] focus-visible:scale-[1.02] hover:-translate-y-1" : ""}`}
    >
      {/* Brand Accent Border & Ambient Background Glow */}
      <div
        style={{
          boxShadow: `0 0 35px ${project.accentGlow}, 0 0 0 1.5px ${project.accentColor}`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700 pointer-events-none z-30"
      />

      <div className="p-5 sm:p-7 flex flex-col justify-between h-full min-h-[480px] sm:min-h-[520px] relative z-20">
        {/* 1. EDITORIAL HEADER BAR: Project Number & Category Pill */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: project.accentColor }}
              className="w-2 h-2 rounded-full inline-block"
            />
            <span className="font-bold text-white/90 text-sm tracking-wider font-mono">
              {project.number} <span className="text-white/40 font-normal">/ 04</span>
            </span>
          </div>

          <span
            style={{
              backgroundColor: `${project.accentColor}20`,
              color: project.accentColor === "#FFD42A" ? "#FFE885" : project.accentColor,
              borderColor: `${project.accentColor}40`,
            }}
            className="px-3 py-1 rounded-full border text-[11px] font-mono tracking-widest font-semibold uppercase backdrop-blur-md"
          >
            {project.category}
          </span>
        </div>

        {/* 2. PROJECT TITLE & TAGLINE */}
        <div className="mb-4">
          <h3
            style={{
              fontFamily: project.motifType === "doomsday" ? "'Inter', sans-serif" : "'Instrument Sans', sans-serif",
            }}
            className={`text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-2 ${
              project.motifType === "doomsday" ? "uppercase tracking-wider text-[#FF003C]" : ""
            }`}
          >
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl font-normal">
            {project.tagline}
          </p>
        </div>

        {/* 3. AUTHENTIC REAL PROJECT UI SCREENSHOT INSIDE REFINED BROWSER FRAME */}
        <div className="relative w-full my-2 rounded-xl overflow-hidden border border-white/15 bg-[#14181f] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
          {/* Subtle Browser Window Header */}
          <div className="px-3 py-2 bg-[#1b2029] border-b border-white/10 flex items-center justify-between font-mono text-[11px] text-white/50 select-none">
            {/* Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
            </div>

            {/* Clean Domain URL Bar */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-black/40 text-white/70 text-[10px] tracking-wide border border-white/5">
              <Globe className="w-3 h-3 text-white/40" />
              <span>{project.domain}</span>
            </div>

            <span className="text-[10px] text-white/30 tracking-wider">LIVE APP</span>
          </div>

          {/* Screenshot Container with Subtle Hover Zoom */}
          <div className="relative w-full h-[210px] sm:h-[240px] overflow-hidden bg-[#0a0c0f]">
            <img
              src={project.bgImage}
              alt={`Real application preview of ${project.title}`}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            {/* Very Subtle Gradient Overlay at bottom for content legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1116]/60 via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>

        {/* 4. FOOTER: TECH STACK PILLS & EDITORIAL LINKS BAR */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
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

          {/* Action Links Bar */}
          <div className="relative flex items-center justify-between font-mono text-xs tracking-widest uppercase pt-1">
            {/* Expanding Brand Accent Progress Line on Hover */}
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
    </div>
  );
};

export default ProjectCard;
