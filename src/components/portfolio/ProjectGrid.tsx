import React from "react";
import { SHOWCASE_PROJECTS } from "@/data/showcaseProjects";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  limit?: number;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ limit }) => {
  const projects = limit ? SHOWCASE_PROJECTS.slice(0, limit) : SHOWCASE_PROJECTS;

  return (
    <div className="relative grid w-full grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20 xl:gap-x-12 xl:gap-y-24">
      {projects.map((project, index) => (
        <div key={project.id} className={`w-full ${project.gridClassName || "lg:col-span-6"}`}>
          <ProjectCard project={project} cardIndex={index} />
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
