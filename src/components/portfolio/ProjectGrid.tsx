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
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.8,
            delay: index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;
