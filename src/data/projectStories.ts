import React from "react";

export type SlideType = "hero" | "feature" | "quote" | "grid" | "readNext";

export interface BaseSlide {
  id: string;
  type: SlideType;
  bgTheme: "dark" | "light" | "navy" | "warm" | "emerald" | "crimson";
}

export interface HeroSlide extends BaseSlide {
  type: "hero";
  tagline: string;
  previewImage?: string;
  stats?: { label: string; value: string }[];
}

export interface FeatureSlide extends BaseSlide {
  type: "feature";
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  badge?: string;
  visualGraphic?: string;
}

export interface QuoteSlide extends BaseSlide {
  type: "quote";
  quoteText: string;
  highlightedPhrase: string;
  authorOrContext: string;
}

export interface GridSlide extends BaseSlide {
  type: "grid";
  title: string;
  subtitle?: string;
  columns: {
    heading: string;
    subheading?: string;
    items: string[];
    metrics?: string;
  }[];
}

export interface ReadNextSlide extends BaseSlide {
  type: "readNext";
  nextProjectId: string;
  nextProjectSlug: string;
  nextProjectTitle: string;
  nextProjectCategory: string;
  nextProjectDescription: string;
  nextProjectTech: string[];
  nextProjectBgTheme?: string;
}

export type ProjectSlide = HeroSlide | FeatureSlide | QuoteSlide | GridSlide | ReadNextSlide;

export interface ProjectStoryData {
  id: string;
  slug: string;
  number: string;
  category: string;
  titleMain: string;
  tagline: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  slides: ProjectSlide[];
}

