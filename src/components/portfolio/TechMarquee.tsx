import React, { useEffect, useRef, useState } from "react";

interface TechItem {
  name: string;
  separator: string;
  yOffset: string;
  accent?: boolean;
  spacing: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "PYTHON", separator: "✦", yOffset: "translate-y-0", spacing: "px-6 sm:px-10" },
  { name: "GENERATIVE AI", separator: "—", yOffset: "-translate-y-1 sm:-translate-y-1.5", accent: true, spacing: "px-8 sm:px-14" },
  { name: "LANGCHAIN", separator: "•", yOffset: "translate-y-1 sm:translate-y-1.5", spacing: "px-6 sm:px-9" },
  { name: "GEMINI API", separator: "+", yOffset: "translate-y-0", accent: true, spacing: "px-8 sm:px-12" },
  { name: "LLM APPS", separator: "◦", yOffset: "-translate-y-1 sm:-translate-y-1.5", spacing: "px-9 sm:px-16" },
  { name: "PROMPT ENGINEERING", separator: "✦", yOffset: "translate-y-1 sm:translate-y-1.5", spacing: "px-7 sm:px-11" },
  { name: "REACT", separator: "—", yOffset: "translate-y-0", spacing: "px-8 sm:px-13" },
  { name: "FASTAPI", separator: "•", yOffset: "-translate-y-1 sm:-translate-y-1.5", spacing: "px-6 sm:px-10" },
  { name: "SUPABASE", separator: "+", yOffset: "translate-y-1 sm:translate-y-1.5", spacing: "px-8 sm:px-12" },
  { name: "VERCEL", separator: "◦", yOffset: "translate-y-0", spacing: "px-9 sm:px-15" },
];

const TechMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isHoveredContainer, setIsHoveredContainer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation RAF state references to prevent re-renders
  const stateRef = useRef({
    currentX: 0,
    baseSpeed: 0.75, // pixels per frame (~45px/sec at 60fps => ~30 sec loop)
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
        // Track has 3 sets, single set width is total width / 3
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

      // Add temporary velocity boost based on scroll speed
      if (delta > 0) {
        stateRef.current.scrollBoost = Math.min(2.2, 1 + delta * 0.04);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // RAF loop for smooth 60fps hardware accelerated continuous ticker
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;

    const tick = () => {
      const state = stateRef.current;

      // Smooth lerp hover speed scale
      state.targetHoverFactor = isHoveredContainer ? 0.35 : 1;
      state.hoverFactor += (state.targetHoverFactor - state.hoverFactor) * 0.08;

      // Smooth decay scroll boost back to 1.0
      state.scrollBoost += (1 - state.scrollBoost) * 0.06;

      // Calculate frame movement
      const effectiveSpeed = state.baseSpeed * state.hoverFactor * state.scrollBoost;
      state.currentX += effectiveSpeed;

      // Loop seamlessly when completed 1 full set
      if (state.singleSetWidth > 0 && state.currentX >= state.singleSetWidth) {
        state.currentX %= state.singleSetWidth;
      }

      // Direct GPU transform update for zero layout shift & zero React re-renders
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
      onMouseLeave={() => {
        setIsHoveredContainer(false);
        setHoveredIdx(null);
      }}
      className="relative w-full h-[84px] sm:h-[96px] bg-cream-paper text-ink overflow-hidden select-none z-10 border-y border-ink/10 flex items-center"
      aria-label="Interactive Technology & Skills Ticker"
    >
      {/* Top subtle decorative accent track line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ink/15 to-transparent pointer-events-none" />

      {/* Edge gradient mask overlays for soft elegant disappearance */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-cream-paper via-cream-paper/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-cream-paper via-cream-paper/90 to-transparent z-20 pointer-events-none" />

      {/* CONTINUOUS HARDWARE-ACCELERATED TICKER TRACK */}
      <div
        ref={trackRef}
        className={`flex items-center w-max will-change-transform ${
          prefersReducedMotion ? "overflow-x-auto py-4" : ""
        }`}
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {list.map((item, index) => {
          const isItemHovered = hoveredIdx === index;
          const isAnyHovered = hoveredIdx !== null;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center ${item.spacing} transition-all duration-300 group cursor-pointer`}
            >
              {/* Technology Label */}
              <div
                className={`flex items-center gap-2 transform transition-all duration-300 ${item.yOffset} ${
                  isItemHovered
                    ? "scale-105 opacity-100 -translate-y-1"
                    : isAnyHovered
                    ? "opacity-35 scale-95"
                    : "opacity-75 group-hover:opacity-100"
                }`}
              >
                {/* Yellow accent marker for selected flagship technologies */}
                {item.accent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-accent shadow-[0_0_6px_#FFD42A] shrink-0" />
                )}

                <span className="text-xs sm:text-sm md:text-base font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-ink whitespace-nowrap">
                  {item.name}
                </span>
              </div>

              {/* Editorial Subtle Restrained Separator */}
              <span
                className={`ml-6 sm:ml-10 text-[10px] sm:text-xs font-mono select-none transition-opacity duration-300 ${
                  isAnyHovered ? "opacity-20" : "opacity-35"
                } ${
                  item.separator === "✦"
                    ? "text-yellow-accent/80 font-bold"
                    : "text-ink/60"
                }`}
              >
                {item.separator}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom subtle decorative accent track line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ink/15 to-transparent pointer-events-none" />
    </section>
  );
};

export default TechMarquee;
