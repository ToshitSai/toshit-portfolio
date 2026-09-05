import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Pixel-perfect continuous single-stroke cursive "hello" matching user reference image.
 * ViewBox 0 0 280 100.
 */
export const EXACT_REFERENCE_HELLO_PATH = `
  M 20 75 
  C 28 62, 38 28, 48 18 
  C 56 12, 60 22, 50 42 
  C 44 54, 42 68, 42 80 
  C 42 62, 58 50, 72 50 
  C 82 50, 84 68, 84 80 
  C 84 80, 94 62, 106 50 
  C 114 42, 118 56, 108 68 
  C 98 78, 90 78, 102 72 
  C 102 72, 120 35, 132 18 
  C 140 12, 144 22, 134 42 
  C 128 54, 126 68, 126 80 
  C 126 80, 144 35, 156 18 
  C 164 12, 168 22, 158 42 
  C 152 54, 150 68, 150 80 
  C 150 80, 164 58, 178 50 
  C 190 42, 200 58, 190 72 
  C 180 84, 166 76, 178 58 
  C 184 48, 204 52, 226 50
`;

const HelloAnimation: React.FC<HelloAnimationProps> = ({ isActive, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "drawing" | "hold" | "retracting" | "done">("idle");

  useEffect(() => {
    if (!isActive) {
      setStage("idle");
      return;
    }

    if (shouldReduceMotion) {
      setStage("hold");
      const timer = setTimeout(() => {
        setStage("done");
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    // Step 1: Draw in over 2.2s
    setStage("drawing");

    const holdTimer = setTimeout(() => {
      // Step 2: Hold fully drawn for 1.2s
      setStage("hold");

      const retractTimer = setTimeout(() => {
        // Step 3: Trailing left-to-right erase over 1.2s
        setStage("retracting");

        const doneTimer = setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 1200);

        return () => clearTimeout(doneTimer);
      }, 1200);

      return () => clearTimeout(retractTimer);
    }, 2200);

    return () => clearTimeout(holdTimer);
  }, [isActive, shouldReduceMotion, onComplete]);

  if (!isActive || stage === "done") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="hello-intro-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none bg-[#FBF7ED] studio-noise-bg overflow-hidden"
        aria-hidden="true"
      >
        {/* QUIET EDITORIAL PAPER BG TEXTURE */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E1E1B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none" />

        {/* CENTERED SVG CONTAINER (Desktop: ~280-320px wide) */}
        <div className="relative w-64 sm:w-72 md:w-80 h-auto aspect-[280/100] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 280 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_10px_rgba(30,30,27,0.05)]"
          >
            {/* Ink Charcoal Path (#1E1E1B) matching exact reference font */}
            <motion.path
              d={EXACT_REFERENCE_HELLO_PATH}
              fill="none"
              stroke="#1E1E1B"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength:
                  stage === "drawing" || stage === "hold" ? 1 : 0,
              }}
              transition={{
                duration: stage === "drawing" ? 2.2 : stage === "retracting" ? 1.2 : 0,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelloAnimation;
