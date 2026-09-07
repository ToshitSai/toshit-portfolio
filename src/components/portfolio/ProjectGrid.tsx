import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SHOWCASE_PROJECTS } from "@/data/showcaseProjects";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  limit?: number;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ limit }) => {
  const shouldReduceMotion = useReducedMotion();
  const projects = limit ? SHOWCASE_PROJECTS.slice(0, limit) : SHOWCASE_PROJECTS;

  return (
    <div className="relative grid w-full grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20 xl:gap-x-12 xl:gap-y-24">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className={`w-full ${project.gridClassName || "lg:col-span-6"}`}
          initial={
            shouldReduceMotion
              ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
              : { opacity: 0, y: -30, rotate: -2, scale: 0.96 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1,
          }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: shouldReduceMotion ? 0.3 : 0.7,
            delay: shouldReduceMotion ? 0 : index * 0.08, // Card 2 drops ~80ms after Card 1, Card 3 ~160ms, etc.
            ease: [0.34, 1.56, 0.64, 1], // Tonearm needle-drop ease-out bounce
          }}
        >
          <ProjectCard project={project} cardIndex={index} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;
