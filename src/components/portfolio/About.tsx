import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motionDistance } from "@/lib/scrollMotion";
import BentoGridWorkspace from "@/components/portfolio/BentoGridWorkspace";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headingY = 0;
  const headingMask = "inset(0% 0 0 0)";
  const headingOpacity = 1;

  const subtextY = 0;
  const subtextOpacity = 1;

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

      <div className="max-w-[980px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center mb-12 sm:mb-16">
        {/* Display Heading Statement — vertical mask reveal */}
        <Link to="/about" className="group block w-full">
          <motion.h2
            style={{
              fontFamily: '"Instrument Sans", sans-serif',
              fontWeight: 400,
              color: "#1E2024",
              fontSize: "clamp(22px, 2.2vw, 32px)",
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
              y: headingY,
              opacity: headingOpacity,
              clipPath: headingMask,
            }}
            className="text-center transition-opacity group-hover:opacity-95 cursor-pointer max-w-[920px] mx-auto font-instrument-sans"
          >
            I'm Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and Generative AI systems to experiences designed for real people.
          </motion.h2>
        </Link>

        {/* Subtext Paragraph */}
        <motion.p
          style={{
            fontFamily: '"Instrument Sans", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(15px, 1.3vw, 18px)",
            lineHeight: 1.5,
            letterSpacing: "-0.005em",
            color: "rgba(30, 32, 36, 0.65)",
            y: subtextY,
            opacity: subtextOpacity,
          }}
          className="text-center max-w-[640px] mx-auto mt-6 sm:mt-7 font-instrument-sans"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>
      </div>

      {/* Bento Grid Capability Cards with Micro-Animations */}
      <div className="relative z-10">
        <BentoGridWorkspace />
      </div>
    </section>
  );
};

export default About;

