import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";

export type CursorMode = "DEFAULT" | "PROJECT" | "SAY_HI" | "OPEN" | "BUTTON" | "LINK";

interface CursorState {
  mode: CursorMode;
  text: string;
  accentColor: string | null;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
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
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isTouchDevice, shouldReduceMotion]);

  // Pointer Move, Click Ripple & Hover Mode State Machine
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. PROJECT HOVER (Vinyl Record Disc Mode with "VIEW ↗")
      const projectEl = target.closest(
        '[data-cursor="project"], .group\\/project, [data-project-card]'
      ) as HTMLElement | null;
      if (projectEl) {
        const accent = projectEl.getAttribute("data-accent") || "#FFD42A";
        setCursorState((prev) =>
          prev.mode === "PROJECT" && prev.accentColor === accent
            ? prev
            : { mode: "PROJECT", text: "VIEW ↗", accentColor: accent }
        );
        return;
      }

      // 2. "WORK WITH ME" / CONTACT HOVER ("SAY HI ↗" Mode)
      const contactTrigger = target.closest(
        'button, a, [role="button"]'
      ) as HTMLElement | null;
      const textContent = contactTrigger?.textContent || "";
      if (
        contactTrigger &&
        (textContent.includes("Work with me") ||
          textContent.includes("Available for work") ||
          contactTrigger.getAttribute("data-cursor") === "contact" ||
          contactTrigger.getAttribute("href") === "#contact")
      ) {
        setCursorState((prev) =>
          prev.mode === "SAY_HI"
            ? prev
            : { mode: "SAY_HI", text: "SAY HI ↗", accentColor: "#FFD42A" }
        );
        return;
      }

      // 3. EXTERNAL LINKS / CERTIFICATES ("OPEN ↗" Mode)
      const certEl = target.closest(
        '[data-cursor="certificate"], [aria-label*="Certificate"], .certificate-card'
      ) as HTMLElement | null;
      const linkEl = target.closest('a[target="_blank"], a[href^="http"], a[href$=".pdf"]') as HTMLElement | null;

      if (certEl || linkEl) {
        setCursorState((prev) =>
          prev.mode === "OPEN"
            ? prev
            : { mode: "OPEN", text: "OPEN ↗", accentColor: "#FFD42A" }
        );
        return;
      }

      // 4. BUTTON & LINK HOVER (Sun-Glow Mode)
      const buttonEl = target.closest(
        'button, a, [role="button"], input, select, textarea, .cursor-pointer'
      ) as HTMLElement | null;
      if (buttonEl) {
        const isBtn = buttonEl.tagName === "BUTTON" || buttonEl.getAttribute("role") === "button";
        setCursorState((prev) =>
          prev.mode === (isBtn ? "BUTTON" : "LINK")
            ? prev
            : { mode: isBtn ? "BUTTON" : "LINK", text: "", accentColor: "#FFD42A" }
        );
        return;
      }

      // 5. DEFAULT STATE
      setCursorState((prev) =>
        prev.mode === "DEFAULT"
          ? prev
          : { mode: "DEFAULT", text: "", accentColor: null }
      );
    };

    // Spawn 400ms Accent Yellow Expanding Ripple on Pointer Click
    const handlePointerDown = (e: PointerEvent) => {
      const ripple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 420);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || typeof document === "undefined") return null;

  const { mode, text, accentColor } = cursorState;

  // Dimensional Specs & Branded Sun-Glow Styles per Mode
  let outerSize = 40;
  let innerDotOpacity = 1;
  let innerDotSize = 6;
  let innerDotColor = "#191916";
  let borderColor = "rgba(25, 25, 22, 0.22)";
  let bgColor = "rgba(25, 25, 22, 0.03)";
  let boxShadow = "none";
  let isVinyl = false;

  if (mode === "PROJECT") {
    outerSize = 56;
    isVinyl = true;
    innerDotOpacity = 1;
    innerDotSize = 7;
    innerDotColor = accentColor || "#FFD42A";
    borderColor = "#FFD42A";
    bgColor = "#1D2024";
    boxShadow = "0 0 20px rgba(255, 212, 42, 0.4)";
  } else if (mode === "SAY_HI") {
    outerSize = 56;
    innerDotOpacity = 0;
    borderColor = "#FFD42A";
    bgColor = "rgba(255, 212, 42, 0.18)";
    boxShadow = "0 0 24px rgba(255, 212, 42, 0.65), inset 0 0 10px rgba(255, 212, 42, 0.3)";
  } else if (mode === "OPEN") {
    outerSize = 48;
    innerDotOpacity = 0;
    borderColor = "#FFD42A";
    bgColor = "rgba(255, 212, 42, 0.14)";
    boxShadow = "0 0 18px rgba(255, 212, 42, 0.5)";
  } else if (mode === "BUTTON" || mode === "LINK") {
    outerSize = 36;
    innerDotSize = 5;
    borderColor = "rgba(255, 212, 42, 0.8)";
    bgColor = "rgba(255, 212, 42, 0.12)";
    boxShadow = "0 0 14px rgba(255, 212, 42, 0.45)";
  }

  const cursorNode = (
    <div
      className="pointer-events-none fixed inset-0 z-[2147483647] overflow-hidden select-none"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.15s ease" }}
    >
      {/* 1. CLICK ACCENT YELLOW RIPPLE ANIMATIONS */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed top-0 left-0 rounded-full border-2 border-[#FFD42A] pointer-events-none"
          style={{
            width: "40px",
            height: "40px",
            transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0) translate(-50%, -50%)`,
            animation: "cursorRipple 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        />
      ))}

      {/* 2. OUTER TRAILING RING (Positioned via single rAF lerp translate3d) */}
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none select-none"
        style={{
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          boxShadow: boxShadow,
          transition: shouldReduceMotion
            ? "none"
            : "width 220ms cubic-bezier(0.16, 1, 0.3, 1), height 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease, background-color 220ms ease, box-shadow 220ms ease",
          willChange: "transform",
        }}
      >
        {/* VINYL RECORD GROOVES (Spinning SVG disc when hovering project cards) */}
        {isVinyl && (
          <svg
            className="absolute inset-0 w-full h-full animate-spin pointer-events-none"
            style={{ animationDuration: "5s" }}
            viewBox="0 0 56 56"
            fill="none"
          >
            <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="28" cy="28" r="16" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="28" cy="28" r="10" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          </svg>
        )}

        {/* CONTEXTUAL LABEL ("VIEW ↗", "SAY HI ↗", "OPEN ↗") */}
        {text && (
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-150"
            style={{ color: isVinyl ? "#FFD42A" : "#191916" }}
          >
            {text}
          </span>
        )}
      </div>

      {/* 3. INNER PRECISION CENTER DOT (Positioned via single rAF exact mouse translate3d) */}
      <div
        ref={innerDotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-180"
        style={{
          width: `${innerDotSize}px`,
          height: `${innerDotSize}px`,
          backgroundColor: innerDotColor,
          opacity: innerDotOpacity,
          willChange: "transform",
        }}
      />

      {/* RIPPLE KEYFRAME INLINE STYLE */}
      <style>{`
        @keyframes cursorRipple {
          0% {
            opacity: 0.9;
            scale: 0.3;
          }
          100% {
            opacity: 0;
            scale: 2.2;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(cursorNode, document.body);
};

export default CustomCursor;
