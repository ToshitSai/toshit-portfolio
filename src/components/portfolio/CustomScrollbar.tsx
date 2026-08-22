import React, { useState, useEffect, useRef, useCallback } from "react";

const CustomScrollbar: React.FC = () => {
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const dragStartYRef = useRef<number>(0);
  const dragStartScrollTopRef = useRef<number>(0);

  const updateScrollbar = useCallback(() => {
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

    const heightRatio = clientHeight / scrollHeight;
    const minThumbHeight = 44;
    const calculatedHeight = Math.max(heightRatio * clientHeight, minThumbHeight);
    const maxThumbTop = Math.max(1, clientHeight - calculatedHeight);
    const calculatedTop = (scrollTop / maxScroll) * maxThumbTop;

    setThumbHeight(calculatedHeight);
    setThumbTop(calculatedTop);
  }, []);

  // Initial load animation, ResizeObserver, and scroll monitoring
  useEffect(() => {
    setIsMounted(true);
    updateScrollbar();

    let animationFrameId: number;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 950);

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updateScrollbar();
          animationFrameId = 0;
        });
      }
    };

    const handleResize = () => {
      updateScrollbar();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Poll to capture lazy-loaded components (SelectedWork, TechnicalSkills, etc.)
    const timers = [100, 300, 700, 1500, 3000].map((delay) =>
      setTimeout(updateScrollbar, delay)
    );

    // Observe body height changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollbar();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      timers.forEach(clearTimeout);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateScrollbar]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const clientHeight = window.innerHeight;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const heightRatio = clientHeight / scrollHeight;
      const minThumbHeight = 44;
      const calculatedHeight = Math.max(heightRatio * clientHeight, minThumbHeight);
      const maxThumbTop = Math.max(1, clientHeight - calculatedHeight);

      const deltaY = e.clientY - dragStartYRef.current;
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
      const targetScrollTop = Math.min(Math.max(0, dragStartScrollTopRef.current + scrollDelta), maxScroll);

      window.scrollTo({ top: targetScrollTop });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle track click (jump scroll)
  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    const clientHeight = window.innerHeight;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const clickY = e.clientY;
    const targetScrollTop = (clickY / clientHeight) * maxScroll;

    window.scrollTo({ top: targetScrollTop, behavior: "smooth" });
  };

  // Hide custom scrollbar if body is scroll-locked (e.g. during loader overlay)
  const isScrollLocked =
    typeof document !== "undefined" && document.body.style.overflow === "hidden";

  if (isScrollLocked) return null;

  // Determine active opacity and width
  const isActive = isScrolling || isHovered || isDragging;
  const opacityStyle = isActive ? 0.75 : isMounted ? 0.2 : 0;
  const widthPx = isHovered || isDragging ? 4 : 2;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTrackClick}
      aria-hidden="true"
      aria-label="Custom Viewport Scrollbar"
      className="hidden md:block fixed right-0 top-0 bottom-0 w-3 z-[99999] pointer-events-auto select-none"
    >
      {/* 1. Track: Extremely Thin Muted Line (only slightly visible on hover or scroll) */}
      <div
        style={{ opacity: isActive ? 0.15 : 0.04 }}
        className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#1D2024] pointer-events-none transition-opacity duration-300"
      />

      {/* 2. Scroll Thumb: Refined Minimal 2px Overlay */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate3d(0, ${thumbTop}px, 0)`,
          height: `${thumbHeight || 44}px`,
          width: `${widthPx}px`,
          opacity: opacityStyle,
          backgroundColor: "#1D2024",
        }}
        className="absolute right-0 top-0 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 ease-out"
      />
    </div>
  );
};

export default CustomScrollbar;
