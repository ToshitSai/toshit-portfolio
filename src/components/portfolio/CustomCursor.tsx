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

  // Direct Coordinates and Interpolation Refs
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const magneticPos = useRef({ x: 0, y: 0 });

  // DOM Refs for high-performance rAF CSS transforms (zero React re-renders during movement)
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Touch & Fine Pointer Media Query Detection
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

  // High Performance rAF Interpolation Loop (~40ms lerp smoothing)
  useEffect(() => {
    if (isTouchDevice) return;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      const lerpFactor = shouldReduceMotion ? 1 : 0.22;

      const targetX = mousePos.current.x + magneticPos.current.x;
      const targetY = mousePos.current.y + magneticPos.current.y;

      cursorPos.current.x = lerp(cursorPos.current.x, targetX, lerpFactor);
      cursorPos.current.y = lerp(cursorPos.current.y, targetY, lerpFactor);

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, shouldReduceMotion]);

  // Mouse Movement & Mode State Machine
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. PROJECT HOVER DETECT
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
        magneticPos.current = { x: 0, y: 0 };
        return;
      }

      // 2. CERTIFICATE HOVER DETECT
      const certEl = target.closest(
        '[data-cursor="certificate"], [aria-label*="Certificate"], .certificate-card'
      ) as HTMLElement | null;
      if (certEl) {
        setCursorState((prev) =>
          prev.mode === "CERTIFICATE"
            ? prev
            : { mode: "CERTIFICATE", text: "OPEN ↗", accentColor: null }
        );
        magneticPos.current = { x: 0, y: 0 };
        return;
      }

      // 3. BUTTON & LINK HOVER DETECT (With Subtle 4-6px Magnetic Pull on Interactive Controls)
      const buttonEl = target.closest(
        'button, a, [role="button"], input, select, textarea, .cursor-pointer'
      ) as HTMLElement | null;
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        if (rect.width > 0 && rect.width < 280 && rect.height < 90 && !shouldReduceMotion) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (centerX - e.clientX) * 0.16;
          const deltaY = (centerY - e.clientY) * 0.16;
          magneticPos.current = {
            x: Math.max(-6, Math.min(6, deltaX)),
            y: Math.max(-6, Math.min(6, deltaY)),
          };
        } else {
          magneticPos.current = { x: 0, y: 0 };
        }

        const isBtn = buttonEl.tagName === "BUTTON" || buttonEl.getAttribute("role") === "button";
        setCursorState((prev) =>
          prev.mode === (isBtn ? "BUTTON" : "LINK")
            ? prev
            : { mode: isBtn ? "BUTTON" : "LINK", text: "", accentColor: null }
        );
        return;
      }

      // 4. DEFAULT STATE
      magneticPos.current = { x: 0, y: 0 };
      setCursorState((prev) =>
        prev.mode === "DEFAULT"
          ? prev
          : { mode: "DEFAULT", text: "", accentColor: null }
      );
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, isVisible, shouldReduceMotion]);

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
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      {/* Outer Interpolated Ring */}
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none select-none transition-all"
        style={{
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          transitionDuration: shouldReduceMotion ? "0ms" : "280ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, width, height, border-color, background-color",
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

      {/* Inner Precision Center Dot */}
      <div
        ref={innerDotRef}
        className="fixed top-0 left-0 rounded-full bg-[#191916] pointer-events-none transition-all"
        style={{
          width: `${innerDotSize}px`,
          height: `${innerDotSize}px`,
          opacity: innerDotOpacity,
          transitionDuration: "200ms",
          willChange: "transform, opacity, width, height",
        }}
      />
    </div>
  );
};

export default CustomCursor;
