import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TypewriterSubtitleProps {
  fullText: string;
  isActive: boolean;
  shouldReduceMotion: boolean | null;
  charDelay?: number;
  pauseDelay?: number;
}

const TypewriterSubtitle: React.FC<TypewriterSubtitleProps> = React.memo(
  ({ fullText, isActive, shouldReduceMotion, charDelay = 28, pauseDelay = 450 }) => {
    const [displayedText, setDisplayedText] = useState(fullText);
    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
      if (shouldReduceMotion || !isActive) {
        setDisplayedText(fullText);
        setShowCursor(false);
        return;
      }

      setDisplayedText("");
      setShowCursor(true);

      let currentIndex = 0;
      let pauseTimer: NodeJS.Timeout | null = null;

      const typingInterval = setInterval(() => {
        currentIndex++;
        setDisplayedText(fullText.slice(0, currentIndex));

        if (currentIndex >= fullText.length) {
          clearInterval(typingInterval);
          pauseTimer = setTimeout(() => {
            setShowCursor(false);
          }, pauseDelay);
        }
      }, charDelay);

      return () => {
        clearInterval(typingInterval);
        if (pauseTimer) clearTimeout(pauseTimer);
      };
    }, [fullText, isActive, shouldReduceMotion, charDelay, pauseDelay]);

    return (
      <span className="font-mono text-xs text-[#1E2024]/60 block mt-1.5 min-h-[1.25rem] select-none">
        {displayedText}
        {showCursor && (
          <span className="inline-block font-mono text-[#FFD42A] ml-0.5 animate-cursor-blink">
            ▍
          </span>
        )}
      </span>
    );
  }
);

TypewriterSubtitle.displayName = "TypewriterSubtitle";

const BuildingPhilosophyPill: React.FC = React.memo(() => {
  return (
    <div className="pt-6">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/50 block mb-2">
        BUILDING PHILOSOPHY
      </span>
      <div className="flex items-center justify-between bg-[#1E2024]/5 p-3 sm:p-3.5 rounded-xl border border-[#1E2024]/10 font-mono text-xs font-bold text-[#1E2024]">
        <span className="process-stage-1">EXPERIMENT</span>
        <div className="process-arrow-slot">
          <span className="process-arrow-one">→</span>
        </div>
        <span className="process-stage-2">BUILD</span>
        <div className="process-arrow-slot">
          <span className="process-arrow-two">→</span>
        </div>
        <span className="process-stage-3">SHIP</span>
      </div>
    </div>
  );
});

BuildingPhilosophyPill.displayName = "BuildingPhilosophyPill";

