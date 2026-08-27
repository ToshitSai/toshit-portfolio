export interface ProjectItemData {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  accentColor: string;
  accentGlow: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  bgImage: string;
}

export const PROJECTS_DATA: ProjectItemData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    title: "CourseForge AI",
    tagline: "AI course generator that builds complete structured courses from any topic using Gemini AI.",
    description: "Builds a full course (outline, lessons, quizzes, curated YouTube videos) from any topic using Gemini AI.",
    category: "AI COURSE GENERATOR",
    accentColor: "#8B5CF6", // Indigo / Purple
    accentGlow: "rgba(139, 92, 246, 0.45)",
    tech: ["REACT", "TAILWIND", "GEMINI AI", "YOUTUBE API"],
    liveUrl: "https://lnkd.in/g4j6gNzA",
    githubUrl: "https://lnkd.in/gtG__2Rb",
    bgImage: "/images/projects/courseforge-ai.png",
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    number: "02",
    title: "Personal Portfolio",
    tagline: "High-performance editorial showcase site built with React, Vite, and Framer Motion.",
    description: "This site itself — an editorial, high-performance showcase built with React, Vite, and Framer Motion.",
    category: "PORTFOLIO & EDITORIAL",
    accentColor: "#FFD42A", // Site Ink / Cream Yellow Accent
    accentGlow: "rgba(255, 212, 42, 0.45)",
    tech: ["REACT", "VITE", "TAILWIND", "FRAMER MOTION"],
    liveUrl: "https://lnkd.in/gehvCMib",
    githubUrl: "https://lnkd.in/giumPvVE",
    bgImage: "/images/projects/personal-portfolio.png",
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "03",
    title: "HireScope AI",
    tagline: "Resume & portfolio analyzer giving combined hireability scores with ATS gauges and skill detection.",
    description: "Resume + portfolio analyzer that gives a combined 'Hireability' score with an ATS gauge, detected skills, and missing keywords.",
    category: "AI RESUME ANALYZER",
    accentColor: "#3B82F6", // Blue
    accentGlow: "rgba(59, 130, 246, 0.45)",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://lnkd.in/gRQgwgZc",
    githubUrl: "https://lnkd.in/gxutjrii",
    bgImage: "/images/projects/hirescope-ai.png",
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "04",
    title: "Greetly",
    tagline: "AI-generated greeting card message generator with a bold neo-brutalist UI.",
    description: "AI-generated greeting card message tool with a bold neo-brutalist UI (thick black borders, bright coral/yellow/cyan/purple color blocks).",
    category: "NEO-BRUTALIST AI TOOL",
    accentColor: "#FF4757", // Coral / Pink
    accentGlow: "rgba(255, 71, 87, 0.45)",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://lnkd.in/dRSa6Z4g",
    githubUrl: "https://lnkd.in/devnZ7jk",
    bgImage: "/images/projects/greetly.png",
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "05",
    title: "Avengers Doomsday",
    tagline: "Cinematic Marvel-themed concept landing page with glowing green particles & 3D coverflow hero.",
    description: "A Marvel-themed concept landing page with a cinematic dark UI, glowing green particle effects, and a 3D coverflow hero carousel. (Front-end design demo).",
    category: "CINEMATIC DESIGN DEMO",
    accentColor: "#00FF88", // Glowing Green
    accentGlow: "rgba(0, 255, 136, 0.45)",
    tech: ["THREE.JS", "GSAP", "WEBGL", "REACT"],
    liveUrl: "https://lnkd.in/gz-jS3MG",
    githubUrl: "https://lnkd.in/giEYt9Au",
    bgImage: "/images/projects/avengers-doomsday.png",
  },
];
