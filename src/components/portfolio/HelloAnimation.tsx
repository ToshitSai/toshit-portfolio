import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Exact continuous single-stroke bezier vector matching the cursive "hello"
 * ViewBox 0 0 700 250 | Pre-calculated path length ~2300px
 */
const HELLO_BEZIER_PATH = `
  M 90,165 
  C 105,130 115,75 125,45 
  C 130,28 140,25 142,38 
  C 145,55 130,120 120,175 
  C 130,135 155,108 178,110 
  C 192,112 196,128 190,145 
  C 182,165 168,175 152,175 
  C 142,175 132,165 142,145 
  C 152,122 188,118 208,122 
  C 228,126 238,155 228,172 
  C 220,182 205,178 215,160 
  C 230,135 255,80 262,48 
  C 267,28 277,25 280,38 
  C 285,60 265,145 258,175 
  C 268,160 288,105 310,50 
  C 316,32 326,28 329,40 
  C 334,62 318,135 310,175 
  C 325,160 348,125 372,120 
  C 395,115 412,130 412,148 
  C 412,168 395,178 375,178 
  C 352,178 342,158 348,142 
  C 358,120 395,115 418,128 
  C 432,138 438,138 450,132
`;

const HelloAnimation: React.FC<HelloAnimationProps> = ({ isActive, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "playing" | "exiting" | "done">("idle");

  useEffect(() => {
    if (!isActive) {
      setStage("idle");
      return;
    }

    if (shouldReduceMotion) {
      setStage("playing");
      const timer = setTimeout(() => {
        setStage("done");
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    setStage("playing");

    // Exact cycle timing matching reference breakdown:
    // 0.0s - 0.4s: Initial dot (0% - 12%)
    // 0.4s - 2.5s: Continuous draw (12% - 45%)
    // 2.5s - 4.2s: Hold stationary (45% - 70%)
    // 4.2s - 5.8s: Trailing erase (70% - 90%)
    // 5.8s - 6.2s: Fade exit & complete (90% - 100%)
    const exitTimer = setTimeout(() => {
      setStage("exiting");
      const doneTimer = setTimeout(() => {
        setStage("done");
        if (onComplete) onComplete();
      }, 400);

      return () => clearTimeout(doneTimer);
    }, 5800);

    return () => clearTimeout(exitTimer);
  }, [isActive, shouldReduceMotion, onComplete]);

  if (!isActive || stage === "done") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="hello-intro-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "exiting" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none bg-[#FBF7ED] studio-noise-bg overflow-hidden"
        aria-hidden="true"
      >
        {/* SUBTLE EDITORIAL PAPER BACKGROUND TEXTURE */}
        <div className="absolute inset-0 bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none" />

        {/* CANVAS CONTAINER WITH EXACT SVG PATH & STROKE ANIMATION */}
        <div className="w-[500px] max-w-[90vw] h-[220px] sm:h-[280px] flex items-center justify-center relative z-10">
          <svg
            viewBox="0 0 700 250"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_16px_rgba(32,37,43,0.06)]"
          >
            {/* CONTINUOUS SINGLE-STROKE BEZIER VECTOR */}
            <motion.path
              d={HELLO_BEZIER_PATH}
              fill="none"
              stroke="#20252B"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={2300}
              initial={{ strokeDashoffset: 2300 }}
              animate={
                shouldReduceMotion
                  ? { strokeDashoffset: 0 }
                  : {
                      strokeDashoffset: [2300, 2280, 0, 0, -2300, -2300],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      duration: 5.8,
                      times: [0, 0.07, 0.43, 0.72, 0.96, 1],
                      ease: "easeInOut",
                    }
              }
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelloAnimation;
