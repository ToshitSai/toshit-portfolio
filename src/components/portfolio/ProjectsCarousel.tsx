import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Github, ArrowUpRight } from "lucide-react";

export interface CarouselProjectItem {
  id: string;
  number: string;
  category: string;
  titleMain: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  PreviewComponent: React.FC;
}

interface ProjectsCarouselProps {
  projects: CarouselProjectItem[];
  autoRotate?: boolean;
  rotateInterval?: number; // duration in ms, default 5000ms
  onOpenStory?: (slug: string) => void;
}

export const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({
  projects,
  autoRotate = true,
  rotateInterval = 5000,
  onOpenStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 for next, -1 for prev
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Advance to next slide
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, [projects.length]);

  // Go to previous slide
  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Direct jump to slide
  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Toggle Play / Pause
  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  // Auto-rotation timer effect
  useEffect(() => {
    if (!autoRotate || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [autoRotate, isPaused, rotateInterval, nextSlide]);

  // Keyboard Navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === " ") {
      e.preventDefault();
      togglePlayPause();
    }
  };

  const currentProject = projects[currentIndex];
  const PreviewComp = currentProject.PreviewComponent;

  // Slide Animation Variants (Hardware-Accelerated GPU composited)
  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? "3%" : "-3%",
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // Power3 ease-out
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? "-3%" : "3%",
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Projects Interactive Showcase Carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full rounded-2xl border border-[#1D2024]/15 bg-[#F4EDE0] p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-[#1D2024]/40"
    >
      {/* 1. TOP HEADER CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#1D2024]/10 pb-6">
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm tracking-[0.18em] text-[#1D2024]/80 uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] inline-block animate-pulse" />
          <span className="font-bold text-[#1D2024]">PROJECT {currentProject.number} OF {projects.length}</span>
          <span className="text-[#1D2024]/30">//</span>
          <span className="text-[#1D2024]/70 font-semibold">{currentProject.category}</span>
        </div>

        {/* MANUAL CONTROLS & AUTO-PLAY TOGGLE */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPaused ? "Start carousel auto-rotation" : "Pause carousel auto-rotation"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1D2024]/20 bg-white/60 hover:bg-white text-[#1D2024] font-mono text-xs tracking-wider transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1D2024]"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden xs:inline">{isPaused ? "PLAY" : "PAUSE"}</span>
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous project slide"
            className="p-2 rounded-lg border border-[#1D2024]/20 bg-white/60 hover:bg-white text-[#1D2024] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1D2024]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next project slide"
            className="p-2 rounded-lg border border-[#1D2024]/20 bg-white/60 hover:bg-white text-[#1D2024] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1D2024]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. AUTO-ROTATE PROGRESS BAR INDICATOR */}
      <div className="w-full h-1 bg-[#1D2024]/10 rounded-full overflow-hidden mb-8">
        <motion.div
          key={`${currentIndex}-${isPaused}`}
          initial={{ width: "0%" }}
          animate={{ width: isPaused || !autoRotate ? "0%" : "100%" }}
          transition={{
            duration: isPaused || !autoRotate ? 0 : rotateInterval / 1000,
            ease: "linear",
          }}
          className="h-full bg-[#1D2024]/70 origin-left"
        />
      </div>

      {/* 3. CAROUSEL SLIDE CONTAINER WITH LIVE REGION */}
      <div
        aria-live={isPaused || !autoRotate ? "polite" : "off"}
        aria-atomic="true"
        className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[420px] w-full"
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentProject.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            role="group"
            aria-roledescription="slide"
            aria-label={`Project ${currentIndex + 1} of ${projects.length}: ${currentProject.titleMain}`}
            style={{ willChange: "transform, opacity" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <h3
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                  className="text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1D2024] mb-3"
                >
                  {currentProject.titleMain}
                </h3>

                <p
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                  className="text-base sm:text-lg leading-[1.5] text-[#1D2024]/85 max-w-[500px]"
                >
                  {currentProject.description}
                </p>
              </div>

              {/* Tech Stack Tags */}
              <div className="font-mono text-xs tracking-wider text-[#1D2024]/60 uppercase flex flex-wrap gap-x-3 gap-y-1">
                {currentProject.tech.map((t, idx) => (
                  <React.Fragment key={t}>
                    <span>{t}</span>
                    {idx < currentProject.tech.length - 1 && (
                      <span className="text-[#1D2024]/30">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Editorial Underline Links */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-xs tracking-widest font-semibold uppercase pt-2">
                {onOpenStory && (
                  <button
                    type="button"
                    onClick={() => onOpenStory(currentProject.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D2024] text-[#F8F2E6] hover:bg-black transition-all cursor-pointer shadow-xs"
                  >
                    <span>VIEW STORY</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FFD42A]" />
                  </button>
                )}

                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative inline-flex items-center gap-1.5 text-[#1D2024] hover:text-black py-1"
                >
                  <span>LIVE DEMO</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1D2024] transition-all origin-left scale-x-100 group-hover/link:scale-x-110" />
                </a>

                <a
                  href={currentProject.githubUrl}
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

            {/* Right Interactive Preview Graphic Column */}
            <div className="lg:col-span-6 w-full">
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3 }}
                onClick={() => onOpenStory && onOpenStory(currentProject.id)}
                className="w-full rounded-xl overflow-hidden shadow-sm cursor-pointer group/preview relative"
              >
                <PreviewComp />
                {onOpenStory && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold tracking-widest uppercase shadow-lg">
                      CLICK TO OPEN STORY ↗
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM DOT INDICATORS & KEYBOARD INSTRUCTIONS */}
      <div className="flex items-center justify-between pt-8 border-t border-[#1D2024]/10 mt-8">
        <div className="flex items-center gap-2">
          {projects.map((proj, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${proj.titleMain}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-[#1D2024]"
                    : "w-2.5 bg-[#1D2024]/25 hover:bg-[#1D2024]/50"
                }`}
              />
            );
          })}
        </div>

        <span className="hidden sm:inline-block font-mono text-[11px] tracking-widest text-[#1D2024]/50 uppercase">
          USE ← → KEYS TO NAVIGATE // SPACE TO PAUSE
        </span>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
