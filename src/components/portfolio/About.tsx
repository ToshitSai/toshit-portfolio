import React, { useEffect, useRef } from "react";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const block0Ref = useRef<HTMLParagraphElement>(null);
  const block1Ref = useRef<HTMLParagraphElement>(null);
  const block2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const blocks = [block0Ref.current, block1Ref.current, block2Ref.current];

    if (prefersReducedMotion) {
      blocks.forEach((el) => {
        if (el) {
          el.style.color = "#1F2328";
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0px, 0)";
        }
      });
      return;
    }

    let animationFrameId: number;

    const updateScrollAnimation = () => {
      const vh = window.innerHeight || 800;

      // Inactive: #C2BBB0, Active: #1F2328
      const startR = 194, startG = 187, startB = 176;
      const endR = 31, endG = 35, endB = 40;

      blocks.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;

        // Activation zone calculation:
        // Starts activating when elCenter is at 92% of viewport height
        // Reaches 100% active state when elCenter is at 52% of viewport height
        const startPoint = vh * 0.92;
        const endPoint = vh * 0.52;

        let rawProgress = (startPoint - elCenter) / (startPoint - endPoint);
        const progress = Math.max(0, Math.min(1, rawProgress));

        // Smooth cubic easing for fluid color progression
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const r = Math.round(startR + (endR - startR) * eased);
        const g = Math.round(startG + (endG - startG) * eased);
        const b = Math.round(startB + (endB - startB) * eased);
        const opacity = (0.35 + 0.65 * eased).toFixed(3);
        const translateY = ((1 - eased) * 16).toFixed(2);

        el.style.color = `rgb(${r}, ${g}, ${b})`;
        el.style.opacity = opacity;
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(updateScrollAnimation);
    };

    window.addEventListener("scroll", updateScrollAnimation, { passive: true });
    window.addEventListener("resize", updateScrollAnimation, { passive: true });

    // Initial trigger
    updateScrollAnimation();

    return () => {
      window.removeEventListener("scroll", updateScrollAnimation);
      window.removeEventListener("resize", updateScrollAnimation);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#FAF6ED" }}
      className="relative w-full py-24 sm:py-32 lg:py-40 text-[#1F2328] overflow-hidden z-10 select-none"
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

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col items-center text-center">
        
        {/* BLOCK 0: FIRST BIO SENTENCE */}
        <p
          ref={block0Ref}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(20px, 2.5vw, 32px)",
            lineHeight: 1.4,
            letterSpacing: "-0.015em",
            willChange: "transform, opacity, color",
          }}
          className="max-w-[880px] text-center mx-auto mb-6 sm:mb-8 transition-none"
        >
          I&apos;m Toshit Sai, a Computer Science Engineering student specializing in AI &amp; Machine Learning.
        </p>

        {/* BLOCK 1: SECOND BIO SENTENCE */}
        <p
          ref={block1Ref}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(20px, 2.5vw, 32px)",
            lineHeight: 1.4,
            letterSpacing: "-0.015em",
            willChange: "transform, opacity, color",
          }}
          className="max-w-[880px] text-center mx-auto mb-10 sm:mb-12 lg:mb-14 transition-none"
        >
          I design and build intelligent digital tools and web applications, turning complex ideas into scalable experiences.
        </p>

        {/* BLOCK 2: BOLD PERSONAL STATEMENT (POSITIONED CLOSER UP) */}
        <h3
          ref={block2Ref}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(19px, 2.2vw, 28px)",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            willChange: "transform, opacity, color",
          }}
          className="max-w-[780px] text-center mx-auto transition-none"
        >
          I believe the best software happens when machine intelligence meets thoughtful engineering — and I&apos;m here to keep building mine.
        </h3>

      </div>
    </section>
  );
};

export default About;
