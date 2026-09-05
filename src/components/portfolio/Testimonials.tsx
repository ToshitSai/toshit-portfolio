import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FeedbackEntry {
  id: string;
  badge: string;
  name: string;
  roleLine1: string;
  roleLine2: string;
  quote: string;
  metaTag: string;
}

const feedbackLogs: FeedbackEntry[] = [
  {
    id: "log-1",
    badge: "RS",
    name: "Riya Sharma",
    roleLine1: "AI Research Intern",
    roleLine2: "Pixel Mind",
    quote: "What impressed me most was how quickly Toshit moved from an idea to a working AI application with a thoughtful interface.",
    metaTag: "RE: HireScope",
  },
  {
    id: "log-2",
    badge: "AK",
    name: "Arjun Kapoor",
    roleLine1: "Senior Engineer",
    roleLine2: "NIAT Faculty",
    quote: "Solid grasp of system design for someone early in their degree — the API architecture on CourseForge held up well under review.",
    metaTag: "RE: CourseForge",
  },
  {
    id: "log-3",
    badge: "AM",
    name: "Arjun Mehta",
    roleLine1: "Product Engineer",
    roleLine2: "Nova Labs",
    quote: "Toshit has a strong instinct for turning AI ideas into polished, usable products. The combination of experimentation and web engineering really stands out.",
    metaTag: "RE: Greetly",
  },
  {
    id: "log-4",
    badge: "KM",
    name: "Karan Malhotra",
    roleLine1: "Software Engineer",
    roleLine2: "BuildCraft",
    quote: "Toshit brings together modern AI tools, frontend development, and practical problem solving in a way that feels genuinely product-focused.",
    metaTag: "RE: AI Systems",
  },
  {
    id: "log-5",
    badge: "NK",
    name: "Ananya Kapoor",
    roleLine1: "Product Designer",
    roleLine2: "Orbit Studio",
    quote: "The work feels both technical and creative. Toshit pays attention to interaction, presentation, and the actual usefulness of what he builds.",
    metaTag: "RE: Avengers Doomsday",
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCount = feedbackLogs.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Viewport resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Gentle auto rotation timer (5s per recommendation)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, shouldReduceMotion, handleNext]);

  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % totalCount;
    if (diff < -Math.floor(totalCount / 2)) diff += totalCount;
    if (diff > Math.floor(totalCount / 2)) diff -= totalCount;
    return diff;
  };

  return (
    <section
      id="feedback"
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10 bg-[#FBF7ED] text-[#1E1E1B] border-t border-[#1E1E1B]/10"
      aria-label="What people say - Recommendations"
    >
      {/* ATMOSPHERIC ORGANIC BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Warm Yellow Ambient Blob 1 */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 25, -15, 0],
                  y: [0, -20, 15, 0],
                  scale: [1, 1.08, 0.95, 1],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#E5C158]/12 blur-3xl"
        />

        {/* Soft Warm Olive Ambient Blob 2 */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, -30, 20, 0],
                  y: [0, 25, -15, 0],
                  scale: [1, 0.92, 1.06, 1],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#A8B08D]/15 blur-3xl"
        />

        {/* Quiet Paper Noise / Dot Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E1E1B_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.025]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* SECTION LABEL & EDITORIAL HEADING */}
        <div className="mb-14 sm:mb-20 max-w-2xl">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158] inline-block shadow-xs" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[#1E1E1B]/70 font-medium">
              ● WHAT PEOPLE SAY
            </span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="font-normal text-3xl sm:text-4xl lg:text-5xl text-[#1E1E1B] tracking-tight leading-[1.15]"
          >
            Good work tends to leave a trace.
          </h2>
        </div>

        {/* FLOATING COLLAGE CAROUSEL STAGE */}
        <div
          className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center my-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full max-w-[800px] h-[340px] sm:h-[370px] flex items-center justify-center">
            {feedbackLogs.map((item, index) => {
              const diff = getOffset(index);
              const isCenter = diff === 0;
              const isLeft1 = diff === -1;
              const isRight1 = diff === 1;
              const isLeft2 = diff === -2;
              const isRight2 = diff === 2;

              // Deterministic Collage Positioning Configuration
              let xPos = "0%";
              let yPos = 0;
              let scale = 1;
              let opacity = 1;
              let rotate = 0;
              let zIndex = 30;

              if (isCenter) {
                xPos = "0%";
                yPos = 0;
                scale = 1;
                opacity = 1;
                rotate = 0;
                zIndex = 30;
              } else if (isLeft1) {
                xPos = isMobile ? "-86%" : "-56%";
                yPos = isMobile ? -6 : -14;
                scale = 0.94;
                opacity = 0.65;
                rotate = -2.2;
                zIndex = 20;
              } else if (isRight1) {
                xPos = isMobile ? "86%" : "56%";
                yPos = isMobile ? 6 : 12;
                scale = 0.94;
                opacity = 0.65;
                rotate = 1.8;
                zIndex = 20;
              } else if (isLeft2) {
                xPos = isMobile ? "-140%" : "-102%";
                yPos = 16;
                scale = 0.86;
                opacity = isMobile ? 0 : 0.35;
                rotate = -3.5;
                zIndex = 10;
              } else if (isRight2) {
                xPos = isMobile ? "140%" : "102%";
                yPos = -12;
                scale = 0.86;
                opacity = isMobile ? 0 : 0.35;
                rotate = 2.5;
                zIndex = 10;
              } else {
                xPos = diff > 0 ? "160%" : "-160%";
                yPos = 0;
                scale = 0.75;
                opacity = 0;
                rotate = 0;
                zIndex = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    if (diff < 0) handlePrev();
                    if (diff > 0) handleNext();
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) handleNext();
                    if (info.offset.x > 40) handlePrev();
                  }}
                  animate={{
                    x: xPos,
                    y: shouldReduceMotion ? 0 : yPos,
                    scale: scale,
                    opacity: opacity,
                    rotate: shouldReduceMotion ? 0 : rotate,
                    zIndex: zIndex,
                  }}
                  whileHover={
                    isCenter
                      ? {
                          y: -5,
                          boxShadow: "0 22px 45px rgba(30, 30, 25, 0.08)",
                          transition: { duration: 0.25, ease: "easeOut" },
                        }
                      : { opacity: 0.85, cursor: "pointer" }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2 }
                      : {
                          duration: 0.75,
                          ease: [0.16, 1, 0.3, 1],
                        }
                  }
                  style={{
                    willChange: "transform, opacity",
                  }}
                  className={`absolute top-0 w-[90vw] sm:w-full max-w-[620px] h-full p-6 sm:p-9 rounded-2xl sm:rounded-3xl border border-[#1E1E1B]/10 bg-[#FFFDF9]/85 backdrop-blur-md text-[#1E1E1B] shadow-[0_12px_36px_rgba(30,30,25,0.04)] flex flex-col justify-between select-none ${
                    isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  }`}
                >
                  {/* CARD HEADER: SMALL CIRCULAR MONOGRAM & IDENTITY */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Monogram Circle Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1E1E1B] text-[#FBF7ED] font-mono text-xs font-semibold flex items-center justify-center shrink-0 shadow-xs">
                        {item.badge}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg text-[#1E1E1B] leading-snug">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-[#1E1E1B]/60 tracking-wide mt-0.5">
                          {item.roleLine1} {item.roleLine2 ? `· ${item.roleLine2}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Subtle Context Tag */}
                    {item.metaTag && (
                      <span className="font-mono text-[10px] tracking-wider text-[#1E1E1B]/60 bg-[#1E1E1B]/5 border border-[#1E1E1B]/10 px-2.5 py-1 rounded-full shrink-0">
                        {item.metaTag}
                      </span>
                    )}
                  </div>

                  {/* QUOTE TEXT BODY */}
                  <div className="my-auto py-3">
                    <p className="text-base sm:text-lg md:text-xl text-[#1E1E1B] font-normal leading-relaxed tracking-tight">
                      <span className="text-[#E5C158] font-serif text-2xl inline-block mr-1">“</span>
                      {item.quote}
                    </p>
                  </div>

                  {/* SUBTLE FOOTER ACCENT LINE */}
                  <div className="pt-2">
                    <div className="w-7 h-[2px] rounded-full bg-[#E5C158]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* EDITORIAL FOOTER: ANIMATED COUNTER & ARROW NAVIGATION */}
        <div className="flex items-center justify-between max-w-[620px] mx-auto pt-6 px-2">
          {/* VERTICALLY ANIMATED MONOSPACE COUNTER */}
          <div className="font-mono text-xs tracking-widest text-[#1E1E1B]/70 font-medium flex items-center gap-1 overflow-hidden h-6">
            <div className="relative w-6 h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span>/</span>
            <span>{String(totalCount).padStart(2, "0")}</span>
          </div>

          {/* MINIMAL EDITORIAL ARROW CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous recommendation"
              className="w-10 h-10 rounded-full border border-[#1E1E1B]/15 bg-white/60 text-[#1E1E1B] hover:bg-[#1E1E1B] hover:text-[#FBF7ED] hover:border-[#1E1E1B] transition-all flex items-center justify-center text-sm cursor-pointer shadow-xs active:scale-95"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next recommendation"
              className="w-10 h-10 rounded-full border border-[#1E1E1B]/15 bg-white/60 text-[#1E1E1B] hover:bg-[#1E1E1B] hover:text-[#FBF7ED] hover:border-[#1E1E1B] transition-all flex items-center justify-center text-sm cursor-pointer shadow-xs active:scale-95"
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
