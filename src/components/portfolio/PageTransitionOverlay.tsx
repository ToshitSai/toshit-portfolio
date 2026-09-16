import React from "react";
import { usePageTransition } from "@/context/PageTransitionContext";

export const PageTransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionStage } = usePageTransition();

  if (!isTransitioning && transitionStage === "idle") {
    return null;
  }

  // Calculate transform-origin and scaleY based on transition stage
  let origin = "bottom";
  let scaleY = 0;

  if (transitionStage === "covering") {
    origin = "bottom";
    scaleY = 1;
  } else if (transitionStage === "covered") {
    origin = "bottom";
    scaleY = 1;
  } else if (transitionStage === "revealing") {
    origin = "top";
    scaleY = 0;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden select-none"
      style={{
        backgroundColor: "#FFF8E8", // Warm cream palette matching site background
        transformOrigin: origin,
        transform: `scaleY(${scaleY}) translateZ(0)`,
        transition: transitionStage === "covered" ? "none" : "transform 520ms cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      {/* SUBTLE YELLOW ACCENT EDGE BAR (FFD42A) */}
      <div
        className="absolute left-0 right-0 h-[3px] bg-[#FFD42A] shadow-[0_0_12px_rgba(255,212,42,0.6)]"
        style={{
          top: transitionStage === "covering" || transitionStage === "covered" ? 0 : "auto",
          bottom: transitionStage === "revealing" ? 0 : "auto",
        }}
      />
    </div>
  );
};

export default PageTransitionOverlay;
