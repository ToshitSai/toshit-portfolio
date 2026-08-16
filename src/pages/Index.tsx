import Hero from "@/components/portfolio/Hero";
import TechMarquee from "@/components/portfolio/TechMarquee";
import About from "@/components/portfolio/About";
import SelectedWork from "@/components/portfolio/SelectedWork";
import AcademicJourney from "@/components/portfolio/AcademicJourney";
import TechnicalSkills from "@/components/portfolio/TechnicalSkills";
import Testimonials from "@/components/portfolio/Testimonials";
import ContactFooter from "@/components/portfolio/ContactFooter";
import CustomCursor from "@/components/portfolio/CustomCursor";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-yellow-accent selection:text-ink font-sans">
      <CustomCursor />
      <main>
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
