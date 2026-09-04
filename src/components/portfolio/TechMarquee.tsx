import React, { useEffect, useRef, useState } from "react";

const TECH_ITEMS: string[] = [
  "Vercel",
  "Python",
  "Generative AI",
  "LangChain",
  "Gemini API",
  "LLM Apps",
  "Prompt Engineering",
  "React",
  "FastAPI",
  "Supabase",
];

const TechMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHoveredContainer, setIsHoveredContainer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation RAF state references to prevent re-renders
  const stateRef = useRef({
    currentX: 0,
    baseSpeed: 0.28, // Unhurried, calm scrolling pace (~16px/sec at 60fps)
    hoverFactor: 1,
    targetHoverFactor: 1,
    scrollBoost: 1,
    lastScrollY: 0,
    singleSetWidth: 0,
  });

  // Tripled array for seamless mathematical infinite loop
  const list = [...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS];

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Measure single set width accurately
  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        stateRef.current.singleSetWidth = trackRef.current.scrollWidth / 3;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Scroll velocity listener
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - stateRef.current.lastScrollY);
      stateRef.current.lastScrollY = currentY;

      if (delta > 0) {
        stateRef.current.scrollBoost = Math.min(1.4, 1 + delta * 0.015);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // RAF loop for smooth 60fps continuous marquee
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;

    const tick = () => {
      const state = stateRef.current;

      state.targetHoverFactor = isHoveredContainer ? 0.4 : 1;
      state.hoverFactor += (state.targetHoverFactor - state.hoverFactor) * 0.05;

      state.scrollBoost += (1 - state.scrollBoost) * 0.05;

      const effectiveSpeed = state.baseSpeed * state.hoverFactor * state.scrollBoost;
      state.currentX += effectiveSpeed;

      if (state.singleSetWidth > 0 && state.currentX >= state.singleSetWidth) {
        state.currentX %= state.singleSetWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${state.currentX}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHoveredContainer, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHoveredContainer(true)}
      onMouseLeave={() => setIsHoveredContainer(false)}
      className="relative w-full h-[64px] sm:h-[76px] bg-[#FFF8E8] text-[#3D434A] overflow-hidden select-none z-10 border-y border-[#3D434A]/10 flex items-center"
      aria-label="Technology Showcase Strip"
    >
      {/* Edge gradient mask overlays for soft elegant disappearance */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#FFF8E8] via-[#FFF8E8]/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#FFF8E8] via-[#FFF8E8]/90 to-transparent z-20 pointer-events-none" />

      {/* CONTINUOUS TICKER TRACK */}
      <div
        ref={trackRef}
        className={`flex items-center w-max will-change-transform ${
          prefersReducedMotion ? "overflow-x-auto py-4" : ""
        }`}
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {list.map((item, index) => (
          <div
            key={index}
            className="px-12 sm:px-20 md:px-24 flex items-center shrink-0"
          >
            <span
              style={{
                fontFamily: '"Host Grotesk", "Plus Jakarta Sans", sans-serif',
                color: '#3D434A', // WCAG 9.25:1 contrast ratio against #FFF8E8
              }}
              className="text-sm sm:text-base md:text-lg font-normal tracking-[0.08em] sm:tracking-[0.12em] whitespace-nowrap opacity-85 hover:opacity-100 transition-opacity duration-300"
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechMarquee;
