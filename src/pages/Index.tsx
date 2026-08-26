import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import About from "@/components/portfolio/About";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import ContactFooter from "@/components/portfolio/ContactFooter";
import CustomCursor from "@/components/portfolio/CustomCursor";
import EditorialLoginLoader from "@/components/portfolio/EditorialLoginLoader";

// Lazy-loaded heavy sections for bundle optimization and code-splitting
const SelectedWork = React.lazy(() => import("@/components/portfolio/SelectedWork"));
const TechnicalSkills = React.lazy(() => import("@/components/portfolio/TechnicalSkills"));
const Testimonials = React.lazy(() => import("@/components/portfolio/Testimonials"));

// Section Fallbacks to prevent cumulative layout shifts during lazy load
const SelectedWorkFallback = () => <div className="min-h-[600px] w-full bg-cream" />;
const TechnicalSkillsFallback = () => <div className="min-h-[500px] w-full bg-[#111317]" />;
const TestimonialsFallback = () => <div className="min-h-[400px] w-full bg-cream" />;

const Index = () => {
  // Only trigger loader on first visit per session using sessionStorage
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("has_seen_loader") && !sessionStorage.getItem("hasVisited");
    }
    return false;
  });

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
        if (!targetEl && targetId === "playground") targetEl = document.getElementById("skills");

        if (targetEl) {
          const timer = setTimeout(() => {
            targetEl?.scrollIntoView({ behavior: "smooth" });
          }, 150);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isLoggingIn]);

  const handleTriggerLogin = () => {
    setIsLoggingIn(true);
  };

  const handleLoadingComplete = () => {
    setIsLoggingIn(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true");
      sessionStorage.setItem("has_seen_loader", "true");
    }
  };

  const handleOpenContactDrawer = () => {
    setIsContactDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-yellow-accent selection:text-ink font-sans relative">
      {/* CONTEXTUAL EDITORIAL LOGIN LOADER (FIRST VISIT PER SESSION ONLY) */}
      <EditorialLoginLoader
        isLoading={isLoggingIn}
        onLoadingComplete={handleLoadingComplete}
      />

      <CustomCursor />
      <Navbar onTriggerLogin={handleTriggerLogin} onOpenContact={handleOpenContactDrawer} />
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
    </div>
  );
};

export default Index;
