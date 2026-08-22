import React, { useState, useEffect, useRef } from "react";

const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const pathLengthRef = useRef<number>(0);

  // Organic curved trajectory staying within [10, 80] X range (no clipping!)
  const pathD = "M 40,0 C 10,220 80,440 25,640 C 5,800 70,940 35,1000";

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

      // Update active path dash offset & dot marker along curve
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
      className="fixed left-2 sm:left-4 top-0 bottom-0 w-12 sm:w-16 md:w-20 z-[99999] pointer-events-none select-none overflow-visible"
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
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="opacity-35"
        />

        {/* Active Progress Overlay on Dashed Trajectory */}
        <path
          ref={activePathRef}
          d={pathD}
          fill="none"
          stroke="#1F2328"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="opacity-95 transition-none"
        />

        {/* Progress Dot Marker */}
        <circle
          ref={markerRef}
          r="4.5"
          fill="#1F2328"
          stroke="#FAF6ED"
          strokeWidth="1.5"
          className="opacity-100 transition-none drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default CustomScrollbar;
