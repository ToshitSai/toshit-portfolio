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
  const paragraphOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [35, 0]);

  const statementOpacity = useTransform(statementProgress, [0, 1], [0, 1]);
  const statementY = useTransform(statementProgress, [0, 1], [35, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 min-h-[70vh] flex flex-col justify-center items-center bg-cream text-ink overflow-hidden z-10 select-none"
    >
      <div className="w-full max-w-[1340px] mx-auto px-6 sm:px-10 md:px-14 lg:px-18 flex flex-col items-center justify-center text-center">
        {/* Large Introductory Paragraph — Modern Sans-Serif Editorial Typography */}
        <motion.p
          style={
            shouldReduceMotion
              ? {}
              : {
                  opacity: paragraphOpacity,
                  y: paragraphY,
                }
          }
          className="w-[92%] max-w-[1240px] mx-auto text-[clamp(1.5rem,3.4vw,3.25rem)] text-ink font-sans leading-[1.3] tracking-[-0.015em] font-normal text-center"
        >
          I'm a Computer Science Engineering student specializing in Artificial Intelligence & Machine Learning, building at the intersection of Generative AI, intelligent automation, prompt engineering, and modern web experiences. From AI-powered applications and LLM workflows to interactive web interfaces, I enjoy turning ideas into products that feel useful, fast, and genuinely human.
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
          className="w-[88%] max-w-[1050px] mx-auto mt-14 sm:mt-20 md:mt-24 text-center"
        >
          <h3 className="text-[clamp(1.25rem,2.5vw,2.35rem)] text-ink font-sans leading-[1.3] tracking-[-0.02em] font-bold">
            I believe great technology should feel simple, useful, and human — and I'm here to keep building mine.
          </h3>
        </motion.div>
      </div>
    </section>
  );
};

export default About;


