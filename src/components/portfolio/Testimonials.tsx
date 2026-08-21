import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackLogEntry {
  id: string;
  badge: string;
  name: string;
  roleLine1: string;
  roleLine2: string;
  quote: string;
  metaTag: string;
}

const feedbackLogs: FeedbackLogEntry[] = [
  {
    id: "log-1",
    badge: "RS",
    name: "Riya Sharma",
    roleLine1: "AI RESEARCH INTERN",
    roleLine2: "PIXEL MIND",
    quote: "What impressed me most was how quickly Toshit moved from an idea to a working AI application with a thoughtful interface.",
    metaTag: "RE: HireScope",
  },
  {
    id: "log-2",
    badge: "AK",
    name: "Arjun Kapoor",
    roleLine1: "SENIOR ENGINEER",
    roleLine2: "NIAT FACULTY",
    quote: "Solid grasp of system design for someone early in their degree — the API architecture on CourseForge held up well under review.",
    metaTag: "RE: CourseForge",
  },
  {
    id: "log-3",
    badge: "AM",
    name: "Arjun Mehta",
    roleLine1: "PRODUCT ENGINEER",
    roleLine2: "NOVA LABS",
    quote: "Toshit has a strong instinct for turning AI ideas into polished, usable products. The combination of experimentation and web engineering really stands out.",
    metaTag: "RE: Greetly",
  },
  {
    id: "log-4",
    badge: "KM",
    name: "Karan Malhotra",
    roleLine1: "SOFTWARE ENGINEER",
    roleLine2: "BUILDCRAFT",
    quote: "Toshit brings together modern AI tools, frontend development, and practical problem solving in a way that feels genuinely product-focused.",
    metaTag: "RE: AI Systems",
  },
  {
    id: "log-5",
    badge: "NK",
    name: "Ananya Kapoor",
    roleLine1: "PRODUCT DESIGNER",
    roleLine2: "ORBIT STUDIO",
    quote: "The work feels both technical and creative. Toshit pays attention to interaction, presentation, and the actual usefulness of what he builds.",
    metaTag: "RE: Avengers Doomsday",
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCount = feedbackLogs.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Window resize & reduced motion detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Infinite Auto Rotation Timer (3.5 Seconds per card)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, handleNext]);

  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % totalCount;
    if (diff < -Math.floor(totalCount / 2)) diff += totalCount;
    if (diff > Math.floor(totalCount / 2)) diff -= totalCount;
    return diff;
  };

  const progressPercent = ((activeIndex + 1) / totalCount) * 100;

  return (
    <section
      id="feedback"
      style={{ backgroundColor: "#F7F2E7", color: "#1B1B18" }}
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10 border-t border-[#1B1B18]/10"
      aria-label="Mentors and Collaborators Testimonials Carousel"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* HEADER ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#1B1B18]/12 pb-8 mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-wider text-[#4A4A45] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D9A62C]" />
              <span>FEEDBACK LOG</span>
            </div>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1B1B18]"
            >
              Words from mentors &amp; collaborators.
            </h2>
          </div>

          <div className="font-mono text-xs sm:text-sm text-[#85847C] sm:text-right">
            <b className="text-[#1B1B18] text-sm sm:text-base font-semibold">
              {String(activeIndex + 1).padStart(2, "0")}
            </b>{" "}
            / {String(totalCount).padStart(2, "0")} entries
          </div>
        </div>

        {/* 3D ANIMATED STACKED CARD CAROUSEL STAGE */}
        <div
          className="relative w-full min-h-[380px] sm:min-h-[420px] flex items-center justify-center py-6 my-4"
          style={{ perspective: "1200px" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full max-w-[700px] h-[340px] sm:h-[360px] flex items-center justify-center">
            {feedbackLogs.map((item, index) => {
              const diff = getOffset(index);
              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              // Calculate positions & 3D transformations
              let xPos = "0%";
              let scale = 1;
              let rotateY = 0;
              let opacity = 1;
              let zIndex = 30;
              let filter = "blur(0px)";

              if (isLeft) {
                xPos = isMobile ? "-68%" : "-58%";
                scale = 0.88;
                rotateY = 10;
                opacity = 0.55;
                zIndex = 10;
                filter = "blur(0.5px)";
              } else if (isRight) {
                xPos = isMobile ? "68%" : "58%";
                scale = 0.88;
                rotateY = -10;
                opacity = 0.55;
                zIndex = 10;
                filter = "blur(0.5px)";
              } else if (!isCenter) {
                xPos = diff > 0 ? "120%" : "-120%";
                scale = 0.75;
                rotateY = 0;
                opacity = 0;
                zIndex = 0;
                filter = "blur(4px)";
              }

              return (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) handleNext();
                    if (info.offset.x > 40) handlePrev();
                  }}
                  animate={{
                    x: xPos,
                    scale: scale,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    opacity: opacity,
                    zIndex: zIndex,
                    filter: filter,
                  }}
                  whileHover={
                    isCenter
                      ? {
                          scale: 1.025,
                          y: -6,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                      : { opacity: 0.8, cursor: "pointer" }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.1 }
                      : {
                          duration: 0.75,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                  className={`absolute top-0 w-full max-w-[620px] h-full p-6 sm:p-9 rounded-3xl border border-[#1B1B18]/15 bg-[#FFF8E8] text-[#1B1B18] shadow-[0_20px_50px_rgba(27,27,24,0.1)] flex flex-col justify-between select-none ${
                    isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  }`}
                >
                  {/* CARD TOP HEADER ROW */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1B1B18] text-[#FFF8E8] font-mono text-xs font-bold flex items-center justify-center shadow-sm">
                        {item.badge}
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-[#1B1B18] leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#85847C] uppercase">
                          {item.roleLine1} • {item.roleLine2}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#B08420] bg-[#D9A62C]/15 border border-[#D9A62C]/40 px-3 py-1 rounded-full font-semibold">
                      {item.metaTag}
                    </span>
                  </div>

                  {/* CARD QUOTE */}
                  <div className="my-auto py-2">
                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#2A2A25] font-normal tracking-tight">
                      <span className="text-[#D9A62C] font-serif text-3xl mr-1 leading-none">“</span>
                      {item.quote}
                    </p>
                  </div>

                  {/* CARD FOOTER METADATA */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1B1B18]/10 text-xs font-mono text-[#85847C]">
                    <span>FEEDBACK // {item.badge}</span>
                    <span className="text-[#D9A62C] font-bold">★ ★ ★ ★ ★</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FOOTER NAVIGATION & DOTS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4">

          {/* PROGRESS BAR & COUNTER */}
          <div className="font-mono text-xs text-[#85847C] flex items-center gap-3">
            <span>
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
            </span>
            <div className="w-[120px] h-[3px] bg-[#1B1B18]/12 rounded-full relative overflow-hidden">
              <motion.div
                className="h-full bg-[#D9A62C] rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* PAGINATION DOT INDICATORS */}
          <div className="flex items-center gap-2">
            {feedbackLogs.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to feedback slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "w-7 bg-[#D9A62C]" : "w-2.5 bg-[#1B1B18]/25 hover:bg-[#1B1B18]/50"
                  }`}
                />
              );
            })}
          </div>

          {/* ARROW CONTROLS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              aria-label="Previous feedback entry"
              className="w-10 h-10 rounded-full border border-[#1B1B18]/20 bg-white/40 flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#FFF8E8] transition-all shadow-xs"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next feedback entry"
              className="w-10 h-10 rounded-full border border-[#1B1B18]/20 bg-white/40 flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#FFF8E8] transition-all shadow-xs"
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
