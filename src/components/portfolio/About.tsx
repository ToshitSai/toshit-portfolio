import React, { useEffect, useRef } from "react";

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const blocks = [paragraphRef.current, statementRef.current];

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
        // Starts activating when elCenter is at 90% of viewport height
        // Reaches 100% active state when elCenter is at 50% of viewport height
        const startPoint = vh * 0.90;
        const endPoint = vh * 0.50;

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
        const translateY = ((1 - eased) * 14).toFixed(2);

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

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col items-center text-center">
        
        {/* PARAGRAPH 1: MAIN BIO TEXT (EXACT STRUCTURE AS REFERENCE) */}
        <p
          ref={paragraphRef}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(22px, 3.2vw, 38px)",
            lineHeight: 1.38,
            letterSpacing: "-0.018em",
            willChange: "transform, opacity, color",
          }}
          className="max-w-[1020px] text-center mx-auto mb-14 sm:mb-18 lg:mb-20 transition-none"
        >
          I&apos;m Toshit Sai, a Computer Science Engineering student specializing in Artificial Intelligence &amp; Machine Learning, building what&apos;s next – from intelligent automation tools and prompt-engineered workflows to context-aware web applications and scalable AI-powered products.
        </p>

        {/* PARAGRAPH 2: BOLD PERSONAL STATEMENT (EXACT STRUCTURE AS REFERENCE) */}
        <h3
          ref={statementRef}
          style={{
            fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 36px)",
            lineHeight: 1.3,
            letterSpacing: "-0.022em",
            willChange: "transform, opacity, color",
          }}
          className="max-w-[950px] text-center mx-auto transition-none"
        >
          I believe every great design forms the basis for an even greater story and I&apos;m here to keep writing mine.
        </h3>

      </div>
    </section>
  );
};

export default About;
