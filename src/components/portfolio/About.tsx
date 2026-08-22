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
        
        {/* 1. MAIN EDITORIAL PARAGRAPH */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(20px, 2.5vw, 32px)",
            lineHeight: 1.4,
            letterSpacing: "-0.015em",
            color: "#1F2328",
          }}
          className="max-w-[880px] text-center mx-auto opacity-95 mb-16 sm:mb-20 lg:mb-24"
        >
          I&apos;m Toshit Sai, a Computer Science Engineering student specializing in AI &amp; Machine Learning. I design and build intelligent digital tools and web applications, turning complex ideas into scalable experiences.
        </motion.p>

        {/* 2. SECOND BOLD PERSONAL STATEMENT */}
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(19px, 2.2vw, 28px)",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            color: "#1F2328",
          }}
          className="max-w-[780px] text-center mx-auto"
        >
          I believe the best software happens when machine intelligence meets thoughtful engineering — and I&apos;m here to keep building mine.
        </motion.h3>

      </div>
    </section>
  );
};

export default About;
