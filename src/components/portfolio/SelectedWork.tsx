import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

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

const ProjectsBackdrop: React.FC<{ containerRef: React.RefObject<HTMLElement | null> }> = ({ containerRef }) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const planeY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 520]);
  const planeX = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 130]);
  const planeRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [-10, -10] : [-12, 18]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        className="absolute left-1/2 top-[18%] hidden h-[72%] w-[1180px] -translate-x-1/2 text-[#1D2024]/20 lg:block"
        viewBox="0 0 1180 1180"
        fill="none"
      >
        <path
          d="M116 116 C 360 30 488 258 374 410 C 274 544 462 700 646 592 C 882 454 1072 628 984 828 C 908 1000 650 1032 480 940"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="8 12"
        />
      </svg>

      <motion.svg
        style={{ x: planeX, y: planeY, rotate: planeRotate }}
        className="absolute left-[10%] top-[22%] hidden h-9 w-9 text-[#1D2024]/55 lg:block"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M42 7 6 23.5l15.2 4.1L26 42l16-35Z"
          fill="#F8F2E6"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path d="m21.2 27.6 10.7-10.8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </motion.svg>
    </div>
  );
};

export const SelectedWork: React.FC = () => {
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
      <ProjectsBackdrop containerRef={sectionRef} />

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
