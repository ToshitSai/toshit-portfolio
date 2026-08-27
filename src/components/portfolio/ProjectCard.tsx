import React, { useCallback, useEffect, useRef, useState } from "react";
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
  videoSrc: string;
  mobileVideoSrc?: string;
  tileSize: "feature" | "wide" | "tall" | "compact";
  alignment: "left" | "center" | "right";
  imagePosition: string;
  mobileImagePosition?: string;
  composition: "laptop-left" | "laptop-right" | "desktop-center" | "portfolio-duo" | "cinematic";
}

interface ProjectCardProps {
  project: ProjectCardData;
}

interface DeviceFrameProps {
  className: string;
  children: React.ReactNode;
  kind?: "laptop" | "desktop" | "phone" | "tablet";
  delay?: number;
  style?: React.ComponentProps<typeof motion.div>["style"];
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ className, children, kind = "laptop", delay = 0, style }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: kind === "phone" ? 38 : 24, scale: kind === "phone" ? 0.92 : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ProjectVideoProps {
  active: boolean;
  shouldLoad: boolean;
  project: ProjectCardData;
  className?: string;
  fit?: "cover" | "contain";
  sourceSrc?: string;
}

const ProjectVideo: React.FC<ProjectVideoProps> = ({
  active,
  shouldLoad,
  project,
  className = "",
  fit = "cover",
  sourceSrc = project.videoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldReduceMotion || hasError) return;

    if (active && shouldLoad) {
      if (video.dataset.loaded !== "true") {
        video.load();
        video.dataset.loaded = "true";
      }
      const playPromise = video.play();
      playPromise?.catch(() => {
        video.pause();
      });
      return;
    }

    video.pause();
  }, [active, hasError, shouldLoad, shouldReduceMotion]);

  if (shouldReduceMotion || hasError) {
    return (
      <img
        src={project.bgImage}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
        style={{ objectPosition: project.imagePosition }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      muted
      playsInline
      loop
      controls={false}
      preload="metadata"
      poster={project.bgImage}
      onError={() => setHasError(true)}
      className={`h-full w-full bg-black ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    >
      {shouldLoad && <source src={sourceSrc} type={sourceSrc.endsWith(".webm") ? "video/webm" : "video/mp4"} />}
    </video>
  );
};

const ProjectDeviceScene: React.FC<{ project: ProjectCardData }> = ({ project }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [active, setActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const primaryY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [8, -8]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [12, -12]);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      {
        root: null,
        rootMargin: "450px 0px",
        threshold: 0,
      },
    );

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.28);
      },
      {
        root: null,
        rootMargin: "-8% 0px -8% 0px",
        threshold: [0, 0.28, 0.5, 0.75],
      },
    );

    loadObserver.observe(element);
    playbackObserver.observe(element);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, []);

  const video = (fit: "cover" | "contain" = "cover", className = "", sourceSrc = project.videoSrc) => (
    <ProjectVideo active={active} shouldLoad={shouldLoad} project={project} fit={fit} className={className} sourceSrc={sourceSrc} />
  );

  const laptop = (
    <DeviceFrame
      kind="laptop"
      delay={0}
      className="relative z-10 w-[84%] overflow-hidden rounded-[18px] border border-black/18 bg-[#101114] p-[7px] shadow-[0_28px_70px_rgba(29,32,36,0.24)] sm:rounded-[24px] sm:p-[9px]"
    >
      <div className="overflow-hidden rounded-[12px] bg-black sm:rounded-[17px]">
        <div className="aspect-[16/9] w-full">{video("cover")}</div>
      </div>
      <div className="mx-auto mt-[7px] h-[5px] w-2/5 rounded-full bg-white/14" />
    </DeviceFrame>
  );

  const desktop = (
    <DeviceFrame
      kind="desktop"
      delay={0}
      className="relative z-10 w-[88%] overflow-hidden rounded-[22px] border border-black/16 bg-[#111316] p-[8px] shadow-[0_30px_85px_rgba(29,32,36,0.24)] sm:rounded-[28px] sm:p-[10px]"
    >
      <div className="overflow-hidden rounded-[15px] bg-black sm:rounded-[21px]">
        <div className="aspect-[16/9] w-full">{video("cover")}</div>
      </div>
    </DeviceFrame>
  );

  const phone = (className: string, delay = 0.12) => (
    <DeviceFrame
      kind="phone"
      delay={delay}
      style={{ y: secondaryY }}
      className={`absolute z-20 w-[22%] min-w-[82px] max-w-[168px] rounded-[22px] border border-white/18 bg-[#101114] p-[5px] shadow-[0_22px_55px_rgba(29,32,36,0.32)] sm:rounded-[30px] sm:p-[6px] ${className}`}
    >
      <div className="absolute left-1/2 top-[9px] z-10 h-[4px] w-9 -translate-x-1/2 rounded-full bg-white/20" />
      <div className="overflow-hidden rounded-[17px] bg-black sm:rounded-[24px]">
        <div className="aspect-[9/17] w-full">{video("cover", "", project.mobileVideoSrc || project.videoSrc)}</div>
      </div>
    </DeviceFrame>
  );

  const tablet = (className: string, delay = 0.14) => (
    <DeviceFrame
      kind="tablet"
      delay={delay}
      style={{ y: secondaryY }}
      className={`absolute z-20 w-[34%] min-w-[126px] max-w-[245px] rounded-[18px] border border-white/18 bg-[#111316] p-[6px] shadow-[0_24px_60px_rgba(29,32,36,0.28)] sm:rounded-[24px] sm:p-[7px] ${className}`}
    >
      <div className="overflow-hidden rounded-[12px] bg-black sm:rounded-[17px]">
        <div className="aspect-[4/5] w-full">{video("contain")}</div>
      </div>
    </DeviceFrame>
  );

  const composition = (() => {
    switch (project.composition) {
      case "laptop-left":
        return (
          <>
            <motion.div style={{ y: primaryY }} className="flex w-full justify-center sm:justify-end">
              {laptop}
            </motion.div>
            {phone("bottom-[8%] left-[5%] -rotate-[3deg] sm:bottom-[7%] sm:left-[8%]")}
          </>
        );
      case "laptop-right":
        return (
          <>
            <motion.div style={{ y: primaryY }} className="flex w-full justify-center sm:justify-start">
              {laptop}
            </motion.div>
            {phone("bottom-[7%] right-[4%] rotate-[3deg] sm:right-[8%]")}
          </>
        );
      case "desktop-center":
        return (
          <>
            <motion.div style={{ y: primaryY }} className="flex w-full justify-center">
              {desktop}
            </motion.div>
            {phone("bottom-[4%] left-1/2 -translate-x-1/2 rotate-[2deg]")}
          </>
        );
      case "portfolio-duo":
        return (
          <>
            <motion.div style={{ y: primaryY }} className="flex w-full justify-center">
              {desktop}
            </motion.div>
            {phone("bottom-[6%] left-[5%] -rotate-[4deg] sm:left-[8%]", 0.1)}
            {phone("bottom-[10%] right-[4%] hidden rotate-[4deg] sm:block sm:right-[8%]", 0.18)}
          </>
        );
      case "cinematic":
        return (
          <>
            <motion.div style={{ y: primaryY }} className="flex w-full justify-center">
              {desktop}
            </motion.div>
            {tablet("bottom-[2%] right-[4%] rotate-[3deg] sm:right-[7%]")}
          </>
        );
      default:
        return (
          <motion.div style={{ y: primaryY }} className="flex w-full justify-center">
            {laptop}
          </motion.div>
        );
    }
  })();

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#EFE5D4] px-4 py-8 transition-all duration-700 ease-out group-hover/project:scale-[1.03] group-hover/project:blur-[12px] group-hover/project:brightness-[0.85] group-hover/project:saturate-[0.85] group-focus-visible/project:blur-[12px] group-focus-visible/project:brightness-[0.85] sm:px-8"
    >
      <div
        style={{
          background: `radial-gradient(circle at 50% 52%, ${project.accentColor}24, transparent 62%)`,
        }}
        className="absolute inset-0"
      />
      <div className="relative flex h-full w-full items-center justify-center">{composition}</div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const shouldReduceMotion = useReducedMotion();
  const articleRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLAnchorElement>(null);
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
        className={`group/project relative block w-full ${aspectClass} overflow-hidden rounded-[24px] bg-[#EFE5D4] shadow-[0_20px_60px_rgba(29,32,36,0.1)] outline-none ring-1 ring-[#1D2024]/10 transition-all duration-500 ease-out hover:shadow-[0_30px_80px_rgba(29,32,36,0.16)] focus-visible:ring-2 focus-visible:ring-[#1D2024]/80 sm:rounded-[32px]`}
      >
        <ProjectDeviceScene project={project} />

        {/* 2. SUBTLE WARM TRANSLUCENT OVERLAY LAYER */}
        <div className="pointer-events-none absolute inset-0 bg-[#F4EDE0]/0 backdrop-blur-[0px] transition-all duration-500 ease-out group-hover/project:bg-[#F4EDE0]/55 group-hover/project:backdrop-blur-md group-focus-visible/project:bg-[#F4EDE0]/55 group-focus-visible/project:backdrop-blur-md" />

        {/* 3. UNIFIED CENTERED HOVER COMPOSITION */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center sm:p-10">
          {/* A. SINGLE TOP PILL BUTTON */}
          <div className="mb-4 inline-flex translate-y-3 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1D2024] opacity-0 shadow-md transition-all duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100 sm:mb-5">
            <span>VIEW PROJECT</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/project:translate-x-0.5" />
          </div>

          {/* B. CENTERED SANS-SERIF PROJECT TITLE */}
          <h3 className="translate-y-4 font-sans text-[clamp(26px,3.6vw,46px)] font-bold uppercase leading-[1.05] tracking-tight text-[#1D2024] opacity-0 drop-shadow-xs transition-all delay-75 duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100">
            {project.title}
          </h3>

          {/* C. CONCISE 1-2 LINE DESCRIPTION */}
          <p className="mt-3 max-w-[460px] translate-y-4 font-sans text-sm font-medium leading-relaxed text-[#1D2024]/85 opacity-0 transition-all delay-150 duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100 sm:text-base">
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
