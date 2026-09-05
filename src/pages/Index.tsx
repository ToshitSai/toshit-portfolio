import React, { useState, useEffect, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import About from "@/components/portfolio/About";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import ContactFooter from "@/components/portfolio/ContactFooter";
import EditorialLoginLoader from "@/components/portfolio/EditorialLoginLoader";
import HelloAnimation from "@/components/portfolio/HelloAnimation";
import SelectedWork from "@/components/portfolio/SelectedWork";

// Lazy-loaded heavy sections for bundle optimization and code-splitting
const TechnicalSkills = React.lazy(() => import("@/components/portfolio/TechnicalSkills"));
const Testimonials = React.lazy(() => import("@/components/portfolio/Testimonials"));

// Section Fallbacks to prevent cumulative layout shifts during lazy load
const SelectedWorkFallback = () => <div className="min-h-[600px] w-full bg-cream" />;
const TechnicalSkillsFallback = () => <div className="min-h-[500px] w-full bg-[#111317]" />;
const TestimonialsFallback = () => <div className="min-h-[400px] w-full bg-cream" />;

// PHYSICAL HOME CANVAS TRANSITION VARIANTS
const homeCanvasVariants = {
  initial: {
    opacity: 0.92,
    y: -12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0.92,
    y: -12,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const Index = () => {
  const shouldReduceMotion = useReducedMotion();

  // Only trigger loader on first visit per session using sessionStorage (or forced via ?intro=true)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("intro") === "true" || urlParams.get("reset") === "true") {
        sessionStorage.removeItem("has_seen_loader");
        sessionStorage.removeItem("hasVisited");
        sessionStorage.removeItem("has_seen_hello");
        return true;
      }
      return !sessionStorage.getItem("has_seen_loader") && !sessionStorage.getItem("hasVisited");
    }
    return false;
  });

  const [isHelloActive, setIsHelloActive] = useState<boolean>(false);
  const helloStartedRef = React.useRef<boolean>(false);

  // Global State for Contact Drawer Overlay (Opens smoothly from right on any "Work with me" click)
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Coordinate hash navigation AFTER loader finishes
  useEffect(() => {
    if (!isLoggingIn && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace("#", "");
        let targetEl = document.getElementById(targetId);
        if (!targetEl && targetId === "work") targetEl = document.getElementById("projects");

        if (targetEl) {
          const timer = setTimeout(() => {
            targetEl?.scrollIntoView({ behavior: "smooth" });
          }, 150);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isLoggingIn]);

  const startHello = React.useCallback(() => {
    if (!helloStartedRef.current) {
      helloStartedRef.current = true;
      setIsHelloActive(true);
    }
  }, []);

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoggingIn(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
      sessionStorage.setItem("has_seen_loader", "true");
    }
    // Wait 500ms for EditorialLoginLoader's exit transition (0.5s duration) to finish 100%
    setTimeout(() => {
      startHello();
    }, 500);
  }, [startHello]);

  const handleLoaderExitComplete = React.useCallback(() => {
    startHello();
  }, [startHello]);

  // Fallback: If loader is not active and hello has not been shown yet in this session
  useEffect(() => {
    if (!isLoggingIn && typeof window !== "undefined") {
      const hasSeenHello = sessionStorage.getItem("has_seen_hello");
      if (!hasSeenHello && !helloStartedRef.current) {
        const timer = setTimeout(() => {
          startHello();
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggingIn, startHello]);

  const handleHelloComplete = React.useCallback(() => {
    setIsHelloActive(false);
    try {
      sessionStorage.setItem("has_seen_hello", "true");
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : homeCanvasVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-cream text-ink selection:bg-yellow-accent selection:text-ink font-sans relative"
    >
      {/* CONTEXTUAL EDITORIAL LOGIN LOADER (FIRST VISIT PER SESSION ONLY) */}
      <EditorialLoginLoader
        isLoading={isLoggingIn}
        onLoadingComplete={handleLoadingComplete}
        onExitComplete={handleLoaderExitComplete}
      />

      {/* POST-ENTRANCE HANDWRITTEN HELLO INTRO ANIMATION */}
      <HelloAnimation
        isActive={isHelloActive}
        onComplete={handleHelloComplete}
      />
      
      <main className={`transition-opacity duration-700 ease-out ${isLoggingIn ? "opacity-0" : "opacity-100"}`}>
        <Hero />
        <TechMarquee />
        <About />

        <Suspense fallback={<SelectedWorkFallback />}>
          <SelectedWork />
        </Suspense>

        <AcademicJourney />

        <Suspense fallback={<TechnicalSkillsFallback />}>
          <TechnicalSkills />
        </Suspense>

        <Suspense fallback={<TestimonialsFallback />}>
          <Testimonials />
        </Suspense>
      </main>
      <ContactFooter isDrawerOpen={isContactDrawerOpen} setIsDrawerOpen={setIsContactDrawerOpen} />
    </motion.div>
  );
};

export default Index;
