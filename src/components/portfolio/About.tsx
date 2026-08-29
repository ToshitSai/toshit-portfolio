import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 md:py-36 bg-cream text-ink overflow-hidden z-10 select-none">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">

        {/* Large Editorial Serif Display Heading — Clickable to /about */}
        <Link to="/about" className="group block max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(1.8rem,4vw,3.2rem)] font-serif font-normal leading-[1.2] text-[#20252B] text-center mb-8 group-hover:opacity-90 transition-opacity cursor-pointer"
          >
            Some people collect ideas. I prefer to build them. I’m Toshit Sai —{" "}
            <span className="italic underline decoration-[#FFD42A] decoration-wavy decoration-2">
              exploring AI
            </span>
            , turning curiosity into working applications, and learning something new every time I put an idea on a screen.
          </motion.h2>
        </Link>

        {/* Subtext Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal mb-10"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>

      </div>
    </section>
  );
};

export default About;
