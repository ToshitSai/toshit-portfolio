import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface TestimonialItem {
  id: string;
  badge: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

const testimonialsData: TestimonialItem[] = [
  {
    id: "rec-1",
    badge: "RS",
    name: "Riya Sharma",
    role: "AI Research Intern",
    company: "Pixel Mind",
    quote: "What impressed me most was how quickly Toshit moved from an idea to a working AI application with a thoughtful interface.",
  },
  {
    id: "rec-2",
    badge: "AK",
    name: "Arjun Kapoor",
    role: "Senior Engineer",
    company: "NIAT Faculty",
    quote: "Solid grasp of system design for someone early in their degree — the API architecture on CourseForge held up well under review.",
  },
  {
    id: "rec-3",
    badge: "AM",
    name: "Arjun Mehta",
    role: "Product Engineer",
    company: "Nova Labs",
    quote: "Toshit has a strong instinct for turning AI ideas into polished, usable products. The combination of experimentation and web engineering really stands out.",
  },
  {
    id: "rec-4",
    badge: "KM",
    name: "Karan Malhotra",
    role: "Software Engineer",
    company: "BuildCraft",
    quote: "Toshit brings together modern AI tools, frontend development, and practical problem solving in a way that feels genuinely product-focused.",
  },
  {
    id: "rec-5",
    badge: "NK",
    name: "Ananya Kapoor",
    role: "Product Designer",
    company: "Orbit Studio",
    quote: "The work feels both technical and creative. Toshit pays attention to interaction, presentation, and the actual usefulness of what he builds.",
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Timer & Touch Swipe Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = testimonialsData.length;

  // Single Source of Truth Navigation Helpers
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
    resetTimer();
  }, [total, resetTimer]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    resetTimer();
  }, [total, resetTimer]);

  const goToIndex = useCallback((idx: number) => {
    setActiveIndex(idx);
    resetTimer();
  }, [resetTimer]);

  // Keyboard Navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Page Visibility Listener (Pause rotation when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Automatic Rotation System (4.8s Display Hold Interval)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4800);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, shouldReduceMotion, total]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger horizontal swipe only when X movement dominates vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const current = testimonialsData[activeIndex];

  return (
    <section
      id="feedback"
      className="relative w-full py-20 sm:py-28 lg:py-32 font-sans select-none overflow-hidden bg-[#FFF8E8] text-[#1D2024] border-t border-[#1D2024]/10"
      aria-label="Recommendations and feedback"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ATMOSPHERIC DECORATIVE CANVAS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#FFD42A]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1D2024_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />
      </div>

      <div className="max-w-[1120px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

        {/* 1. SECTION LABEL & EDITORIAL HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFD42A] inline-block shadow-xs" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1D2024]/60 font-semibold">
              ● WORDS FROM OTHERS
            </span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-tight text-[#1D2024] leading-[1.12]">
            A few words from people I&apos;ve built with.
          </h2>
          <div className="mt-2 w-24 h-[3px] bg-[#FFD42A] rounded-full" />
        </motion.div>

        {/* 2. MAIN SINGLE QUOTE CONTAINER (STABLE HEIGHT - NO LAYOUT SHIFT) */}
        <div className="min-h-[260px] sm:min-h-[280px] flex flex-col justify-between max-w-[860px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18, filter: "blur(2px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -16, filter: "blur(2px)" }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
              }
              className="flex flex-col justify-between"
            >
              {/* HERO QUOTE TEXT */}
              <div className="relative pl-1 sm:pl-2">
                <span className="absolute -left-5 sm:-left-7 top-0 font-serif text-3xl sm:text-4xl text-[#FFD42A] select-none leading-none">
                  “
                </span>
                <blockquote className="font-sans text-xl sm:text-2xl lg:text-3xl font-normal leading-[1.38] text-[#1D2024] tracking-tight">
                  {current.quote}
                </blockquote>
              </div>

              {/* PERSON IDENTITY (NAME, ROLE, BADGE MONOGRAM) */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? {}
                    : { duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }
                }
                className="mt-8 sm:mt-10 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-[#1D2024] text-[#FFF8E8] font-mono text-xs font-semibold flex items-center justify-center shrink-0 ring-2 ring-[#FFD42A]/60 shadow-xs">
                  {current.badge}
                </div>
                <div>
                  <h3 className="font-sans text-base sm:text-lg font-semibold text-[#1D2024] leading-tight">
                    {current.name}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-[#1D2024]/60 tracking-wide mt-0.5">
                    {current.role} <span className="mx-1 text-[#FFD42A]">·</span> {current.company}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. EDITORIAL FOOTER: ANIMATED MONO COUNTER & ARROW NAVIGATION */}
        <div className="mt-12 sm:mt-16 pt-6 border-t border-[#1D2024]/10 flex items-center justify-between max-w-[860px]">
          {/* MONOSPACE COUNTER & PROGRESS INDICATOR */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs sm:text-sm tracking-widest text-[#1D2024]/70 font-semibold flex items-center gap-1">
              <div className="relative w-6 h-5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeIndex}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center font-bold text-[#1D2024]"
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[#1D2024]/40">/</span>
              <span className="text-[#1D2024]/50">{String(total).padStart(2, "0")}</span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              {testimonialsData.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => goToIndex(idx)}
                  aria-label={`Go to recommendation ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-7 bg-[#FFD42A]"
                      : "w-1.5 bg-[#1D2024]/18 hover:bg-[#1D2024]/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* MINIMAL ARROW CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous recommendation"
              className="w-10 h-10 rounded-full border border-[#1D2024]/20 bg-transparent text-[#1D2024] hover:bg-[#1D2024] hover:text-[#FFF8E8] hover:border-[#1D2024] transition-all flex items-center justify-center text-sm font-bold cursor-pointer shadow-xs active:scale-95"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next recommendation"
              className="w-10 h-10 rounded-full border border-[#1D2024]/20 bg-transparent text-[#1D2024] hover:bg-[#1D2024] hover:text-[#FFF8E8] hover:border-[#1D2024] transition-all flex items-center justify-center text-sm font-bold cursor-pointer shadow-xs active:scale-95"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
