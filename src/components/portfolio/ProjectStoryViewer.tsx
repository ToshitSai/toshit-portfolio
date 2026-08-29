import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  X,
  Play,
  Pause,
  Github,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import {
  ProjectStoryData,
  HeroSlide,
  FeatureSlide,
  QuoteSlide,
  GridSlide,
  ReadNextSlide,
  PROJECT_STORIES
} from "@/data/projectStories";

interface ProjectStoryViewerProps {
  projectSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (slug: string) => void;
}

const SLIDE_DURATION_MS = 5000;

interface ProjectStoryStyle {
  bg: string;
  cardBg: string;
  text: string;
  mutedText: string;
  accent: string;
  accentBg: string;
}

export const ProjectStoryViewer: React.FC<ProjectStoryViewerProps> = ({
  projectSlug,
  isOpen,
  onClose,
  onSelectProject,
}) => {
  // Find current project by slug or id
  const projectIndex = PROJECT_STORIES.findIndex((p) => p.slug === projectSlug || p.id === projectSlug);
  const currentProject = PROJECT_STORIES[projectIndex >= 0 ? projectIndex : 0];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [direction, setDirection] = useState<1 | -1>(1);
  const [viewerTheme, setViewerTheme] = useState<"default" | "high-contrast">("default");

  const shouldReduceMotion = useReducedMotion();
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isPressingRef = useRef(false);

  const totalSlides = currentProject.slides.length;
  const currentSlide = currentProject.slides[currentSlideIndex] || currentProject.slides[0];

  // Reset slide index and progress when project changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgress(0);
    lastTimeRef.current = null;
  }, [projectSlug]);

  // Preload next slide resources (if image present)
  useEffect(() => {
    if (!isOpen) return;
    const nextSlideIdx = (currentSlideIndex + 1) % totalSlides;
    const nextSlide = currentProject.slides[nextSlideIdx];
    if (nextSlide && "previewImage" in nextSlide && nextSlide.previewImage) {
      const img = new Image();
      img.src = nextSlide.previewImage;
    }
  }, [currentSlideIndex, currentProject, isOpen, totalSlides]);

  // Next Slide Logic
  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setDirection(1);
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
      lastTimeRef.current = null;
    } else {
      // Reached Read Next slide or last slide -> move to next project
      const nextProjIdx = (projectIndex + 1) % PROJECT_STORIES.length;
      const nextProj = PROJECT_STORIES[nextProjIdx];
      onSelectProject(nextProj.slug);
    }
  }, [currentSlideIndex, totalSlides, projectIndex, onSelectProject]);

  // Prev Slide Logic
  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
      lastTimeRef.current = null;
    } else {
      // Go to previous project's last slide
      const prevProjIdx = (projectIndex - 1 + PROJECT_STORIES.length) % PROJECT_STORIES.length;
      const prevProj = PROJECT_STORIES[prevProjIdx];
      onSelectProject(prevProj.slug);
    }
  }, [currentSlideIndex, projectIndex, onSelectProject]);

  // Animation Frame Loop for Smooth Progress Fill (Pauses on hold, background tab, hover)
  useEffect(() => {
    if (!isOpen || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    const updateProgress = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prevProgress) => {
        const next = prevProgress + (elapsed / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          handleNextSlide();
          return 0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, isPaused, handleNextSlide]);

  // Handle Tab Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNextSlide, handlePrevSlide]);

  // Screen Tap & Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    isPressingRef.current = true;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isPressingRef.current = false;
    setIsPaused(false);

    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Swipe Thresholds
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && deltaTime < 400) {
      if (deltaX < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartRef.current = null;
  };

  // Screen Tap Zones (Left 33%, Right 33%)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks on buttons/links
    if ((e.target as HTMLElement).closest("button, a")) return;

    const width = window.innerWidth;
    const clickX = e.clientX;

    if (clickX < width * 0.33) {
      handlePrevSlide();
    } else if (clickX > width * 0.66) {
      handleNextSlide();
    }
  };

  // Background Theme Styles mapping
  const getSlideThemeStyles = (theme: string): ProjectStoryStyle => {
    if (viewerTheme === "high-contrast") {
      return {
        bg: "bg-[#0A0A0C]",
        cardBg: "bg-[#141418] border-white/30",
        text: "text-white",
        mutedText: "text-white/70",
        accent: "#FFD42A",
        accentBg: "bg-[#FFD42A] text-black",
      };
    }
    switch (theme) {
      case "navy":
        return {
          bg: "bg-[#0B1329]",
          cardBg: "bg-[#111C3A]/90 border-[#38BDF8]/20",
          text: "text-[#F8FAFC]",
          mutedText: "text-[#94A3B8]",
          accent: "#38BDF8",
          accentBg: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40",
        };
      case "warm":
        return {
          bg: "bg-[#211A15]",
          cardBg: "bg-[#2E241E]/90 border-[#FFD42A]/25",
          text: "text-[#F8F2E6]",
          mutedText: "text-[#D6C7B2]",
          accent: "#FFD42A",
          accentBg: "bg-[#FFD42A] text-[#1D2024]",
        };
      case "emerald":
        return {
          bg: "bg-[#062925]",
          cardBg: "bg-[#0A3D37]/90 border-[#10B981]/25",
          text: "text-[#ECFDF5]",
          mutedText: "text-[#A7F3D0]",
          accent: "#10B981",
          accentBg: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40",
        };
      case "crimson":
        return {
          bg: "bg-[#2A0813]",
          cardBg: "bg-[#3F0E1E]/90 border-[#FB7185]/25",
          text: "text-[#FFF1F2]",
          mutedText: "text-[#FECDD3]",
          accent: "#FB7185",
          accentBg: "bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/40",
        };
      case "light":
        return {
          bg: "bg-[#F4EDE0]",
          cardBg: "bg-[#FFFBF0] border-[#1D2024]/15",
          text: "text-[#1D2024]",
          mutedText: "text-[#1D2024]/75",
          accent: "#1D2024",
          accentBg: "bg-[#1D2024] text-[#F8F2E6]",
        };
      case "dark":
      default:
        return {
          bg: "bg-[#0D0F12]",
          cardBg: "bg-[#16191E]/90 border-white/10",
          text: "text-[#F8F2E6]",
          mutedText: "text-[#F8F2E6]/70",
          accent: "#FFD42A",
          accentBg: "bg-[#FFD42A] text-black",
        };
    }
  };

  const currentStyles = getSlideThemeStyles(currentSlide.bgTheme);

  // Motion Variants
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.35,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  // Body scroll locking when viewer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentProject.titleMain} Story Case Study`}
      onClick={handleOverlayClick}
      onMouseDown={() => {
        isPressingRef.current = true;
        setIsPaused(true);
      }}
      onMouseUp={() => {
        isPressingRef.current = false;
        setIsPaused(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 ${currentStyles.bg}`}
    >
      {/* 1. TOP CONTROL BAR */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/10 bg-black/20 backdrop-blur-md">
        {/* Left: Back to Grid Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit story viewer and return to project grid"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-wider transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold uppercase">BACK TO GRID</span>
          </button>

          <span className="hidden sm:inline-block font-mono text-xs tracking-widest text-white/50 uppercase">
            // {currentProject.category}
          </span>
        </div>

        {/* Center: Title & Counter */}
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-white/90 uppercase">
          <span className="font-bold text-[#FFD42A]">{currentProject.titleMain}</span>
          <span className="text-white/40">•</span>
          <span>
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Right: Theme Toggle & Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            aria-label={isPaused ? "Play story auto-advance" : "Pause story auto-advance"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          {/* Contrast / Theme Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewerTheme((prev) => (prev === "default" ? "high-contrast" : "default"));
            }}
            aria-label="Toggle story theme contrast"
            title="Toggle contrast mode"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {viewerTheme === "high-contrast" ? <Sun className="w-4 h-4 text-[#FFD42A]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 ml-1"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN SLIDE CONTAINER (WITH ACCESSIBLE ARIA-LIVE REGION) */}
      <main
        aria-live="polite"
        aria-atomic="true"
        className="relative flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden z-10"
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={`${currentProject.id}-${currentSlideIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-4xl max-h-[85vh] mx-auto flex flex-col justify-between"
          >
            {/* RENDER BASED ON SLIDE TYPE */}
            {currentSlide.type === "hero" && (
              <HeroSlideView slide={currentSlide as HeroSlide} project={currentProject} styles={currentStyles} />
            )}

            {currentSlide.type === "feature" && (
              <FeatureSlideView slide={currentSlide as FeatureSlide} project={currentProject} styles={currentStyles} />
            )}

            {currentSlide.type === "quote" && (
              <QuoteSlideView slide={currentSlide as QuoteSlide} styles={currentStyles} />
            )}

            {currentSlide.type === "grid" && (
              <GridSlideView slide={currentSlide as GridSlide} styles={currentStyles} />
            )}

            {currentSlide.type === "readNext" && (
              <ReadNextSlideView
                slide={currentSlide as ReadNextSlide}
                onSelectProject={onSelectProject}
                styles={currentStyles}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. BOTTOM SEGMENTED PROGRESS BAR */}
      <footer className="relative z-30 px-4 sm:px-8 pb-6 pt-2">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={`Slide ${currentSlideIndex + 1} of ${totalSlides} progress`}
          className="flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto"
        >
          {currentProject.slides.map((_, idx) => {
            let widthPercent = 0;
            if (idx < currentSlideIndex) {
              widthPercent = 100;
            } else if (idx === currentSlideIndex) {
              widthPercent = progress;
            } else {
              widthPercent = 0;
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(idx > currentSlideIndex ? 1 : -1);
                  setCurrentSlideIndex(idx);
                  setProgress(0);
                  lastTimeRef.current = null;
                }}
                aria-label={`Jump to slide ${idx + 1}`}
                className="flex-1 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden transition-all duration-150 group cursor-pointer hover:h-2.5"
              >
                <div
                  style={{ width: `${widthPercent}%` }}
                  className="h-full bg-white rounded-full transition-all duration-75 origin-left shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </button>
            );
          })}
        </div>

        {/* TAP & KEYBOARD HINTS */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mt-3 font-mono text-[11px] tracking-widest text-white/50 uppercase">
          <span>← TAP LEFT / TAP RIGHT →</span>
          <span>HOLD TO PAUSE</span>
        </div>
      </footer>
    </div>,
    document.body
  );
};

// --- SLIDE TYPE COMPONENT RENDERERS ---

// 1. Hero Slide Component
const HeroSlideView: React.FC<{
  slide: HeroSlide;
  project: ProjectStoryData;
  styles: ProjectStoryStyle;
}> = ({ slide, project, styles }) => {

  return (
    <div className={`p-8 sm:p-12 lg:p-14 rounded-3xl border backdrop-blur-xl ${styles.cardBg} ${styles.text} shadow-2xl flex flex-col justify-between min-h-[460px] sm:min-h-[500px]`}>
      <div>
        {/* Category & Number Header */}
        <div className="flex items-center justify-between mb-6 font-mono text-xs tracking-[0.2em] uppercase text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] animate-pulse" />
            <span>PROJECT {project.number} // {project.category}</span>
          </div>
          <span className="hidden sm:inline">STORY CASE STUDY</span>
        </div>

        {/* Main Title & Tagline */}
        <h1
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          className="text-4xl sm:text-6xl font-medium tracking-tight leading-[1.05] mb-4"
        >
          {project.titleMain}
        </h1>

        <p className={`text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mb-8 ${styles.mutedText}`}>
          {slide.tagline || project.description}
        </p>

        {/* Project Metrics / Stats */}
        {slide.stats && (
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-8">
            {slide.stats.map((stat, i) => (
              <div key={i} className="text-left">
                <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase block text-white/60 mb-1">
                  {stat.label}
                </span>
                <span className="font-mono text-xl sm:text-3xl font-bold text-[#FFD42A]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tech Tags & Project Links */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-md bg-white/10 font-mono text-xs tracking-wider uppercase text-white/80 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs tracking-widest font-semibold uppercase">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black hover:bg-[#FFD42A] transition-colors"
          >
            <span>LIVE DEMO</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Feature Slide Component
const FeatureSlideView: React.FC<{
  slide: FeatureSlide;
  project: ProjectStoryData;
  styles: ProjectStoryStyle;
}> = ({ slide, project, styles }) => {
  return (
    <div className={`p-8 sm:p-12 lg:p-14 rounded-3xl border backdrop-blur-xl ${styles.cardBg} ${styles.text} shadow-2xl flex flex-col justify-between min-h-[460px] sm:min-h-[500px]`}>
      <div>
        {/* Badge & Subtitle */}
        <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-widest uppercase">
          <span className={`px-2.5 py-1 rounded-md font-semibold ${styles.accentBg}`}>
            {slide.badge || "FEATURE HIGHLIGHT"}
          </span>
          <span className={styles.mutedText}>• {slide.subtitle}</span>
        </div>

        {/* Feature Title */}
        <h2
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          className="text-3xl sm:text-5xl font-medium tracking-tight leading-tight mb-4"
        >
          {slide.title}
        </h2>

        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mb-8 ${styles.mutedText}`}>
          {slide.description}
        </p>

        {/* Highlight Bullets */}
        <div className="space-y-3 mb-6">
          {slide.highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#FFD42A] mt-0.5" />
              <span className="text-sm sm:text-base font-medium leading-normal">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 font-mono text-xs tracking-widest text-white/50 uppercase flex justify-between">
        <span>CORE ARCHITECTURE ENGINE</span>
        <span>{project.titleMain}</span>
      </div>
    </div>
  );
};

// 3. Pull Quote Slide Component
const QuoteSlideView: React.FC<{
  slide: QuoteSlide;
  styles: ProjectStoryStyle;
}> = ({ slide, styles }) => {
  // Highlight specified phrase inside quoteText
  const renderHighlightedQuote = () => {
    if (!slide.highlightedPhrase) return slide.quoteText;
    const parts = slide.quoteText.split(slide.highlightedPhrase);
    if (parts.length < 2) return slide.quoteText;

    return (
      <>
        {parts[0]}
        <span className="text-[#FFD42A] font-serif underline decoration-2 underline-offset-8">
          {slide.highlightedPhrase}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`p-8 sm:p-14 lg:p-16 rounded-3xl border backdrop-blur-xl ${styles.cardBg} ${styles.text} shadow-2xl flex flex-col justify-between items-center text-center min-h-[460px] sm:min-h-[500px]`}>
      <div className="my-auto max-w-3xl">
        <span className="font-serif text-6xl sm:text-8xl leading-none text-[#FFD42A] opacity-80 block mb-2">
          “
        </span>

        <h2 className="font-serif font-normal text-2xl sm:text-4xl lg:text-5xl leading-[1.3] tracking-tight mb-8">
          {renderHighlightedQuote()}
        </h2>

        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/15 font-mono text-xs tracking-widest uppercase text-white/80">
          — {slide.authorOrContext}
        </div>
      </div>

      <div className="w-full pt-4 border-t border-white/10 font-mono text-xs tracking-widest text-white/40 uppercase">
        PHILOSOPHY & DESIGN VISION
      </div>
    </div>
  );
};

// 4. Breakdown Grid Slide Component
const GridSlideView: React.FC<{
  slide: GridSlide;
  styles: ProjectStoryStyle;
}> = ({ slide, styles }) => {
  return (
    <div className={`p-8 sm:p-12 lg:p-14 rounded-3xl border backdrop-blur-xl ${styles.cardBg} ${styles.text} shadow-2xl flex flex-col justify-between min-h-[460px] sm:min-h-[500px]`}>
      <div>
        <div className="mb-6">
          <span className="font-mono text-xs tracking-widest text-[#FFD42A] uppercase block mb-1">
            SYSTEM COMPARISON & BREAKDOWN
          </span>
          <h2
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            className="text-2xl sm:text-4xl font-medium tracking-tight"
          >
            {slide.title}
          </h2>
          {slide.subtitle && <p className={`text-sm sm:text-base mt-1 ${styles.mutedText}`}>{slide.subtitle}</p>}
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-6">
          {slide.columns.map((col, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#FFD42A] tracking-wider block mb-1">
                  {col.heading}
                </span>
                {col.subheading && (
                  <span className="font-sans text-sm font-semibold text-white/90 block mb-3">
                    {col.subheading}
                  </span>
                )}
                <ul className="space-y-2 mb-4">
                  {col.items.map((item, i) => (
                    <li key={i} className="text-xs sm:text-sm text-white/80 flex items-start gap-1.5">
                      <span className="text-[#FFD42A]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {col.metrics && (
                <div className="pt-3 border-t border-white/10 font-mono text-[11px] font-semibold text-[#FFD42A] uppercase tracking-wider">
                  {col.metrics}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 font-mono text-xs tracking-widest text-white/50 uppercase flex justify-between">
        <span>TECHNICAL ARCHITECTURE</span>
        <span>MODULAR DESIGN</span>
      </div>
    </div>
  );
};

// 5. Read Next Project Slide Component
const ReadNextSlideView: React.FC<{
  slide: ReadNextSlide;
  onSelectProject: (slug: string) => void;
  styles: ProjectStoryStyle;
}> = ({ slide, onSelectProject, styles }) => {
  return (
    <div className={`p-8 sm:p-12 lg:p-14 rounded-3xl border backdrop-blur-xl ${styles.cardBg} ${styles.text} shadow-2xl flex flex-col justify-between min-h-[460px] sm:min-h-[500px]`}>
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.2em] uppercase text-[#FFD42A]">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "5s" }} />
          <span>UP NEXT IN STORY REEL</span>
        </div>

        <h2 className="font-mono text-xs tracking-widest text-white/60 uppercase mb-2">
          CONTINUE TO NEXT CASE STUDY:
        </h2>

        <h1
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          className="text-4xl sm:text-6xl font-medium tracking-tight leading-tight mb-4 text-white"
        >
          {slide.nextProjectTitle}
        </h1>

        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mb-8 ${styles.mutedText}`}>
          {slide.nextProjectDescription}
        </p>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2 mb-8">
          {slide.nextProjectTech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-md bg-white/10 font-mono text-xs tracking-wider uppercase text-white/80 border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button & Auto advance indicator */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProject(slide.nextProjectSlug);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFD42A] text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors cursor-pointer"
        >
          <span>READ {slide.nextProjectTitle} NOW</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs tracking-widest text-white/60 uppercase text-center sm:text-right">
          AUTO-ADVANCING IN 5 SECONDS...
        </span>
      </div>
    </div>
  );
};

export default ProjectStoryViewer;
