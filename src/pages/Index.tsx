import React, { useState, useEffect } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import About from "@/components/portfolio/About";
import SelectedWork from "@/components/portfolio/SelectedWork";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import TechnicalSkills from "@/components/portfolio/TechnicalSkills";
import Testimonials from "@/components/portfolio/Testimonials";
import ContactFooter from "@/components/portfolio/ContactFooter";
import CustomCursor from "@/components/portfolio/CustomCursor";
import EditorialLoginLoader from "@/components/portfolio/EditorialLoginLoader";

const Index = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Trigger login loader on initial session login if requested
  useEffect(() => {
    const hasSeenLogin = sessionStorage.getItem("portfolio_has_logged_in");
    if (!hasSeenLogin) {
      // Trigger login loader once per login session
      setIsLoggingIn(true);
      sessionStorage.setItem("portfolio_has_logged_in", "true");
    }
  }, []);

  const handleSimulateLogin = () => {
    setIsLoggingIn(true);
  };

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-yellow-accent selection:text-ink font-sans relative">
      {/* CONTEXTUAL RANDOMIZED EDITORIAL LOGIN LOADER */}
      <EditorialLoginLoader
        isLoading={isLoggingIn}
        onLoadingComplete={() => setIsLoggingIn(false)}
      />

      <CustomCursor />
      <Navbar onTriggerLogin={handleSimulateLogin} />
      <main className={`transition-opacity duration-700 ${isLoggingIn ? "opacity-0" : "opacity-100"}`}>
        <Hero />
        <TechMarquee />
        <About />
        <SelectedWork />
        <AcademicJourney />
        <TechnicalSkills />
        <Testimonials />
      </main>
      <ContactFooter />
    </div>
  );
};

export default Index;
