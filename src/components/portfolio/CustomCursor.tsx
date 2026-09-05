import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";

export type CursorMode =
  | "DEFAULT"
  | "PROJECT"
  | "NOW_BUILDING"
  | "SAY_HI"
  | "OPEN"
  | "BUTTON"
  | "LINK";

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

interface TrailPoint {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: "DEFAULT",
    text: "",
    accentColor: null,
  });

  const shouldReduceMotion = useReducedMotion();

  // Pointer & Motion Coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const prevRingPos = useRef({ x: -100, y: -100 });

  // Spring Physics for Inertial Squash & Stretch
  const springRef = useRef({
    stretch: 1,
    squash: 1,
    angle: 0,
  });

  // Weather-Aware Idle State Refs
  const idleTimer = useRef(0);
  const isIdleRef = useRef(false);
  const idleFloatTime = useRef(0);

  // Magnetic Snap Target Ref
  const magneticTargetRef = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);

  // Trail Points Buffer
  const trailRef = useRef<TrailPoint[]>([]);

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

  // Coordinated Unified Single requestAnimationFrame Loop
  useEffect(() => {
    if (isTouchDevice) return;

    let frameCount = 0;

    const animate = () => {
      frameCount++;

      const mouseX = mousePos.current.x;
      const mouseY = mousePos.current.y;

      // 1. Weather-Aware Idle Detection & Cloud Drift
      const distMoved = Math.hypot(mouseX - prevRingPos.current.x, mouseY - prevRingPos.current.y);
      if (distMoved < 0.3) {
        idleTimer.current += 1;
      } else {
        idleTimer.current = 0;
        isIdleRef.current = false;
      }

      if (idleTimer.current > 220) {
        isIdleRef.current = true;
      }

      // Calculate Target Position for Outer Ring (Magnetic Snap vs Mouse)
      let targetX = mouseX;
      let targetY = mouseY;

      if (magneticTargetRef.current) {
        const { x: magX, y: magY } = magneticTargetRef.current;
        const magDist = Math.hypot(mouseX - magX, mouseY - magY);
        const MAG_RADIUS = 44;
        if (magDist < MAG_RADIUS) {
          const pull = Math.pow(1 - magDist / MAG_RADIUS, 1.4) * 0.55;
          targetX = mouseX + (magX - mouseX) * pull;
          targetY = mouseY + (magY - mouseY) * pull;
        }
      }

      // Add Weather Cloud Float Offset if Idle
      if (isIdleRef.current && !shouldReduceMotion) {
        idleFloatTime.current += 0.025;
        const cloudX = Math.sin(idleFloatTime.current * 0.8) * 14;
        const cloudY = Math.cos(idleFloatTime.current * 1.2) * 5;
        targetX += cloudX;
        targetY += cloudY;
      }

      // 2. Inner Dot follows mouse EXACTLY in same frame (No desync/separation!)
      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // 3. Outer Ring Lerp
      const lerpFactor = shouldReduceMotion ? 1 : 0.22;
      ringPos.current.x += (targetX - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (targetY - ringPos.current.y) * lerpFactor;

      // 4. Inertial Velocity-Based Squash & Stretch Physics
      const vx = ringPos.current.x - prevRingPos.current.x;
      const vy = ringPos.current.y - prevRingPos.current.y;
      const speed = Math.hypot(vx, vy);

      if (speed > 0.1) {
        springRef.current.angle = Math.atan2(vy, vx);
      }

      const targetStretch = shouldReduceMotion ? 1 : 1 + Math.min(speed * 0.012, 0.35);
      const targetSquash = shouldReduceMotion ? 1 : 1 / Math.sqrt(targetStretch);

      springRef.current.stretch += (targetStretch - springRef.current.stretch) * 0.18;
      springRef.current.squash += (targetSquash - springRef.current.squash) * 0.18;

      prevRingPos.current.x = ringPos.current.x;
      prevRingPos.current.y = ringPos.current.y;

      // 5. Update Outer Ring Transform with Inertial Matrix
      if (outerRingRef.current) {
        const { stretch, squash, angle } = springRef.current;
        outerRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squash}) rotate(${-angle}rad)`;
      }

      // 6. Groove Trail Buffer Update
      if (frameCount % 2 === 0) {
        trailRef.current = [
          { x: ringPos.current.x, y: ringPos.current.y },
          ...trailRef.current.slice(0, 6),
        ];
        setTrail([...trailRef.current]);
      }

      // 7. Dynamic ElementFromPoint Check to Prevent Stuck Hover States (Fixes Bug 3)
      if (frameCount % 3 === 0 && mouseX > 0 && mouseY > 0) {
        const targetEl = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
        if (targetEl) {
          updateCursorStateFromElement(targetEl);
        } else {
          setCursorState({ mode: "DEFAULT", text: "", accentColor: null });
        }
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

  // Helper: Element Inspection to Set Cursor Mode
  const updateCursorStateFromElement = (target: HTMLElement) => {
    // 1. NOW BUILDING BADGE (Tonearm Needle-Drop Mode)
    const nowBuildingEl = target.closest(
      '[data-cursor="now-building"], [aria-label*="Now Building"], .group\\/card'
    ) as HTMLElement | null;

    if (nowBuildingEl) {
      setCursorState((prev) =>
        prev.mode === "NOW_BUILDING"
          ? prev
          : { mode: "NOW_BUILDING", text: "", accentColor: "#FFD42A" }
      );
      return;
    }

    // 2. PROJECT HOVER (Solid Black Vinyl Badge with Clean Yellow "VIEW ↗")
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

    // 3. "WORK WITH ME" / CONTACT HOVER ("SAY HI ↗" Mode)
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

    // 4. EXTERNAL LINKS / CERTIFICATES ("OPEN ↗" Mode)
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

    // 5. BUTTON & LINK HOVER (Sun-Glow & Magnetic Target Detection)
    const buttonEl = target.closest(
      'button, a, [role="button"], input, select, textarea, .cursor-pointer'
    ) as HTMLElement | null;

    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect();
      magneticTargetRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        el: buttonEl,
      };

      const isBtn = buttonEl.tagName === "BUTTON" || buttonEl.getAttribute("role") === "button";
      setCursorState((prev) =>
        prev.mode === (isBtn ? "BUTTON" : "LINK")
          ? prev
          : { mode: isBtn ? "BUTTON" : "LINK", text: "", accentColor: "#FFD42A" }
      );
      return;
    }

    // Clear Magnetic Target if no button hovered
    magneticTargetRef.current = null;

    // 6. DEFAULT STATE
    setCursorState((prev) =>
      prev.mode === "DEFAULT"
        ? prev
        : { mode: "DEFAULT", text: "", accentColor: null }
    );
  };

  // Pointer Move, Click Ripple & Event Listeners
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleScroll = () => {
      // Recalculate element from point on scroll to avoid stale states
      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y) as HTMLElement | null;
        if (el) updateCursorStateFromElement(el);
      }
    };

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || typeof document === "undefined") return null;

  const { mode, text } = cursorState;

  // Dimensional Specs & Branded Sun-Glow Styles per Mode
  let outerSize = 40;
  let innerDotOpacity = 1;
  let innerDotSize = 6;
  let innerDotColor = "#191916";
  let borderColor = "rgba(25, 25, 22, 0.22)";
  let bgColor = "rgba(25, 25, 22, 0.03)";
  let boxShadow = "none";
  let tonearmTilt = false;

  if (mode === "PROJECT") {
    // Redesigned Solid Black Vinyl Badge: Solid #1D2024 circle, yellow accent #FFD42A, legible text, no dashed SVG clutter
    outerSize = 56;
    innerDotOpacity = 1;
    innerDotSize = 7;
    innerDotColor = "#FFD42A";
    borderColor = "#FFD42A";
    bgColor = "#1D2024";
    boxShadow = "0 0 20px rgba(255, 212, 42, 0.4)";
  } else if (mode === "NOW_BUILDING") {
    // Tonearm Needle-Drop Mode on NOW BUILDING badge
    outerSize = 50;
    tonearmTilt = true;
    innerDotOpacity = 1;
    innerDotSize = 8;
    innerDotColor = "#FFD42A";
    borderColor = "#FFD42A";
    bgColor = "rgba(29, 32, 36, 0.9)";
    boxShadow = "0 0 22px rgba(255, 212, 42, 0.6)";
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
      {/* 1. VINYL GROOVE TRAIL (Curved dotted spiral path behind cursor) */}
      {trail.map((point, i) => {
        const opacity = (1 - i / trail.length) * 0.45;
        const curveOffset = Math.sin(i * 0.7) * 4;
        const dotScale = (1 - i / trail.length) * 4 + 1.5;

        return (
          <div
            key={i}
            className="fixed top-0 left-0 rounded-full bg-[#FFD42A] pointer-events-none"
            style={{
              width: `${dotScale}px`,
              height: `${dotScale}px`,
              opacity: opacity,
              transform: `translate3d(${point.x + curveOffset}px, ${point.y}px, 0) translate(-50%, -50%)`,
              transition: "opacity 0.2s ease",
            }}
          />
        );
      })}

      {/* 2. CLICK ACCENT YELLOW RIPPLE ANIMATIONS */}
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

      {/* 3. OUTER TRAILING RING (Positioned via single rAF lerp translate3d with inertial squash & stretch) */}
      <div
        ref={outerRingRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none select-none ${
          tonearmTilt ? "-rotate-[16deg]" : ""
        }`}
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
        {/* TONEARM ARM EXTENSION GRAPHIC (NOW BUILDING HOVER) */}
        {tonearmTilt && (
          <div className="absolute -top-3.5 -right-2 w-5 h-1 bg-[#FFD42A] rounded-full shadow-sm rotate-[35deg] origin-left animate-pulse" />
        )}

        {/* CONTEXTUAL LABEL ("VIEW ↗", "SAY HI ↗", "OPEN ↗") — Redesigned solid black vinyl badge */}
        {text && (
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap z-10 text-[#FFD42A] drop-shadow-xs"
          >
            {text}
          </span>
        )}
      </div>

      {/* 4. INNER PRECISION CENTER DOT (Positioned via single rAF exact mouse translate3d) */}
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
