import React, { useState, useEffect, useRef } from "react";

/**
 * Editorial Scroll Indicator Component
 * 
 * Replaces the native browser scrollbar with a left-aligned, fixed SVG curved
 * dashed trajectory that responds smoothly to actual page scroll progress.
 * Fades in only once the user scrolls down to/past the Bio section (#about).
 */
const CustomScrollbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const pathLengthRef = useRef<number>(0);

  // Smooth continuous organic curve that stays within viewport margin [5px to 45px]
  const pathD = "M 20,0 C -5,180 50,380 15,550 C -8,720 45,880 18,1000";

  // Cache path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathLengthRef.current = length;

      // Set initial dash array for active path scrubbing
      if (activePathRef.current) {
        activePathRef.current.style.strokeDasharray = `0 ${length}`;
      }
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateScrollProgress = () => {
      // Calculate real scroll position across window/document
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      
      // Clamp progress between 0 and 1
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

      // HIDE IN HERO SECTION — ONLY SHOW BELOW BIO SECTION (#about)
      const aboutEl = document.getElementById("about");
      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect();
        // Show ONLY when user has scrolled down into or past the Bio section
        setIsVisible(aboutRect.top <= clientHeight * 0.5);
      } else {
        setIsVisible(scrollTop > 500);
      }

      // Update marker position and active path along SVG curve
      if (pathRef.current && pathLengthRef.current > 0) {
        const currentLength = progress * pathLengthRef.current;
        const point = pathRef.current.getPointAtLength(currentLength);

        // Update dot marker position
        if (markerRef.current) {
          markerRef.current.setAttribute("cx", point.x.toString());
          markerRef.current.setAttribute("cy", point.y.toString());
        }

        // Scrub active path stroke
        if (activePathRef.current) {
          activePathRef.current.style.strokeDasharray = `${currentLength} ${pathLengthRef.current}`;
        }
      }
    };

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updateScrollProgress();
          animationFrameId = 0;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Respect user preference for reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
      }}
      className="fixed left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 z-50 pointer-events-none select-none overflow-hidden"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 60 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Background Dashed Curved Path */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#20252B"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          strokeLinecap="round"
          className="opacity-20"
        />

        {/* Active Scroll Scrubbing Dashed Overlay */}
        <path
          ref={activePathRef}
          d={pathD}
          fill="none"
          stroke="#20252B"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          strokeLinecap="round"
          className="opacity-80 transition-none"
        />

        {/* Scroll Progress Marker Dot */}
        <circle
          ref={markerRef}
          r="3.5"
          fill="#20252B"
          stroke="#FFF8E8"
          strokeWidth="1"
          className="opacity-90 transition-none"
        />
      </svg>
    </div>
  );
};

export default CustomScrollbar;
