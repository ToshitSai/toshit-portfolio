import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, X, CheckCircle2 } from "lucide-react";
import { Certificate, CERTIFICATES_DATA } from "@/data/certificatesData";

interface Certificate3DCarouselProps {
  certificates?: Certificate[];
}

export const Certificate3DCarousel: React.FC<Certificate3DCarouselProps> = ({
  certificates = CERTIFICATES_DATA,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedModalCert, setSelectedModalCert] = useState<Certificate | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [screenSize, setScreenSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const isAnimatingRef = useRef(false);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const totalCertificates = certificates.length;

  // Responsive Screen Detection
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenSize("mobile");
      } else if (w < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lazy-preload active and adjacent certificate images only
  useEffect(() => {
    if (!certificates.length) return;
    const indicesToLoad = [
      activeIndex,
      (activeIndex + 1) % totalCertificates,
      (activeIndex - 1 + totalCertificates) % totalCertificates,
    ];
    indicesToLoad.forEach((idx) => {
      if (certificates[idx]?.image) {
        const img = new Image();
        img.src = certificates[idx].image;
      }
    });
  }, [activeIndex, certificates, totalCertificates]);

  // Safe Index Navigation with Debounce/Queue lock
  const navigateTo = useCallback(
    (newIndex: number) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      // Wrap around index
      const wrapped = (newIndex + totalCertificates) % totalCertificates;
      setActiveIndex(wrapped);

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 550);
    },
    [totalCertificates]
  );

  const handleNext = useCallback(() => {
    navigateTo(activeIndex + 1);
  }, [activeIndex, navigateTo]);

  const handlePrev = useCallback(() => {
    navigateTo(activeIndex - 1);
  }, [activeIndex, navigateTo]);

  // Keyboard Shortcuts (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside input elements
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (selectedModalCert) {
        if (e.key === "Escape") {
          e.preventDefault();
          setSelectedModalCert(null);
        }
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, selectedModalCert]);

  // Mouse Wheel / Trackpad Navigation Handler (passive, no scroll hijacking)
  const stageRef = useRef<HTMLDivElement>(null);

  // Focus trap for Modal Dialog
  useEffect(() => {
    if (selectedModalCert) {
      setTimeout(() => {
        modalCloseButtonRef.current?.focus();
      }, 100);
    } else {
      triggerButtonRef.current?.focus();
    }
  }, [selectedModalCert]);

  // Pointer/Touch Drag Handlers for Physical Drag & Snap
  const dragStartXRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedModalCert) return;
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    setDragOffset(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const THRESHOLD = screenSize === "mobile" ? 50 : 80;
    if (dragOffset < -THRESHOLD) {
      handleNext();
    } else if (dragOffset > THRESHOLD) {
      handlePrev();
    }
    setDragOffset(0);
    dragStartXRef.current = null;
  };

  const activeCert = certificates[activeIndex];

  // Helper to compute 3D Card Transforms per index offset
  const getCardTransform = (index: number) => {
    let diff = index - activeIndex;
    // Circular wrap distance
    if (diff > totalCertificates / 2) diff -= totalCertificates;
    if (diff < -totalCertificates / 2) diff += totalCertificates;

    const dragFactor = isDragging ? dragOffset : 0;

    if (shouldReduceMotion) {
      // Reduced motion fallback: 2D flat crossfade / slide
      return {
        x: diff * 280 + dragFactor,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: diff === 0 ? 1 : 0.85,
        opacity: diff === 0 ? 1 : Math.abs(diff) === 1 ? 0.35 : 0,
        zIndex: diff === 0 ? 30 : 30 - Math.abs(diff) * 10,
        pointerEvents: diff === 0 ? ("auto" as const) : ("none" as const),
      };
    }

    if (screenSize === "desktop") {
      if (diff === 0) {
        return {
          x: dragFactor * 0.85,
          y: 0,
          z: 0,
          rotateY: dragFactor * -0.03,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) { // Right side card
        return {
          x: 410 + dragFactor * 0.7,
          y: 0,
          z: -130,
          rotateY: -12,
          scale: 0.77,
          opacity: 0.45,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) { // Left side card
        return {
          x: -410 + dragFactor * 0.7,
          y: 0,
          z: -130,
          rotateY: 12,
          scale: 0.77,
          opacity: 0.45,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else if (diff > 1) {
        return {
          x: 720 + dragFactor,
          y: 0,
          z: -280,
          rotateY: -22,
          scale: 0.55,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      } else {
        return {
          x: -720 + dragFactor,
          y: 0,
          z: -280,
          rotateY: 22,
          scale: 0.55,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      }
    } else if (screenSize === "tablet") {
      if (diff === 0) {
        return {
          x: dragFactor * 0.85,
          y: 0,
          z: 0,
          rotateY: dragFactor * -0.04,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) {
        return {
          x: 290 + dragFactor * 0.6,
          y: 0,
          z: -110,
          rotateY: -10,
          scale: 0.74,
          opacity: 0.4,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) {
        return {
          x: -290 + dragFactor * 0.6,
          y: 0,
          z: -110,
          rotateY: 10,
          scale: 0.74,
          opacity: 0.4,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else {
        return {
          x: (diff > 0 ? 550 : -550) + dragFactor,
          y: 0,
          z: -240,
          rotateY: diff > 0 ? -18 : 18,
          scale: 0.5,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      }
    } else {
      // Mobile stage
      const mobileOffset = typeof window !== "undefined" && window.innerWidth < 420 ? 110 : 160;

      if (diff === 0) {
        return {
          x: dragFactor * 0.9,
          y: 0,
          z: 0,
          rotateY: dragFactor * -0.05,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) {
        return {
          x: mobileOffset + dragFactor * 0.5,
          y: 0,
          z: -80,
          rotateY: -8,
          scale: 0.65,
          opacity: 0.25,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) {
        return {
          x: -mobileOffset + dragFactor * 0.5,
          y: 0,
          z: -80,
          rotateY: 8,
          scale: 0.65,
          opacity: 0.25,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      } else {
        return {
          x: (diff > 0 ? mobileOffset * 2 : -mobileOffset * 2) + dragFactor,
          y: 0,
          z: -180,
          rotateY: diff > 0 ? -15 : 15,
          scale: 0.45,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      }
    }
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedModalCert) return;
    if (Math.abs(dragOffset) > 10) return;

    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;

    if (relativeX < 0.45) {
      handlePrev();
    } else if (relativeX > 0.55) {
      handleNext();
    } else {
      // Center dead zone click (45% - 55%): Do not trigger prev/next.
      // If clicking active certificate card, open modal viewer.
      const target = e.target as HTMLElement;
      const cardEl = target.closest('[data-certificate-card]') as HTMLElement | null;
      if (cardEl) {
        setSelectedModalCert(activeCert);
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none py-2 sm:py-6">
      {/* 1. SHORT CENTERED INTRO SENTENCE (REFERENCE 1 TOP TEXT) */}
      <div className="w-full max-w-[760px] px-4 text-center mb-8 sm:mb-14">
        <p className="font-sans text-[16px] sm:text-[19px] md:text-[21px] text-[#4A525D] leading-relaxed tracking-tight font-normal">
          A small archive of certifications, courses, and milestones from my AI/ML journey.
        </p>
      </div>

      {/* 2. 3D CAROUSEL STAGE CONTAINER */}
      <div
        ref={stageRef}
        data-cursor="certificate-stage"
        className="relative w-full max-w-[1280px] h-[260px] sm:h-[360px] md:h-[420px] flex items-center justify-center overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing mb-8 sm:mb-12"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleStageClick}
      >
        {/* CERTIFICATE CARDS */}
        {certificates.map((cert, index) => {
          const transform = getCardTransform(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={cert.id}
              initial={false}
              animate={{
                x: transform.x,
                y: transform.y,
                z: transform.z,
                rotateY: transform.rotateY,
                scale: transform.scale,
                opacity: transform.opacity,
              }}
              transition={{
                duration: isDragging ? 0.05 : 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                zIndex: transform.zIndex,
                pointerEvents: transform.pointerEvents,
                transformStyle: "preserve-3d",
              }}
              data-certificate-card={isActive ? "active" : "side"}
              className="group cursor-pointer flex items-center justify-center"
            >
              {/* TIGHT ZERO-PADDING DOCUMENT WRAPPER */}
              <div
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isActive
                    ? "border-[#20252B]/12 shadow-[0_20px_50px_rgba(32,37,43,0.18)] hover:shadow-[0_26px_60px_rgba(32,37,43,0.25)]"
                    : "border-[#20252B]/8 shadow-md grayscale-[15%] hover:grayscale-0 opacity-90"
                }`}
              >
                {/* CERTIFICATE IMAGE FILLING 100% OF CARD BOUNDARY */}
                <div className="relative flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="eager"
                    className="w-auto h-auto max-w-[280px] sm:max-w-[500px] md:max-w-[620px] lg:max-w-[700px] max-h-[200px] sm:max-h-[310px] md:max-h-[360px] object-contain block transition-transform duration-500 group-hover:scale-[1.008]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. REFERENCE 1 TYPOGRAPHIC HIERARCHY BELOW CAROUSEL: METADATA → TITLE → DESCRIPTION */}
      <div className="w-full max-w-[800px] px-4 flex flex-col items-center text-center">
        <div className="min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* A. SMALL METADATA LINE (01 / 19  ·  OPENAI ACADEMY  ·  2026) */}
              <div className="font-mono text-[11px] sm:text-[13px] tracking-[0.22em] font-semibold text-[#6F6C63] uppercase mb-2.5 sm:mb-3 select-none">
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(totalCertificates).padStart(2, "0")}</span>
                <span className="mx-2.5 sm:mx-3 text-[#20252B]/30">·</span>
                <span>{activeCert.issuer}</span>
                <span className="mx-2.5 sm:mx-3 text-[#20252B]/30">·</span>
                <span>{activeCert.year}</span>
              </div>

              {/* B. LARGE EDITORIAL DISPLAY TITLE */}
              <h2 className="font-serif font-normal text-[28px] sm:text-[44px] md:text-[50px] text-[#20252B] tracking-[-0.02em] leading-[1.08] max-w-[780px] mb-2.5 sm:mb-3">
                {activeCert.title}
              </h2>

              {/* C. SHORT DESCRIPTION */}
              <p className="font-sans text-[14px] sm:text-[16px] md:text-[17px] text-[#6F6C63] max-w-[620px] leading-[1.55] tracking-normal font-normal">
                {activeCert.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FULLSCREEN CERTIFICATE VIEWER MODAL */}
      <AnimatePresence>
        {selectedModalCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Certificate viewer for ${selectedModalCert.title}`}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedModalCert(null)}
              className="absolute inset-0 bg-[#121417]/85 backdrop-blur-xl cursor-pointer"
            />

            {/* MODAL DIALOG CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[1020px] max-h-[90vh] bg-[#FFF8E8] rounded-[28px] border border-[#20252B]/20 shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#20252B]/12 bg-[#FFF8E8]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFD42A]" />
                  <div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#20252B] leading-tight tracking-[-0.025em]">
                      {selectedModalCert.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#20252B]/60">
                      {selectedModalCert.issuer} · {selectedModalCert.date}
                    </span>
                  </div>
                </div>

                {/* CLOSE BUTTON */}
                <button
                  ref={modalCloseButtonRef}
                  type="button"
                  onClick={() => setSelectedModalCert(null)}
                  aria-label="Close modal dialog"
                  className="w-9 h-9 rounded-full bg-[#20252B]/10 hover:bg-[#20252B] text-[#20252B] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY (SCROLLABLE IMAGE CONTAINER) */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-center justify-center bg-[#121417]/5">
                <div className="relative max-w-full rounded-xl overflow-hidden border border-[#20252B]/12 bg-white p-1 sm:p-2 shadow-lg">
                  <img
                    src={selectedModalCert.image}
                    alt={selectedModalCert.title}
                    className="max-w-full h-auto max-h-[72vh] object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* MODAL FOOTER WITH ACTION BUTTONS */}
              <div className="px-6 py-4 border-t border-[#20252B]/12 bg-[#FFF8E8] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#20252B]/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Official Record</span>
                  {selectedModalCert.credentialId && (
                    <span className="hidden sm:inline text-[#20252B]/40">
                      · ID: {selectedModalCert.credentialId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* OPEN ORIGINAL IMAGE */}
                  <a
                    href={selectedModalCert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-[#20252B]/20 bg-white hover:bg-[#20252B] text-[#20252B] hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <span>Open Original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* VERIFY CREDENTIAL URL (ONLY DISPLAYED IF URL EXISTS) */}
                  {selectedModalCert.credentialUrl && (
                    <a
                      href={selectedModalCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#FFD42A] hover:bg-[#ffe066] text-[#20252B] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs border border-[#20252B]/15"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
