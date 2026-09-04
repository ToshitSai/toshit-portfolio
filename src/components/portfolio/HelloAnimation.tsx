import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Hand-drawn lowercase cursive "hello" SVG path data.
 * Single fluid continuous stroke in viewBox 0 0 160 65.
 */
const HELLO_SVG_PATH =
  "M 14 52 C 22 34 32 12 36 10 C 39 8 26 28 20 52 C 20 36 32 28 42 28 C 49 28 50 44 50 52 C 50 54 56 42 62 34 C 68 26 60 26 52 34 C 46 40 50 52 60 51 C 68 50 76 36 84 18 C 90 7 82 22 76 52 C 76 54 84 42 92 28 C 98 16 106 7 108 7 C 111 7 100 22 94 52 C 94 54 102 40 112 32 C 120 25 132 30 132 40 C 132 50 119 54 112 45 C 108 39 114 30 124 30 C 132 30 142 34 152 32";

const HelloAnimation: React.FC<HelloAnimationProps> = ({ isActive, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "drawing" | "hold" | "exiting" | "done">("idle");

  useEffect(() => {
    if (!isActive) {
      setStage("idle");
      return;
    }

    if (shouldReduceMotion) {
      setStage("hold");
      const timer = setTimeout(() => {
        setStage("exiting");
        setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 300);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Timeline:
    // 0ms: Start stroke drawing
    setStage("drawing");

    // 1100ms: Drawing complete -> Hold phase
    const holdTimer = setTimeout(() => {
      setStage("hold");

      // 250ms hold -> Exit phase
      const exitTimer = setTimeout(() => {
        setStage("exiting");

        // 350ms exit fade -> Done
        const doneTimer = setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 350);

        return () => clearTimeout(doneTimer);
      }, 250);

      return () => clearTimeout(exitTimer);
    }, 1100);

    return () => clearTimeout(holdTimer);
  }, [isActive, shouldReduceMotion, onComplete]);

  if (!isActive || stage === "done") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="hello-intro-overlay"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: stage === "exiting" ? 0 : 1,
          scale: stage === "exiting" ? 1.02 : 1,
        }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Soft Radial Ambient Highlight Centered Behind "hello" */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#FFD42A]/20 blur-3xl pointer-events-none" />

        {/* Hand-drawn SVG Container (Desktop: ~135px wide, Mobile: ~95px wide) */}
        <div className="relative w-24 sm:w-32 md:w-36 h-auto aspect-[160/65] flex items-center justify-center">
          <svg
            viewBox="0 0 160 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_16px_rgba(255,212,42,0.5)]"
          >
            {/* Soft guide stroke underlay */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#FFD42A"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.2}
            />

            {/* Primary Hand-Drawn Cursive Stroke */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#FFD42A"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : {
                      pathLength: stage === "drawing" || stage === "hold" || stage === "exiting" ? 1 : 0,
                      opacity: 1,
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      pathLength: {
                        duration: 1.1,
                        ease: [0.45, 0, 0.55, 1], // Fluid organic stroke drawing
                      },
                      opacity: { duration: 0.1 },
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
