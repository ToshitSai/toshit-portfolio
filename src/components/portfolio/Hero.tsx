import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Mail } from "lucide-react";

const WORDS = [
  "AI-POWERED",
  "FULL STACK",
  "CREATIVE",
  "AI BUILDER",
  "PRODUCT",
];

const Hero: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Motion physics for mouse parallax using Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax layer outputs
  // Title layer: ±8px
  const titleX = useSpring(useMotionValue(0), springConfig);
  const titleY = useSpring(useMotionValue(0), springConfig);
  // Cloud layer: ±18px
  const cloudsX = useSpring(useMotionValue(0), springConfig);
  const cloudsY = useSpring(useMotionValue(0), springConfig);
  // Sun layer: ∓14px (opposite direction)
  const sunX = useSpring(useMotionValue(0), springConfig);
  const sunY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalised mouse coordinates (-1 to 1)
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;

    titleX.set(normX * 8);
    titleY.set(normY * 8);

    cloudsX.set(normX * 18);
    cloudsY.set(normY * 18);

    sunX.set(normX * -14);
    sunY.set(normY * -14);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{ background: "linear-gradient(180deg, #7EB8E8 0%, #A9D3F0 45%, #5B9BD5 100%)" }}
      className="relative w-full h-[80vh] min-h-[580px] max-h-[820px] overflow-hidden flex flex-col justify-between select-none studio-noise-bg border-b border-[#20252B]/10"
    >
      {/* SVG Noise Overlay */}
      <svg className="pointer-events-none absolute inset-0 opacity-[0.035] w-full h-full z-0">
        <filter id="studio-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#studio-noise)" />
      </svg>

      {/* TOP CHROME & STICKY FLOATING CAPSULE HEADER (SINGLE INSTANCE IN DOM) */}
      <header className="sticky top-0 z-50 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between pointer-events-auto">
        {/* Top-Left Metadata: Strictly ONE instance of HYDERABAD, IN */}
        <div className="label-mono text-[#20252B] font-bold hidden sm:block tracking-[0.18em] bg-white/30 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/40 shadow-sm">
          HYDERABAD, IN
        </div>

        {/* Centered Floating Navigation Capsule */}
        <nav className="mx-auto sm:mx-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-2 sm:gap-3 px-2 sm:px-2.5 py-1.5 rounded-full bg-white/30 backdrop-blur-xl border border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          {/* Avatar Badge */}
          <a
            href="#hero"
            className="w-8 h-8 rounded-full bg-[#FFD42A] text-[#20252B] font-bold flex items-center justify-center text-sm shadow-sm hover:scale-105 transition-transform"
            aria-label="Toshit Home"
          >
            T
          </a>

          <div className="flex items-center gap-1 sm:gap-2 text-xs font-mono tracking-[0.18em] uppercase text-[#20252B] font-bold">
            <a
              href="#projects"
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white/40 border border-white/60 text-[#20252B] font-bold shadow-sm transition-all"
            >
              WORK
            </a>
            <a
              href="#about"
              className="px-3.5 sm:px-4 py-1.5 rounded-full text-[#20252B]/80 hover:text-[#20252B] hover:bg-white/20 transition-all"
            >
              ABOUT
            </a>
            <a
              href="#skills"
              className="px-3.5 sm:px-4 py-1.5 rounded-full text-[#20252B]/80 hover:text-[#20252B] hover:bg-white/20 transition-all"
            >
              SKILLS
            </a>
          </div>

          <a
            href="#contact"
            className="px-4 sm:px-5 py-2 rounded-full bg-[#FFF8E8] text-[#20252B] text-xs font-mono font-bold tracking-[0.18em] uppercase hover:bg-white hover:scale-[1.03] transition-all shadow-sm flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-[#20252B] stroke-[2.2]" />
            <span>WORK WITH ME</span>
          </a>
        </nav>

        {/* Top-Right Metadata: Strictly ONE instance of 2026 */}
        <div className="label-mono text-[#20252B] font-bold hidden sm:block tracking-[0.18em] bg-white/30 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/40 shadow-sm">
          2026
        </div>
      </header>

      {/* BACKGROUND SCENERY & MULTI-LAYER PARALLAX GRAPHICS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* ANIMATION C — Patterned Yellow Sun Graphic with Continuous Slow Rotation & Parallax */}
        <motion.div
          style={{ x: sunX, y: sunY }}
          className="absolute top-16 right-6 sm:top-20 sm:right-12 md:right-16 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
        >
          <div className="w-full h-full rounded-full bg-[#FFD42A] p-2 shadow-xl opacity-95 animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-dashed border-[#20252B]/30 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full bg-[radial-gradient(#20252B_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-40" />
            </div>
          </div>
        </motion.div>

        {/* ANIMATION D — Organic Cutout Cloud Left */}
        <motion.div
          style={{ x: cloudsX, y: cloudsY }}
          className="absolute top-[28%] left-[2%] sm:left-[5%] w-24 sm:w-32 md:w-36 opacity-90"
        >
          <motion.div
            animate={{
              x: [-8, 8, -8],
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 160 90" fill="none" className="w-full drop-shadow-sm filter">
              <path
                d="M20 70 C 10 70, 0 60, 0 45 C 0 32, 10 20, 25 20 C 35 10, 55 5, 75 15 C 85 5, 115 5, 130 20 C 145 20, 160 30, 160 45 C 160 60, 145 70, 130 70 Z"
                fill="#FFF8E8"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* ANIMATION D — Organic Cutout Cloud Right */}
        <motion.div
          style={{ x: cloudsX, y: cloudsY }}
          className="absolute top-[22%] right-[5%] sm:right-[10%] w-40 sm:w-[220px] md:w-[250px] opacity-95"
        >
          <motion.div
            animate={{
              x: [12, -12, 12],
              y: [6, -6, 6],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 200 110" fill="none" className="w-full drop-shadow-md filter">
              <path
                d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
                fill="#FFF8E8"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* MAIN HERO CONTENT AREA */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-4 pb-6 flex-1 flex flex-col justify-center items-center text-center">
        {/* ANIMATION B — Headline Title Motion Physics Layer */}
        <motion.div
          style={{ x: titleX, y: titleY }}
          className="w-full max-w-[780px] flex flex-col items-center relative"
        >
          {/* Vertical Side Tagline directly beside the main display headline */}
          <div className="absolute -left-4 sm:-left-6 md:-left-10 lg:-left-12 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
            <span className="inline-block text-[10px] sm:text-[11px] font-mono tracking-[0.24em] text-white font-bold uppercase -rotate-90 origin-center whitespace-nowrap drop-shadow-sm">
              DESIGN / DETAILS / CODE
            </span>
          </div>
          {/* ANIMATION F — Eyebrow Badge with Pulsing Yellow Dot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 mb-4 sm:mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A] animate-pulse" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.18em] uppercase text-white font-bold drop-shadow-sm">
              HELLO, I'M TOSHIT SAI GALAM. A —
            </span>
          </motion.div>

          {/* ANIMATION H — Display Headline with Staggered Entrance Reveal */}
          <motion.h1
            initial={{ clipPath: "inset(100% 0 0 0)", y: 40 }}
            animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center text-[#20252B] font-serif font-normal text-[clamp(3rem,8vw,6.2rem)] leading-[0.88] tracking-[-0.02em] mb-6 flex flex-col items-center justify-center"
          >
            {/* ANIMATION A — Line 1: Dedicated Fixed Height Word Viewport */}
            <div className="relative w-full h-[1.15em] min-h-[64px] sm:min-h-[85px] md:min-h-[105px] overflow-hidden flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={WORDS[wordIndex]}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -35 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-x-0 text-center text-[#FFD42A] font-serif tracking-tight whitespace-nowrap block drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                >
                  {WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Line 2: Static Line DEVELOPER */}
            <span className="text-[#20252B] block drop-shadow-sm font-normal">DEVELOPER</span>
          </motion.h1>

          {/* ANIMATION E — Centered Status Card with Lift & Speed-Up Vinyl Discs */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
            className="w-full max-w-[420px] bg-[#FFF8E8] rounded-full p-2.5 sm:p-3 px-5 sm:px-6 shadow-2xl border border-white/80 flex items-center justify-between gap-3 cursor-pointer"
          >
            {/* Spinning Vinyl Left */}
            <div
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#20252B] flex items-center justify-center shadow-md transition-all ${
                isCardHovered ? "animate-[spin_5s_linear_infinite]" : "animate-[spin_12s_linear_infinite]"
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD42A]" />
            </div>

            <div className="flex-1 text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#4A525D] font-bold">
                NOW BUILDING
              </div>
              <div className="text-xs sm:text-sm font-sans font-bold text-[#20252B] leading-tight truncate">
                AI-powered web apps & student projects
              </div>
            </div>

            {/* Spinning Vinyl Right */}
            <div
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#20252B] flex items-center justify-center shadow-md transition-all ${
                isCardHovered ? "animate-[spin_5s_linear_infinite]" : "animate-[spin_12s_linear_infinite]"
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD42A]" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ANIMATION F — BOTTOM SCROLL INDICATOR & BOUNCING ARROW */}
      <div className="relative z-20 w-full flex flex-col items-center pb-2">
        <a
          href="#about"
          className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#20252B] font-bold hover:text-[#FFF8E8] transition-colors mb-2 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-sm"
        >
          <span>SCROLL TO WORK</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </a>

        {/* Organic Rolling Waves Transition to Cream Background */}
        <div className="w-full h-14 sm:h-16 relative overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,70L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="#FFF8E8"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
