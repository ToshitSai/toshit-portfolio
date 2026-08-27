import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";

import ProjectStoryViewer from "./ProjectStoryViewer";
import ProjectGrid, { SHOWCASE_PROJECTS } from "./ProjectGrid";

// EDITORIAL PROJECTS INTRO HEADER
const ProjectsHeader: React.FC<{ projectCount: number }> = ({ projectCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const headingLines = [
    "Things I built",
    "because I had",
    "to know if they worked.",
  ];

  return (
    <div ref={containerRef} className="relative pb-4 mb-12 sm:mb-16">
      <div className="flex items-center gap-2.5 font-mono text-xs sm:text-[13px] tracking-[0.18em] text-[#1D2024]/75 uppercase mb-6 sm:mb-8">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={isInView ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs inline-block flex-shrink-0"
        />
        <span className="font-semibold text-[#1D2024]/80">02 // SELECTED WORK ({projectCount} PROJECTS)</span>
      </div>

      <div className="max-w-[760px] mb-6 sm:mb-8">
        <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,50px)] leading-[1.15] tracking-[-0.01em] text-[#1D2024] flex flex-col items-start gap-0.5">
          {headingLines.map((line, idx) => (
            <div key={idx} className="overflow-hidden py-0.5">
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.75,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={isInView || shouldReduceMotion ? { scaleX: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[1px] bg-[#1D2024]/12 origin-left"
      />
    </div>
  );
};

export const SelectedWork: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const activeSlug = slug || "";

  const handleOpenStory = (projectSlug: string) => {
    navigate(`/work/${projectSlug}`);
  };

  const handleCloseStory = () => {
    navigate("/");
  };

  return (
    <section
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
        <ProjectsHeader projectCount={SHOWCASE_PROJECTS.length} />

        {/* EDITORIAL PROJECT SHOWCASE GRID */}
        <ProjectGrid />
      </div>
    </section>
  );
};

export default SelectedWork;
