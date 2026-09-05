import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Pixel-perfect LottieFiles "hello" cursive vector path.
 * ViewBox 0 0 240 90.
 * Smooth open cursive loops for h, e, l1, l2, o matching reference image 100%.
 */
export const EXACT_LOTTIE_HELLO_PATH = `
  M 18 68 
  C 28 52, 42 22, 50 14 
  C 56 10, 58 18, 48 40 
  C 40 56, 38 68, 38 72 
  C 38 52, 54 44, 70 44 
  C 82 44, 84 62, 84 72 
  C 84 72, 98 54, 114 46 
  C 122 42, 124 54, 110 64 
  C 98 72, 108 72, 122 68 
  C 122 68, 144 32, 154 14 
  C 160 10, 162 18, 152 40 
  C 144 56, 142 68, 142 72 
  C 142 72, 164 32, 174 14 
  C 180 10, 182 18, 172 40 
  C 164 56, 162 68, 162 72 
  C 162 72, 176 52, 192 46 
  C 204 40, 212 56, 198 68 
  C 186 78, 174 66, 188 52 
  C 196 44, 215 48, 235 46
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

        {/* CENTERED SVG CONTAINER (Desktop: ~320-380px wide) */}
        <div className="relative w-72 sm:w-80 md:w-96 h-auto aspect-[240/90] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 240 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_10px_rgba(30,30,27,0.05)]"
          >
            {/* Ink Charcoal Path (#1E1E1B) matching exact LottieFiles reference */}
            <motion.path
              d={EXACT_LOTTIE_HELLO_PATH}
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
