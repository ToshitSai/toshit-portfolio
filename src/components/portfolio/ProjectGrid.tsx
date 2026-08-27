import React from "react";
import { PROJECTS_DATA, ProjectItemData } from "@/data/projectsData";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  onOpenStory?: (slug: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onOpenStory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {PROJECTS_DATA.map((project: ProjectItemData) => (
        <ProjectCard key={project.id} project={project} onOpenStory={onOpenStory} />
      ))}
    </div>
  );
};

export default ProjectGrid;
