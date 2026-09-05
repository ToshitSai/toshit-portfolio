import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CursorMode =
  | "DEFAULT"
  | "PROJECT"
  | "CERTIFICATE"
  | "SAY_HI"
  | "OPEN"
  | "BUTTON"
  | "LINK"
  | "INPUT";

interface CursorState {
  mode: CursorMode;
  text: string;
  accentColor: string;
  projectId: string | null;
}

const DEFAULT_STATE: CursorState = {
  mode: "DEFAULT",
  text: "",
  accentColor: "rgba(25, 25, 22, 0.22)",
  projectId: null,
};

const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>(DEFAULT_STATE);

  // Single Source of Position Coordinates
  const pointerPos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const isPointerInitialized = useRef(false);

  // State Refs for RAF loop access without re-renders
  const stateRef = useRef<CursorState>(DEFAULT_STATE);
  stateRef.current = cursorState;

  // Dwell Indicator Refs
  const dwellTimer = useRef<number>(0);
  const isDwelling = useRef(false);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 1

  // Entry Pulse Ref
  const lastProjectId = useRef<string | null>(null);
  const isPulsing = useRef(false);
  const pulseScale = useRef(1);

  // DOM Refs for Single Root & Sub-parts
  const rootRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Check Touch Device Capability
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

  // Single Unified rAF Animation & Position Update Loop
  useEffect(() => {
    if (isTouchDevice) return;

    let frameCount = 0;
    let prevMouseX = -100;
    let prevMouseY = -100;

    const animate = () => {
      frameCount++;

      const pX = pointerPos.current.x;
      const pY = pointerPos.current.y;

      if (isPointerInitialized.current && pX >= 0 && pY >= 0) {
        // 1. Check Pointer Movement for Dwell Reset
        const mouseDelta = Math.hypot(pX - prevMouseX, pY - prevMouseY);
        prevMouseX = pX;
        prevMouseY = pY;

        // 2. High-speed Responsive Lerp (15-25ms perceived lag: lerp factor = 0.38)
        const lerpFactor = 0.38;
        cursorPos.current.x += (pX - cursorPos.current.x) * lerpFactor;
        cursorPos.current.y += (pY - cursorPos.current.y) * lerpFactor;

        // 3. Dwell Progress Logic for Projects & Certificates
        const currentMode = stateRef.current.mode;
        if ((currentMode === "PROJECT" || currentMode === "CERTIFICATE") && mouseDelta < 1.2) {
          dwellTimer.current += 1;
          if (dwellTimer.current > 40) {
            // ~700ms threshold (40 frames at 60fps)
            isDwelling.current = true;
            const progress = Math.min((dwellTimer.current - 40) / 30, 1);
            setDwellProgress(progress);
          }
        } else {
          dwellTimer.current = 0;
          if (isDwelling.current) {
            isDwelling.current = false;
            setDwellProgress(0);
          }
        }

        // 4. One-time Entry Pulse Animation (scale 1 -> 1.06 -> 1 over ~240ms)
        if (isPulsing.current) {
          const t = Date.now() - (pulseScale.current || Date.now());
          if (t < 240) {
            const p = Math.sin((t / 240) * Math.PI);
            pulseScale.current = 1 + p * 0.06;
          } else {
            isPulsing.current = false;
            pulseScale.current = 1;
          }
        }

        // 5. Update Single Root Transform via GPU translate3d
        if (rootRef.current) {
          const scale = pulseScale.current || 1;
          rootRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        }

        // 6. Robust Dynamic Element Inspection (Fixes Sticking Hover States)
        if (frameCount % 3 === 0) {
          const target = document.elementFromPoint(pX, pY) as HTMLElement | null;
          if (target) {
            inspectElementAndSetState(target);
          } else {
            resetToDefault();
          }
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
  }, [isTouchDevice]);

  // Inspect Hover Target & Map to Finite Cursor State
  const inspectElementAndSetState = (target: HTMLElement) => {
    // 1. Text Inputs & Textareas (Disable custom cursor to allow native text cursor)
    const inputEl = target.closest('input, textarea, [contenteditable="true"]') as HTMLElement | null;
    if (inputEl) {
      if (stateRef.current.mode !== "INPUT") {
        setCursorState({ mode: "INPUT", text: "", accentColor: "", projectId: null });
      }
      return;
    }

    // 2. Project Card Hover -> Editorial Pill State
    const projectEl = target.closest('[data-cursor="project"], .group\\/project') as HTMLElement | null;
    if (projectEl) {
      const pId = projectEl.getAttribute("data-project-id") || projectEl.getAttribute("href") || "project";
      const accent = projectEl.getAttribute("data-accent") || "#FFD42A";

      // Trigger One-Time Entry Pulse if new project
      if (lastProjectId.current !== pId) {
        lastProjectId.current = pId;
        isPulsing.current = true;
        pulseScale.current = Date.now(); // Store start timestamp
      }

      const labelText = isDwelling.current && dwellProgress >= 1 ? "OPEN ↗" : "VIEW ↗";

      if (stateRef.current.mode !== "PROJECT" || stateRef.current.text !== labelText || stateRef.current.accentColor !== accent) {
        setCursorState({
          mode: "PROJECT",
          text: labelText,
          accentColor: accent,
          projectId: pId,
        });
      }
      return;
    }

    // Reset project id tracking when off projects
    lastProjectId.current = null;

    // 3. Certificate Hover
    const certEl = target.closest('[data-cursor="certificate"], .certificate-card') as HTMLElement | null;
    if (certEl) {
      const labelText = isDwelling.current && dwellProgress >= 1 ? "GO ↗" : "OPEN ↗";
      if (stateRef.current.mode !== "CERTIFICATE" || stateRef.current.text !== labelText) {
        setCursorState({
          mode: "CERTIFICATE",
          text: labelText,
          accentColor: "#FFD42A",
          projectId: null,
        });
      }
      return;
    }

    // 4. "Work with me" / Contact Triggers
    const contactBtn = target.closest('button, a, [role="button"]') as HTMLElement | null;
    const btnText = contactBtn?.textContent || "";
    if (
      contactBtn &&
      (btnText.includes("Work with me") ||
        btnText.includes("Available for work") ||
        contactBtn.getAttribute("data-cursor") === "contact" ||
        contactBtn.getAttribute("href") === "#contact")
    ) {
      if (stateRef.current.mode !== "SAY_HI") {
        setCursorState({
          mode: "SAY_HI",
          text: "SAY HI ↗",
          accentColor: "#FFD42A",
          projectId: null,
        });
      }
      return;
    }

    // 5. External Links
    const linkEl = target.closest('a[target="_blank"], a[href^="http"], a[href$=".pdf"]') as HTMLElement | null;
    if (linkEl) {
      if (stateRef.current.mode !== "OPEN") {
        setCursorState({
          mode: "OPEN",
          text: "OPEN ↗",
          accentColor: "#FFD42A",
          projectId: null,
        });
      }
      return;
    }

    // 6. Buttons & Interactive Links
    const btnEl = target.closest('button, a, [role="button"], select, .cursor-pointer') as HTMLElement | null;
    if (btnEl) {
      const isBtn = btnEl.tagName === "BUTTON" || btnEl.getAttribute("role") === "button";
      const targetMode = isBtn ? "BUTTON" : "LINK";
      if (stateRef.current.mode !== targetMode) {
        setCursorState({
          mode: targetMode,
          text: "",
          accentColor: "rgba(25, 25, 22, 0.35)",
          projectId: null,
        });
      }
      return;
    }

    // 7. Default Neutral State
    resetToDefault();
  };

  const resetToDefault = () => {
    if (stateRef.current.mode !== "DEFAULT") {
      setCursorState(DEFAULT_STATE);
    }
  };

  // Pointer Event Listeners
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Small magnetic snap effect on small CTA buttons only (3-4px max)
      const target = e.target as HTMLElement | null;
      const smallBtn = target?.closest("button.btn-magnetic, .nav-item-magnetic") as HTMLElement | null;

      let pX = e.clientX;
      let pY = e.clientY;

      if (smallBtn) {
        const rect = smallBtn.getBoundingClientRect();
        const cX = rect.left + rect.width / 2;
        const cY = rect.top + rect.height / 2;
        const dist = Math.hypot(pX - cX, pY - cY);
        if (dist < 32) {
          pX = pX + (cX - pX) * 0.15;
          pY = pY + (cY - pY) * 0.15;
        }
      }

      pointerPos.current.x = pX;
      pointerPos.current.y = pY;

      if (!isPointerInitialized.current) {
        isPointerInitialized.current = true;
        cursorPos.current.x = pX;
        cursorPos.current.y = pY;
      }
    };

    const handleMouseLeave = () => {
      isPointerInitialized.current = false;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      pointerPos.current.x = e.clientX;
      pointerPos.current.y = e.clientY;
      cursorPos.current.x = e.clientX;
      cursorPos.current.y = e.clientY;
      isPointerInitialized.current = true;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPointerInitialized.current = false;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTouchDevice]);

  if (isTouchDevice || typeof document === "undefined") return null;

  const { mode, text, accentColor } = cursorState;

  // Mode Specs & Dimensions
  const isProject = mode === "PROJECT";
  const isInput = mode === "INPUT";

  let width = 38;
  let height = 38;
  let isLens = false;
  let showDot = true;

  if (isProject) {
    showDot = false;
  } else if (mode === "CERTIFICATE") {
    width = 54;
    height = 54;
    showDot = false;
    isLens = true;
  } else if (mode === "SAY_HI") {
    width = 58;
    height = 58;
    showDot = false;
    isLens = true;
  } else if (mode === "OPEN") {
    width = 48;
    height = 48;
    showDot = false;
    isLens = true;
  } else if (mode === "BUTTON" || mode === "LINK") {
    width = 34;
    height = 34;
    isLens = true;
  }

  const radius = width / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - dwellProgress * circumference;

  const cursorNode = (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[2147483647] flex items-center justify-center select-none"
      style={{
        opacity: isInput || !isPointerInitialized.current ? 0 : 1,
        transition: "opacity 0.18s ease",
        willChange: "transform",
      }}
    >
      {/* 1. PROJECT HOVER STATE — DARK CHARCOAL EDITORIAL PILL */}
      {isProject ? (
        <div
          className="flex items-center justify-center rounded-full px-3.5 py-1.5 bg-[#1D1C18] border border-[#F6F0E4]/20 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-all duration-240 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in zoom-in-90 duration-200"
          style={{ height: "34px" }}
        >
          {/* TINY 4px PROJECT ACCENT DOT */}
          <span
            className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor || "#FFD42A" }}
          />

          {/* EDITORIAL WARM CREAM TEXT LABEL */}
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F0E4] whitespace-nowrap">
            {text || "VIEW ↗"}
          </span>
        </div>
      ) : (
        /* 2. DEFAULT & OTHER MODES — CLEAN CIRCULAR LENS RING & DOT */
        <div
          className="relative flex items-center justify-center rounded-full transition-all duration-260 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: `1px solid ${accentColor}`,
            backgroundColor: "transparent",
          }}
        >
          {/* DWELL PROGRESS CIRCULAR SVG ARC */}
          {dwellProgress > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox={`0 0 ${width} ${height}`}>
              <circle
                cx={width / 2}
                cy={height / 2}
                r={radius}
                fill="none"
                stroke="#FFD42A"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-75 ease-linear"
              />
            </svg>
          )}

          {/* CONTEXTUAL LENS TOP & BOTTOM ARCS */}
          {isLens && (
            <>
              <div
                className="absolute -top-1 w-3 h-[2px] rounded-full transition-colors duration-200"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="absolute -bottom-1 w-3 h-[2px] rounded-full transition-colors duration-200"
                style={{ backgroundColor: accentColor }}
              />
            </>
          )}

          {/* CONTEXTUAL TEXT LABEL */}
          {text && (
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#191916] whitespace-nowrap z-10">
              {text}
            </span>
          )}
        </div>
      )}

      {/* 3. CENTER PRECISION POINTER DOT FOR DEFAULT MODES */}
      {showDot && !isProject && (
        <div className="absolute w-[6px] h-[6px] rounded-full bg-[#191916] pointer-events-none" />
      )}
    </div>
  );

  return createPortal(cursorNode, document.body);
};

export default CustomCursor;
