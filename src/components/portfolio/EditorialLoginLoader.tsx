import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EditorialLoginLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

const CONTEXTUAL_MESSAGES = [
  "Chasing down the last few bytes...",
  "Warming up the pixels...",
  "Teaching the interface some manners...",
  "Connecting the dots...",
  "Polishing the rough edges...",
  "Aligning the pixels...",
  "Compiling a little magic...",
  "Making the pixels behave...",
  "Setting the interface in motion...",
  "Brewing something useful...",
  "Turning ideas into interfaces...",
  "Arranging the moving parts...",
  "Feeding the UI some caffeine...",
  "Untangling a few wires...",
  "Calibrating the creative engine...",
  "Putting the pieces together...",
  "Making the components cooperate...",
  "Bringing the pixels to life...",
  "Preparing the good stuff...",
  "Shaping the next interaction...",
  "Getting things into place...",
  "Teaching the browser a new trick...",
  "Almost ready to make some noise...",
];

let previousMessageIndex = -1;

export const getRandomContextualMessage = (): string => {
  let randomIndex = Math.floor(Math.random() * CONTEXTUAL_MESSAGES.length);
  if (randomIndex === previousMessageIndex) {
    randomIndex = (randomIndex + 1) % CONTEXTUAL_MESSAGES.length;
  }
  previousMessageIndex = randomIndex;
  return CONTEXTUAL_MESSAGES[randomIndex];
};

const EditorialLoginLoader: React.FC<EditorialLoginLoaderProps> = ({
  isLoading,
  onLoadingComplete,
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const handleSkip = () => {
    try {
      sessionStorage.setItem("has_seen_loader", "true");
    } catch {
      // Ignore storage errors
    }
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoading) {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading]);

  // Pick a fresh random message whenever isLoading becomes true
  useEffect(() => {
    if (isLoading) {
      setCurrentMessage(getRandomContextualMessage());

      // Lock body scroll during fullscreen loader
      document.body.style.overflow = "hidden";

      // Smooth finish timing (2.0s duration unless persistent preview flag ?loader=true is present)
      const isPersistentPreview = typeof window !== "undefined" && window.location.search.includes("loader=true");

      if (!isPersistentPreview) {
        const timer = setTimeout(() => {
          try {
            sessionStorage.setItem("has_seen_loader", "true");
          } catch {
            // Ignore storage errors
          }
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 2000);

        return () => {
          clearTimeout(timer);
          document.body.style.overflow = "";
        };
      }
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading, onLoadingComplete]);

  // Accessibility check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Duration of one chomping mouth cycle (open & shut) in seconds
  const BITE_DURATION = 0.32;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="login-loader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="polite"
          aria-label={`Loading portfolio: ${currentMessage}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#FBF7ED",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {/* CENTERED LOADER COMPOSITION */}
          <div className="flex flex-col items-center justify-center space-y-7">
            {/* PAC-MAN SHAPE & CONTINUOUS TRAILING DOT STREAM */}
            <div className="flex items-center space-x-3.5 pl-2">
              {/* PAC-MAN CHARACTER WITH ANIMATED DYNAMIC TOP & BOTTOM JAWS */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  className="w-full h-full overflow-visible"
                >
                  {/* TOP JAW (Upper Semicircle) */}
                  <motion.path
                    d="M 18 18 L 34 18 A 16 16 0 0 0 2 18 Z"
                    fill="#FFD42A"
                    style={{ transformOrigin: "18px 18px" }}
                    animate={
                      prefersReducedMotion
                        ? { rotate: -20 }
                        : { rotate: [0, -36, 0] }
                    }
                    transition={{
                      duration: BITE_DURATION,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {/* PAC-MAN EYE (Attached to & rotating with Top Jaw) */}
                  <motion.circle
                    cx="19"
                    cy="10"
                    r="1.8"
                    fill="#1C1F24"
                    style={{ transformOrigin: "18px 18px" }}
                    animate={
                      prefersReducedMotion
                        ? { rotate: -20 }
                        : { rotate: [0, -36, 0] }
                    }
                    transition={{
                      duration: BITE_DURATION,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {/* BOTTOM JAW (Lower Semicircle) */}
                  <motion.path
                    d="M 18 18 L 34 18 A 16 16 0 0 1 2 18 Z"
                    fill="#FFD42A"
                    style={{ transformOrigin: "18px 18px" }}
                    animate={
                      prefersReducedMotion
                        ? { rotate: 20 }
                        : { rotate: [0, 36, 0] }
                    }
                    transition={{
                      duration: BITE_DURATION,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>

              {/* TRAILING DOTS CONVEYOR STREAM (EATEN IN PERFECT SYNC WITH BITE) */}
              <div className="relative w-28 sm:w-32 h-5 overflow-hidden flex items-center">
                <motion.div
                  className="flex items-center gap-3.5 absolute left-0"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { x: [0, -18] }
                  }
                  transition={{
                    duration: BITE_DURATION,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const isFirst = idx === 0;
                    return (
                      <motion.span
                        key={idx}
                        animate={
                          prefersReducedMotion
                            ? { opacity: 0.7 }
                            : isFirst
                            ? { opacity: [1, 0], scale: [1, 0.2] }
                            : { opacity: 0.85, scale: 1 }
                        }
                        transition={
                          isFirst && !prefersReducedMotion
                            ? { duration: BITE_DURATION, repeat: Infinity, ease: "linear" }
                            : {}
                        }
                        className="w-2 h-2 rounded-full bg-[#D9A62C] flex-shrink-0"
                      />
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* CONTEXTUAL MONOSPACE MESSAGE */}
            <div className="h-6 flex items-center justify-center pt-1">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  letterSpacing: "0.09em",
                  fontWeight: 500,
                  color: "#6F6C63",
                }}
                className="text-center px-4 max-w-xs sm:max-w-md uppercase tracking-wider"
              >
                {currentMessage}
              </motion.p>
            </div>
          </div>

          {/* ESC HINT AT BOTTOM */}
          <div className="absolute bottom-6 text-[10px] text-[#A09C93] font-mono tracking-widest uppercase opacity-60">
            Press ESC to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorialLoginLoader;
