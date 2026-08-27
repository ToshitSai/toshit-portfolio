export interface ProjectItemData {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  category: string;
  domain: string;
  accentColor: string;
  accentGradient: string;
  accentGlow: string;
  tech: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  bgImage: string;
  motifType: "course" | "resume" | "greeting" | "doomsday" | "portfolio";
}

export const PROJECTS_DATA: ProjectItemData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    title: "CourseForge AI",
    subtitle: "AI-Powered Course Generator",
    tagline: "AI-powered course generator – create complete lesson plans, quizzes, and syllabi in seconds.",
    description: "Generates complete structured courses with lesson outlines, AI video curation, and interactive quizzes from any topic using Gemini AI.",
    category: "AI COURSE GENERATOR",
    domain: "courseforge-ai.vercel.app",
    accentColor: "#3B82F6", // Indigo / Blue
    accentGradient: "from-[#3B82F6] to-[#60A5FA]",
    accentGlow: "rgba(59, 130, 246, 0.45)",
    tech: ["React", "Gemini API", "Vercel", "YouTube API"],
    features: ["AI Syllabus Structuring", "YouTube Curation", "Interactive Quizzes"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    bgImage: "/images/projects/courseforge-ai.png",
    motifType: "course",
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    number: "02",
    title: "Personal Portfolio",
    subtitle: "Editorial Showcase Site",
    tagline: "My web portfolio – AI/ML & web development projects showcased with creative animations.",
    description: "High-performance editorial showcase site built with React, Vite, Tailwind CSS, & Framer Motion.",
    category: "PORTFOLIO & EDITORIAL",
    domain: "toshitsai.dev",
    accentColor: "#F6C545", // Warm Yellow
    accentGradient: "from-[#F6C545] to-[#F59E0B]",
    accentGlow: "rgba(246, 197, 69, 0.45)",
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    features: ["Story Reel Modal", "Frosted Cards", "Passive rAF Nav"],
    liveUrl: "https://toshitsai.dev",
    githubUrl: "https://github.com/ToshitSai/toshit-portfolio",
    bgImage: "/images/projects/personal-portfolio.png",
    motifType: "portfolio",
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "03",
    title: "HireScope AI",
    subtitle: "Resume Analysis Tool",
    tagline: "Smart resume & portfolio analyzer – instant AI-driven feedback on your career documents.",
    description: "Advanced resume analysis platform leveraging state-of-the-art NLP to compute ATS match scores, extract skills, and identify candidate experience gaps.",
    category: "AI RESUME ANALYZER",
    domain: "job-gem-grader.vercel.app",
    accentColor: "#38B2AC", // Teal / Green
    accentGradient: "from-[#0D9488] to-[#38B2AC]",
    accentGlow: "rgba(56, 178, 172, 0.45)",
    tech: ["Next.js", "Puppeteer", "Claude API", "Serper API"],
    features: ["ATS Match Gauge", "Gap Analysis", "Keyword Optimization"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    bgImage: "/images/projects/hirescope-ai.png",
    motifType: "resume",
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "04",
    title: "Greetly",
    subtitle: "Personalized Messaging App",
    tagline: "AI-powered greeting generator – craft personalized messages and save your favorites.",
    description: "AI greeting card message tool with a bold neo-brutalist UI. Features Groq Llama-3.3 acceleration, JWT auth, and custom tone presets.",
    category: "NEO-BRUTALIST AI TOOL",
    domain: "toshit-greetly.vercel.app",
    accentColor: "#F06C64", // Coral / Orange
    accentGradient: "from-[#F06C64] to-[#FF4757]",
    accentGlow: "rgba(240, 108, 100, 0.45)",
    tech: ["React", "Flask", "Groq Llama-3.3", "JWT Auth"],
    features: ["Empathy Engine", "Tone Presets", "History Dashboard"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    bgImage: "/images/projects/greetly.png",
    motifType: "greeting",
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "05",
    title: "Avengers Doomsday",
    subtitle: "Interactive Fan Concept",
    tagline: "Avengers Doomsday – a cinematic Marvel web experience exploring 3D dynamics and GLSL particles.",
    description: "A Marvel-inspired cinematic scroll experience built with Next.js, Three.js, GSAP ScrollTrigger, and Lenis smooth physics.",
    category: "CINEMATIC DESIGN DEMO",
    domain: "avengers-doomsday.vercel.app",
    accentColor: "#C0392B", // Crimson Red
    accentGradient: "from-[#C0392B] to-[#FF003C]",
    accentGlow: "rgba(192, 57, 43, 0.45)",
    tech: ["Next.js", "Three.js", "GSAP", "Lenis Physics"],
    features: ["3D Coverflow Hero", "GLSL Particles", "Scroll Video Scrub"],
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    bgImage: "/images/projects/avengers-doomsday.png",
    motifType: "doomsday",
  },
];
