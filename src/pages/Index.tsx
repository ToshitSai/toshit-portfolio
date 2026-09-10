import React, { useState, useEffect, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import About from "@/components/portfolio/About";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import ContactFooter from "@/components/portfolio/ContactFooter";
import EditorialLoginLoader from "@/components/portfolio/EditorialLoginLoader";
import SelectedWork from "@/components/portfolio/SelectedWork";

import VelocityTiltWrapper from "@/components/portfolio/VelocityTiltWrapper";

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
    opacity: 0.95,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const Index = () => {
  const shouldReduceMotion = useReducedMotion();

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("intro") === "true" || urlParams.get("reset") === "true") {
        sessionStorage.removeItem("has_seen_loader");
        sessionStorage.removeItem("hasVisited");
        try {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        } catch {
          // Ignore state replace errors
        }
        return true;
      }
      return !sessionStorage.getItem("has_seen_loader") && !sessionStorage.getItem("hasVisited");
    }
    return false;
  });

  // Global State for Contact Drawer Overlay (Opens smoothly from right on any "Work with me" click)
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Coordinate hash navigation AFTER loader finishes
  useEffect(() => {
    console.log("EDITORIAL_MOTION_SYSTEM_V2_ACTIVE", new Date().toISOString());
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

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoggingIn(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
      sessionStorage.setItem("has_seen_loader", "true");
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
      />
      
      <main className={`transition-opacity duration-700 ease-out ${isLoggingIn ? "opacity-0" : "opacity-100"}`}>
        <VelocityTiltWrapper>
          <div>
            <Hero />
          </div>
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
        </VelocityTiltWrapper>
      </main>
      <ContactFooter isDrawerOpen={isContactDrawerOpen} setIsDrawerOpen={setIsContactDrawerOpen} />
    </motion.div>
  );
};

export default Index;
