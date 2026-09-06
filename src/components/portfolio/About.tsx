import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Editorial Chapter Motion Physics: 35px -> 0 -> -20px
  const headingY = useTransform(scrollYProgress, [0, 0.45, 0.9], shouldReduceMotion ? [0, 0, 0] : [35, 0, -20]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0, 1, 1, 0.65]);

  const subtextY = useTransform(scrollYProgress, [0.06, 0.5, 0.95], shouldReduceMotion ? [0, 0, 0] : [45, 0, -16]);
  const subtextOpacity = useTransform(scrollYProgress, [0.06, 0.3, 0.82, 1], [0, 1, 1, 0.65]);

  // Hand-drawn Decorative Element Parallax Offsets
  const decorDotY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [30, -14]);
  const decorLineY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [20, -28]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full py-24 sm:py-32 bg-cream text-[#333333] overflow-hidden z-10 select-none"
    >
      {/* Hand-Drawn Editorial Decorative Objects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: decorDotY }}
          className="absolute top-12 left-[10%] sm:left-[15%] w-3 h-3 rounded-full bg-[#FFD42A] opacity-80 shadow-xs"
        />
        <motion.div
          style={{ y: decorLineY }}
          className="absolute bottom-16 right-[12%] sm:right-[18%] w-16 h-[2px] bg-[#1D2024]/12 rounded-full"
        />
      </div>

      <div className="max-w-[980px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Display Heading Statement — Clickable to /about */}
        <Link to="/about" className="group block w-full">
          <motion.h2
            style={{
              fontFamily: '"Host Grotesk", sans-serif',
              fontWeight: 400,
              color: '#333333',
              y: headingY,
              opacity: headingOpacity,
            }}
            className="text-lg sm:text-2xl md:text-[28px] leading-[1.5] sm:leading-[1.4] text-center mb-6 sm:mb-8 group-hover:opacity-95 transition-opacity cursor-pointer max-w-[820px] mx-auto"
          >
            I’m Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and Generative AI systems to experiences designed for real people.
          </motion.h2>
        </Link>

        {/* Subtext Paragraph */}
        <motion.p
          style={{
            y: subtextY,
            opacity: subtextOpacity,
          }}
          className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal mb-8"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
