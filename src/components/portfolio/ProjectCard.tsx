import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Sparkles,
  BookOpen,
  FileCheck,
  Mail,
  Flame,
  Layers,
  CheckCircle2,
  Activity
} from "lucide-react";
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
    if ((e.target as HTMLElement).closest("a")) return;

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

  // Render project-specific visual motif icon/graphic
  const renderMotifGraphic = () => {
    switch (project.motifType) {
      case "course":
        return (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-md">
            <BookOpen className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div className="flex flex-col text-[11px] font-mono leading-none text-indigo-200">
              <span className="font-bold">LESSON MAP</span>
              <span className="text-indigo-400/80">4 Modules Ready</span>
            </div>
          </div>
        );

      case "resume":
        return (
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div className="flex flex-col text-[11px] font-mono leading-none text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold">
                <span>ATS SCORE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </div>
              <div className="w-24 h-1.5 bg-emerald-900/80 rounded-full mt-1 overflow-hidden border border-emerald-500/30">
                <div className="h-full bg-emerald-400 rounded-full w-[92%]" />
              </div>
            </div>
          </div>
        );

      case "greeting":
        return (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/60 border border-rose-500/30 backdrop-blur-md">
            <Mail className="w-5 h-5 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex flex-col text-[11px] font-mono leading-none text-rose-200">
              <span className="font-bold">EMPATHY ENGINE</span>
              <span className="text-rose-400/80">Sub-50ms Inference</span>
            </div>
          </div>
        );

      case "doomsday":
        return (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/70 border border-red-500/40 backdrop-blur-md">
            <Flame className="w-5 h-5 text-[#FF003C] animate-pulse" />
            <div className="flex flex-col text-[11px] font-mono leading-none text-red-200">
              <span className="font-bold tracking-widest text-[#FF003C]">CINEMATIC 3D</span>
              <span className="text-red-400/80">60 FPS Particles</span>
            </div>
          </div>
        );

      case "portfolio":
      default:
        return (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 backdrop-blur-md">
            <Layers className="w-5 h-5 text-amber-400" />
            <div className="flex flex-col text-[11px] font-mono leading-none text-amber-200">
              <span className="font-bold">EDITORIAL UI</span>
              <span className="text-amber-400/80">Design System</span>
            </div>
          </div>
        );
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
      className={`group relative w-full h-[380px] sm:h-[430px] rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD42A] ${
        isTouched ? "is-touched" : ""
      } ${!shouldReduceMotion ? "hover:scale-[1.03] focus-visible:scale-[1.03]" : ""}`}
    >
      {/* Dynamic Brand Accent Glow Border on Hover/Focus */}
      <div
        style={{
          boxShadow: `0 20px 45px ${project.accentGlow}, 0 0 0 2px ${project.accentColor}`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
      />

      {/* 1. BACKGROUND IMAGE WITH FROSTED GLASS BLUR TO SHARP TRANSITION */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0D0F12]">
        <img
          src={project.bgImage}
          alt={`${project.title} screenshot preview`}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none blur-[24px] brightness-65 scale-110 group-hover:blur-0 group-hover:brightness-90 group-hover:scale-100 group-focus-visible:blur-0 group-focus-visible:brightness-90 group-focus-visible:scale-100 ${
            isTouched ? "blur-0 brightness-90 scale-100" : ""
          }`}
        />

        {/* FROSTED GLASS OVERLAY GRADIENT */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0b0d10]/75 backdrop-blur-md group-hover:bg-[#06080a]/45 group-hover:backdrop-blur-none group-focus-visible:bg-[#06080a]/45 group-focus-visible:backdrop-blur-none ${
            isTouched ? "bg-[#06080a]/45 backdrop-blur-none" : ""
          }`}
        />

        {/* Subtle Ambient Sparkle / Glow Orb */}
        <div
          style={{ backgroundColor: project.accentColor }}
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-500"
        />
      </div>

      {/* 2. UNHOVERED CENTERED BRAND ACCENT DOT (SINGLE VISIBLE ELEMENT WHEN UNHOVERED) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-50 group-focus-visible:opacity-0 group-focus-visible:scale-50 ${
          isTouched ? "opacity-0 scale-50" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <span
            style={{ backgroundColor: project.accentColor }}
            className="absolute w-14 h-14 rounded-full opacity-35 animate-ping"
          />

          {/* Glowing Center Accent Dot */}
          <span
            style={{
              backgroundColor: project.accentColor,
              boxShadow: `0 0 26px ${project.accentColor}, 0 0 14px ${project.accentColor}`,
            }}
            className="relative w-5 h-5 rounded-full border-2 border-white/90 transition-transform duration-300 group-hover:scale-125"
          />
        </div>
      </div>

      {/* 3. HOVERED OVERLAY CONTENT (DESIGNS & MOTIFS) */}
      <div
        className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:pointer-events-auto ${
          isTouched ? "opacity-100 translate-y-0 pointer-events-auto" : ""
        }`}
      >
        {/* Top Header: Category Pill & Project Motif Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span
              style={{
                backgroundColor: `${project.accentColor}25`,
                color: project.accentColor === "#FFD42A" ? "#FFE885" : project.accentColor,
                borderColor: `${project.accentColor}60`,
              }}
              className="self-start px-3 py-1 rounded-full border text-[11px] font-mono tracking-widest uppercase font-semibold backdrop-blur-md shadow-xs"
            >
              {project.category}
            </span>
            <span className="text-xs font-mono tracking-wider text-white/60 pl-1 pt-0.5">
              {project.subtitle}
            </span>
          </div>

          {/* Project Specific Graphic Motif */}
          {renderMotifGraphic()}
        </div>

        {/* Bottom Section: Title, Tagline, Tech Badges & Action Links */}
        <div className="space-y-3 pt-4">
          <div>
            <h3
              style={{
                fontFamily: project.motifType === "doomsday" ? "'Inter', sans-serif" : "'Instrument Sans', sans-serif",
              }}
              className={`text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none mb-2 flex items-center gap-2 ${
                project.motifType === "doomsday" ? "uppercase tracking-wider text-[#FF003C]" : ""
              }`}
            >
              <span>{project.title}</span>
              <Sparkles
                style={{ color: project.accentColor }}
                className="w-5 h-5 inline-block opacity-90"
              />
            </h3>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md font-normal line-clamp-2">
              {project.tagline}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px] tracking-wider uppercase border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links Bar: View Project & GitHub & Story Reel */}
          <div className="relative flex items-center justify-between pt-3 border-t border-white/20 font-mono text-xs tracking-widest uppercase">
            {/* Animated Underline Effect for Doomsday or Accent Projects */}
            <div
              style={{ backgroundColor: project.accentColor }}
              className="absolute top-0 left-0 h-[1.5px] w-12 group-hover:w-full transition-all duration-700 ease-out"
            />

            <div className="flex items-center gap-3">
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
