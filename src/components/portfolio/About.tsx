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

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      setTargetPos({
        x: Math.max(-1, Math.min(1, deltaX)) * 8,
        y: Math.max(-1, Math.min(1, deltaY)) * 8,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[340px] lg:h-[340px] flex items-center justify-center pointer-events-auto"
    >
      {/* ALWAYS READABLE UPRIGHT TOP-ARC TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <path id="textTopArcPath" d="M 35,150 A 115,115 0 0,1 265,150" />
          </defs>
          <text className="text-[11px] font-mono tracking-[0.24em] fill-[#1F2328]/50 uppercase font-medium">
            <textPath href="#textTopArcPath" startOffset="50%" textAnchor="middle">
              AI • DESIGN • SOFTWARE • SYSTEMS
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
        {/* Outer dashed orbital ring */}
        <circle
          cx="150"
          cy="150"
          r="105"
          fill="none"
          stroke="#1F2328"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="3 5"
        />

        {/* Inner orbital ring */}
        <circle
          cx="150"
          cy="150"
          r="72"
          fill="none"
          stroke="#1F2328"
          strokeWidth="1"
          strokeOpacity="0.18"
        />

        {/* Dynamic Connecting Lines to Center */}
        {nodes.map((node) => (
          <line
            key={`center-line-${node.id}`}
            x1="150"
            y1="150"
            x2={node.cx + mousePos.x * 0.4}
            y2={node.cy + mousePos.y * 0.4}
            stroke="#1F2328"
            strokeWidth="1"
            strokeOpacity="0.15"
          />
        ))}

        {/* Node to Node Web Lines */}
        <path
          d={`M ${nodes[0].cx + mousePos.x * 0.4} ${nodes[0].cy + mousePos.y * 0.4} L ${nodes[1].cx + mousePos.x * 0.3} ${nodes[1].cy + mousePos.y * 0.3} L ${nodes[2].cx + mousePos.x * 0.5} ${nodes[2].cy + mousePos.y * 0.5} L ${nodes[3].cx + mousePos.x * 0.2} ${nodes[3].cy + mousePos.y * 0.2} L ${nodes[4].cx + mousePos.x * 0.4} ${nodes[4].cy + mousePos.y * 0.4} L ${nodes[5].cx + mousePos.x * 0.3} ${nodes[5].cy + mousePos.y * 0.3} Z`}
          fill="none"
          stroke="#1F2328"
          strokeWidth="1"
          strokeOpacity="0.12"
        />

        {/* Satellite Nodes */}
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={node.cx + mousePos.x * 0.4}
            cy={node.cy + mousePos.y * 0.4}
            r={node.r}
            fill="#1F2328"
            fillOpacity="0.75"
          />
        ))}

        {/* CENTRAL GLOWING ACCENT NODE (YELLOW CORE) */}
        <circle cx="150" cy="150" r="16" fill="#FFD42A" fillOpacity="0.25" className="animate-pulse" />
        <circle cx="150" cy="150" r="7" fill="#FFD42A" />
        <circle cx="150" cy="150" r="3" fill="#1F2328" />
      </svg>

      {/* Tight Corner Crop Markers */}
      <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#1F2328]/40" />
      <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#1F2328]/40" />
      <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#1F2328]/40" />
      <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#1F2328]/40" />
    </div>
  );
};

// --- MAIN ABOUT COMPONENT ---
const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#F7F1E5" }}
      className="relative w-full pt-28 sm:pt-36 lg:pt-40 pb-24 sm:pb-32 text-[#1F2328] overflow-hidden z-10 select-none"
    >
      {/* ATMOSPHERIC PAPER GRAIN OVERLAY */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilter)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* MAIN ASYMMETRIC GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* FAR LEFT VERTICAL INDEX MARKER (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-2 text-[#1F2328]/40 font-mono text-xs tracking-widest">
            <span className="font-bold text-sm text-[#1F2328]/70">01</span>
            <div className="w-[1px] h-20 bg-[#1F2328]/15 my-4" />
            <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-[0.25em] font-medium text-[11px]">
              ABOUT
            </span>
          </div>

          {/* MAIN HEADLINE & CONTENT (LEFT/CENTER COLUMN) */}
          <div className="lg:col-span-7 flex flex-col max-w-full lg:max-w-[780px]">
            {/* OVERSIZED INSTRUMENT SANS HEADLINE */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(44px, 5.2vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "#1F2328",
              }}
              className="mb-8 sm:mb-10 text-left"
            >
              Building Software <br />
              at the Intersection <br />
              of <br />
              Applied AI <br />
              & Modern Design.
            </motion.h2>

            {/* FOCUS METADATA STRIP */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 py-3 border-t border-[#1F2328]/15 max-w-xl mb-6 font-mono text-[11px] sm:text-[12px] tracking-[0.16em] text-[#1F2328]/60 uppercase"
            >
              <span className="text-[#C49A00] font-bold">FOCUS</span>
              <span>//</span>
              <span className="font-medium text-[#1F2328]/80">AI / FULL-STACK / CREATIVE TECHNOLOGY</span>
            </motion.div>

            {/* BODY PARAGRAPH */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontWeight: 400,
                color: "#1F2328",
              }}
              className="text-[19px] sm:text-[21px] lg:text-[22px] leading-[1.4] tracking-[-0.015em] max-w-[650px] text-left opacity-90"
            >
              I design and build intelligent digital products — from AI-powered tools and automation systems to context-aware web applications, turning complex ideas into useful, scalable experiences.
            </motion.p>
          </div>

          {/* RIGHT COLUMN: AI SYSTEM RADAR VISUAL */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-start pt-4 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <AISystemVisual />

              {/* CAPTION BELOW DIAGRAM */}
              <div className="mt-4 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#1F2328]/60 uppercase max-w-[280px] text-center leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F2328]/50 flex-shrink-0" />
                <span>FIG 01. INTEGRATED AI SYSTEM ARCHITECTURE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
