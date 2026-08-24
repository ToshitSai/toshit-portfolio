import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Sparkles, Terminal, Cpu, ArrowUpRight } from "lucide-react";

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Scroll-linked transforms for smooth parallax & scroll-driven motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers and subtle rotation linked to scroll position
  const sunRotation = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const textParallaxY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const cardStackParallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={containerRef}
      style={{ backgroundColor: "#FAF6ED" }}
      className="relative w-full min-h-[90vh] sm:min-h-screen py-24 sm:py-32 lg:py-40 text-[#1B1B18] overflow-hidden z-10 select-none transition-colors duration-700"
    >
      {/* 1. SUBTLE EDITORIAL PAPER NOISE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilterScrapbook">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilterScrapbook)" />
        </svg>
      </div>

      {/* 2. HAND-DRAWN DECORATIVE SVG SUN (UPPER RIGHT) WITH SCROLL ROTATION */}
      <motion.div
        style={{ rotate: sunRotation, y: backgroundY }}
        className="absolute top-10 right-6 sm:top-14 sm:right-16 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none opacity-85 z-0"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Sun Core */}
          <circle cx="50" cy="50" r="18" fill="#FFD42A" fillOpacity="0.25" stroke="#FFD42A" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#FFD42A" />
          {/* Organic Radiating Sun Rays */}
          <path
            d="M 50 12 L 50 22 M 50 78 L 50 88 M 12 50 L 22 50 M 78 50 L 88 50 M 23 23 L 30 30 M 70 70 L 77 77 M 77 23 L 70 30 M 30 70 L 23 77"
            stroke="#FFD42A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* 3. HAND-DRAWN DECORATIVE ORGANIC LEAF & ARC (BOTTOM LEFT) */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 pointer-events-none opacity-30 z-0"
        aria-hidden="true"
      >
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 20 120 C 50 80, 90 50, 120 20 M 70 60 C 55 45, 45 55, 52 72 C 60 85, 78 78, 70 60 Z M 95 32 C 85 20, 72 28, 80 44 C 88 56, 102 48, 95 32 Z"
            stroke="#1B1B18"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* 4. MAIN TWO-COLUMN CONTAINER */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: EDITORIAL TEXT & IDENTITY (7 COLS ON DESKTOP) */}
          <motion.div style={{ y: textParallaxY }} className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Small Monospace Label with Yellow Accent Dot */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs text-[#85847C] uppercase tracking-[0.22em] font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A]" />
              <span>ABOUT ME</span>
            </motion.div>

            {/* Display Heading Line 1 & Line 2 (Instrument Serif) */}
            <div className="overflow-hidden space-y-1">
              <motion.h2
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-4xl sm:text-6xl lg:text-[72px] font-normal leading-[0.98] text-[#1B1B18] tracking-tight"
              >
                BUILDING WITH AI.
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-4xl sm:text-6xl lg:text-[72px] font-normal leading-[0.98] text-[#1B1B18]/90 tracking-tight"
              >
                CREATING WHAT&apos;S NEXT.
              </motion.h2>
            </div>

            {/* Main Paragraph Description */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="space-y-4 text-base sm:text-lg lg:text-[19px] text-[#1B1B18]/80 font-sans leading-relaxed max-w-2xl"
            >
              <p>
                I&apos;m <strong className="font-semibold text-[#1B1B18]">Toshit Sai</strong>, a Computer Science Engineering student specializing in <strong className="font-semibold text-[#1B1B18]">Artificial Intelligence &amp; Machine Learning</strong>. I build at the intersection of intelligent automation, prompt engineering, and context-aware web experiences.
              </p>
              <p className="text-[#1B1B18]/75">
                From LLM applications and automated pipelines to high-performance user interfaces, I focus on shipping tools that feel fast, intuitive, and genuinely human.
              </p>
            </motion.div>

            {/* Personal Statement Quote Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-[#1B1B18]/10 shadow-xs relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD42A]" />
              <p className="text-sm sm:text-base font-sans italic text-[#1B1B18]/90 font-medium leading-relaxed pl-2">
                &ldquo;Every great design forms the basis for an even greater story — and I&apos;m here to keep writing mine.&rdquo;
              </p>
            </motion.div>

            {/* Quick Spec Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.52 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B1B18]/5 border border-[#1B1B18]/10 font-mono text-[11px] sm:text-xs text-[#1B1B18]/80 font-medium">
                <Cpu className="w-3.5 h-3.5 text-[#1B1B18]" />
                B.Tech CSE (AI / ML)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B1B18]/5 border border-[#1B1B18]/10 font-mono text-[11px] sm:text-xs text-[#1B1B18]/80 font-medium">
                <Terminal className="w-3.5 h-3.5 text-[#1B1B18]" />
                Generative AI &amp; LLM Apps
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFD42A]/20 border border-[#FFD42A]/40 font-mono text-[11px] sm:text-xs text-[#1B1B18] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#1B1B18]" />
                Prompt Engineering
              </span>
            </motion.div>

          </motion.div>

          {/* RIGHT COLUMN: PHYSICAL PHOTO CARD STACK (5 COLS ON DESKTOP) */}
          <motion.div
            style={{ y: cardStackParallaxY }}
            className="lg:col-span-5 relative flex flex-col items-center justify-center py-6 sm:py-10"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] flex items-center justify-center">

              {/* CARD 3 (BOTTOM STACK - ROTATED -2DEG) */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 6 }}
                animate={isInView ? { opacity: 1, x: 0, rotate: -2 } : {}}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl bg-white border border-[#1B1B18]/15 shadow-lg p-5 flex flex-col justify-between select-none transform origin-bottom-left"
                style={{ transform: "rotate(-2deg)" }}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#85847C] tracking-wider uppercase border-b border-[#1B1B18]/10 pb-2">
                  <span>FIG 03. CORE FOCUS</span>
                  <span>AI/ML</span>
                </div>
                <div className="space-y-2 py-4">
                  <div className="font-mono text-xs font-semibold text-[#1B1B18]">SPECIALIZED TOOLKIT</div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-[#1B1B18]/70">
                    <span className="bg-[#FAF6ED] px-2 py-1 rounded border border-[#1B1B18]/10">Python</span>
                    <span className="bg-[#FAF6ED] px-2 py-1 rounded border border-[#1B1B18]/10">LangChain</span>
                    <span className="bg-[#FAF6ED] px-2 py-1 rounded border border-[#1B1B18]/10">Gemini API</span>
                    <span className="bg-[#FAF6ED] px-2 py-1 rounded border border-[#1B1B18]/10">FastAPI</span>
                    <span className="bg-[#FAF6ED] px-2 py-1 rounded border border-[#1B1B18]/10">React</span>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-[#85847C] text-right">03 / 03</div>
              </motion.div>

              {/* CARD 2 (MIDDLE STACK - ROTATED 3DEG) */}
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 8 }}
                animate={isInView ? { opacity: 1, x: 0, rotate: 3 } : {}}
                transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl bg-[#FFFDF6] border border-[#1B1B18]/15 shadow-xl p-5 flex flex-col justify-between select-none transform origin-center"
                style={{ transform: "translate(8px, -10px) rotate(3deg)" }}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#85847C] tracking-wider uppercase border-b border-[#1B1B18]/10 pb-2">
                  <span>FIG 02. EDUCATION</span>
                  <span>HYDERABAD</span>
                </div>
                <div className="space-y-2 py-4">
                  <div className="text-sm font-sans font-semibold text-[#1B1B18]">B.Tech in Computer Science</div>
                  <div className="text-xs font-sans text-[#1B1B18]/75">Specialization in Artificial Intelligence &amp; Machine Learning</div>
                  <div className="pt-2 font-mono text-[11px] text-[#85847C]">Building intelligent software systems.</div>
                </div>
                <div className="font-mono text-[10px] text-[#85847C] text-right">02 / 03</div>
              </motion.div>

              {/* CARD 1 (TOP MAIN IDENTITY CARD - ROTATED -4DEG WITH PAPER TAPE) */}
              <motion.div
                initial={{ opacity: 0, x: 70, rotate: 10 }}
                animate={isInView ? { opacity: 1, x: 0, rotate: -4 } : {}}
                transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl bg-white border border-[#1B1B18]/20 shadow-2xl p-5 sm:p-6 flex flex-col justify-between select-none transform origin-top-right z-10"
                style={{ transform: "translate(-6px, -18px) rotate(-4deg)" }}
              >
                {/* Vintage Washi Tape Mark at Top Edge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FFD42A]/40 backdrop-blur-xs border border-[#FFD42A]/60 shadow-xs rotate-[-2deg] z-20 pointer-events-none" />

                <div className="flex items-center justify-between font-mono text-[10px] text-[#85847C] tracking-wider uppercase border-b border-[#1B1B18]/10 pb-2.5">
                  <span>FIG 01. CREATIVE ARCHITECT</span>
                  <span className="flex items-center gap-1 text-[#1B1B18] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A]" />
                    TOSHIT SAI
                  </span>
                </div>

                {/* Inner Printed Frame Graphic */}
                <div className="relative my-3 p-4 rounded-xl bg-[#FAF6ED] border border-[#1B1B18]/10 flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#1B1B18] text-[#FFF8E8] flex items-center justify-center font-serif text-2xl font-normal shadow-md">
                    TS
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif" }} className="text-2xl text-[#1B1B18]">
                    Toshit Sai Galam
                  </div>
                  <div className="font-mono text-[11px] text-[#85847C] uppercase tracking-wider">
                    AI/ML &amp; Web Developer
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1B1B18]/10 font-mono text-[10px] text-[#85847C]">
                  <span>PORTFOLIO EDITORIAL</span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-[#1B1B18] hover:text-[#FFD42A] transition-colors font-semibold uppercase"
                  >
                    <span>CONNECT</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
