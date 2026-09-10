import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RecordScratchHeading from "./RecordScratchHeading";
import { useIsMobile } from "@/hooks/use-mobile";
import { SECTION_APPROACH, motionDistance } from "@/lib/scrollMotion";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: SECTION_APPROACH,
  });

  const headingY = useTransform(scrollYProgress, [0, 0.35, 0.85], shouldReduceMotion ? [0, 0, 0] : [motionDistance(isMobile, 8), 0, -motionDistance(isMobile, 5)]);
  const quoteY = useTransform(scrollYProgress, [0, 0.4, 0.9], shouldReduceMotion ? [0, 0, 0] : [motionDistance(isMobile, 8), 0, -motionDistance(isMobile, 4)]);
  const personY = useTransform(scrollYProgress, [0.1, 0.45, 0.9], shouldReduceMotion ? [0, 0, 0] : [motionDistance(isMobile, 5), 0, -motionDistance(isMobile, 3)]);
  const bgY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -motionDistance(isMobile, 5)]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.5, 1, 1, 0.85]);
  
  // Timer & Touch Swipe Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = testimonialsData.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

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

  // Automatic Rotation System (3000ms display duration — resets timer on activeIndex change)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, shouldReduceMotion, total, activeIndex]);

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
      ref={containerRef}
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
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#FFD42A]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1D2024_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />
      </motion.div>

      <motion.div style={{ opacity: sectionOpacity }} className="max-w-[1120px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <motion.div style={{ y: headingY }}>
        {/* 1. SECTION LABEL & EDITORIAL HEADING WITH RECORD-SCRATCH TRANSITION */}
        <RecordScratchHeading
          sectionTag="06 // WORDS FROM OTHERS"
          lineColor="bg-[#1D2024]/10"
          accentColor="#FFD42A"
          title={
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.035em] text-[#1D2024] leading-[1.05]">
              A few words from people I&apos;ve built with.
            </h2>
          }
        />
        </motion.div>

        {/* 2. MAIN SINGLE QUOTE CONTAINER (STABLE HEIGHT - NO LAYOUT SHIFT) */}
        <motion.div style={{ y: quoteY }} className="min-h-[260px] sm:min-h-[280px] flex flex-col justify-between max-w-[860px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
              }
              className="flex flex-col justify-between"
            >
              {/* HERO QUOTE TEXT */}
              <div className="relative pl-1 sm:pl-2">
                <span className="absolute -left-5 sm:-left-7 top-0 font-sans text-3xl sm:text-4xl text-[#FFD42A] select-none leading-none font-bold">
                  “
                </span>
                <blockquote className="font-sans text-xl sm:text-2xl lg:text-3xl font-normal leading-[1.45] text-[#1D2024] tracking-[-0.015em]">
                  {current.quote}
                </blockquote>
              </div>

              {/* PERSON IDENTITY (NAME, ROLE, BADGE MONOGRAM) */}
              <motion.div
                style={{ y: personY }}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? {}
                    : { duration: 0.5, delay: 0.04, ease: [0.16, 1, 0.3, 1] }
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
        </motion.div>


      </motion.div>
    </section>
  );
};

export default Testimonials;
