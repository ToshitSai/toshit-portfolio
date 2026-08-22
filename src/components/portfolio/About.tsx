import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(".gsap-scrub-line", { color: "#1F2328", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".gsap-scrub-line");

      lines.forEach((line) => {
        gsap.fromTo(
          line,
          {
            color: "#C5BEB3",
            opacity: 0.35,
          },
          {
            color: "#1F2328",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      style={{ backgroundColor: "#FAF6ED" }}
      className="relative w-full py-28 sm:py-36 lg:py-44 text-[#1F2328] overflow-hidden z-10 select-none"
    >
      {/* SUBTLE PAPER NOISE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilterClean">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilterClean)" />
        </svg>
      </div>

      <div
        ref={containerRef}
        className="relative max-w-[840px] mx-auto px-6 text-center z-10 flex flex-col items-center"
        style={{
          fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* PARAGRAPH 1 SENTENCE LINES */}
        <div className="mb-10 sm:mb-12 lg:mb-14 flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="gsap-scrub-line block font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.45] tracking-[-0.015em]">
            I&apos;m Toshit Sai, a Computer Science Engineering student specializing
          </span>
          <span className="gsap-scrub-line block font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.45] tracking-[-0.015em]">
            in Artificial Intelligence &amp; Machine Learning, building what&apos;s next
          </span>
          <span className="gsap-scrub-line block font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.45] tracking-[-0.015em]">
            from intelligent automation tools and prompt engineered workflows
          </span>
          <span className="gsap-scrub-line block font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.45] tracking-[-0.015em]">
            to context aware web applications and scalable AI powered products.
          </span>
        </div>

        {/* BOLD PERSONAL STATEMENT LINES */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="gsap-scrub-line block font-bold text-[18px] sm:text-[22px] md:text-[25px] leading-[1.38] tracking-[-0.02em]">
            I believe every great design forms the basis for an even greater story
          </span>
          <span className="gsap-scrub-line block font-bold text-[18px] sm:text-[22px] md:text-[25px] leading-[1.38] tracking-[-0.02em]">
            and I&apos;m here to keep writing mine.
          </span>
        </div>

      </div>
    </section>
  );
};

export default About;
