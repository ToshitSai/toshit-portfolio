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

        {/* Editorial Bio Feature Block */}
        <div className="space-y-8 max-w-4xl">
          <p className="text-xl sm:text-2xl lg:text-3xl text-ink font-sans leading-relaxed sm:leading-relaxed tracking-[-0.015em] font-normal">
            Building software at the intersection of applied AI & modern design — from AI-powered resume evaluators to intelligent context-aware applications, bringing scalable full-stack web experiences to life.
          </p>



        </div>
      </div>
    </section>
  );
};

export default About;
