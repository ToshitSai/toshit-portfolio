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
    tagline: "Generate complete courses in minutes: outlines, lessons, videos, and quizzes powered by advanced AI.",
    description: "Generates complete structured courses with lesson outlines, AI video curation, and interactive quizzes from any topic using Gemini AI.",
    category: "AI COURSE GENERATOR",
    domain: "courseforge-ai.vercel.app",
    accentColor: "#6366F1", // Cool Blue-Indigo
    accentGradient: "from-[#4F46E5] to-[#3B82F6]",
    accentGlow: "rgba(99, 102, 241, 0.45)",
    tech: ["React", "Gemini API", "Vercel", "YouTube API"],
    features: ["AI Syllabus Structuring", "YouTube Curation", "Interactive Quizzes"],
    liveUrl: "https://lnkd.in/g4j6gNzA",
    githubUrl: "https://lnkd.in/gtG__2Rb",
    bgImage: "/images/projects/courseforge-ai.png",
    motifType: "course",
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "02",
    title: "HireScope AI",
    subtitle: "AI-Powered Resume Analysis",
    tagline: "Uses NLP & ML to score resumes (formatting, keywords, relevance) and suggest recruiter-focused improvements.",
    description: "Advanced resume analysis platform leveraging state-of-the-art NLP to compute ATS match scores, extract skills, and identify candidate experience gaps.",
    category: "AI RESUME ANALYZER",
    domain: "job-gem-grader.vercel.app",
    accentColor: "#10B981", // Teal / Cool Green
    accentGradient: "from-[#0D9488] to-[#10B981]",
    accentGlow: "rgba(16, 185, 129, 0.45)",
    tech: ["Next.js", "Puppeteer", "Claude API", "Serper API"],
    features: ["ATS Match Gauge", "Gap Analysis", "Keyword Optimization"],
    liveUrl: "https://lnkd.in/gRQgwgZc",
    githubUrl: "https://lnkd.in/gxutjrii",
    bgImage: "/images/projects/hirescope-ai.png",
    motifType: "resume",
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "03",
    title: "Greetly",
    subtitle: "AI-Powered Message Generator",
    tagline: "Craft truly personal messages for any occasion by understanding your relationship with the recipient.",
    description: "AI greeting card message tool with a bold neo-brutalist UI. Features Groq Llama-3.3 acceleration, JWT auth, and custom tone presets.",
    category: "NEO-BRUTALIST AI TOOL",
    domain: "toshit-greetly.vercel.app",
    accentColor: "#FF4757", // Warm Coral / Orange
    accentGradient: "from-[#FF6B6B] to-[#FF4757]",
    accentGlow: "rgba(255, 71, 87, 0.45)",
    tech: ["React", "Flask", "Groq Llama-3.3", "JWT Auth"],
    features: ["Empathy Engine", "Tone Presets", "History Dashboard"],
    liveUrl: "https://lnkd.in/dRSa6Z4g",
    githubUrl: "https://lnkd.in/devnZ7jk",
    bgImage: "/images/projects/greetly.png",
    motifType: "greeting",
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "04",
    title: "AVENGERS: DOOMSDAY",
    subtitle: "Cinematic Scroll Experience",
    tagline: "Scroll-scrubbed video trailers, glowing green particle portals, & 3D WebGL coverflow dynamics (Front-End Design Demo).",
    description: "A Marvel-inspired cinematic scroll experience built with Next.js, Three.js, GSAP ScrollTrigger, and Lenis smooth physics.",
    category: "CINEMATIC DESIGN DEMO",
    domain: "avengers-doomsday.vercel.app",
    accentColor: "#FF003C", // Deep Crimson Red
    accentGradient: "from-[#FF003C] to-[#E11D48]",
    accentGlow: "rgba(255, 0, 60, 0.45)",
    tech: ["Next.js", "Three.js", "GSAP", "Lenis Physics"],
    features: ["3D Coverflow Hero", "GLSL Particles", "Scroll Video Scrub"],
    liveUrl: "https://lnkd.in/gz-jS3MG",
    githubUrl: "https://lnkd.in/giEYt9Au",
    bgImage: "/images/projects/avengers-doomsday.png",
    motifType: "doomsday",
  },
];
