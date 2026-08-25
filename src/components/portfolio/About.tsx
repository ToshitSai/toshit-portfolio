import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 md:py-36 bg-cream text-ink overflow-hidden z-10">
      {/* Drifting Background Cloud Graphic */}
      <div className="absolute top-12 right-[-5%] w-72 sm:w-96 opacity-25 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#82BCE5"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Section Header Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10 sm:mb-12"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-accent shadow-sm" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-ink-light font-semibold">
            01 // ABOUT ME
          </span>
        </motion.div>

        {/* Top Main Paragraph - Smaller, refined editorial font */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl lg:text-[1.35rem] text-ink font-sans leading-[1.6] tracking-[-0.01em] font-normal max-w-2xl text-center"
        >
          Computer Science student at NIAT, building software at the intersection of applied AI & modern design – from AI-powered tools to context-aware applications, shipping scalable web experiences.
        </motion.p>

        {/* Bottom Impact Statement - Smaller, refined bold font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-center mt-10 sm:mt-12 md:mt-14"
        >
          <h3 className="text-base sm:text-lg md:text-xl lg:text-[1.45rem] text-ink font-sans leading-[1.4] tracking-[-0.015em] font-bold">
            I believe every great design forms the basis for an even greater story and I'm here to keep writing mine.
          </h3>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

