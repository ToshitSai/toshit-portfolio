import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked motion connected directly to viewport scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "center 45%"],
  });

  const { scrollYProgress: statementProgress } = useScroll({
    target: sectionRef,
    offset: ["start 65%", "center 30%"],
  });

  // Smooth scroll-driven opacity and vertical transform
  const paragraphOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [30, 0]);

  const statementOpacity = useTransform(statementProgress, [0, 1], [0, 1]);
  const statementY = useTransform(statementProgress, [0, 1], [25, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 md:py-36 min-h-[50vh] flex flex-col justify-center items-center bg-[#FFF8E8] text-[#20252B] overflow-hidden z-10 select-none"
    >
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 flex flex-col items-center justify-center text-center">
        {/* TOP EDITORIAL BADGE */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#20252B]/70 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block" />
          <span>ABOUT ME</span>
        </div>

        {/* Introductory Paragraph — Editorial Instrument Serif Typography */}
        <motion.h2
          style={
            shouldReduceMotion
              ? {}
              : {
                  opacity: paragraphOpacity,
                  y: paragraphY,
                }
          }
          className="w-full max-w-[920px] mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#20252B] font-serif font-medium leading-[1.12] tracking-tight text-center"
        >
          I'm Toshit Sai, a Computer Science Engineering student specializing in AI &amp; Machine Learning. I build with <span className="italic underline decoration-[#FFD42A] decoration-wavy decoration-2 font-normal">Generative AI</span>, explore intelligent systems, and turn ideas into useful digital experiences.
        </motion.h2>

        {/* Second Bold Statement — Personal Highlight */}
        <motion.div
          style={
            shouldReduceMotion
              ? {}
              : {
                  opacity: statementOpacity,
                  y: statementY,
                }
          }
          className="w-full max-w-[720px] mx-auto mt-6 sm:mt-8 text-center flex flex-col items-center gap-4"
        >
          <p className="text-base sm:text-lg md:text-xl text-[#20252B]/80 font-sans leading-relaxed font-normal">
            I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
