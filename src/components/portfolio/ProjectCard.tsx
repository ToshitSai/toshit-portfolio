import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

type DeviceType = "laptop" | "desktop" | "phone" | "tablet" | "cinema";
type DeviceMedia = "desktop" | "mobile";
type MediaFit = "cover" | "contain";

export interface ProjectDeviceConfig {
  id: string;
  type: DeviceType;
  media: DeviceMedia;
  className: string;
  screenAspect: string;
  fit?: MediaFit;
  objectPosition?: string;
  delay?: number;
}

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
  devices: ProjectDeviceConfig[];
}

interface ProjectCardProps {
  project: ProjectCardData;
}

interface ProjectVideoProps {
  active: boolean;
  shouldLoad: boolean;
  project: ProjectCardData;
  device: ProjectDeviceConfig;
}

const ProjectVideo: React.FC<ProjectVideoProps> = ({ active, shouldLoad, project, device }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);
  const sourceSrc = device.media === "mobile" ? project.mobileVideoSrc || project.videoSrc : project.videoSrc;
  const fit = device.fit || "cover";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldReduceMotion || hasError) return;

    if (active && shouldLoad) {
      if (video.dataset.loaded !== "true") {
        video.load();
        video.dataset.loaded = "true";
      }
      video.play().catch(() => video.pause());
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
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        style={{ objectPosition: device.objectPosition || "50% 50%" }}
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
      className={`h-full w-full bg-black ${fit === "contain" ? "object-contain" : "object-cover"}`}
      style={{ objectPosition: device.objectPosition || "50% 50%" }}
    >
      {shouldLoad && <source src={sourceSrc} type={sourceSrc.endsWith(".webm") ? "video/webm" : "video/mp4"} />}
    </video>
  );
};

interface DeviceShellProps {
  active: boolean;
  shouldLoad: boolean;
  project: ProjectCardData;
  device: ProjectDeviceConfig;
  parallaxY: ReturnType<typeof useTransform>;
}

