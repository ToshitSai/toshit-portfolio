import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Certificate3DCarousel } from "@/components/portfolio/Certificate3DCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { SECTION_APPROACH, motionDistance } from "@/lib/scrollMotion";

const PlaygroundPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: SECTION_APPROACH,
  });

  const stageScale = useTransform(scrollYProgress, [0, 0.35, 0.7], shouldReduceMotion ? [1, 1, 1] : [0.98, 1, 1]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75], [0, 1, 1]);
  const stageY = useTransform(scrollYProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [motionDistance(isMobile, 10), 0]);
  const depthY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -motionDistance(isMobile, 8)]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#20252B] selection:bg-[#FFD42A] selection:text-[#20252B] font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* AMBIENT QUIET GALLERY CANVAS BACKGROUND DEPTH */}
      <motion.div style={{ y: depthY }} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[85vw] max-w-[1100px] h-[550px] rounded-full bg-gradient-to-b from-[#FFD42A]/14 via-[#FFF8E8]/50 to-transparent blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="120" x2="90%" y2="120" stroke="#20252B" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="85%" cy="22%" r="5" fill="#FFD42A" stroke="#20252B" strokeWidth="1" />
        </svg>
      </motion.div>

      <main className="relative z-10 pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-[1360px] mx-auto w-full flex-1 flex flex-col items-center">
        <div className="w-full flex items-center justify-between border-b border-[#20252B]/12 pb-5 mb-8 sm:mb-12">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#20252B]/75 transition-colors hover:text-[#20252B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#20252B] tracking-tight">
            Curated Archive
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#20252B]/75 leading-relaxed">
            A small archive of things I've learned, built, and explored.
          </p>
        </div>

        <motion.div
          ref={stageRef}
          style={{ scale: stageScale, opacity: stageOpacity, y: stageY }}
          className="w-full flex-1 flex flex-col items-center justify-center"
        >
          <Certificate3DCarousel />
        </motion.div>
      </main>
    </div>
  );
};

export default PlaygroundPage;
