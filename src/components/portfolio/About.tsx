import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#F7F1E5" }}
      className="relative w-full min-h-[80vh] flex flex-col justify-center items-center py-[140px] lg:py-[180px] px-5 sm:px-8 text-[#1F2328] overflow-hidden z-10 select-none"
    >
      {/* ATMOSPHERIC PAPER GRAIN OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilter)" />
        </svg>
      </div>

      <div className="max-w-[1200px] w-full mx-auto text-center relative z-10 flex flex-col items-center">
        {/* INTRODUCTORY EDITORIAL PARAGRAPH */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 3.2vw, 48px)",
            lineHeight: 1.18,
            letterSpacing: "-0.025em",
            color: "#1F2328",
          }}
          className="max-w-[1100px] mx-auto text-center"
        >
          I design and build intelligent digital products — from AI-powered tools and automation systems to context-aware web applications, turning complex ideas into useful, scalable experiences.
        </motion.p>

        {/* SPACIOUS VERTICAL SEPARATOR / GAP (100px–140px) */}
        <div className="h-[100px] sm:h-[120px] lg:h-[140px]" />

        {/* SECOND BOLD PHILOSOPHY STATEMENT */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(27px, 3vw, 44px)",
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            color: "#1F2328",
          }}
          className="max-w-[1050px] mx-auto text-center"
        >
          I believe great software should feel as considered as great design — and I'm here to build experiences that make complex technology feel simple.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
