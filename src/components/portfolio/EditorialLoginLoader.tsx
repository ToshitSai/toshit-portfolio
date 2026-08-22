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

      // Smooth finish timing (1.8s duration)
      const timer = setTimeout(() => {
        try {
          sessionStorage.setItem("has_seen_loader", "true");
        } catch {
          // Ignore storage errors
        }
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 1800);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
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

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="login-loader-overlay"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* PAC-MAN SHAPE & TRAILING DOTS HORIZONTAL CONTAINER */}
            <div className="flex items-center gap-3">
              {/* YELLOW PAC-MAN-LIKE CHARACTER WITH FLUID CONTINUOUS MOUTH BITE */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  className="w-full h-full text-[#FFD42A]"
                >
                  {prefersReducedMotion ? (
                    <path
                      d="M 18 18 L 34 18 A 16 16 0 1 0 33.8 20 Z"
                      fill="#FFD42A"
                    />
                  ) : (
                    <motion.path
                      fill="#FFD42A"
                      animate={{
                        d: [
                          "M 18 18 L 34 18 A 16 16 0 1 0 33.8 20 Z",
                          "M 18 18 L 33.5 10 A 16 16 0 1 0 33.5 26 Z",
                          "M 18 18 L 34 18 A 16 16 0 1 0 33.8 20 Z",
                        ],
                      }}
                      transition={{
                        duration: 0.75,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </svg>
              </div>

              {/* TRAILING DOTS WITH FLUID STAGGERED OPACITY PULSE */}
              <div className="flex items-center gap-2 pl-1">
                {[0, 1, 2, 3, 4].map((idx) => {
                  return (
                    <motion.span
                      key={idx}
                      animate={
                        prefersReducedMotion
                          ? { opacity: 0.5 }
                          : {
                              opacity: [0.2, 0.9, 0.2],
                              scale: [0.95, 1.15, 0.95],
                            }
                      }
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: idx * 0.15,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D9A62C]"
                    />
                  );
                })}
              </div>
            </div>

            {/* CONTEXTUAL MONOSPACE MESSAGE */}
            <div className="h-6 flex items-center justify-center pt-1">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  fontWeight: 400,
                  color: "#6F6C63",
                }}
                className="text-center px-4 max-w-xs sm:max-w-md uppercase tracking-wider"
              >
                {currentMessage}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorialLoginLoader;