export const BentoGridWorkspace: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-16">
      {/* BENTO GRID CONTAINER WITH EXPLICIT STACKING & SPANS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start relative">
        
        {/* 1. CENTER PROFILE CARD (PRIMARY ANCHOR — ORDER 1 ON MOBILE, SPANS 5 COLS ON DESKTOP) */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0 }}
          className="order-1 lg:col-span-5 self-start rounded-3xl bg-[#F7F1E5] border border-[#1E2024]/16 p-6 sm:p-8 shadow-[0_12px_36px_rgba(30,32,36,0.06)] flex flex-col justify-between relative group"
        >
          {/* Identity Header */}
          <div>
            <div className="flex items-center justify-between border-b border-[#1E2024]/12 pb-5 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E2024] text-[#F7F1E5] flex items-center justify-center font-bold text-base font-sans shadow-xs">
                  T
                </div>
                <div>
                  <h2 className="font-sans font-bold text-xl sm:text-2xl text-[#1E2024] tracking-[-0.02em]">
                    Toshit Sai
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E2024]/60 block mt-0.5">
                    CREATIVE ENGINEER
                  </span>
                </div>
              </div>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#1E2024]/85 leading-relaxed font-medium">
              Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning.
            </p>
          </div>

          {/* Building Philosophy Pill Signature */}
          <BuildingPhilosophyPill />
        </motion.div>

        {/* 2. CARD 2: WHAT I BUILD — BORDER-LIGHT PASS (0ms STAGGER) */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0 }}
          className="order-2 lg:col-span-7 rounded-3xl bg-[#F7F1E5] border border-[#1E2024]/16 p-6 sm:p-8 lg:p-10 shadow-[0_12px_36px_rgba(30,32,36,0.06)] flex flex-col justify-between transition-colors duration-300 hover:border-[#1E2024]/30 select-none relative overflow-hidden"
        >
          {/* SUBTLE BORDER-LIGHT PASS (Thin yellow highlight travels along top border LEFT -> RIGHT once in 1000ms) */}
          {!shouldReduceMotion && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileInView={{ x: "250%", opacity: [0, 1, 1, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.0, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#FFD42A] to-transparent pointer-events-none z-10"
            />
          )}

          <div>
            {/* CATEGORY TAG */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#1E2024]/60">
                02 // WHAT I BUILD
              </span>
            </div>

            {/* MAIN HEADING */}
            <h3 className="font-sans font-bold text-[clamp(28px,3.8vw,48px)] text-[#1E2024] tracking-[-0.03em] leading-[1.05] mb-3 sm:mb-4">
              WHAT I BUILD
            </h3>

            {/* MAIN DESCRIPTION CONTENT */}
            <p className="font-sans text-[clamp(16px,1.8vw,22px)] text-[#1E2024]/85 leading-relaxed font-medium max-w-[620px]">
              AI-powered applications, intelligent workflows, and complete digital products that turn ideas into useful experiences.
            </p>
          </div>

          {/* STATIC SECONDARY LINE FOOTER */}
          <div className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-[#1E2024]/12 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#1E2024]/60">
            <span>AI / ML</span>
            <span className="text-[#FFD42A] font-bold">·</span>
            <span>GENERATIVE AI</span>
            <span className="text-[#FFD42A] font-bold">·</span>
            <span>LLM APPLICATIONS</span>
            <span className="text-[#FFD42A] font-bold">·</span>
            <span>PRODUCT BUILDING</span>
          </div>
        </motion.div>

        {/* 3. CARD 1: AI / ML SYSTEMS — STEPPER CARD 0 */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0 }}
          onClick={() => setActiveIndex(0)}
          className={`order-3 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-colors duration-300 hover:border-[#1E2024]/28 select-none group cursor-pointer ${
            activeIndex === 0 ? "border-[#1E2024]/30" : "border-[#1E2024]/14"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Index Dot: switches from muted gray to accent yellow when active */}
                <span
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    activeIndex === 0 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                  01 // SYSTEM
                </span>
              </div>

              {/* THREE STEPPER DOTS (● —— ● —— ●) */}
              <div className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    activeIndex === 0 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
                <span className="w-2.5 h-[1px] bg-[#1E2024]/25" />
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    activeIndex === 1 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
                <span className="w-2.5 h-[1px] bg-[#1E2024]/25" />
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    activeIndex === 2 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
              </div>
            </div>

            <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-0.5">
              AI / ML Systems
            </h3>

            {/* Typewriter Subtitle for Card 0 */}
            <TypewriterSubtitle
              fullText="Neural Nets & Preprocessing"
              isActive={activeIndex === 0}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        </motion.div>

        {/* 4. CARD 3: WEB ENGINEERING — STEPPER CARD 1 */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.10 }}
          onClick={() => setActiveIndex(1)}
          className={`order-4 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-colors duration-300 hover:border-[#1E2024]/28 select-none group cursor-pointer ${
            activeIndex === 1 ? "border-[#1E2024]/30" : "border-[#1E2024]/14"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Index Dot: switches from muted gray to accent yellow when active */}
                <span
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    activeIndex === 1 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                  03 // FRONTEND
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-0.5">
                Web Engineering
              </h3>
            </div>

            {/* Typewriter Subtitle for Card 1 */}
            <TypewriterSubtitle
              fullText="React 18 & TypeScript Systems"
              isActive={activeIndex === 1}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        </motion.div>

        {/* 5. CARD 4: PRODUCT BUILDING — STEPPER CARD 2 */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.20 }}
          onClick={() => setActiveIndex(2)}
          className={`order-5 lg:col-span-4 rounded-2xl bg-[#F7F1E5] border p-5 sm:p-6 shadow-[0_8px_24px_rgba(30,32,36,0.04)] flex flex-col justify-between transition-colors duration-300 hover:border-[#1E2024]/28 select-none group cursor-pointer ${
            activeIndex === 2 ? "border-[#1E2024]/30" : "border-[#1E2024]/14"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Index Dot: switches from muted gray to accent yellow when active */}
                <span
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    activeIndex === 2 ? "bg-[#FFD42A]" : "bg-[#1E2024]/30"
                  }`}
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E2024]/55">
                  04 // ARCHITECTURE
                </span>
              </div>
            </div>

            <h3 className="font-sans font-bold text-lg text-[#1E2024] tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-0.5">
              Product Building
            </h3>

            {/* Typewriter Subtitle for Card 2 */}
            <TypewriterSubtitle
              fullText="Idea → Execution → Ship"
              isActive={activeIndex === 2}
              shouldReduceMotion={shouldReduceMotion}
            />

            {/* PROGRESSION SIGNAL TRAVEL */}
            <div className="relative overflow-hidden pt-0.5 mt-0.5">
              {!shouldReduceMotion && (
                <>
                  {/* Viewport Entry Signal Sweep */}
                  <motion.span
                    initial={{ x: "-40%", opacity: 0 }}
                    whileInView={{ x: "140%", opacity: [0, 0.9, 0.9, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 0.20, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FFD42A] to-transparent rounded-full pointer-events-none shadow-[0_0_8px_rgba(255,212,42,0.8)]"
                  />
                  {/* Hover Single Pass Sweep */}
                  <span className="absolute top-1/2 left-0 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FFD42A] to-transparent rounded-full pointer-events-none shadow-[0_0_8px_rgba(255,212,42,0.8)] animate-signal-pass-once opacity-0" />
                </>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BentoGridWorkspace;

