import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type CursorMode = "DEFAULT" | "PROJECT" | "CERTIFICATE" | "BUTTON" | "LINK";

interface CursorState {
  mode: CursorMode;
  text: string;
  accentColor: string | null;
}

const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: "DEFAULT",
    text: "",
    accentColor: null,
  });

  const shouldReduceMotion = useReducedMotion();

  // Pointer Position & Lerp Ref Coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  // DOM Refs for GPU-accelerated translate3d transforms
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Touch & Fine Pointer Media Query Check
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const checkPointer = () => setIsTouchDevice(!mediaQuery.matches);
    checkPointer();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", checkPointer);
    } else {
      mediaQuery.addListener(checkPointer);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", checkPointer);
      } else {
        mediaQuery.removeListener(checkPointer);
      }
    };
  }, []);

  // Coordinated Single requestAnimationFrame Loop for BOTH Inner Dot & Outer Ring
  useEffect(() => {
    if (isTouchDevice) return;

    const animate = () => {
      // 1. Inner Dot follows mouse EXACTLY via GPU-accelerated translate3d
      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Outer Ring lerps toward mouse position (speed scales with distance)
      const lerpFactor = shouldReduceMotion ? 1 : 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      // Cancel animation frame loop on unmount to prevent memory leaks
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isTouchDevice, shouldReduceMotion]);

  // Pointer Move & Hover Mode State Machine
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. PROJECT HOVER
      const projectEl = target.closest(
        '[data-cursor="project"], .group\\/project, [data-project-card]'
      ) as HTMLElement | null;
      if (projectEl) {
        const accent = projectEl.getAttribute("data-accent") || null;
        setCursorState((prev) =>
          prev.mode === "PROJECT" && prev.accentColor === accent
            ? prev
            : { mode: "PROJECT", text: "VIEW ↗", accentColor: accent }
        );
        return;
      }

      // 2. CERTIFICATE HOVER
      const certEl = target.closest(
        '[data-cursor="certificate"], [aria-label*="Certificate"], .certificate-card'
      ) as HTMLElement | null;
      if (certEl) {
        setCursorState((prev) =>
          prev.mode === "CERTIFICATE"
            ? prev
            : { mode: "CERTIFICATE", text: "OPEN ↗", accentColor: null }
        );
        return;
      }

      // 3. BUTTON & LINK HOVER
      const buttonEl = target.closest(
        'button, a, [role="button"], input, select, textarea, .cursor-pointer'
      ) as HTMLElement | null;
      if (buttonEl) {
        const isBtn = buttonEl.tagName === "BUTTON" || buttonEl.getAttribute("role") === "button";
        setCursorState((prev) =>
          prev.mode === (isBtn ? "BUTTON" : "LINK")
            ? prev
            : { mode: isBtn ? "BUTTON" : "LINK", text: "", accentColor: null }
        );
        return;
      }

      // 4. DEFAULT STATE
      setCursorState((prev) =>
        prev.mode === "DEFAULT"
          ? prev
          : { mode: "DEFAULT", text: "", accentColor: null }
      );
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice) return null;

  const { mode, text, accentColor } = cursorState;

  // Dimensional Specs per Mode
  let outerSize = 40;
  let innerDotOpacity = 1;
  let innerDotSize = 6;
  let borderColor = "rgba(25, 25, 22, 0.22)";
  let bgColor = "rgba(25, 25, 22, 0.03)";

  if (mode === "PROJECT") {
    outerSize = 54;
    innerDotOpacity = 0;
    borderColor = accentColor ? accentColor : "rgba(32, 37, 43, 0.6)";
    bgColor = accentColor ? `${accentColor}1A` : "rgba(32, 37, 43, 0.08)";
  } else if (mode === "CERTIFICATE") {
    outerSize = 48;
    innerDotOpacity = 0;
    borderColor = "rgba(32, 37, 43, 0.5)";
    bgColor = "rgba(255, 212, 42, 0.15)";
  } else if (mode === "BUTTON" || mode === "LINK") {
    outerSize = 36;
    innerDotSize = 5;
    borderColor = "rgba(32, 37, 43, 0.4)";
    bgColor = "rgba(32, 37, 43, 0.06)";
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.15s ease" }}
    >
      {/* Outer Trailing Ring — Positioned via single rAF lerp translate3d */}
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none select-none"
        style={{
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          transition: shouldReduceMotion
            ? "none"
            : "width 220ms cubic-bezier(0.16, 1, 0.3, 1), height 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease, background-color 220ms ease",
          willChange: "transform",
        }}
      >
        {/* VIEW / OPEN Typography Label */}
        {text && (
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
            style={{ color: accentColor || "#191916" }}
          >
            {text}
          </span>
        )}
      </div>

      {/* Inner Precision Center Dot — Positioned via single rAF exact mouse translate3d */}
      <div
        ref={innerDotRef}
        className="fixed top-0 left-0 rounded-full bg-[#191916] pointer-events-none"
        style={{
          width: `${innerDotSize}px`,
          height: `${innerDotSize}px`,
          opacity: innerDotOpacity,
          transition: "opacity 180ms ease, width 180ms ease, height 180ms ease",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default CustomCursor;
