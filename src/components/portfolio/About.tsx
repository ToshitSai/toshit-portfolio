import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const YellowUnderline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="relative inline-block font-semibold text-[#333333]">
    {children}
    <svg
      className="absolute -bottom-1 left-0 w-full h-[6px] text-[#FFD42A] overflow-visible pointer-events-none"
      viewBox="0 0 160 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M1 5.5C40 2.5 105 7.5 159 3.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-cream text-[#333333] overflow-hidden z-10 select-none">
      <div className="max-w-[980px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">

        {/* Display Heading Statement — Clickable to /about */}
        <Link to="/about" className="group block w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Host Grotesk", sans-serif',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: '#333333'
            }}
            className="text-center mb-8 group-hover:opacity-95 transition-opacity cursor-pointer max-w-[820px] mx-auto"
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
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal mb-8"
        >
          I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
        </motion.p>

      </div>
    </section>
  );
};

export default About;
