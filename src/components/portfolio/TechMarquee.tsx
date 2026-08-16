import React from "react";

const MARQUEE_ITEMS = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Claude API",
  "LangChain",
  "PostgreSQL",
  "Gemini API",
  "Flask",
  "Whisper",
  "Vite",
];

const TechMarquee: React.FC = () => {
  // Duplicate array 3 times for seamless infinite loop
  const list = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="relative w-full bg-cream-paper border-y border-ink/10 py-5 overflow-hidden select-none z-10">
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-cream-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-cream-paper to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee-x">
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-6 sm:gap-10 px-3 sm:px-5">
            <span className="text-sm sm:text-base font-mono font-medium tracking-widest text-ink/80 uppercase">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechMarquee;
