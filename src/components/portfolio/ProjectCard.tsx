import React, { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

export interface ProjectCardData {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  accentColor: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  bgImage: string;
  tileSize: "feature" | "wide" | "tall" | "compact";
  alignment: "left" | "center" | "right";
  imagePosition: string;
  mobileImagePosition?: string;
}

interface ProjectCardProps {
  project: ProjectCardData;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const shouldReduceMotion = useReducedMotion();
  const articleRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [14, -14]);

  const alignmentClass = {
    left: "lg:mr-auto",
    center: "lg:mx-auto",
    right: "lg:ml-auto",
  }[project.alignment];

  const sizeClass = {
    feature: "lg:w-[78%] xl:w-[72%]",
    wide: "lg:w-[66%] xl:w-[61%]",
    tall: "lg:w-[52%] xl:w-[48%]",
    compact: "lg:w-[46%] xl:w-[42%]",
  }[project.tileSize];

  const aspectClass = {
    feature: "aspect-[1.08/1] sm:aspect-[1.45/1]",
    wide: "aspect-[1.02/1] sm:aspect-[1.7/1]",
    tall: "aspect-[0.92/1] sm:aspect-[1.05/1]",
    compact: "aspect-[0.98/1] sm:aspect-[1.22/1]",
  }[project.tileSize];

  const animateParallax = useCallback(() => {
    if (shouldReduceMotion) return;

    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;

    const { x, y } = currentPos.current;
    if (imageRef.current && tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const px = (x / rect.width - 0.5) * 8;
      const py = (y / rect.height - 0.5) * 8;
      imageRef.current.style.transform = `translate3d(${px}px, ${py}px, 0) scale(1.03)`;
    }

    if (
      Math.abs(targetPos.current.x - currentPos.current.x) > 0.1 ||
      Math.abs(targetPos.current.y - currentPos.current.y) > 0.1
    ) {
      rafId.current = requestAnimationFrame(animateParallax);
    } else {
      rafId.current = null;
    }
  }, [shouldReduceMotion]);

  const startAnimation = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(animateParallax);
    }
  }, [animateParallax]);

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !tileRef.current || event.pointerType === "touch") return;

    const rect = tileRef.current.getBoundingClientRect();
    targetPos.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    startAnimation();
  };

  const handlePointerLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "";
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <motion.article
      ref={articleRef}
      style={{ y }}
      className={`w-full ${sizeClass} ${alignmentClass} select-none font-sans`}
    >
      <a
        ref={tileRef}
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`group/project relative block w-full ${aspectClass} overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#EFE5D4] shadow-[0_20px_60px_rgba(29,32,36,0.1)] outline-none ring-1 ring-[#1D2024]/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_30px_80px_rgba(29,32,36,0.16)] focus-visible:ring-2 focus-visible:ring-[#1D2024]/80`}
      >
        {/* 1. REAL PROJECT SCREENSHOT BACKGROUND (BLURS & SCALES ON HOVER) */}
        <img
          ref={imageRef}
          src={project.bgImage}
          alt={`${project.title} project screenshot`}
          loading="lazy"
          style={{
            "--mobile-position": project.mobileImagePosition || project.imagePosition,
            "--project-position": project.imagePosition,
          } as React.CSSProperties}
          className="h-full w-full object-cover [object-position:var(--mobile-position)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:scale-[1.03] group-hover/project:blur-[12px] group-hover/project:brightness-[0.85] group-hover/project:saturate-[0.85] group-focus-visible/project:blur-[12px] group-focus-visible/project:brightness-[0.85] sm:[object-position:var(--project-position)]"
        />

        {/* 2. SUBTLE WARM TRANSLUCENT OVERLAY LAYER */}
        <div className="pointer-events-none absolute inset-0 bg-[#F4EDE0]/0 backdrop-blur-[0px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:bg-[#F4EDE0]/55 group-hover/project:backdrop-blur-md group-focus-visible/project:bg-[#F4EDE0]/55 group-focus-visible/project:backdrop-blur-md" />

        {/* 3. UNIFIED CENTERED HOVER COMPOSITION */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center">
          {/* A. SINGLE TOP PILL BUTTON */}
          <div className="mb-4 sm:mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1D2024] shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-3 opacity-0 group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100">
            <span>VIEW PROJECT</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/project:translate-x-0.5" />
          </div>

          {/* B. CENTERED SANS-SERIF PROJECT TITLE */}
          <h3 className="font-sans font-bold uppercase tracking-tight text-[#1D2024] text-[clamp(26px,3.6vw,46px)] leading-[1.05] drop-shadow-xs transition-all duration-500 delay-[70ms] ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-4 opacity-0 group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100">
            {project.title}
          </h3>

          {/* C. CONCISE 1-2 LINE DESCRIPTION */}
          <p className="mt-3 max-w-[460px] font-sans font-medium text-sm sm:text-base leading-relaxed text-[#1D2024]/85 transition-all duration-500 delay-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-4 opacity-0 group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100">
            {project.tagline || project.description}
          </p>
        </div>
      </a>

      {/* 4. BOTTOM COMPACT METADATA (OUTSIDE HOVER AREA) */}
      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D2024]/58">
            <span style={{ color: project.accentColor }}>{project.number}</span>
            <span>{project.title}</span>
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[#1D2024]/72 sm:text-[15px]">
            {project.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1D2024]/62">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#1D2024] transition-colors hover:text-black"
          >
            Live
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[#1D2024]"
          >
            <Github className="h-3.5 w-3.5" />
            Code
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