const DeviceShell: React.FC<DeviceShellProps> = ({ active, shouldLoad, project, device, parallaxY }) => {
  const shouldReduceMotion = useReducedMotion();
  const isPhone = device.type === "phone";

  const shellChrome = {
    laptop: "rounded-[18px] border border-black/18 bg-[#101114] p-[7px] shadow-[0_26px_65px_rgba(29,32,36,0.22)] sm:rounded-[24px] sm:p-[9px]",
    desktop: "rounded-[22px] border border-black/16 bg-[#111316] p-[8px] shadow-[0_28px_78px_rgba(29,32,36,0.22)] sm:rounded-[28px] sm:p-[10px]",
    phone: "rounded-[24px] border border-white/20 bg-[#101114] p-[5px] shadow-[0_22px_55px_rgba(29,32,36,0.3)] sm:rounded-[30px] sm:p-[6px]",
    tablet: "rounded-[18px] border border-white/20 bg-[#111316] p-[6px] shadow-[0_24px_60px_rgba(29,32,36,0.25)] sm:rounded-[24px] sm:p-[7px]",
    cinema: "rounded-[26px] border border-black/18 bg-[#090A0D] p-[8px] shadow-[0_34px_85px_rgba(29,32,36,0.24)] sm:rounded-[34px] sm:p-[10px]",
  }[device.type];

  const screenChrome = {
    laptop: "rounded-[12px] sm:rounded-[17px]",
    desktop: "rounded-[15px] sm:rounded-[21px]",
    phone: "rounded-[19px] sm:rounded-[24px]",
    tablet: "rounded-[12px] sm:rounded-[17px]",
    cinema: "rounded-[18px] sm:rounded-[25px]",
  }[device.type];

  return (
    <div aria-hidden="true" className={device.className}>
      <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: isPhone ? 36 : 24, scale: isPhone ? 0.9 : 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.82, delay: device.delay || 0, ease: [0.16, 1, 0.3, 1] }}
      style={{ y: parallaxY }}
      className={`relative w-full ${shellChrome}`}
    >
      {isPhone && <div className="absolute left-1/2 top-[9px] z-10 h-[4px] w-9 -translate-x-1/2 rounded-full bg-white/20" />}
      <div className={`relative overflow-hidden bg-black ${screenChrome}`}>
        <div className={device.screenAspect}>
          <ProjectVideo active={active} shouldLoad={shouldLoad} project={project} device={device} />
        </div>
      </div>
      {device.type === "laptop" && <div className="mx-auto mt-[7px] h-[5px] w-2/5 rounded-full bg-white/14" />}
      {device.type === "desktop" && <div className="mx-auto mt-[8px] hidden h-[4px] w-1/5 rounded-full bg-white/12 sm:block" />}
      </motion.div>
    </div>
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
  const primaryY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [7, -7]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [11, -11]);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { root: null, rootMargin: "420px 0px", threshold: 0 },
    );

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.28);
      },
      { root: null, rootMargin: "-8% 0px -8% 0px", threshold: [0, 0.28, 0.5, 0.75] },
    );

    loadObserver.observe(element);
    playbackObserver.observe(element);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#EFE5D4] px-4 py-8 transition-all duration-700 ease-out group-hover/project:scale-[1.03] group-hover/project:blur-[12px] group-hover/project:brightness-[0.85] group-hover/project:saturate-[0.85] group-focus-visible/project:blur-[12px] group-focus-visible/project:brightness-[0.85] sm:px-8"
    >
      <div
        style={{ background: `radial-gradient(circle at 50% 52%, ${project.accentColor}22, transparent 62%)` }}
        className="absolute inset-0"
      />
      <div className="relative h-full w-full">
        {project.devices.map((device, index) => (
          <DeviceShell
            key={device.id}
            active={active}
            shouldLoad={shouldLoad}
            project={project}
            device={device}
            parallaxY={index === 0 ? primaryY : secondaryY}
          />
        ))}
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const shouldReduceMotion = useReducedMotion();
  const articleRef = useRef<HTMLElement>(null);

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

  return (
    <motion.article
      ref={articleRef}
      style={{ y }}
      className={`w-full ${sizeClass} ${alignmentClass} select-none font-sans`}
    >
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
        className={`group/project relative block w-full ${aspectClass} overflow-hidden rounded-[24px] bg-[#EFE5D4] shadow-[0_20px_60px_rgba(29,32,36,0.1)] outline-none ring-1 ring-[#1D2024]/10 transition-all duration-500 ease-out hover:shadow-[0_30px_80px_rgba(29,32,36,0.16)] focus-visible:ring-2 focus-visible:ring-[#1D2024]/80 sm:rounded-[32px]`}
      >
        <ProjectDeviceScene project={project} />

        <div className="pointer-events-none absolute inset-0 bg-[#F4EDE0]/0 backdrop-blur-[0px] transition-all duration-500 ease-out group-hover/project:bg-[#F4EDE0]/55 group-hover/project:backdrop-blur-md group-focus-visible/project:bg-[#F4EDE0]/55 group-focus-visible/project:backdrop-blur-md" />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center sm:p-10">
          <div className="mb-4 inline-flex translate-y-3 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1D2024] opacity-0 shadow-md transition-all duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100 sm:mb-5">
            <span>VIEW PROJECT</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/project:translate-x-0.5" />
          </div>

          <h3 className="translate-y-4 font-sans text-[clamp(26px,3.6vw,46px)] font-bold uppercase leading-[1.05] tracking-tight text-[#1D2024] opacity-0 drop-shadow-xs transition-all delay-75 duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100">
            {project.title}
          </h3>

          <p className="mt-3 max-w-[460px] translate-y-4 font-sans text-sm font-medium leading-relaxed text-[#1D2024]/85 opacity-0 transition-all delay-150 duration-500 ease-out group-hover/project:translate-y-0 group-hover/project:opacity-100 group-focus-visible/project:translate-y-0 group-focus-visible/project:opacity-100 sm:text-base">
            {project.tagline || project.description}
          </p>
        </div>
      </a>

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
