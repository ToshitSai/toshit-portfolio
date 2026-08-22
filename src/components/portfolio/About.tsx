import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-12%" });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#FAF6ED" }}
      className="relative w-full py-28 sm:py-36 lg:py-48 text-[#1F2328] overflow-hidden z-10 select-none"
    >
      {/* SUBTLE PAPER NOISE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilterClean">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilterClean)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col items-center text-center">
        
        {/* 1. LARGE CENTERED MAIN EDITORIAL PARAGRAPH */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 3.6vw, 46px)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: "#1F2328",
          }}
          className="max-w-[1100px] text-center mx-auto opacity-95"
        >
          I&apos;m Toshit Sai, a B.Tech Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning. I design and build intelligent digital products — from AI-powered tools and automation systems to context-aware web applications, turning complex algorithms into useful, scalable experiences.
        </motion.p>

        {/* 2. SUBTLE ELEGANT DIVIDER / ARROW SPACING */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="my-16 sm:my-20 lg:my-24 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-12 sm:h-16 bg-[#1F2328]/20" />
          <span className="font-mono text-sm tracking-widest text-[#1F2328]/40">↓</span>
        </motion.div>

        {/* 3. SECOND LARGE CENTERED BOLD PERSONAL STATEMENT */}
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(24px, 3.2vw, 42px)",
            lineHeight: 1.25,
            letterSpacing: "-0.025em",
            color: "#1F2328",
          }}
          className="max-w-[950px] text-center mx-auto"
        >
          I believe the best software happens when machine intelligence meets thoughtful engineering — and I&apos;m here to keep building mine.
        </motion.h3>

      </div>
    </section>
  );
};

export default About;
