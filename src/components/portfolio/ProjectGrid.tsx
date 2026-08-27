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
    tileSize: "feature",
    alignment: "center",
    devices: [
      {
        id: "courseforge-laptop",
        type: "laptop",
        media: "desktop",
        screenAspect: "aspect-[959/510]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[88%] max-w-[800px] -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    number: "02",
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
    tileSize: "compact",
    alignment: "center",
    devices: [
      {
        id: "portfolio-desktop",
        type: "desktop",
        media: "desktop",
        screenAspect: "aspect-[192/91]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[90%] max-w-[720px] -translate-x-1/2 -translate-y-1/2",
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
    mobileVideoSrc: "/videos/projects/hirescope-ai-mobile.webm",
    tileSize: "wide",
    alignment: "center",
    devices: [
      {
        id: "hirescope-desktop",
        type: "desktop",
        media: "desktop",
        screenAspect: "aspect-[320/153]",
        fit: "cover",
        className: "absolute left-[3%] top-1/2 z-10 w-[71%] max-w-[700px] -translate-y-1/2",
      },
      {
        id: "hirescope-phone",
        type: "phone",
        media: "mobile",
        screenAspect: "aspect-[65/119]",
        fit: "cover",
        delay: 0.14,
        className: "absolute right-[4%] top-1/2 z-20 w-[24%] min-w-[100px] max-w-[180px] -translate-y-1/2",
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
    alignment: "center",
    devices: [
      {
        id: "greetly-phone",
        type: "phone",
        media: "mobile",
        screenAspect: "aspect-[65/119]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[44%] min-w-[160px] max-w-[240px] -translate-x-1/2 -translate-y-1/2 -rotate-[1deg]",
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
    alignment: "center",
    devices: [
      {
        id: "avengers-cinema",
        type: "cinema",
        media: "desktop",
        screenAspect: "aspect-[137/65]",
        fit: "cover",
        className: "absolute left-1/2 top-1/2 z-10 w-[92%] max-w-[920px] -translate-x-1/2 -translate-y-1/2",
      },
    ],
  },
];

export const ProjectGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid w-full grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      {SHOWCASE_PROJECTS.map((project, index) => {
        const isFullWidth = index === SHOWCASE_PROJECTS.length - 1 && SHOWCASE_PROJECTS.length % 2 !== 0;
        return (
          <motion.div
            key={project.id}
            className={`w-full ${isFullWidth ? "lg:col-span-2 lg:mx-auto lg:w-[86%]" : ""}`}
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
        );
      })}
    </div>
  );
};

export default ProjectGrid;
