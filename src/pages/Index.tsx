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
  // Always trigger the login loader on page load / reload
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true);

  useEffect(() => {
    if (window.location.hash === "#contact" || window.location.pathname === "/contact") {
      const timer = setTimeout(() => {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTriggerLogin = () => {
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
      <Navbar onTriggerLogin={handleTriggerLogin} />
      <main className={`transition-opacity duration-1000 ease-out ${isLoggingIn ? "opacity-0" : "opacity-100"}`}>
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
