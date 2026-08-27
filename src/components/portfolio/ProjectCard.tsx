import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import { ProjectItemData } from "@/data/projectsData";

interface ProjectCardProps {
  project: ProjectItemData;
  onOpenStory?: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenStory }) => {
  const [isTouched, setIsTouched] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Mobile tap handler: toggle active state on mobile, or navigate if already revealed
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking directly on live link or github link, let link navigate
    if ((e.target as HTMLElement).closest("a")) return;

    // Mobile tap support: if not touched on touch screens, first tap reveals details
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (!isTouched) {
        setIsTouched(true);
        return;
      }
    }

    // Open Story Reel if handler available
    if (onOpenStory) {
      onOpenStory(project.slug);
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Project card: ${project.title}`}
      onBlur={() => setIsTouched(false)}
      onClick={handleCardClick}
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(29, 32, 36, 0.1)",
      }}
      className={`group relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD42A] ${
        isTouched ? "is-touched" : ""
      } ${!shouldReduceMotion ? "hover:scale-[1.03] focus-visible:scale-[1.03]" : ""}`}
    >
      {/* Dynamic Accent Color Custom Border Glow on Hover/Focus */}
      <div
        style={{
          boxShadow: `0 20px 45px ${project.accentGlow}, 0 0 0 2px ${project.accentColor}`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
      />

      {/* 1. BACKGROUND IMAGE WITH FROSTED GLASS BLUR TO SHARP TRANSITION */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#121418]">
        <img
          src={project.bgImage}
          alt={`${project.title} live screenshot preview`}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none blur-[22px] brightness-75 scale-110 group-hover:blur-0 group-hover:brightness-90 group-hover:scale-100 group-focus-visible:blur-0 group-focus-visible:brightness-90 group-focus-visible:scale-100 ${
            isTouched ? "blur-0 brightness-90 scale-100" : ""
          }`}
        />

        {/* FROSTED GLASS OVERLAY GRADIENT */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0f1115]/75 backdrop-blur-md group-hover:bg-[#0a0c10]/40 group-hover:backdrop-blur-none group-focus-visible:bg-[#0a0c10]/40 group-focus-visible:backdrop-blur-none ${
            isTouched ? "bg-[#0a0c10]/40 backdrop-blur-none" : ""
          }`}
        />
      </div>

      {/* 2. UNHOVERED CENTERED BRAND ACCENT DOT (SINGLE VISIBLE ELEMENT WHEN UNHOVERED) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-50 group-focus-visible:opacity-0 group-focus-visible:scale-50 ${
          isTouched ? "opacity-0 scale-50" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <span
            style={{ backgroundColor: project.accentColor }}
            className="absolute w-12 h-12 rounded-full opacity-40 animate-ping"
          />

          {/* Glowing Center Accent Dot */}
          <span
            style={{
              backgroundColor: project.accentColor,
              boxShadow: `0 0 24px ${project.accentColor}, 0 0 12px ${project.accentColor}`,
            }}
            className="relative w-5 h-5 rounded-full border-2 border-white/80 transition-transform duration-300 group-hover:scale-125"
          />
        </div>
      </div>

      {/* 3. HOVERED OVERLAY CONTENT (BOTTOM-ALIGNED NARRATIVE & LINKS) */}
      <div
        className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:pointer-events-auto ${
          isTouched ? "opacity-100 translate-y-0 pointer-events-auto" : ""
        }`}
      >
        {/* Top Bar: Category Pill Tag & Number */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase">
          <span
            style={{
              backgroundColor: `${project.accentColor}25`,
              color: project.accentColor === "#FFD42A" ? "#FFE885" : project.accentColor,
              borderColor: `${project.accentColor}60`,
            }}
            className="px-3 py-1 rounded-full border font-semibold backdrop-blur-md"
          >
            {project.category}
          </span>

          <span className="font-bold text-white/70 font-mono text-sm">
            {project.number}
          </span>
        </div>

        {/* Bottom Section: Title, Tagline, Links */}
        <div className="space-y-4 pt-6">
          <div>
            <h3
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight mb-2 flex items-center gap-2"
            >
              <span>{project.title}</span>
              {onOpenStory && (
                <Sparkles
                  style={{ color: project.accentColor }}
                  className="w-5 h-5 inline-block opacity-90"
                />
              )}
            </h3>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md font-normal line-clamp-2">
              {project.tagline}
            </p>
          </div>

          {/* Links Bar: View Project & GitHub */}
          <div className="flex items-center justify-between pt-3 border-t border-white/20 font-mono text-xs tracking-widest uppercase">
            <div className="flex items-center gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-1 text-white hover:text-[#FFD42A] font-semibold py-1 transition-colors"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-1 text-white/70 hover:text-white py-1 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </div>

            {onOpenStory && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStory(project.slug);
                }}
                className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white text-white hover:text-black font-semibold transition-all cursor-pointer text-[11px]"
              >
                STORY REEL ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
