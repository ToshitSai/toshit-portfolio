import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactFooter from "@/components/portfolio/ContactFooter";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import ProjectStoryViewer from "@/components/portfolio/ProjectStoryViewer";

const ProjectsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeSlug = slug || "";

  const handleOpenStory = (projectSlug: string) => {
    navigate(`/projects/work/${projectSlug}`);
  };

  const handleCloseStory = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-[#F8F2E6] text-[#1D2024] selection:bg-[#FFD42A] selection:text-[#1D2024] font-sans relative">
      {/* STORY VIEWER OVERLAY FOR PROJECTS PAGE */}
      <ProjectStoryViewer
        projectSlug={activeSlug}
        isOpen={Boolean(activeSlug)}
        onClose={handleCloseStory}
        onSelectProject={handleOpenStory}
      />

      <main className="pt-28 sm:pt-36 pb-24 sm:pb-32 select-none">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-16 relative z-10">
          
          {/* BACK TO HOME BREADCRUMB */}
          <div className="mb-8 flex items-center justify-between border-b border-[#1D2024]/12 pb-6">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#1D2024]/75 transition-colors hover:text-[#1D2024]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1D2024]/50">
              ALL PROJECTS
            </span>
          </div>

          {/* PAGE TITLE HEADER */}
          <div className="max-w-[800px] mb-12 sm:mb-16">
            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-[13px] tracking-[0.18em] text-[#1D2024]/75 uppercase mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] shadow-xs inline-block" />
              <span className="font-semibold text-[#1D2024]/80">COMPLETE ARCHIVE</span>
            </div>
            <h1 className="font-serif font-medium text-[clamp(32px,4.5vw,62px)] leading-[1.1] tracking-[-0.01em] text-[#1D2024]">
              All Projects &amp; Experiments
            </h1>
            <p className="mt-4 font-sans text-base sm:text-lg text-[#1D2024]/75 max-w-[620px] leading-relaxed">
              Explore the full showcase of AI applications, full-stack tools, and creative web design demos built with modern technologies.
            </p>
          </div>

          {/* FULL PROJECT GRID (ALL PROJECTS) */}
          <ProjectGrid />

        </div>
      </main>

      <ContactFooter isDrawerOpen={isContactDrawerOpen} setIsDrawerOpen={setIsContactDrawerOpen} />
    </div>
  );
};

export default ProjectsPage;
