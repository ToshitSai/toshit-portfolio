import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Exact pointer coordinates for inner dot
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth physics spring for trailing outer ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch / coarse pointer support
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const checkPointer = () => setIsTouchDevice(!mediaQuery.matches);
    checkPointer();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", checkPointer);
    } else {
      mediaQuery.addListener(checkPointer);
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover]'
          )
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", checkPointer);
      } else {
        mediaQuery.removeListener(checkPointer);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // Completely disable custom cursor component on touch screens
  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Outer Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#20252B]/30 bg-[#20252B]/5 backdrop-blur-[1px] pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovered ? 52 : isClicking ? 30 : 38,
          height: isHovered ? 52 : isClicking ? 30 : 38,
          scale: isClicking ? 0.9 : 1,
          borderColor: isHovered ? "rgba(32, 37, 43, 0.6)" : "rgba(32, 37, 43, 0.25)",
          backgroundColor: isHovered ? "rgba(255, 212, 42, 0.35)" : "rgba(32, 37, 43, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      />

      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-[#20252B] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovered ? 8 : isClicking ? 5 : 6,
          height: isHovered ? 8 : isClicking ? 5 : 6,
          backgroundColor: "#20252B",
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
    </div>
  );
};

export default CustomCursor;
