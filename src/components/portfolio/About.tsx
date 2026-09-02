import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const YellowUnderline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="relative inline-block font-semibold text-[#20252B]">
    {children}
    <svg
      className="absolute -bottom-1 left-0 w-full h-[10px] text-[#FFD42A] overflow-visible pointer-events-none"
      viewBox="0 0 160 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 10C42 4 105 13 158 6"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 sm:py-28 md:py-36 bg-cream text-ink overflow-hidden z-10 select-none">
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">

        {/* Large Modern Sans-Serif Display Heading — Clickable to /about */}
        <Link to="/about" className="group block w-full">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-medium text-[26px] sm:text-[34px] md:text-[42px] lg:text-[50px] xl:text-[56px] leading-[1.14] tracking-[-0.018em] text-[#20252B] text-center mb-8 group-hover:opacity-95 transition-opacity cursor-pointer max-w-[1080px] mx-auto"
          >
            I’m Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and{" "}
            <YellowUnderline>
              Generative AI
            </YellowUnderline>{" "}
            systems to experiences designed for real people.
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
