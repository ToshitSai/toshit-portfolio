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
    videoSrc: "/videos/projects/courseforge-ai.webm",
    tileSize: "feature",
    alignment: "left",
    gridClassName: "lg:col-span-8 lg:col-start-1",
    devices: [
      {
        id: "courseforge-laptop",
        type: "laptop",
        media: "desktop",
        screenAspect: "aspect-[959/510]",
        fit: "cover",
        className: "absolute left-1/2 top-[53%] z-10 w-[90%] max-w-[900px] -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    number: "02",
    title: "Personal Portfolio",
    category: "PORTFOLIO & EDITORIAL",
    tagline: "My web portfolio - AI/ML & web development projects showcased with creative animations.",
    description: "High-performance editorial showcase site built with React, Vite, Tailwind CSS, and Framer Motion.",
    accentColor: "#D9A62C",
    tech: ["React", "Vite", "Tailwind CSS"],
    liveUrl: "https://toshit-portfolio.vercel.app",
    githubUrl: "https://github.com/ToshitSai/toshit-portfolio",
    bgImage: "/images/projects/personal-portfolio.png",
    videoSrc: "/videos/projects/personal-portfolio.mp4",
    tileSize: "compact",
    alignment: "right",
    gridClassName: "lg:col-span-5 lg:col-start-8 lg:mt-28",
    devices: [
      {
        id: "portfolio-desktop",
        type: "desktop",
        media: "desktop",
        screenAspect: "aspect-[1280/607]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[88%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rotate-[1deg]",
      },
    ],
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "03",
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
    tileSize: "wide",
    alignment: "left",
    gridClassName: "lg:col-span-7 lg:col-start-2 lg:mt-12",
    devices: [
      {
        id: "hirescope-laptop",
        type: "laptop",
        media: "desktop",
        screenAspect: "aspect-[320/153]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[88%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 -rotate-[1deg]",
      },
    ],
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "04",
    title: "Greetly",
    category: "NEO-BRUTALIST AI TOOL",
    tagline: "AI-generated greeting card messages for any occasion.",
    description: "AI greeting card message tool with a bold neo-brutalist UI. Features Groq Llama-3.3 acceleration, JWT auth, and custom tone presets.",
    accentColor: "#F06C64",
    tech: ["React", "Groq Llama 3", "Vercel"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    bgImage: "/images/projects/greetly.png",
    videoSrc: "/videos/projects/greetly-mobile.webm",
    tileSize: "tall",
    alignment: "right",
    gridClassName: "lg:col-span-4 lg:col-start-9 lg:-mt-8",
    devices: [
      {
        id: "greetly-phone",
        type: "phone",
        media: "mobile",
        screenAspect: "aspect-[65/119]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[58%] min-w-[185px] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rotate-[2deg]",
      },
    ],
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
    tileSize: "feature",
    alignment: "right",
    gridClassName: "lg:col-span-9 lg:col-start-4 lg:mt-10",
    devices: [
      {
        id: "avengers-cinema",
        type: "cinema",
        media: "desktop",
        screenAspect: "aspect-[137/65]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[92%] max-w-[1040px] -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
];

export const ProjectGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative grid w-full grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16 xl:gap-x-10 xl:gap-y-20">
      {SHOWCASE_PROJECTS.map((project, index) => (
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
