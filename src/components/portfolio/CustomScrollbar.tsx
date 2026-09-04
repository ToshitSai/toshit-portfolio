import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CustomScrollbar: React.FC = () => {
  const location = useLocation();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentY = useRef(0);
  const targetY = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateScrollProgress = () => {
      const docEl = document.documentElement;
      const body = document.body;

      // Check if body scroll is locked by loader or modal
      const isScrollLocked = window.getComputedStyle(body).overflow === "hidden";
      if (isScrollLocked) {
        setIsVisible(false);
        return;
      }

      const scrollTop = window.scrollY || docEl.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        docEl.scrollHeight,
        body.scrollHeight,
        docEl.offsetHeight,
        body.offsetHeight
      );
      const clientHeight = window.innerHeight || docEl.clientHeight;

      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

      if (!trackRef.current || !thumbRef.current) return;

      const trackHeight = trackRef.current.clientHeight;
      const thumbHeight = Math.max(40, Math.min(85, (clientHeight / (scrollHeight || 1)) * trackHeight));
      
      thumbRef.current.style.height = `${thumbHeight}px`;

      const availableSpace = trackHeight - thumbHeight;
      targetY.current = progress * availableSpace;

      if (prefersReducedMotion) {
        currentY.current = targetY.current;
        if (thumbRef.current) {
          thumbRef.current.style.transform = `translate3d(0, ${currentY.current}px, 0)`;
        }
      }
    };

    const handleScrollActivity = () => {
      updateScrollProgress();

      // Show scrollbar on scroll activity
      setIsVisible(true);

      // Auto-hide scrollbar after 1.2s of inactivity
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1200);
    };

    const renderLoop = () => {
      if (!prefersReducedMotion) {
        const diff = targetY.current - currentY.current;
        if (Math.abs(diff) > 0.05) {
          currentY.current += diff * 0.18;
        } else {
          currentY.current = targetY.current;
        }

        if (thumbRef.current) {
          thumbRef.current.style.transform = `translate3d(0, ${currentY.current.toFixed(2)}px, 0)`;
        }
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    const onScroll = () => {
      handleScrollActivity();
    };

    const onResize = () => {
      updateScrollProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    updateScrollProgress();
    currentY.current = targetY.current;
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(0, ${currentY.current}px, 0)`;
    }

    animationFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      className={`fixed right-2 sm:right-4 top-5 bottom-5 z-[999] pointer-events-none select-none flex justify-center w-3 transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1px Vertical Track Container */}
      <div
        ref={trackRef}
        className="relative w-full h-full flex justify-center"
      >
        {/* Track Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-[#20252B]/18 rounded-full" />

        {/* Minimalist Top & Bottom Endpoint Ticks */}
        <div className="absolute top-0 w-[3px] h-[3px] rounded-full bg-[#20252B]/25" />
        <div className="absolute bottom-0 w-[3px] h-[3px] rounded-full bg-[#20252B]/25" />

        {/* Active Moving Scroll Indicator */}
        <div
          ref={thumbRef}
          className="absolute top-0 w-[3px] sm:w-[4px] bg-[#20252B] rounded-full shadow-xs will-change-transform flex flex-col items-center"
          style={{
            height: "60px",
            transform: "translate3d(0, 0px, 0)",
          }}
        >
          {/* Single Tiny Yellow Accent Marker at Top Tip */}
          <div className="w-[5px] h-[5px] rounded-full bg-[#FFD42A] -mt-[1px] shadow-[0_0_6px_#FFD42A] flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default CustomScrollbar;
