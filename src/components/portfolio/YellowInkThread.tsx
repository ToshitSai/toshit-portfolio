import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Subtle hand-drawn yellow thread at selected section transitions.
 * Extends on scroll down, retracts on scroll up — scroll-linked only.
 */
const YellowInkThread: React.FC = () => {
  const bridgeRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: bridgeRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.55, 0.85], shouldReduceMotion ? [1, 1, 1] : [0, 1, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.7, 0.7, 0]);

  return (
    <div
      ref={bridgeRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 z-[15] h-[120px] -mt-[60px]"
      style={{ top: "82vh" }}
    >
      <motion.svg
        viewBox="0 0 400 80"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-x-[8%] top-0 h-full w-[84%] overflow-visible"
        style={{ opacity }}
      >
        <motion.path
          d="M 0 60 Q 80 20, 160 45 T 320 35 T 400 50"
          stroke="#FFD42A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          style={{ pathLength }}
        />
      </motion.svg>
    </div>
  );
};

export default YellowInkThread;
