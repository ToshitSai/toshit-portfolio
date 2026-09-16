import React, { useState, useEffect, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import ContactFooter from "@/components/portfolio/ContactFooter";
import EditorialLoginLoader from "@/components/portfolio/EditorialLoginLoader";
import SelectedWork from "@/components/portfolio/SelectedWork";
import { useIntro } from "@/context/IntroContext";

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
  const { isIntroActive, completeIntro } = useIntro();

  const [isLoading, setIsLoading] = useState<boolean>(isIntroActive);

  // Synchronize isLoading if isIntroActive changes
  useEffect(() => {
    setIsLoading(isIntroActive);
  }, [isIntroActive]);

  // Global State for Contact Drawer Overlay (Opens smoothly from right on any "Work with me" click)
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Coordinate hash navigation AFTER loader finishes
  useEffect(() => {
    console.log("EDITORIAL_MOTION_SYSTEM_V2_ACTIVE", new Date().toISOString());
    if (!isLoading && typeof window !== "undefined") {
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
  }, [isLoading]);

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoading(false);
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
        isLoading={isLoading}
        onLoadingComplete={handleLoadingComplete}
        onExitComplete={completeIntro}
      />
      
      <main className={`transition-opacity duration-700 ease-out ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <VelocityTiltWrapper>
          <div>
            <Hero />
          </div>

          {/* ABOUT ME INTRO STATEMENT BLOCK (RIGHT AFTER HERO SECTION) */}
          <section id="about-intro" className="relative w-full py-16 sm:py-20 bg-cream text-[#333333] z-10 select-none">
            <div className="max-w-[980px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
              <a href="/about" className="group block w-full">
                <h2
                  style={{
                    fontFamily: '"Host Grotesk", sans-serif',
                    fontWeight: 400,
                    color: "#333333",
                  }}
                  className="text-lg sm:text-2xl md:text-[28px] leading-[1.5] sm:leading-[1.4] text-center mb-6 sm:mb-8 group-hover:opacity-90 transition-opacity max-w-[820px] mx-auto"
                >
                  I'm Toshit Sai. I build with AI, experiment relentlessly, and turn ideas into complete digital products from intelligent applications and Generative AI systems to experiences designed for real people.
                </h2>
              </a>

              <p className="text-base sm:text-lg md:text-xl text-[#20252B]/70 font-sans leading-[1.6] max-w-2xl text-center font-normal">
                I believe great technology should feel simple, useful, and human, and I'm here to keep building mine.
              </p>
            </div>
          </section>

          <TechMarquee />

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
