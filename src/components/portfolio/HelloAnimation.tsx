import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Hand-drawn lowercase cursive "hello" SVG path data.
 * Single fluid continuous pen stroke in viewBox 0 0 180 75.
 */
const HELLO_SVG_PATH =
  "M 20 68 C 28 48 36 14 40 12 C 43 10 30 32 26 68 C 26 48 38 40 48 40 C 55 40 56 56 56 68 C 56 70 64 54 72 44 C 80 34 70 34 62 44 C 54 52 60 68 70 67 C 80 66 88 48 96 26 C 102 12 92 30 86 68 C 86 70 96 54 104 38 C 112 24 120 12 122 12 C 125 12 112 30 106 68 C 106 70 116 52 126 44 C 134 36 148 41 148 52 C 148 64 133 68 126 58 C 122 51 128 41 138 41 C 148 41 160 45 172 43";

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
        }, 400);
      }, 600);
      return () => clearTimeout(timer);
    }

    // Exact Specification Timeline:
    // 0.00s: Start continuous pen stroke drawing
    setStage("drawing");

    // 2.30s: "hello" complete -> Enter hold phase (650ms hold)
    const holdTimer = setTimeout(() => {
      setStage("hold");

      // 650ms hold -> Enter smooth exit phase (400ms fade)
      const exitTimer = setTimeout(() => {
        setStage("exiting");

        // 400ms exit fade -> Done & callback
        const doneTimer = setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 400);

        return () => clearTimeout(doneTimer);
      }, 650);

      return () => clearTimeout(exitTimer);
    }, 2300);

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
        animate={{
          opacity: stage === "exiting" ? 0 : 1,
          scale: stage === "exiting" ? 1.015 : 1,
        }}
        exit={{ opacity: 0, scale: 1.015 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none bg-[#171714] overflow-hidden"
        aria-hidden="true"
      >
        {/* SUBTLE ATMOSPHERIC DARK BACKGROUND MOTION */}
        {/* 1. Large Blurred Warm Gold Organic Glow Shape */}
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [-15, 15, -15],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#FFD42A]/10 blur-[90px] pointer-events-none"
        />

        {/* 2. Secondary Warm Muted Gold Shape (#3A3728) */}
        <motion.div
          animate={{
            x: [15, -15, 15],
            y: [12, -12, 12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#3A3728]/35 blur-[70px] pointer-events-none"
        />

        {/* 3. Thin Organic Ambient Line */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <motion.path
            d="M -100 200 Q 400 100 900 300 T 1800 200"
            fill="none"
            stroke="#FFD42A"
            strokeWidth="1"
            animate={{
              d: [
                "M -100 200 Q 400 100 900 300 T 1800 200",
                "M -100 220 Q 450 80 950 320 T 1800 180",
                "M -100 200 Q 400 100 900 300 T 1800 200",
              ],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* CENTERED HANDWRITTEN SVG CONTAINER (Desktop: 220–250px wide, Mobile: 150px wide) */}
        <div className="relative w-40 sm:w-56 md:w-64 h-auto aspect-[180/75] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 180 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_2px_18px_rgba(247,241,230,0.18)]"
          >
            {/* Guide Stroke Underlay (Soft Cream Off-White #F7F1E6 at 12% opacity) */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#F7F1E6"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.12}
            />

            {/* Primary Continuous Pen Stroke (#F7F1E6 Warm Cream) */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#F7F1E6"
              strokeWidth="3"
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
                        duration: 2.3, // Exact 2.3s continuous stroke drawing speed
                        ease: [0.4, 0, 0.2, 1], // Smooth organic pen movement
                      },
                      opacity: { duration: 0.1 },
                    }
              }
            />

            {/* Subtle Yellow Accent Endpoint Dot at the End of the "o" Loop */}
            <motion.circle
              cx="172"
              cy="43"
              r="2"
              fill="#FFD42A"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage === "hold" || stage === "exiting" ? 1 : 0,
                opacity: stage === "hold" || stage === "exiting" ? 0.9 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelloAnimation;
