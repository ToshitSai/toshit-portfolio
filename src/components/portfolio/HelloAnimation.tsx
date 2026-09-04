import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Clean, highly legible continuous cursive "hello" SVG path in viewBox 0 0 240 100.
 * Letter by letter breakdown:
 * - h: tall ascender loop (x:25->48->35) + rounded shoulder (x:35->64->76)
 * - e: clear lowercase loop (x:76->98->100->94)
 * - l1: first tall ascender loop (x:94->120->110)
 * - l2: second tall ascender loop (x:110->138->128)
 * - o: clear oval loop with right exit stroke (x:128->160->175->160->200)
 */
export const READABLE_HELLO_PATH =
  "M 25 85 C 32 60 42 25 48 15 C 52 10 40 40 35 85 C 35 55 52 48 64 48 C 74 48 76 70 76 85 C 82 66 94 52 102 52 C 108 52 108 62 98 72 C 88 82 82 78 94 68 C 104 52 116 28 122 15 C 126 10 114 45 110 85 C 118 52 132 28 138 15 C 142 10 130 45 128 85 C 136 68 152 48 165 48 C 178 48 184 62 174 76 C 162 90 148 78 162 60 C 170 48 185 48 200 48";

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

    // Step 1: Draw in (2.5s)
    setStage("drawing");

    const holdTimer = setTimeout(() => {
      // Step 2: Hold full word (1.5s)
      setStage("hold");

      const retractTimer = setTimeout(() => {
        // Step 3: Retract / Erase in reverse (1.2s)
        setStage("retracting");

        const doneTimer = setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 1200);

        return () => clearTimeout(doneTimer);
      }, 1500);

      return () => clearTimeout(retractTimer);
    }, 2500);

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

        {/* CENTERED SVG CONTAINER (Desktop: ~240-280px wide) */}
        <div className="relative w-56 sm:w-64 md:w-72 h-auto aspect-[240/100] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 240 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_10px_rgba(30,30,27,0.05)]"
          >
            {/* Ink Charcoal Path (#1E1E1B) */}
            <motion.path
              d={READABLE_HELLO_PATH}
              fill="none"
              stroke="#1E1E1B"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength:
                  stage === "drawing" || stage === "hold" ? 1 : 0,
              }}
              transition={{
                duration: stage === "drawing" ? 2.5 : stage === "retracting" ? 1.2 : 0,
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
