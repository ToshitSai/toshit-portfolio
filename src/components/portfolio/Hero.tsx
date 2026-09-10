import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { HERO_EXIT, motionDistance } from "@/lib/scrollMotion";

const HERO_WORDS = [
  "AI-POWERED",
  "FULL STACK",
  "CREATIVE",
  "PROMPT",
  "AI BUILDER",
];

const RotatingHeroWord: React.FC = React.memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2100); // 1.6s hold + 0.5s transition
    return () => clearInterval(timer);
  }, []);

  const currentWord = HERO_WORDS[index];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Line 1: Dedicated Fixed Height Overlapping Word Viewport */}
      <div className="relative w-full h-[1.15em] min-h-[36px] xs:min-h-[42px] sm:min-h-[85px] md:min-h-[105px] overflow-hidden flex items-center justify-center text-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentWord}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-x-0 text-center text-[#FFD42A] font-serif font-normal tracking-[-0.02em] whitespace-nowrap block drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Line 2: Permanent Static DEVELOPER Line */}
      <span className="text-[#20252B] block drop-shadow-sm font-serif font-normal tracking-[-0.02em]">
        DEVELOPER
      </span>
    </div>
  );
});

interface NowBuildingProject {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

const NOW_BUILDING_PROJECTS: NowBuildingProject[] = [
  {
    id: "nova",
    title: "NOVA",
    subtitle: "AI desktop & voice automation assistant",
    url: "https://github.com/ToshitSai",
  },
  {
    id: "courseforge",
    title: "CourseForge",
    subtitle: "AI-powered course generation platform",
    url: "https://courseforge-ai-pied.vercel.app/",
  },
  {
    id: "hirescope",
    title: "HireScope",
    subtitle: "AI-powered portfolio & resume analysis",
    url: "https://job-gem-grader.vercel.app/",
  },
  {
    id: "greetly",
    title: "Greetly",
    subtitle: "Personalized AI video & message generator",
    url: "https://toshit-greetly.vercel.app",
  },
];

const Hero: React.FC = () => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Interactive Now Building Card State
  const [projectIndex, setProjectIndex] = useState(0);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  const [leftDiscHovered, setLeftDiscHovered] = useState(false);
  const [rightDiscHovered, setRightDiscHovered] = useState(false);
  const [isAutoRotatePaused, setIsAutoRotatePaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Lightweight section entrance & scroll exit transforms
  const heroTitleY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -30]);
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.85]);
  const heroSupportingY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -18]);
  const heroBackgroundY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -10]);
  const heroCloudsY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -15]);
  const heroSunY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -12]);
  const heroDecorY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -14]);
  const heroWaveY = useTransform(scrollYProgress, [0.35, 1], shouldReduceMotion ? [0, 0] : [0, -14]);

  // Automatic Project Rotation (every 4.5s, pauses on manual interaction)
  useEffect(() => {
    if (isAutoRotatePaused || isCardHovered) return;
    const interval = setInterval(() => {
      setProjectIndex((prev) => (prev + 1) % NOW_BUILDING_PROJECTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotatePaused, isCardHovered]);

  const pauseAutoRotate = () => {
    setIsAutoRotatePaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsAutoRotatePaused(false);
    }, 5000);
  };

  const handlePrevProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    pauseAutoRotate();
    setProjectIndex((prev) => (prev === 0 ? NOW_BUILDING_PROJECTS.length - 1 : prev - 1));
  };

  const handleNextProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    pauseAutoRotate();
    setProjectIndex((prev) => (prev === NOW_BUILDING_PROJECTS.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    const currentProj = NOW_BUILDING_PROJECTS[projectIndex];
    if (currentProj?.url) {
      window.open(currentProj.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDownCard = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevProject();
    } else if (e.key === "ArrowRight") {
      handleNextProject();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const currentProject = NOW_BUILDING_PROJECTS[projectIndex];

  return (
    <motion.section
      ref={heroRef}
      className="relative w-full min-h-[100svh] sm:min-h-[580px] max-h-[880px] overflow-hidden flex flex-col justify-between select-none studio-noise-bg border-b border-[#20252B]/10"
    >
      {/* Background layer — slowest parallax */}
      <motion.div
        aria-hidden="true"
        style={{
          y: heroBackgroundY,
          background: "linear-gradient(180deg, #7EB8E8 0%, #A9D3F0 45%, #5B9BD5 100%)",
        }}
        className="absolute inset-0 z-0"
      />
      {/* SVG Noise Overlay */}
      <svg className="pointer-events-none absolute inset-0 opacity-[0.035] w-full h-full z-0">
        <filter id="studio-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#studio-noise)" />
      </svg>

      {/* Top spacing spacer for floating navbar */}
      <div className="pt-20 sm:pt-24" />

      {/* BACKGROUND SCENERY & MULTI-LAYER PARALLAX GRAPHICS */}
      <motion.div style={{ y: heroBackgroundY }} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Patterned Yellow Sun Graphic */}
        <motion.div
          style={{ y: heroSunY }}
          className="absolute top-16 right-2 sm:top-20 sm:right-8 md:right-16 w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28"
        >
          <div className="w-full h-full rounded-full bg-[#FFD42A] p-1 sm:p-2 shadow-xl opacity-95 animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-dashed border-[#20252B]/30 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-[radial-gradient(#20252B_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-40" />
            </div>
          </div>
        </motion.div>

        {/* Organic Cutout Cloud Left */}
        <motion.div
          style={{ y: heroCloudsY }}
          className="absolute top-[16%] sm:top-[28%] left-[1%] sm:left-[4%] w-14 sm:w-28 md:w-36"
        >
          <div>
            <svg viewBox="0 0 160 90" fill="none" className="w-full drop-shadow-sm filter">
              <path
                d="M20 70 C 10 70, 0 60, 0 45 C 0 32, 10 20, 25 20 C 35 10, 55 5, 75 15 C 85 5, 115 5, 130 20 C 145 20, 160 30, 160 45 C 160 60, 145 70, 130 70 Z"
                fill="#FFF8E8"
              />
            </svg>
          </div>
        </motion.div>

        {/* Organic Cutout Cloud Right */}
        <motion.div
          style={{ y: heroCloudsY }}
          className="absolute top-[10%] sm:top-[22%] right-[1%] sm:right-[2%] md:right-[8%] lg:right-[10%] w-20 sm:w-36 md:w-[220px] lg:w-[250px]"
        >
          <div>
            <svg viewBox="0 0 200 110" fill="none" className="w-full drop-shadow-md filter">
              <path
                d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
                fill="#FFF8E8"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* MAIN HERO CONTENT AREA */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-1 sm:pt-4 pb-2 sm:pb-6 flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          style={{ y: heroTitleY, opacity: heroTitleOpacity }}
          className="w-full max-w-[780px] flex flex-col items-center relative"
        >
          {/* Vertical Side Tagline directly beside the main display headline */}
          <div className="absolute left-0 sm:left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
            <span className="inline-block text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-white font-bold uppercase -rotate-90 origin-center whitespace-nowrap drop-shadow-sm">
              DESIGN / DETAILS / CODE
            </span>
          </div>

          {/* Eyebrow Badge Pill above Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-xs mb-3 sm:mb-4 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-white font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD42A] animate-pulse" />
            <span>HELLO, I'M TOSHIT SAI GALAM. A —</span>
          </motion.div>

          {/* Display Headline with Staggered Entrance Reveal */}
          <motion.h1
            initial={{ clipPath: "inset(100% 0 0 0)", y: 40 }}
            animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center text-[#20252B] font-serif font-normal text-[clamp(2.1rem,7.5vw,6.2rem)] leading-[0.92] tracking-[-0.02em] mb-4 sm:mb-6 flex flex-col items-center justify-center"
          >
            <RotatingHeroWord />
          </motion.h1>

          {/* Centered Interactive Now Building Card */}
          <motion.div
            style={{ y: heroSupportingY }}
            data-cursor="now-building"
            tabIndex={0}
            role="region"
            aria-label="Interactive Now Building Portfolio Easter Egg"
            onKeyDown={handleKeyDownCard}
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
            className="group/card w-[calc(100%-24px)] xs:w-[calc(100%-32px)] sm:w-full max-w-[460px] bg-[#FFF8E8] rounded-full p-1.5 sm:p-3 px-3 sm:px-5 shadow-2xl border border-white/80 flex items-center justify-between gap-1.5 cursor-pointer relative select-none focus:outline-none focus:ring-2 focus:ring-[#FFD42A]"
          >
            {/* LEFT VINYL DISC (PREVIOUS PROJECT) */}
            <div className="relative flex-shrink-0 z-20">
              <button
                type="button"
                onClick={handlePrevProject}
                onMouseEnter={() => setLeftDiscHovered(true)}
                onMouseLeave={() => setLeftDiscHovered(false)}
                aria-label="Previous Project"
                className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#20252B] flex items-center justify-center shadow-md transition-all duration-300 transform focus:outline-none ${leftDiscHovered
                  ? "-rotate-12 scale-110 shadow-lg"
                  : isCardHovered
                    ? "animate-[spin_6s_linear_infinite]"
                    : "animate-[spin_12s_linear_infinite]"
                  }`}
              >
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD42A] transition-shadow duration-300 ${leftDiscHovered ? "shadow-[0_0_8px_#FFD42A]" : ""
                    }`}
                />
              </button>

              {/* PREV Tooltip */}
              <AnimatePresence>
                {leftDiscHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 4, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#20252B] text-[#FFD42A] text-[9px] font-mono font-bold tracking-widest uppercase shadow-md pointer-events-none whitespace-nowrap z-30"
                  >
                    PREV
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* CENTER CONTENT AREA (DYNAMIC PROJECT INFO + CLICKABLE URL) */}
            <div
              onClick={handleCardClick}
              onMouseEnter={() => setIsCenterHovered(true)}
              onMouseLeave={() => setIsCenterHovered(false)}
              className="flex-1 text-center px-1 overflow-hidden h-[34px] sm:h-[38px] flex flex-col justify-center relative cursor-pointer z-10"
            >
              <div className="text-[8.5px] xs:text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#4A525D] font-bold">
                NOW BUILDING
              </div>

              {/* PROJECT TITLE & SUBTITLE ANIMATED VIEWPORT */}
              <div className="relative h-[20px] sm:h-[20px] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProject.id}
                    initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center gap-1.5"
                  >
                    <span className="text-[10.5px] xs:text-[11px] sm:text-sm font-sans font-bold text-[#20252B] leading-tight truncate">
                      {currentProject.title}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-sans text-[#20252B]/70 truncate">
                      — {currentProject.subtitle}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* VIEW PROJECT ↗ HOVER OVERLAY */}
                <AnimatePresence>
                  {isCenterHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-[#FFF8E8] flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#20252B] shadow-xs z-20"
                    >
                      <span className="text-[#20252B] underline decoration-[#FFD42A] underline-offset-2">VIEW PROJECT</span>
                      <span className="text-[#FFD42A] font-extrabold">↗</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT VINYL DISC (NEXT PROJECT) */}
            <div className="relative flex-shrink-0 z-20">
              <button
                type="button"
                onClick={handleNextProject}
                onMouseEnter={() => setRightDiscHovered(true)}
                onMouseLeave={() => setRightDiscHovered(false)}
                aria-label="Next Project"
                className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#20252B] flex items-center justify-center shadow-md transition-all duration-300 transform focus:outline-none ${rightDiscHovered
                  ? "rotate-12 scale-110 shadow-lg"
                  : isCardHovered
                    ? "animate-[spin_6s_linear_infinite]"
                    : "animate-[spin_12s_linear_infinite]"
                  }`}
              >
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD42A] transition-shadow duration-300 ${rightDiscHovered ? "shadow-[0_0_8px_#FFD42A]" : ""
                    }`}
                />
              </button>

              {/* NEXT Tooltip */}
              <AnimatePresence>
                {rightDiscHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 4, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#20252B] text-[#FFD42A] text-[9px] font-mono font-bold tracking-widest uppercase shadow-md pointer-events-none whitespace-nowrap z-30"
                  >
                    NEXT
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM SCROLL INDICATOR & BOUNCING ARROW */}
      <motion.div style={{ y: heroDecorY }} className="relative z-20 w-full flex flex-col items-center pb-1">
        <a
          href="#about"
          className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#20252B] font-bold hover:text-[#FFF8E8] transition-colors mb-1 bg-white/30 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/40 shadow-sm"
        >
          <span>SCROLL TO WORK</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </a>

        {/* Organic Rolling Waves Transition to Cream Background */}
        <motion.div
          style={{ y: heroWaveY }}
          className="w-full h-8 sm:h-16 relative overflow-hidden pointer-events-none"
        >
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,70L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="#FFF8E8"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
