import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TransitionStage = "idle" | "covering" | "covered" | "revealing";

interface PageTransitionContextType {
  isTransitioning: boolean;
  transitionStage: TransitionStage;
  triggerTransition: (targetPath: string, options?: { scrollToTop?: boolean }) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  
  const isTransitioningRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const triggerTransition = useCallback(
    (targetPath: string, options = { scrollToTop: true }) => {
      // 1. CLICK PROTECTION: Prevent duplicate or rapid navigation events
      if (isTransitioningRef.current) return;

      // Extract path without hash for route check
      const currentPath = location.pathname;
      const targetCleanPath = targetPath.split("#")[0] || "/";

      // If already on the target path, just scroll to top smoothly if requested
      if (currentPath === targetCleanPath) {
        if (targetPath.includes("#")) {
          const hashId = targetPath.split("#")[1];
          let targetEl = document.getElementById(hashId);
          if (!targetEl && hashId === "work") targetEl = document.getElementById("projects");
          if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
        } else if (options.scrollToTop) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      // 2. REDUCED MOTION CHECK: Respect user preferences
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        navigate(targetPath);
        if (options.scrollToTop) {
          window.scrollTo(0, 0);
        }
        return;
      }

      // 3. START COVER PHASE
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setTransitionStage("covering");

      // Cover animation duration: 520ms (cubic-bezier(0.76, 0, 0.24, 1))
      setTimeout(() => {
        setTransitionStage("covered");

        // 4. ROUTE SWITCH (While fully covered - NO WHITE FLASH)
        navigate(targetPath);

        if (options.scrollToTop) {
          window.scrollTo(0, 0);
        }

        // Brief tick for target route DOM mount
        setTimeout(() => {
          setTransitionStage("revealing");

          // 5. REVEAL PHASE Retraction (520ms)
          setTimeout(() => {
            setTransitionStage("idle");
            setIsTransitioning(false);
            isTransitioningRef.current = false;
          }, 520);
        }, 40);
      }, 520);
    },
    [location.pathname, navigate]
  );

  // 6. BROWSER BACK/FORWARD BUTTON HANDLING (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (!isTransitioningRef.current) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        transitionStage,
        triggerTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
};
