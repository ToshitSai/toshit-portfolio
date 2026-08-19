import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#FBF5EA" }}
      className="relative w-full min-h-[80vh] flex flex-col justify-center items-center py-[130px] lg:py-[160px] px-5 sm:px-10 text-[#111111] overflow-hidden z-10 select-none"
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

      <div className="max-w-[1250px] w-full mx-auto text-center relative z-10 flex flex-col items-center">
        {/* FIRST PARAGRAPH (REGULAR WEIGHT 400, ELEGANT EDITORIAL TYPOGRAPHY) */}
        <div className="relative w-full max-w-[1250px] mx-auto">
          {/* SUBTLE DECORATIVE EDGE DOT (MATCHING REFERENCE COMPOSITION) */}
          <span className="hidden md:block absolute -left-6 top-[18px] w-[7px] h-[7px] rounded-full bg-[#111111] opacity-75" />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(27px, 3.15vw, 47px)",
              lineHeight: 1.16,
              letterSpacing: "-0.025em",
              color: "#111111",
            }}
            className="text-center mx-auto"
          >
            I design and build intelligent digital products — from AI-powered tools and automation systems to context-aware web applications, turning complex ideas into useful, scalable experiences.
          </motion.p>
        </div>

        {/* SPACIOUS VERTICAL GAP (100px - 130px) */}
        <div className="h-[90px] sm:h-[110px] lg:h-[130px]" />

        {/* SECOND BOLD STATEMENT (HEAVIER WEIGHT 600) */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(26px, 3vw, 44px)",
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
            color: "#111111",
          }}
          className="max-w-[1250px] text-center mx-auto"
        >
          I believe great software should feel as considered as great design — and I'm here to build experiences that make complex technology feel simple.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
