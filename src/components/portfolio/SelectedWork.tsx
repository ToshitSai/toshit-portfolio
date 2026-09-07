import React, { useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProjectStoryViewer from "./ProjectStoryViewer";
import ProjectGrid from "./ProjectGrid";
import RecordScratchHeading from "./RecordScratchHeading";

// EDITORIAL PROJECTS INTRO HEADER WITH RECORD-SCRATCH TRANSITION
const ProjectsHeader: React.FC<{ projectCount?: number }> = ({ projectCount: _projectCount }) => {
  return (
    <RecordScratchHeading
      sectionTag="02 // FEATURED WORK"
      title={
        <div className="flex flex-col items-start gap-0.5">
          <span>Things I built</span>
          <span>because I had</span>
          <span>to know if they worked.</span>
        </div>
      }
    />
  );
};

export interface SelectedWorkProps {
  limit?: number;
  showSeeAllButton?: boolean;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  limit = 2,
  showSeeAllButton = true,
}) => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  const activeSlug = slug || "";

  const handleOpenStory = (projectSlug: string) => {
    navigate(`/work/${projectSlug}`);
  };

  const handleCloseStory = () => {
    navigate("/");
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-20 sm:py-28 lg:py-32 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      {/* STORY VIEWER OVERLAY */}
      <ProjectStoryViewer
        projectSlug={activeSlug}
        isOpen={Boolean(activeSlug)}
        onClose={handleCloseStory}
        onSelectProject={handleOpenStory}
      />

      <div id="projects" className="absolute -top-12 left-0" />

      <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-16 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <ProjectsHeader projectCount={limit} />

        {/* EDITORIAL PROJECT SHOWCASE GRID (FEATURED 2) */}
        <ProjectGrid limit={limit} />

        {/* SEE ALL PROJECTS BUTTON */}
        {showSeeAllButton && (
          <div className="mt-16 sm:mt-20 flex flex-col items-center justify-center">
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-3.5 rounded-full bg-[#1D2024] px-9 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#F8F2E6] shadow-xl transition-all duration-300 hover:bg-black hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#FFD42A]"
            >
              <span>SEE ALL PROJECTS</span>
              <ArrowUpRight className="h-4 w-4 text-[#FFD42A] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
