import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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
    quote: "Solid grasp of system design for someone early in their degree the API architecture on CourseForge held up well under review.",
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

  // Fast & Smooth Auto Rotation Timer (2.0s per card)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 2000);

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

  return (
    <section
      id="feedback"
      style={{ backgroundColor: "#F7F2E7", color: "#1B1B18" }}
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10 border-t border-[#1B1B18]/10"
      aria-label="Mentors and Collaborators Testimonials Carousel"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* HEADER ROW */}
        <div className="border-b border-[#1B1B18]/12 pb-8 mb-12">
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-[#1B1B18]"
          >
            Words from mentors &amp; collaborators.
          </h2>
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

              // Ultra-clean 3D transformations optimized for GPU
              let xPos = "0%";
              let scale = 1;
              let rotateY = 0;
              let opacity = 1;
              let zIndex = 30;

              if (isLeft) {
                xPos = isMobile ? "-68%" : "-56%";
                scale = 0.88;
                rotateY = 12;
                opacity = 0.55;
                zIndex = 10;
              } else if (isRight) {
                xPos = isMobile ? "68%" : "56%";
                scale = 0.88;
                rotateY = -12;
                opacity = 0.55;
                zIndex = 10;
              } else if (!isCenter) {
                xPos = diff > 0 ? "115%" : "-115%";
                scale = 0.75;
                rotateY = 0;
                opacity = 0;
                zIndex = 0;
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
                    if (info.offset.x < -30) handleNext();
                    if (info.offset.x > 30) handlePrev();
                  }}
                  animate={{
                    x: xPos,
                    scale: scale,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  whileHover={
                    isCenter
                      ? {
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }
                      : { opacity: 0.8, cursor: "pointer" }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.1 }
                      : {
                        duration: 0.55,
                        ease: [0.25, 1, 0.5, 1],
                      }
                  }
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                  }}
                  className={`absolute top-0 w-full max-w-[620px] h-full p-6 sm:p-9 rounded-3xl border border-[#1B1B18]/15 bg-[#FFF8E8] text-[#1B1B18] shadow-[0_20px_50px_rgba(27,27,24,0.1)] flex flex-col justify-between select-none ${isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
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
                    <span className="text-[#85847C]/70 text-[11px]">VERIFIED LOG</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="flex items-center justify-center pt-6 mt-4">

          {/* ARROW CONTROLS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              aria-label="Previous feedback entry"
              className="w-10 h-10 rounded-full border border-[#1B1B18]/20 bg-white/40 flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#FFF8E8] transition-all shadow-xs cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next feedback entry"
              className="w-10 h-10 rounded-full border border-[#1B1B18]/20 bg-white/40 flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#FFF8E8] transition-all shadow-xs cursor-pointer"
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
