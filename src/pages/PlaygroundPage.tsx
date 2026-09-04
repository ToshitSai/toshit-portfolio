import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Certificate3DCarousel } from "@/components/portfolio/Certificate3DCarousel";
import CustomCursor from "@/components/portfolio/CustomCursor";

// EDITORIAL PLAYGROUND CANVAS TRANSITION (2026-09-04 DEPLOYMENT)
const playgroundPageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const PlaygroundPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : playgroundPageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FFF8E8] text-[#20252B] selection:bg-[#FFD42A] selection:text-[#20252B] font-sans relative overflow-x-hidden flex flex-col justify-between"
    >
      <CustomCursor />

      {/* AMBIENT QUIET GALLERY CANVAS BACKGROUND DEPTH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[85vw] max-w-[1100px] h-[550px] rounded-full bg-gradient-to-b from-[#FFD42A]/14 via-[#FFF8E8]/50 to-transparent blur-3xl" />

        {/* Minimal Editorial Linework */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="10%" y1="120" x2="90%" y2="120" stroke="#20252B" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="85%" cy="22%" r="5" fill="#FFD42A" stroke="#20252B" strokeWidth="1" />
        </svg>
      </div>

      {/* MAIN PLAYGROUND CONTENT */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-[1360px] mx-auto w-full flex-1 flex flex-col items-center">
        {/* TOP NAVIGATION BREADCRUMB & MONO BADGE */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-between border-b border-[#20252B]/12 pb-5 mb-8 sm:mb-12"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#20252B]/75 transition-colors hover:text-[#20252B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          {/* TOP MONO BADGE */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/85">
            <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block" />
            <span>PLAYGROUND</span>
          </div>
        </motion.div>

        {/* TOP INTRO HEADER */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-3"
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#20252B] tracking-tight">
            Curated Archive
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#20252B]/75 leading-relaxed">
            A small archive of things I've learned, built, and explored.
          </p>
        </motion.div>

        {/* MAIN CINEMATIC 3D CERTIFICATE CAROUSEL EXPERIENCE */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 flex flex-col items-center justify-center"
        >
          <Certificate3DCarousel />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default PlaygroundPage;
