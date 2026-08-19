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
  const [dotsOffset, setDotsOffset] = useState<number>(0);
  const [mouthOpen, setMouthOpen] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Pick a fresh random message whenever isLoading flips to true
  useEffect(() => {
    if (isLoading) {
      setCurrentMessage(getRandomContextualMessage());

      // Lock body scroll during fullscreen loader
      document.body.style.overflow = "hidden";

      // Auto finish loading after 1.8 seconds
      const timer = setTimeout(() => {
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

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Pac-Man mouth bite & trailing dots animation interval (800ms loop)
  useEffect(() => {
    if (!isLoading || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
      setDotsOffset((prev) => (prev + 1) % 5);
    }, 280);

    return () => clearInterval(interval);
  }, [isLoading, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="login-loader-overlay"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="flex flex-col items-center justify-center space-y-5">
            {/* PAC-MAN SHAPE & TRAILING DOTS HORIZONTAL CONTAINER */}
            <div className="flex items-center gap-2.5">
              {/* YELLOW PAC-MAN-LIKE CHARACTER */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  className="w-full h-full text-[#FFD42A]"
                  style={{
                    transform: "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  {/* Circular Pac-Man body with animated SVG wedge mouth */}
                  {prefersReducedMotion || !mouthOpen ? (
                    // CLOSED MOUTH PAC-MAN
                    <path
                      d="M 18 18 L 34 18 A 16 16 0 1 0 33.8 20 Z"
                      fill="#FFD42A"
                    />
                  ) : (
                    // GENTLY OPENED MOUTH PAC-MAN
                    <path
                      d="M 18 18 L 33.5 10 A 16 16 0 1 0 33.5 26 Z"
                      fill="#FFD42A"
                    />
                  )}
                </svg>
              </div>

              {/* TRAILING DOTS (5 HORIZONTALLY ALIGNED DOTS WITH SEQUENTIAL OPACITY) */}
              <div className="flex items-center gap-2 pl-1">
                {[0.8, 0.55, 0.35, 0.25, 0.15].map((baseOpacity, idx) => {
                  // Cycle opacity sequentially to create moving motion effect
                  const activeIdx = (dotsOffset + idx) % 5;
                  const opacities = [0.85, 0.6, 0.4, 0.25, 0.15];
                  const currentOpacity = prefersReducedMotion ? baseOpacity : opacities[activeIdx];

                  return (
                    <motion.span
                      key={idx}
                      animate={{ opacity: currentOpacity }}
                      transition={{ duration: 0.25 }}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D9A62C]"
                    />
                  );
                })}
              </div>
            </div>

            {/* CONTEXTUAL MONOSPACE MESSAGE */}
            <div className="h-6 flex items-center justify-center pt-2">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
