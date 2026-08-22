import React, { useState, useEffect, useRef } from "react";

const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBelowBio, setIsBelowBio] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const pathLengthRef = useRef<number>(0);

  // A 3000px tall continuous sweeping curve hugging the far left viewport edge
  const pathD = `
    M 15,-50 
    C -20,300 45,600 5,900 
    C -25,1200 40,1500 8,1800 
    C -20,2100 45,2400 5,2700 
    C -15,2850 35,3000 12,3050
  `;

  useEffect(() => {
    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
          const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
          );
          const clientH = window.innerHeight || 1;
          setViewportHeight(clientH);

          const maxScroll = Math.max(1, scrollHeight - clientH);
          const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

          setScrollProgress(progress);

          // STRICTLY HIDE IN HERO SECTION — ONLY SHOW BELOW BIO SECTION (#about)
          const aboutEl = document.getElementById("about");
          if (aboutEl) {
            const aboutRect = aboutEl.getBoundingClientRect();
            // Show only when user has scrolled into/past the Bio section!
            setIsBelowBio(aboutRect.bottom <= clientH * 0.7);
          } else {
            setIsBelowBio(scrollTop > 700);
          }

          // Move marker along the long SVG trajectory
          if (pathRef.current && markerRef.current && pathLengthRef.current > 0) {
            const point = pathRef.current.getPointAtLength(progress * pathLengthRef.current);
            markerRef.current.setAttribute("cx", point.x.toString());
            markerRef.current.setAttribute("cy", point.y.toString());
          }

          animationFrameId = 0;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return null;

  // Travel calculation for continuous curve movement
  const svgTotalHeight = 3000;
  const maxTravel = Math.max(0, svgTotalHeight - viewportHeight);
  const translateY = -scrollProgress * maxTravel;

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: isBelowBio ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
      className="fixed left-0 top-0 bottom-0 w-8 sm:w-12 md:w-14 z-30 pointer-events-none select-none overflow-hidden"
    >
      <div
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: "transform",
        }}
        className="w-full h-[3000px] relative"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 50 3000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Extremely thin, subtle dashed trajectory path */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#1F2328"
            strokeWidth="1.2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            className="opacity-35"
          />

          {/* Tiny dark progress marker dot */}
          <circle
            ref={markerRef}
            r="2.5"
            fill="#1F2328"
            className="opacity-80"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomScrollbar;
