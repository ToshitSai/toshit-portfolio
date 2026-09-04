import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface HelloAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * Hand-drawn lowercase cursive "hello" SVG path data.
 * Continuous pen stroke in viewBox 0 0 180 75.
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
      }, 500);
      return () => clearTimeout(timer);
    }

    // Specification Timeline:
    // 0.00s: Start pen stroke drawing
    setStage("drawing");

    // 1.80s: "hello" drawing complete -> Enter hold phase (500ms hold)
    const holdTimer = setTimeout(() => {
      setStage("hold");

      // 500ms hold -> Enter smooth exit fade phase (400ms fade)
      const exitTimer = setTimeout(() => {
        setStage("exiting");

        // 400ms exit fade -> Done & callback
        const doneTimer = setTimeout(() => {
          setStage("done");
          if (onComplete) onComplete();
        }, 400);

        return () => clearTimeout(doneTimer);
      }, 500);

      return () => clearTimeout(exitTimer);
    }, 1800);

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
          scale: stage === "exiting" ? 1.012 : 1,
        }}
        exit={{ opacity: 0, scale: 1.012 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none bg-[#FBF7ED] studio-noise-bg overflow-hidden"
        aria-hidden="true"
      >
        {/* SUBTLE EDITORIAL PAPER FAINT DOT GRID */}
        <div className="absolute inset-0 bg-[radial-gradient(#20252B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />

        {/* SOFT WARM SUNLIGHT AMBIENT HIGHLIGHT */}
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#FFD42A]/15 blur-[80px] pointer-events-none"
        />

        {/* CENTERED HANDWRITTEN SVG CONTAINER (Desktop: 220–260px wide, Mobile: 150px wide) */}
        <div className="relative w-40 sm:w-56 md:w-64 h-auto aspect-[180/75] flex items-center justify-center z-10">
          <svg
            viewBox="0 0 180 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_16px_rgba(32,37,43,0.08)]"
          >
            {/* Guide Stroke Underlay (Soft Charcoal Ink #20252B at 8% opacity) */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#20252B"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.08}
            />

            {/* Primary Pen Stroke (#20252B Ink Charcoal) */}
            <motion.path
              d={HELLO_SVG_PATH}
              fill="none"
              stroke="#20252B"
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
                        duration: 1.8, // 1.8s drawing speed matching ~1.5-2s spec
                        ease: [0.4, 0, 0.2, 1], // Organic fluid pen motion
                      },
                      opacity: { duration: 0.1 },
                    }
              }
            />

            {/* Yellow Accent Pop Dot at the completion tip of the loop */}
            <motion.circle
              cx="172"
              cy="43"
              r="2.5"
              fill="#FFD42A"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage === "hold" || stage === "exiting" ? 1 : 0,
                opacity: stage === "hold" || stage === "exiting" ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: "backOut" }}
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelloAnimation;
