import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Hand-drawn lowercase cursive "hello" vector stroke in viewBox 0 0 180 75.
 * Designed with connected brush-like handwriting character, rounded caps, and 4.5px stroke.
 */
const HELLO_SVG_PATH =
  "M 20 68 C 28 48 36 14 40 12 C 43 10 30 32 26 68 C 26 48 38 40 48 40 C 55 40 56 56 56 68 C 56 70 64 54 72 44 C 80 34 70 34 62 44 C 54 52 60 68 70 67 C 80 66 88 48 96 26 C 102 12 92 30 86 68 C 86 70 96 54 104 38 C 112 24 120 12 122 12 C 125 12 112 30 106 68 C 106 70 116 52 126 44 C 134 36 148 41 148 52 C 148 64 133 68 126 58 C 122 51 128 41 138 41 C 148 41 160 45 172 43";

const HelloAnimation: React.FC<HelloAnimationProps> = ({ isActive, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "drawing" | "hold" | "retracting" | "endpoint" | "done">("idle");

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

    // Specification Timeline:
    // 0.00s: Start continuous handwritten pen stroke drawing
    setStage("drawing");

    // 2.80s: "hello" drawing complete -> Enter hold phase (1.6s hold)
    const holdTimer = setTimeout(() => {
      setStage("hold");

      // 1.6s hold -> Enter reverse stroke retraction / erase phase (1.2s duration)
      const retractTimer = setTimeout(() => {
        setStage("retracting");

        // 1.2s retraction -> Enter tiny endpoint dot phase (200ms duration)
        const endpointTimer = setTimeout(() => {
          setStage("endpoint");

          // 200ms endpoint dot -> Done & callback
          const doneTimer = setTimeout(() => {
            setStage("done");
            if (onComplete) onComplete();
          }, 200);

          return () => clearTimeout(doneTimer);
        }, 1200);

        return () => clearTimeout(retractTimer);
      }, 1600);

      return () => clearTimeout(retractTimer);
    }, 2800);

    return () => clearTimeout(holdTimer);
  }, [isActive, shouldReduceMotion, onComplete]);

  if (!isActive || stage === "done") {
    return null;
  }

  // Calculate pathLength target based on exact animation stage
  let pathLengthTarget = 0;
  if (stage === "drawing" || stage === "hold") {
    pathLengthTarget = 1;
  } else if (stage === "retracting" || stage === "endpoint") {
    pathLengthTarget = 0;
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
        {/* QUIET EDITORIAL PAPER BG */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E1E1B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none" />

        {/* CENTERED HANDWRITTEN SVG CONTAINER (Desktop: 200–240px wide, Mobile: 140–160px wide) */}
        <div className="relative w-44 sm:w-56 md:w-64 h-auto aspect-[180/75] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 180 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_12px_rgba(30,30,27,0.06)]"
          >
            {/* Soft Charcoal Ink Path (#1E1E1B) */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#1E1E1B"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={
                shouldReduceMotion
                  ? { pathLength: 1 }
                  : { pathLength: pathLengthTarget }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      duration: stage === "drawing" ? 2.8 : stage === "retracting" ? 1.2 : 0,
                      ease: [0.4, 0, 0.2, 1], // Natural fluid pen motion
                    }
              }
            />

            {/* Tiny Final Endpoint Dot (briefly remains at origin when retracting ends) */}
            {(stage === "endpoint" || (stage === "retracting" && pathLengthTarget === 0)) && (
              <motion.circle
                cx="20"
                cy="68"
                r="2.2"
                fill="#1E1E1B"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: stage === "endpoint" ? 1 : 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelloAnimation;
