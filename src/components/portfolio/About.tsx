import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-cream text-ink overflow-hidden z-10">
      {/* Drifting Background Cloud Graphic */}
      <div className="absolute top-12 right-[-5%] w-72 sm:w-96 opacity-30 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#82BCE5"
          />
        </svg>
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          <span className="label-mono text-ink-light">01 // ABOUT ME</span>
        </div>

        {/* H2 Headline */}
        <h2 className="text-display text-[clamp(2.2rem,5.5vw,4.2rem)] text-ink mb-12 sm:mb-16 max-w-4xl">
          Building Software at the Intersection of Applied AI & Modern Design.
        </h2>

        {/* Two-Column Bio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-6 text-base sm:text-lg text-ink/80 leading-relaxed font-sans">
            <p>
              I'm <strong className="text-ink font-semibold">Toshit Sai Galam</strong>, a Computer Science student at <span className="underline decoration-yellow-accent decoration-2 underline-offset-4 font-medium text-ink">NxtWave Institute of Advanced Technologies (NIAT), Chaitanya Deemed to be University</span>.
            </p>
            <p>
              Driven by a deep passion for building intuitive, high-performance web applications, I leverage cutting-edge LLM APIs, autonomous agents, and modern frontend frameworks to create impactful software solutions.
            </p>
          </div>

          <div className="space-y-6 text-base sm:text-lg text-ink/80 leading-relaxed font-sans">
            <p>
              My work spans intelligent web tools like <strong className="text-ink font-semibold">HireScope AI</strong> (Job Gem Grader) for AI resume evaluation and <strong className="text-ink font-semibold">Greetly AI</strong> for personalized context-aware message generation.
            </p>
            
            {/* Quick Highlight Stats Pill */}
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cream-paper border border-ink/10 shadow-sm hover:border-yellow-accent transition-colors">
                <div className="text-2xl sm:text-3xl font-serif text-ink font-bold">100%</div>
                <div className="text-xs font-mono tracking-wider text-ink-light uppercase mt-1">Code Quality Focus</div>
              </div>
              <div className="p-4 rounded-2xl bg-cream-paper border border-ink/10 shadow-sm hover:border-yellow-accent transition-colors">
                <div className="text-2xl sm:text-3xl font-serif text-ink font-bold">Applied AI</div>
                <div className="text-xs font-mono tracking-wider text-ink-light uppercase mt-1">Full-Stack Engineering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
