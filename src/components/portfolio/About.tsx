import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 md:py-36 bg-cream text-ink overflow-hidden z-10 select-none">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* Eyebrow Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 mb-8 sm:mb-10"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] shadow-xs" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#20252B]/70 font-semibold">
            ABOUT ME
          </span>
        </motion.div>

        {/* Large Editorial Serif Display Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.8rem,4vw,3.2rem)] font-serif font-normal leading-[1.2] text-[#20252B] max-w-3xl text-center mb-8"
        >
          I'm Toshit Sai, a Computer Science Engineering student specializing in AI &amp; Machine Learning. I build with{" "}
          <span className="italic underline decoration-[#FFD42A] decoration-wavy decoration-2">
            Generative AI
          </span>
          , explore intelligent systems, and turn ideas into useful digital experiences.
        </motion.h2>

        {/* Subtext Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
