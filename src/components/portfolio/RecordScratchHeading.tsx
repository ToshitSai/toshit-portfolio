import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface RecordScratchHeadingProps {
  sectionTag: string; // e.g. "02 // FEATURED WORK"
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  tagColor?: string;
  lineColor?: string;
  accentColor?: string;
}

export const RecordScratchHeading: React.FC<RecordScratchHeadingProps> = ({
  sectionTag,
  title,
  subtitle,
  align = "left",
  className = "",
  tagColor = "text-[#1D2024]/80",
  lineColor = "bg-[#1D2024]/12",
  accentColor = "#FFD42A",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const scratchVariants = {
    initial: shouldReduceMotion
      ? { opacity: 1, rotate: 0, scale: 1, y: 0 }
      : { opacity: 0, rotate: -2, scale: 0.96, y: 15 },
    animate: shouldReduceMotion
      ? { opacity: 1, rotate: 0, scale: 1, y: 0 }
      : {
          opacity: 1,
          rotate: [-2, 1.5, -0.8, 0],
          scale: [0.96, 1.01, 0.99, 1],
          y: 0,
        },
  };

  return (
    <div
      ref={containerRef}
      className={`relative pb-4 mb-10 sm:mb-16 select-none ${align === "center" ? "text-center flex flex-col items-center" : ""} ${className}`}
    >
      {/* SECTION NUMBER & RECURRING VINYL RECORD BADGE MOTIF */}
      <div className={`flex items-center gap-2.5 font-mono text-xs sm:text-[13px] tracking-[0.18em] uppercase mb-4 sm:mb-6 ${tagColor} ${align === "center" ? "justify-center" : ""}`}>
        {/* Spinning Vinyl Record Badge Motif */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 360 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-5 h-5 rounded-full bg-[#1D2024] p-[3px] shadow-sm flex items-center justify-center flex-shrink-0"
        >
          {/* Inner Groove Line */}
          <div className="w-full h-full rounded-full border border-dashed border-white/40 flex items-center justify-center">
            {/* Center Yellow Label */}
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
            />
          </div>
        </motion.div>

        <span className="font-semibold">{sectionTag}</span>
      </div>

      {/* HEADING WITH RECORD-SCRATCH ROTATION WOBBLE */}
      <motion.div
        variants={scratchVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        transition={{
          duration: shouldReduceMotion ? 0.3 : 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="origin-bottom-left max-w-[840px]"
      >
        {typeof title === "string" ? (
          <h2 className="font-serif font-medium text-[clamp(28px,3.8vw,52px)] leading-[1.12] tracking-[-0.01em] text-[#1D2024]">
            {title}
          </h2>
        ) : (
          title
        )}
      </motion.div>

      {/* OPTIONAL SUBTITLE / SUBTEXT */}
      {subtitle && (
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-sm sm:text-base text-[#1D2024]/75 max-w-[620px] leading-relaxed font-sans"
        >
          {subtitle}
        </motion.p>
      )}

      {/* EDITORIAL BOTTOM SEPARATOR LINE */}
      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={isInView || shouldReduceMotion ? { scaleX: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-[1px] ${lineColor} origin-left mt-6 sm:mt-8`}
      />
    </div>
  );
};

export default RecordScratchHeading;
