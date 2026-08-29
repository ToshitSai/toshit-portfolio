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
  githubUrl?: string;
  bgImage: string;
  motifType: "course" | "resume" | "greeting" | "doomsday" | "portfolio";
}

export const PROJECTS_DATA: ProjectItemData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "02",
    title: "CourseForge",
    subtitle: "AI-Powered Course Generator",
    tagline: "AI course generator that turns a topic into structured lessons, quizzes, and curated videos.",
    description: "Built a prompt-driven course generation workflow with syllabus structuring, lesson breakdowns, quiz generation, and YouTube resource curation.",
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
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "01",
    title: "HireScope",
    subtitle: "Resume Analysis Tool",
    tagline: "Resume and portfolio analyzer that helps candidates understand gaps, keywords, and role fit.",
    description: "Built an AI-assisted resume review workflow with upload handling, role targeting, keyword feedback, and a combined hireability score for faster resume iteration.",
    category: "AI RESUME ANALYZER",
    domain: "job-gem-grader.vercel.app",
    accentColor: "#38B2AC", // Teal / Green
    accentGradient: "from-[#0D9488] to-[#38B2AC]",
    accentGlow: "rgba(56, 178, 172, 0.45)",
    tech: ["Next.js", "Puppeteer", "Claude API", "Serper API"],
    features: ["ATS Match Gauge", "Gap Analysis", "Keyword Optimization"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai/job-gem-grader",
    bgImage: "/images/projects/hirescope-ai.png",
    motifType: "resume",
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "03",
    title: "Greetly",
    subtitle: "Personalized Message Tool",
    tagline: "Greeting and message generator with tone controls, authentication, and saved message flows.",
    description: "Built a full-stack greeting generator with a React interface, Flask API, Groq-powered text generation, JWT auth, and reusable tone presets.",
    category: "AI MESSAGE TOOL",
    domain: "toshit-greetly.vercel.app",
    accentColor: "#F06C64", // Coral / Orange
    accentGradient: "from-[#F06C64] to-[#FF4757]",
    accentGlow: "rgba(240, 108, 100, 0.45)",
    tech: ["React", "Flask", "Groq Llama-3.3", "JWT Auth"],
    features: ["Empathy Engine", "Tone Presets", "History Dashboard"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai/greetly",
    bgImage: "/images/projects/greetly.png",
    motifType: "greeting",
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "04",
    title: "Avengers Doomsday",
    subtitle: "Interactive Fan Concept",
    tagline: "Cinematic fan-concept landing page focused on motion, 3D presentation, and scroll interaction.",
    description: "Built a front-end motion showcase with Next.js, Three.js, GSAP ScrollTrigger, Lenis smooth scrolling, and responsive cinematic project presentation.",
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
