import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X, CheckCircle2 } from "lucide-react";
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

  // Responsive Screen Size Detection
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

  // Preload Images for Smooth Coverflow Rendering
  useEffect(() => {
    certificates.forEach((cert) => {
      const img = new Image();
      img.src = cert.image;
    });
  }, [certificates]);

  // Safe Navigation with Transition Lock
  const navigateTo = useCallback(
    (newIndex: number) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const wrapped = (newIndex + totalCertificates) % totalCertificates;
      setActiveIndex(wrapped);

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 650);
    },
    [totalCertificates]
  );

  const handleNext = useCallback(() => {
    navigateTo(activeIndex + 1);
  }, [activeIndex, navigateTo]);

  const handlePrev = useCallback(() => {
    navigateTo(activeIndex - 1);
  }, [activeIndex, navigateTo]);

  // Keyboard Navigation (ArrowLeft, ArrowRight, Escape, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.key === "Enter") {
        e.preventDefault();
        setSelectedModalCert(certificates[activeIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, certificates, handleNext, handlePrev, selectedModalCert]);

  // Mouse Wheel / Trackpad Horizontal Scroll
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (selectedModalCert) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 12) return;

      e.preventDefault();
      if (isAnimatingRef.current) return;

      if (delta > 0) {
        handleNext();
      } else if (delta < 0) {
        handlePrev();
      }
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [handleNext, handlePrev, selectedModalCert]);

  // Modal Focus Management
  useEffect(() => {
    if (selectedModalCert) {
      setTimeout(() => {
        modalCloseButtonRef.current?.focus();
      }, 100);
    } else {
      triggerButtonRef.current?.focus();
    }
  }, [selectedModalCert]);

  // Pointer / Touch Drag Handlers
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
  const formattedCounter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    totalCertificates
  ).padStart(2, "0")}`;

  // 3D Coverflow Transform Calculator (Matching Primary Reference Image)
  const getCardTransform = (index: number) => {
    let diff = index - activeIndex;

    // Shortest circular wrap distance
    if (diff > totalCertificates / 2) diff -= totalCertificates;
    if (diff < -totalCertificates / 2) diff += totalCertificates;

    const dragFactor = isDragging ? dragOffset : 0;

    if (shouldReduceMotion) {
      return {
        x: diff * 260 + dragFactor,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: diff === 0 ? 1 : 0.82,
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
          rotateY: dragFactor * -0.02,
          scale: 1,
          opacity: 1,
          zIndex: 40,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) {
        // Immediate Right
        return {
          x: 370 + dragFactor * 0.65,
          y: 0,
          z: -120,
          rotateY: -11,
          scale: 0.76,
          opacity: 0.42,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) {
        // Immediate Left
        return {
          x: -370 + dragFactor * 0.65,
          y: 0,
          z: -120,
          rotateY: 11,
          scale: 0.76,
          opacity: 0.42,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 2) {
        // Far Right (+2)
        return {
          x: 580 + dragFactor * 0.45,
          y: 0,
          z: -220,
          rotateY: -18,
          scale: 0.60,
          opacity: 0.22,
          zIndex: 20,
          pointerEvents: "none" as const,
        };
      } else if (diff === -2) {
        // Far Left (-2)
        return {
          x: -580 + dragFactor * 0.45,
          y: 0,
          z: -220,
          rotateY: 18,
          scale: 0.60,
          opacity: 0.22,
          zIndex: 20,
          pointerEvents: "none" as const,
        };
      } else {
        // Hidden outer cards
        return {
          x: (diff > 0 ? 820 : -820) + dragFactor,
          y: 0,
          z: -350,
          rotateY: diff > 0 ? -25 : 25,
          scale: 0.45,
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
          rotateY: dragFactor * -0.03,
          scale: 1,
          opacity: 1,
          zIndex: 40,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) {
        return {
          x: 270 + dragFactor * 0.6,
          y: 0,
          z: -100,
          rotateY: -9,
          scale: 0.74,
          opacity: 0.38,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) {
        return {
          x: -270 + dragFactor * 0.6,
          y: 0,
          z: -100,
          rotateY: 9,
          scale: 0.74,
          opacity: 0.38,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 2) {
        return {
          x: 440 + dragFactor * 0.4,
          y: 0,
          z: -180,
          rotateY: -15,
          scale: 0.56,
          opacity: 0.18,
          zIndex: 20,
          pointerEvents: "none" as const,
        };
      } else if (diff === -2) {
        return {
          x: -440 + dragFactor * 0.4,
          y: 0,
          z: -180,
          rotateY: 15,
          scale: 0.56,
          opacity: 0.18,
          zIndex: 20,
          pointerEvents: "none" as const,
        };
      } else {
        return {
          x: (diff > 0 ? 600 : -600) + dragFactor,
          y: 0,
          z: -280,
          rotateY: diff > 0 ? -20 : 20,
          scale: 0.4,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      }
    } else {
      // Mobile stage
      if (diff === 0) {
        return {
          x: dragFactor * 0.9,
          y: 0,
          z: 0,
          rotateY: dragFactor * -0.04,
          scale: 1,
          opacity: 1,
          zIndex: 40,
          pointerEvents: "auto" as const,
        };
      } else if (diff === 1) {
        return {
          x: 210 + dragFactor * 0.5,
          y: 0,
          z: -80,
          rotateY: -7,
          scale: 0.70,
          opacity: 0.30,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else if (diff === -1) {
        return {
          x: -210 + dragFactor * 0.5,
          y: 0,
          z: -80,
          rotateY: 7,
          scale: 0.70,
          opacity: 0.30,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      } else {
        return {
          x: (diff > 0 ? 360 : -360) + dragFactor,
          y: 0,
          z: -150,
          rotateY: diff > 0 ? -12 : 12,
          scale: 0.45,
          opacity: 0,
          zIndex: 10,
          pointerEvents: "none" as const,
        };
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none py-2 sm:py-6">
      {/* 3D CAROUSEL STAGE & FLANKING ARROWS */}
      <div className="relative w-full max-w-[1360px] flex items-center justify-between px-2 sm:px-6">
        {/* PREVIOUS ARROW (LEFT) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous certificate"
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full border border-[#20252B]/20 bg-white/70 hover:bg-white text-[#20252B] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 hover:-translate-x-1 cursor-pointer z-50 focus:outline-none focus:ring-2 focus:ring-[#FFD42A]"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* 3D CAROUSEL STAGE CONTAINER */}
        <div
          ref={stageRef}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing mx-auto"
          style={{ perspective: "1300px", perspectiveOrigin: "50% 50%" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
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
                  duration: isDragging ? 0.05 : 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  zIndex: transform.zIndex,
                  pointerEvents: transform.pointerEvents,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (isDragging || Math.abs(dragOffset) > 10) return;
                  if (isActive) {
                    setSelectedModalCert(cert);
                  } else {
                    navigateTo(index);
                  }
                }}
                className="group cursor-pointer flex items-center justify-center"
              >
                {/* MINIMAL CERTIFICATE CARD FRAME — NO OVERSIZED BORDER */}
                <div
                  className={`relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 bg-white ${
                    isActive
                      ? "border-[#20252B]/14 shadow-[0_22px_60px_rgba(32,37,43,0.18)] hover:shadow-[0_28px_70px_rgba(32,37,43,0.25)]"
                      : "border-[#20252B]/10 shadow-md grayscale-[10%] hover:grayscale-0"
                  }`}
                >
                  {/* CERTIFICATE PREVIEW IMAGE FILLING 96%+ OF CARD BOUNDARY */}
                  <div className="relative flex items-center justify-center p-1 sm:p-1.5">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="eager"
                      className="w-auto h-auto max-w-[280px] sm:max-w-[540px] md:max-w-[640px] lg:max-w-[720px] max-h-[210px] sm:max-h-[340px] md:max-h-[400px] lg:max-h-[440px] object-contain block transition-transform duration-500 group-hover:scale-[1.006] rounded-lg sm:rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* NEXT ARROW (RIGHT) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next certificate"
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full border border-[#20252B]/20 bg-white/70 hover:bg-white text-[#20252B] flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 hover:translate-x-1 cursor-pointer z-50 focus:outline-none focus:ring-2 focus:ring-[#FFD42A]"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
      </div>

      {/* METADATA, TITLE & DESCRIPTION UNDER ACTIVE CARD */}
      <div className="w-full max-w-[720px] px-6 mt-6 sm:mt-10 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center space-y-2.5 min-h-[130px] justify-center"
          >
            {/* COUNTER & METADATA LINE */}
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#20252B]/60">
              <span className="text-[#20252B] font-bold">{formattedCounter}</span>
              <span>·</span>
              <span>{activeCert.issuer}</span>
              <span>·</span>
              <span>{activeCert.year}</span>
            </div>

            {/* LARGE ELEGANT DISPLAY TITLE */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#20252B] tracking-tight leading-tight">
              {activeCert.title}
            </h2>

            {/* SHORT DESCRIPTION */}
            <p className="font-sans text-sm sm:text-base text-[#20252B]/75 max-w-xl leading-relaxed">
              {activeCert.description}
            </p>
          </motion.div>
        </AnimatePresence>
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
              className="absolute inset-0 bg-[#121417]/80 backdrop-blur-md cursor-pointer"
            />

            {/* MODAL CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[1040px] max-h-[92vh] bg-[#FFF8E8] rounded-[28px] border border-[#20252B]/20 shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#20252B]/12 bg-[#FFF8E8]/95 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFD42A]" />
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#20252B] leading-tight">
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
                  aria-label="Close certificate viewer"
                  className="w-9 h-9 rounded-full bg-[#20252B]/10 hover:bg-[#20252B] text-[#20252B] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-[#121417]/5">
                <div className="relative max-w-full rounded-xl overflow-hidden border border-[#20252B]/12 bg-white p-1 sm:p-2 shadow-lg">
                  <img
                    src={selectedModalCert.image}
                    alt={selectedModalCert.title}
                    className="max-w-full h-auto max-h-[74vh] object-contain rounded-lg block"
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}
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
                    className="px-4 py-2 rounded-full border border-[#20252B]/20 bg-white hover:bg-[#20252B] text-[#20252B] hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* VERIFY CREDENTIAL URL */}
                  {selectedModalCert.credentialUrl && (
                    <a
                      href={selectedModalCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#FFD42A] hover:bg-[#ffe066] text-[#20252B] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs border border-[#20252B]/15 cursor-pointer"
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
