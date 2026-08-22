import React, { useState, useEffect, useRef } from "react";

const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const pathLengthRef = useRef<number>(0);

  const pathD = "M 22,0 C -12,220 58,440 14,640 C -18,800 48,940 22,1000";

  useEffect(() => {
    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const clientHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

      setScrollProgress(progress);

      // Check if scrolled down near/below Bio section (#about)
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        // Activate when scroll enters or passes Bio section
        setIsVisible(aboutRect.top <= clientHeight * 0.7);
      } else {
        setIsVisible(scrollTop > 180);
      }

      // Update active path dash offset & tiny marker dot along curve
      if (pathRef.current && pathLengthRef.current > 0) {
        const currentLength = progress * pathLengthRef.current;
        const point = pathRef.current.getPointAtLength(currentLength);

        if (markerRef.current) {
          markerRef.current.setAttribute("cx", point.x.toString());
          markerRef.current.setAttribute("cy", point.y.toString());
        }

        if (activePathRef.current) {
          activePathRef.current.style.strokeDasharray = `${currentLength} ${pathLengthRef.current}`;
        }
      }
    };

    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updatePosition();
          animationFrameId = 0;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Check if reduced motion is requested
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="fixed left-0 top-0 bottom-0 w-12 sm:w-20 md:w-24 z-[99999] pointer-events-none select-none overflow-hidden"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Dashed Trajectory Curve */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#1F2328"
          strokeWidth="1.3"
          strokeDasharray="4 6"
          strokeLinecap="round"
          className="opacity-25"
        />

        {/* Active Progress Overlay on Dashed Trajectory */}
        <path
          ref={activePathRef}
          d={pathD}
          fill="none"
          stroke="#1F2328"
          strokeWidth="1.8"
          strokeDasharray="4 6"
          strokeLinecap="round"
          className="opacity-80 transition-none"
        />

        {/* Tiny Progress Dot Marker */}
        <circle
          ref={markerRef}
          r="3"
          fill="#1F2328"
          className="opacity-90 transition-none"
        />
      </svg>
    </div>
  );
};

export default CustomScrollbar;
