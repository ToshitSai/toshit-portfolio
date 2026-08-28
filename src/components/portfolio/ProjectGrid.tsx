import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCard, { ProjectCardData } from "./ProjectCard";

export const SHOWCASE_PROJECTS: ProjectCardData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    title: "CourseForge",
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
    gridClassName: "lg:col-span-6",
    sceneClassName: "bg-[#DCE6D6]",
    sceneDecorClassName: "right-[-7%] top-[-4%] h-[340px] w-[340px] bg-[#A7B99B]/45",
    devices: [
      {
        id: "courseforge-laptop",
        type: "laptop",
        media: "desktop",
        screenAspect: "aspect-[959/510]",
        fit: "cover",
        className: "absolute left-[46%] top-[54%] z-10 w-[88%] max-w-[790px] -translate-x-1/2 -translate-y-1/2 -rotate-[1deg]",
      },
    ],
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "02",
    title: "HireScope",
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
    gridClassName: "lg:col-span-6",
    sceneClassName: "bg-[#E7E8E3]",
    sceneDecorClassName: "right-[4%] top-[8%] h-[280px] w-[280px] bg-[#BFC6C1]/45",
    devices: [
      {
        id: "hirescope-laptop",
        type: "laptop",
        media: "desktop",
        screenAspect: "aspect-[320/153]",
        fit: "cover",
        className: "absolute left-[52%] top-[47%] z-10 w-[86%] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rotate-[1deg]",
      },
    ],
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
    videoSrc: "/videos/projects/greetly-mobile.webm",
    tileSize: "tall",
    alignment: "right",
    gridClassName: "lg:col-span-6",
    sceneClassName: "bg-[#E6B56F]",
    sceneDecorClassName: "left-[-9%] bottom-[-12%] h-[330px] w-[330px] bg-[#B56A2D]/35",
    devices: [
      {
        id: "greetly-phone",
        type: "phone",
        media: "mobile",
        screenAspect: "aspect-[65/119]",
        fit: "cover",
        className: "absolute left-[52%] top-1/2 z-10 w-[42%] max-w-[230px] -translate-x-1/2 -translate-y-1/2 rotate-[2deg]",
      },
    ],
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "04",
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
    gridClassName: "lg:col-span-6",
    sceneClassName: "bg-[#302522]",
    sceneDecorClassName: "left-[5%] top-[10%] h-[360px] w-[360px] bg-[#7E1E1A]/35",
    devices: [
      {
        id: "avengers-cinema",
        type: "cinema",
        media: "desktop",
        screenAspect: "aspect-[137/65]",
        fit: "cover",
        className: "absolute left-1/2 top-[58%] z-10 w-[88%] max-w-[980px] -translate-x-1/2 -translate-y-1/2 -rotate-[1deg]",
      },
    ],
  },
];

export const ProjectGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative grid w-full grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20 xl:gap-x-12 xl:gap-y-24">
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
