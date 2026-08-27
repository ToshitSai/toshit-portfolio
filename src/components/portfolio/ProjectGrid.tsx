import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCard, { ProjectCardData } from "./ProjectCard";

export const SHOWCASE_PROJECTS: ProjectCardData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    title: "CourseForge AI",
    category: "AI COURSE GENERATOR",
    tagline: "AI course generator that builds full courses — outline, lessons, quizzes, and video — from any topic.",
    description: "Generates complete structured courses with lesson outlines, AI video curation, and interactive quizzes from any topic using Gemini AI.",
    accentColor: "#3B82F6",
    tech: ["React", "Gemini API", "Vercel"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    bgImage: "/images/projects/courseforge-ai.png",
    videoSrc: "/videos/projects/courseforge-ai.mp4",
    mobileVideoSrc: "/videos/projects/courseforge-ai-mobile.webm",
    tileSize: "feature",
    alignment: "left",
    imagePosition: "center top",
    mobileImagePosition: "left top",
    composition: "laptop-left",
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "02",
    title: "HireScope AI",
    category: "AI RESUME ANALYZER",
    tagline: "Resume + portfolio analyzer with a combined Hireability score.",
    description: "Advanced resume analysis platform leveraging state-of-the-art NLP to compute ATS match scores, extract skills, and identify candidate experience gaps.",
    accentColor: "#38B2AC",
    tech: ["Next.js", "Puppeteer", "Claude API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    bgImage: "/images/projects/hirescope-ai.png",
    videoSrc: "/videos/projects/hirescope-ai.mp4",
    mobileVideoSrc: "/videos/projects/hirescope-ai-mobile.webm",
    tileSize: "wide",
    alignment: "right",
    imagePosition: "center top",
    mobileImagePosition: "46% top",
    composition: "laptop-right",
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "03",
    title: "Greetly",
    category: "NEO-BRUTALIST AI TOOL",
    tagline: "AI-generated greeting card messages for any occasion.",
    description: "AI greeting card message tool with a bold neo-brutalist UI. Features Groq Llama-3.3 acceleration, JWT auth, and custom tone presets.",
    accentColor: "#F06C64",
    tech: ["React", "Groq Llama 3", "Vercel"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    bgImage: "/images/projects/greetly.png",
    videoSrc: "/videos/projects/greetly.mp4",
    mobileVideoSrc: "/videos/projects/greetly-mobile.webm",
    tileSize: "tall",
    alignment: "left",
    imagePosition: "center top",
    mobileImagePosition: "50% top",
    composition: "desktop-center",
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    number: "04",
    title: "Personal Portfolio",
    category: "PORTFOLIO & EDITORIAL",
    tagline: "My web portfolio – AI/ML & web development projects showcased with creative animations.",
    description: "High-performance editorial showcase site built with React, Vite, Tailwind CSS, & Framer Motion.",
    accentColor: "#F6C545",
    tech: ["React", "Vite", "Tailwind CSS"],
    liveUrl: "https://toshit-portfolio.vercel.app",
    githubUrl: "https://github.com/ToshitSai/toshit-portfolio",
    bgImage: "/images/projects/personal-portfolio.png",
    videoSrc: "/videos/projects/personal-portfolio.mp4",
    mobileVideoSrc: "/videos/projects/personal-portfolio-mobile.webm",
    tileSize: "compact",
    alignment: "center",
    imagePosition: "center top",
    mobileImagePosition: "50% top",
    composition: "portfolio-duo",
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "05",
    title: "Avengers Doomsday",
    category: "CINEMATIC DESIGN DEMO",
    tagline: "Cinematic concept landing page — animation & motion design showcase.",
    description: "A Marvel-inspired cinematic scroll experience built with Next.js, Three.js, GSAP ScrollTrigger, and Lenis smooth physics.",
    accentColor: "#C0392B",
    tech: ["Next.js", "Three.js", "GSAP"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    bgImage: "/images/projects/avengers-doomsday.png",
    videoSrc: "/videos/projects/avengers-doomsday.mp4",
    mobileVideoSrc: "/videos/projects/avengers-doomsday-mobile.webm",
    tileSize: "feature",
    alignment: "right",
    imagePosition: "center top",
    mobileImagePosition: "50% top",
    composition: "cinematic",
  },
];

export const ProjectGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full space-y-20 sm:space-y-28 lg:space-y-40">
      {SHOWCASE_PROJECTS.map((project, index) => (
        <motion.div
          key={project.id}
          className="w-full"
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
