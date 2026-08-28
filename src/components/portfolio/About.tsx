import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
  const paragraphOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [35, 0]);

  const statementOpacity = useTransform(statementProgress, [0, 1], [0, 1]);
  const statementY = useTransform(statementProgress, [0, 1], [35, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-18 sm:py-24 md:py-32 min-h-[50vh] flex flex-col justify-center items-center bg-cream text-ink overflow-hidden z-10 select-none"
    >
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 flex flex-col items-center justify-center text-center">
        {/* Introductory Paragraph — Scaled Down Editorial Typography */}
        <motion.p
          style={
            shouldReduceMotion
              ? {}
              : {
                  opacity: paragraphOpacity,
                  y: paragraphY,
                }
          }
          className="w-full max-w-[880px] mx-auto text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] text-ink font-sans leading-[1.55] tracking-[-0.015em] font-normal text-center"
        >
          I'm Toshit Sai, a Computer Science Engineering student specializing in AI &amp; Machine Learning. I build with Generative AI, explore intelligent systems, and turn ideas into useful digital experiences.
        </motion.p>

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
          className="w-full max-w-[750px] mx-auto mt-5 sm:mt-7 md:mt-8 text-center flex flex-col items-center gap-6"
        >
          <h3 className="text-base sm:text-lg md:text-xl lg:text-[1.5rem] text-ink font-sans leading-[1.4] tracking-[-0.02em] font-bold">
            I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
          </h3>

          <Link
            to="/about"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121417] text-white font-mono text-xs font-bold uppercase tracking-[0.18em] shadow-sm hover:bg-black hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Read Full Editorial Story</span>
            <ArrowRight className="w-4 h-4 text-[#FFD42A] group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;


