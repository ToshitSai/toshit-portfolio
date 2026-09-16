import React, { useEffect, useState } from "react";

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  return (
    <section
      className="relative w-full h-[64px] sm:h-[76px] bg-[#FFF8E8] text-[#3D434A] overflow-hidden select-none z-10 border-y border-[#3D434A]/10 flex items-center"
      aria-label="Technology Showcase Strip"
    >
      {/* Edge gradient mask overlays for soft elegant disappearance */}
      <div className="absolute left-0 top-0 bottom-0 w-8 xs:w-16 sm:w-36 md:w-48 bg-gradient-to-r from-[#FFF8E8] via-[#FFF8E8]/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 xs:w-16 sm:w-36 md:w-48 bg-gradient-to-l from-[#FFF8E8] via-[#FFF8E8]/90 to-transparent z-20 pointer-events-none" />

      {/* CONTINUOUS TICKER TRACK */}
      <div
        className={`flex items-center w-max ${
          prefersReducedMotion ? "overflow-x-auto py-4" : "animate-tech-marquee"
        }`}
      >
        {list.map((item, index) => (
          <div
            key={index}
            className="px-12 sm:px-20 md:px-24 flex items-center shrink-0"
          >
            <span
              style={{
                fontFamily: '"Host Grotesk", "Plus Jakarta Sans", sans-serif',
                color: "#3D434A", // WCAG 9.25:1 contrast ratio against #FFF8E8
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

