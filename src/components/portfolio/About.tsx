import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// --- INTERACTIVE AI SYSTEM VISUAL SUB-COMPONENT ---
const AISystemVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized delta (-1 to 1)
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      // Clamp values and set target position (max 10px shift)
      setTargetPos({
        x: Math.max(-1, Math.min(1, deltaX)) * 10,
        y: Math.max(-1, Math.min(1, deltaY)) * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth lerp animation loop for mouse reaction
  useEffect(() => {
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      setMousePos((prev) => ({
        x: lerp(prev.x, targetPos.x, 0.08),
        y: lerp(prev.y, targetPos.y, 0.08),
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos]);

  // Nodes for the connected constellation
  const nodes = [
    { id: 1, cx: 120, cy: 60, r: 4 },
    { id: 2, cx: 200, cy: 110, r: 4.5 },
    { id: 3, cx: 230, cy: 210, r: 4 },
    { id: 4, cx: 150, cy: 260, r: 5 },
    { id: 5, cx: 70, cy: 200, r: 3.5 },
    { id: 6, cx: 60, cy: 110, r: 4 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center pointer-events-auto"
    >
      {/* ROTATING MICRO-ELEMENT (TEXT CIRCLE FOLLOWING ROTATION) */}
      <div className="absolute inset-0 flex items-center justify-center animate-[spin_24s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <path
              id="textCirclePath"
              d="M 150, 150 m -115, 0 a 115,115 0 1,1 230,0 a 115,115 0 1,1 -230,0"
            />
          </defs>
          <text className="text-[10px] font-mono tracking-[0.24em] fill-[#20252B]/40 uppercase font-medium">
            <textPath href="#textCirclePath" startOffset="0%">
              AI • DESIGN • SOFTWARE • SYSTEMS • CREATIVE TECH •
            </textPath>
          </text>
        </svg>
      </div>

      {/* ORBITAL RINGS & CONSTELLATION GRAPHIC */}
      <svg
        viewBox="0 0 300 300"
        className="w-[82%] h-[82%] relative z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
      >
        {/* Outer subtle orbital ring */}
        <circle
          cx="150"
          cy="150"
          r="105"
          fill="none"
          stroke="#20252B"
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="4 6"
        />

        {/* Inner orbital ring */}
        <circle
          cx="150"
          cy="150"
          r="72"
          fill="none"
          stroke="#20252B"
          strokeWidth="1"
          strokeOpacity="0.16"
        />

        {/* Dynamic Connecting Lines to Center */}
        {nodes.map((node) => (
          <line
            key={`center-line-${node.id}`}
            x1="150"
            y1="150"
            x2={node.cx + mousePos.x * 0.4}
            y2={node.cy + mousePos.y * 0.4}
            stroke="#20252B"
            strokeWidth="1"
            strokeOpacity="0.15"
          />
        ))}

        {/* Node to Node Interconnecting Web Lines */}
        <path
          d={`M ${nodes[0].cx + mousePos.x * 0.4} ${nodes[0].cy + mousePos.y * 0.4} L ${nodes[1].cx + mousePos.x * 0.3} ${nodes[1].cy + mousePos.y * 0.3} L ${nodes[2].cx + mousePos.x * 0.5} ${nodes[2].cy + mousePos.y * 0.5} L ${nodes[3].cx + mousePos.x * 0.2} ${nodes[3].cy + mousePos.y * 0.2} L ${nodes[4].cx + mousePos.x * 0.4} ${nodes[4].cy + mousePos.y * 0.4} L ${nodes[5].cx + mousePos.x * 0.3} ${nodes[5].cy + mousePos.y * 0.3} Z`}
          fill="none"
          stroke="#20252B"
          strokeWidth="1"
          strokeOpacity="0.1"
        />

        {/* Satellite Nodes */}
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={node.cx + mousePos.x * 0.4}
            cy={node.cy + mousePos.y * 0.4}
            r={node.r}
            fill="#20252B"
            fillOpacity="0.75"
          />
        ))}

        {/* CENTRAL GLOWING ACCENT NODE (YELLOW CORE) */}
        <circle cx="150" cy="150" r="16" fill="#FFD42A" fillOpacity="0.25" className="animate-pulse" />
        <circle cx="150" cy="150" r="7" fill="#FFD42A" />
        <circle cx="150" cy="150" r="3" fill="#20252B" />
      </svg>

      {/* Subtle Corner Markers */}
      <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#20252B]/30" />
      <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#20252B]/30" />
      <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#20252B]/30" />
      <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#20252B]/30" />
    </div>
  );
};

// --- INTERACTIVE HEADLINE WORD COMPONENT ---
interface HoverWordProps {
  word: string;
}

const HoverWord: React.FC<HoverWordProps> = ({ word }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block transition-transform duration-200 cursor-default"
      style={{
        transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
      }}
    >
      {word}&nbsp;
    </span>
  );
};

// --- MAIN ABOUT COMPONENT ---
const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const headlineLines = [
    "Building Software",
    "at the Intersection of Applied AI",
    "& Modern Design.",
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full pt-36 sm:pt-44 lg:pt-48 pb-28 sm:pb-36 bg-cream text-ink overflow-hidden z-10 select-none"
    >
      {/* ATMOSPHERIC PAPER GRAIN OVERLAY */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* TOP EDITORIAL HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#20252B]/10 pb-6 mb-16 sm:mb-20 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#20252B]/70 uppercase font-semibold">
              01 // ABOUT ME
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#20252B]/50 uppercase">
              <span>BASED IN INDIA</span>
              <span>•</span>
              <span>2026 — PRESENT</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-[#20252B]/10 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A] animate-ping" />
              <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-[#20252B]/80 uppercase">
                AVAILABLE FOR WORK
              </span>
            </div>
          </div>
        </div>

        {/* MAIN ASYMMETRIC CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* FAR LEFT VERTICAL INDEX MARKER (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-3 text-[#20252B]/30 font-mono text-xs tracking-widest">
            <span className="font-bold text-sm text-[#20252B]/70">01</span>
            <div className="w-[1px] h-24 bg-[#20252B]/15 my-4" />
            <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-[0.25em] font-medium">
              ABOUT
            </span>
          </div>

          {/* MAIN EDITORIAL HEADLINE & CONTENT (LEFT & CENTER COLUMN) */}
          <div className="lg:col-span-7 flex flex-col justify-between max-w-full lg:max-w-[850px]">
            {/* OVERSIZED INSTRUMENT SANS HEADLINE WITH STAGGERED LINE REVEAL */}
            <h2
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              className="font-semibold text-[clamp(2.5rem,4.5vw,4.4rem)] leading-[0.98] tracking-[-0.035em] text-[#20252B] mb-12 sm:mb-16"
            >
              {headlineLines.map((line, idx) => (
                <div key={`line-${idx}`} className="overflow-hidden py-0.5">
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.15 + idx * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block font-semibold text-[#20252B]"
                  >
                    {line.split(" ").map((w, wIdx) => (
                      <HoverWord key={`word-${idx}-${wIdx}`} word={w} />
                    ))}
                  </motion.div>
                </div>
              ))}
            </h2>

            {/* EDITORIAL METADATA ACCENT STRIP */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 py-3 border-y border-[#20252B]/10 max-w-xl mb-10 font-mono text-[11px] sm:text-[12px] tracking-[0.16em] text-[#20252B]/60 uppercase"
            >
              <span className="text-[#C49A00] font-bold">FOCUS</span>
              <span>//</span>
              <span className="font-medium text-[#20252B]/80">AI / FULL-STACK / CREATIVE TECHNOLOGY</span>
            </motion.div>

            {/* NARROWER SUPPORTING DESCRIPTION (60-75 CHARS PER LINE) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="max-w-full sm:max-w-[90%] md:max-w-[650px] lg:max-w-[680px]"
            >
              <p className="text-[20px] sm:text-[21px] lg:text-[22px] font-grotesk font-normal leading-[1.4] tracking-[-0.015em] text-[#20252B]/90">
                I design and build intelligent digital products — from AI-powered tools and automation systems to context-aware web applications, turning complex ideas into useful, scalable experiences.
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: AI SYSTEM VISUAL & ROTATING BADGE */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : { opacity: 0, scale: 0.92, filter: "blur(8px)" }
              }
              transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <AISystemVisual />

              {/* CAPTION ANNOTATION BELOW VISUAL */}
              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#20252B]/50 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20252B]/40" />
                <span>FIG 01. INTEGRATED AI SYSTEM ARCHITECTURE</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM SECTION FOOTER: SCROLL TO EXPLORE INDICATOR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 sm:mt-24 pt-8 border-t border-[#20252B]/10 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-[#20252B]/50 uppercase"
        >
          <div className="flex items-center gap-2">
            <span>TOSHIT SAI PORTFOLIO</span>
            <span>—</span>
            <span>2026 EDITION</span>
          </div>

          <a
            href="#selected-work"
            className="group flex items-center gap-2.5 text-[#20252B]/70 hover:text-[#20252B] transition-colors"
          >
            <span className="font-semibold tracking-[0.18em]">SCROLL TO EXPLORE</span>
            <svg
              className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform duration-300 stroke-[#20252B]"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1V13M7 13L1 7M7 13L13 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
