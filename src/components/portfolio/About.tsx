import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-28 sm:py-36 md:py-44 bg-cream text-ink overflow-hidden z-10">
      {/* Drifting Background Cloud Graphic */}
      <div className="absolute top-12 right-[-5%] w-72 sm:w-96 opacity-25 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#82BCE5"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Section Header Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12 sm:mb-16"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-accent shadow-sm" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-ink-light font-semibold">
            01 // ABOUT ME
          </span>
        </motion.div>

        {/* Top Main Paragraph - Shortened, punchy & compact matching Image 2 style */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-lg sm:text-2xl md:text-[1.85rem] text-ink font-sans leading-[1.5] tracking-[-0.015em] font-normal max-w-3xl text-center"
        >
          Computer Science student at NIAT, building software at the intersection of applied AI & modern design – from AI-powered tools to context-aware applications, shipping scalable web experiences.
        </motion.p>

        {/* Bottom Impact Statement - Styled exactly like Image 2 Bottom Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-3xl text-center mt-12 sm:mt-16 md:mt-20"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] text-ink font-sans leading-[1.3] tracking-[-0.015em] font-bold">
            I believe every great design forms the basis for an even greater story and I'm here to keep writing mine.
          </h3>

          {/* Floating Dashed SVG Line Accent matching Image 2 */}
          <div className="absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-10 md:-right-16 pointer-events-none opacity-50 select-none">
            <svg width="64" height="42" viewBox="0 0 64 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 8 C 24 20, 44 14, 58 38"
                stroke="#20252B"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