export const PROJECT_STORIES: ProjectStoryData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    category: "AI COURSE GENERATOR",
    titleMain: "CourseForge AI",
    tagline: "Automated Curriculum & Lesson Generation Engine",
    description: "Builds a full course (outline, lessons, quizzes, curated YouTube videos) from any topic using Gemini AI.",
    tech: ["REACT", "TAILWIND", "GEMINI AI", "YOUTUBE API"],
    liveUrl: "https://lnkd.in/g4j6gNzA",
    githubUrl: "https://lnkd.in/gtG__2Rb",
    slides: [
      {
        id: "courseforge-hero",
        type: "hero",
        bgTheme: "emerald",
        tagline: "Turn any learning objective into a complete multi-module course with videos & quizzes instantly.",
        stats: [
          { label: "MODULE GENERATION", value: "Instant" },
          { label: "QUIZ GENERATION", value: "Dynamic" },
          { label: "CURATION", value: "Automated" },
        ],
      },
      {
        id: "courseforge-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "EDTECH ARCHITECTURE",
        title: "Adaptive Learning Tree & Dynamic Testing",
        subtitle: "AI Syllabus Structuring",
        description: "Breaks down complex subjects into progressive chapters, pairing each module with relevant media and knowledge checks.",
        highlights: [
          "Multi-tier topic decomposition algorithm",
          "Automated YouTube lecture curation matching specific subtopics",
          "Interactive self-assessment quizzes generated on the fly",
        ],
      },
      {
        id: "courseforge-quote",
        type: "quote",
        bgTheme: "navy",
        quoteText: "Democratizing education by empowering anyone to master complex subjects through AI-guided structured pathways.",
        highlightedPhrase: "empowering anyone to master complex subjects",
        authorOrContext: "CourseForge Product Vision",
      },
      {
        id: "courseforge-grid",
        type: "grid",
        bgTheme: "dark",
        title: "Curriculum Engine Workflow",
        subtitle: "From prompt to complete course interactive suite",
        columns: [
          {
            heading: "01. SYLLABUS BUILD",
            subheading: "Topic Decomposition",
            items: ["Hierarchy mapping", "Prerequisite sequencing", "Skill depth calibration"],
            metrics: "4 Structured Modules",
          },
          {
            heading: "02. MEDIA CURATION",
            subheading: "Resource Indexing",
            items: ["Video quality filtering", "Transcript alignment", "Reading material links"],
            metrics: "Curated YouTube Media",
          },
          {
            heading: "03. KNOWLEDGE CHECK",
            subheading: "Dynamic Quizzing",
            items: ["Multiple-choice generation", "Instant answer feedback", "Progress tracking"],
            metrics: "100% Mastery Check",
          },
        ],
      },
      {
        id: "courseforge-readnext",
        type: "readNext",
        bgTheme: "warm",
        nextProjectId: "hirescope-ai",
        nextProjectSlug: "hirescope-ai",
        nextProjectTitle: "HireScope AI",
        nextProjectCategory: "AI RESUME ANALYZER",
        nextProjectDescription: "Resume & portfolio analyzer giving combined hireability scores with ATS gauges and skill detection.",
        nextProjectTech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
      },
    ],
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "02",
    category: "AI RESUME ANALYZER",
    titleMain: "HireScope AI",
    tagline: "Intelligent Resume Evaluation & Candidate Job Matching System",
    description: "Automated scoring, deep skill extraction, and candidate-to-role matching powered by Claude API and Puppeteer.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://lnkd.in/gRQgwgZc",
    githubUrl: "https://lnkd.in/gxutjrii",
    slides: [
      {
        id: "hirescope-hero",
        type: "hero",
        bgTheme: "navy",
        tagline: "Transforming job hunting from a black box into data-driven match intelligence.",
        stats: [
          { label: "MATCH ACCURACY", value: "92.4%" },
          { label: "INFERENCE SPEED", value: "< 1.2s" },
          { label: "PARSE RATE", value: "100%" },
        ],
      },
      {
        id: "hirescope-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "FEATURE HIGHLIGHT",
        title: "Automated Skill Extraction & ATS Scoring",
        subtitle: "Deep PDF Parsing + LLM Analysis",
        description: "Uses Puppeteer to scrape target job descriptions and Claude 3.5 Sonnet to score candidate resumes across key competency vectors.",
        highlights: [
          "Extracts hard skills, soft skills, and experience gap metrics",
          "Generates actionable resume enhancement suggestions",
          "Calculates weighted match score with role requirements",
        ],
      },
      {
        id: "hirescope-quote",
        type: "quote",
        bgTheme: "warm",
        quoteText: "Building career tools that give applicants clarity, precision, and a competitive edge in modern tech hiring.",
        highlightedPhrase: "clarity, precision, and a competitive edge",
        authorOrContext: "HireScope Engineering Vision",
      },
      {
        id: "hirescope-grid",
        type: "grid",
        bgTheme: "dark",
        title: "System Architecture Breakdown",
        subtitle: "How HireScope processes resumes end-to-end",
        columns: [
          {
            heading: "01. INGESTION",
            subheading: "PDF & Text Parsing",
            items: ["Multi-format resume upload", "Section segmentation", "Token optimization"],
            metrics: "100% Parsing Reliability",
          },
          {
            heading: "02. EVALUATION",
            subheading: "Claude API Intelligence",
            items: ["Keyword overlap matrix", "Experience depth rating", "ATS compatibility score"],
            metrics: "92.4% Match Accuracy",
          },
          {
            heading: "03. FEEDBACK",
            subheading: "Actionable Insights",
            items: ["Tailored resume bullet edits", "Missing skill identification", "One-click export"],
            metrics: "< 1.2s Latency",
          },
        ],
      },
      {
        id: "hirescope-readnext",
        type: "readNext",
        bgTheme: "warm",
        nextProjectId: "greetly",
        nextProjectSlug: "greetly",
        nextProjectTitle: "Greetly",
        nextProjectCategory: "NEO-BRUTALIST AI TOOL",
        nextProjectDescription: "Personalized greetings and messages generated from contextual inputs using high-speed Groq API inference.",
        nextProjectTech: ["REACT", "VITE", "FLASK", "GROQ API"],
      },
    ],
  },
  {
    id: "greetly",
    slug: "greetly",
    number: "03",
    category: "NEO-BRUTALIST AI TOOL",
    titleMain: "Greetly",
    tagline: "Contextual AI Message & Greeting Generator",
    description: "High-speed personalized greetings generated in 42ms using Groq API and a lightweight Flask microservice.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://lnkd.in/dRSa6Z4g",
    githubUrl: "https://lnkd.in/devnZ7jk",
    slides: [
      {
        id: "greetly-hero",
        type: "hero",
        bgTheme: "warm",
        tagline: "Ultra-fast contextual AI messages crafted for any event, celebration, or professional milestone.",
        stats: [
          { label: "LATENCY", value: "42ms" },
          { label: "BACKEND", value: "Flask API" },
          { label: "MODEL", value: "Groq Llama 3" },
        ],
      },
      {
        id: "greetly-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "PERFORMANCE HIGHLIGHT",
        title: "Sub-50ms Contextual Inference",
        subtitle: "Groq Llama 3 Hardware Acceleration",
        description: "Delivers instantaneous text generation tuned specifically for tone, recipient profile, and emotional intent.",
        highlights: [
          "Custom tone presets: Formal, Humorous, Inspiring, Casual",
          "Lightweight Python Flask backend hosted on Vercel Serverless",
          "Real-time stream rendering with animated UI audio visualizers",
        ],
      },
      {
        id: "greetly-quote",
        type: "quote",
        bgTheme: "emerald",
        quoteText: "Crafting heartfelt, tailored messages in milliseconds using state-of-the-art inference engines.",
        highlightedPhrase: "heartfelt, tailored messages in milliseconds",
        authorOrContext: "Greetly Design Philosophy",
      },
      {
        id: "greetly-grid",
        type: "grid",
        bgTheme: "warm",
        title: "Engine & Feature Matrix",
        subtitle: "Balancing speed, personalization, and UX design",
        columns: [
          {
            heading: "01. CONTEXT INPUT",
            subheading: "Smart Prompting",
            items: ["Recipient relationship tag", "Event category selection", "Custom keyword injection"],
            metrics: "Instant Input Mapping",
          },
          {
            heading: "02. GROQ ENGINE",
            subheading: "LPU Acceleration",
            items: ["Token streaming API", "Temperature optimization", "Zero-bounce retries"],
            metrics: "42ms Generation",
          },
          {
            heading: "03. OUTPUT CARDS",
            subheading: "Visual Export",
            items: ["One-click clipboard copy", "Custom card styling", "Social share links"],
            metrics: "100% Client Satisfaction",
          },
        ],
      },
      {
        id: "greetly-readnext",
        type: "readNext",
        bgTheme: "crimson",
        nextProjectId: "avengers-doomsday",
        nextProjectSlug: "avengers-doomsday",
        nextProjectTitle: "Avengers Doomsday",
        nextProjectCategory: "CINEMATIC DESIGN DEMO",
        nextProjectDescription: "Marvel-themed concept landing page with a cinematic dark UI, glowing green particles, and 3D coverflow hero.",
        nextProjectTech: ["THREE.JS", "GSAP", "WEBGL", "REACT"],
      },
    ],
  },
  {
    id: "avengers-doomsday",
    slug: "avengers-doomsday",
    number: "04",
    category: "CINEMATIC DESIGN DEMO",
    titleMain: "Avengers Doomsday",
    tagline: "Cinematic 3D Marvel Concept Landing Page (Design Demo)",
    description: "A Marvel-themed concept landing page with a cinematic dark UI, glowing green particle effects, and a 3D coverflow hero carousel. (Fan concept, not an official product).",
    tech: ["THREE.JS", "GSAP", "WEBGL", "REACT"],
    liveUrl: "https://lnkd.in/gz-jS3MG",
    githubUrl: "https://lnkd.in/giEYt9Au",
    slides: [
      {
        id: "doom-hero",
        type: "hero",
        bgTheme: "crimson",
        tagline: "Pushing web graphics to cinematic boundaries with WebGL shaders & 3D coverflow dynamics.",
        stats: [
          { label: "FRAMERATE", value: "60 FPS" },
          { label: "RENDER ENGINE", value: "Three.js / WebGL" },
          { label: "PARTICLES", value: "GLSL Green Pulse" },
        ],
      },
      {
        id: "doom-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "FRONT-END SHOWCASE",
        title: "Glowing Particle Shader & 3D Hero Coverflow",
        subtitle: "Cinematic Fan Concept Landing Page",
        description: "Built purely as a front-end design & animation showcase piece, featuring custom particle shaders and smooth carousel physics.",
        highlights: [
          "Interactive green particle field responding to cursor velocity",
          "3D coverflow carousel with keyframe inertia",
          "Custom dark cinematic aesthetic with villain HUD styling",
        ],
      },
      {
        id: "doom-quote",
        type: "quote",
        bgTheme: "warm",
        quoteText: "Blending cinematic Marvel aesthetics with advanced WebGL mechanics for immersive storytelling.",
        highlightedPhrase: "cinematic Marvel aesthetics with advanced WebGL",
        authorOrContext: "Avengers Doomsday Creative Concept",
      },
      {
        id: "doom-grid",
        type: "grid",
        bgTheme: "crimson",
        title: "Graphics & Animation Tech Stack",
        subtitle: "High-performance front-end showcase pipeline",
        columns: [
          {
            heading: "01. CANVAS ENGINE",
            subheading: "Three.js + Shaders",
            items: ["Custom GLSL shaders", "Instanced rendering", "60 FPS particle engine"],
            metrics: "60 FPS Locked",
          },
          {
            heading: "02. ANIMATION",
            subheading: "GSAP Timeline",
            items: ["Interactive coverflow", "3D card tilt physics", "Scroll triggered reveals"],
            metrics: "Fluid Motion Physics",
          },
          {
            heading: "03. UX DESIGN",
            subheading: "Concept Showcase",
            items: ["Cinematic dark mode", "Neon emerald accents", "Responsive viewport scaling"],
            metrics: "Front-End Design Demo",
          },
        ],
      },
      {
        id: "doom-readnext",
        type: "readNext",
        bgTheme: "emerald",
        nextProjectId: "courseforge-ai",
        nextProjectSlug: "courseforge-ai",
        nextProjectTitle: "CourseForge AI",
        nextProjectCategory: "AI COURSE GENERATOR",
        nextProjectDescription: "Automated curriculum & lesson generator crafting courses from topic prompts using Gemini AI.",
        nextProjectTech: ["REACT", "TAILWIND", "GEMINI AI", "YOUTUBE API"],
      },
    ],
  },
];
