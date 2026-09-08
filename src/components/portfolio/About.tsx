import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motionDistance } from "@/lib/scrollMotion";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Typographic Focus — label → headline mask → support
  const labelY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], shouldReduceMotion ? [0, 0, 0, 0] : [12, 0, -6, -12]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.8]);

  const headingY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], shouldReduceMotion ? [0, 0, 0, 0] : [motionDistance(isMobile, 28), 0, -motionDistance(isMobile, 18), -motionDistance(isMobile, 18)]);
  const headingMask = useTransform(scrollYProgress, [0.05, 0.35], shouldReduceMotion ? ["inset(0% 0 0 0)", "inset(0% 0 0 0)"] : ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.85, 1], [0, 1, 1, 0.75]);

  const subtextY = useTransform(scrollYProgress, [0.1, 0.45, 0.85, 1], shouldReduceMotion ? [0, 0, 0, 0] : [14, 0, -10, -14]);
  const subtextOpacity = useTransform(scrollYProgress, [0.12, 0.38, 0.85, 1], [0, 1, 1, 0.75]);

  const bgY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -motionDistance(isMobile, 8)]);
  const decorLineY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -motionDistance(isMobile, 20)]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-24 sm:py-32 bg-cream text-[#333333] overflow-hidden z-10 select-none"
    >
      {/* Background depth layer */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1D2024_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.025]" />
      </motion.div>

      {/* Hand-Drawn Editorial Decorative Objects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: decorLineY }}
          className="absolute bottom-16 right-[12%] sm:right-[18%] w-16 h-[2px] bg-[#1D2024]/12 rounded-full"
        />
      </div>

      <div className="max-w-[980px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Chapter Tag Label */}
        <motion.div
          style={{ y: labelY, opacity: labelOpacity }}
          className="flex items-center gap-2 font-mono text-xs sm:text-[13px] tracking-[0.18em] uppercase text-[#20252B]/60 font-semibold mb-6 sm:mb-8"
        >
          <span>02 // ABOUT</span>
        </motion.div>

        {/* Display Heading Statement — vertical mask reveal */}
        <Link to="/about" className="group block w-full">
          <motion.h2
            style={{
              fontFamily: '"Host Grotesk", sans-serif',
              fontWeight: 400,
              color: "#333333",
              y: headingY,
              opacity: headingOpacity,
              clipPath: headingMask,
            }}
            className="text-lg sm:text-2xl md:text-[28px] leading-[1.5] sm:leading-[1.4] text-center mb-6 sm:mb-8 group-hover:opacity-95 transition-opacity cursor-pointer max-w-[820px] mx-auto"
          >
            I'm Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and Generative AI systems to experiences designed for real people.
          </motion.h2>
        </Link>

        {/* Subtext Paragraph */}
        <motion.p
          style={{ y: subtextY, opacity: subtextOpacity }}
          className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal mb-8"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
