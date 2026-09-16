import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface IntroContextType {
  isIntroComplete: boolean;
  isIntroActive: boolean;
  completeIntro: () => void;
  latestPointerRef: React.RefObject<{ x: number; y: number } | null>;
}

const IntroContext = createContext<IntroContextType>({
  isIntroComplete: true,
  isIntroActive: false,
  completeIntro: () => undefined,
  latestPointerRef: { current: null },
});

export const useIntro = () => useContext(IntroContext);

interface IntroProviderProps {
  children: React.ReactNode;
}

export const IntroProvider: React.FC<IntroProviderProps> = ({ children }) => {
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);

  // Passive pointer tracking during intro (and always) to capture latest mouse coordinates without re-renders
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      latestPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Determine initial intro state based on session storage and URL query params
  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("intro") === "true" || urlParams.get("reset") === "true") {
      sessionStorage.removeItem("has_seen_loader");
      sessionStorage.removeItem("hasVisited");
      try {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      } catch {
        // Ignore replace state errors
      }
      return true;
    }

    // Loader only plays on main landing page `/` if not visited in session
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
    const hasSeen = sessionStorage.getItem("has_seen_loader") || sessionStorage.getItem("hasVisited");
    
    return isHomePage && !hasSeen;
  });

  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(!isIntroActive);

  // Manage global body/html class during intro state (cursor: none !important)
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!isIntroComplete) {
      document.documentElement.classList.add("intro-active");
      document.body.classList.add("intro-active");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("intro-active");
      document.body.classList.remove("intro-active");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.classList.remove("intro-active");
      document.body.classList.remove("intro-active");
      document.body.style.overflow = "";
    };
  }, [isIntroComplete]);

  const completeIntro = useCallback(() => {
    setIsIntroActive(false);
    setIsIntroComplete(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
      sessionStorage.setItem("has_seen_loader", "true");
    }
  }, []);

  return (
    <IntroContext.Provider
      value={{
        isIntroComplete,
        isIntroActive,
        completeIntro,
        latestPointerRef,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};
