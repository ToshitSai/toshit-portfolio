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
  githubUrl?: string;
  slides: ProjectSlide[];
}

export const PROJECT_STORIES: ProjectStoryData[] = [
  {
    id: "courseforge-ai",
    slug: "courseforge-ai",
    number: "01",
    category: "AI COURSE GENERATOR",
    titleMain: "CourseForge",
    tagline: "Automated Curriculum & Lesson Generation Engine",
    description: "Builds course outlines, lessons, quizzes, and curated video suggestions from a topic prompt using Gemini AI.",
    tech: ["REACT", "TAILWIND", "GEMINI AI", "YOUTUBE API"],
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    slides: [
      {
        id: "courseforge-hero",
        type: "hero",
        bgTheme: "emerald",
        tagline: "Turn a learning topic into a structured course outline with lesson content, quizzes, and curated videos.",
        stats: [
          { label: "CONTENT FLOW", value: "Lessons" },
          { label: "PRACTICE", value: "Quizzes" },
          { label: "RESOURCES", value: "Videos" },
        ],
      },
      {
        id: "courseforge-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "EDTECH ARCHITECTURE",
        title: "Course Builder Workflow",
        subtitle: "AI Syllabus Structuring",
        description: "Breaks down complex subjects into progressive chapters, pairing each module with relevant media and knowledge checks.",
        highlights: [
          "Breaks broad topics into a sequenced learning path",
          "Pairs generated lessons with curated YouTube resources",
          "Creates quiz questions so learners can review each module",
        ],
      },
      {
        id: "courseforge-quote",
        type: "quote",
        bgTheme: "navy",
        quoteText: "The goal was to make course planning faster without removing structure from the learning experience.",
        highlightedPhrase: "make course planning faster",
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
            metrics: "Structured output",
          },
          {
            heading: "02. MEDIA CURATION",
            subheading: "Resource Indexing",
            items: ["Video quality filtering", "Transcript alignment", "Reading material links"],
            metrics: "Curated resources",
          },
          {
            heading: "03. KNOWLEDGE CHECK",
            subheading: "Dynamic Quizzing",
            items: ["Multiple-choice generation", "Instant answer feedback", "Progress tracking"],
            metrics: "Practice questions",
          },
        ],
      },
      {
        id: "courseforge-readnext",
        type: "readNext",
        bgTheme: "warm",
        nextProjectId: "hirescope-ai",
        nextProjectSlug: "hirescope-ai",
        nextProjectTitle: "HireScope",
        nextProjectCategory: "AI RESUME ANALYZER",
        nextProjectDescription: "Resume and portfolio analyzer that helps candidates review role fit, keywords, strengths, and improvement areas.",
        nextProjectTech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
      },
    ],
  },
  {
    id: "hirescope-ai",
    slug: "hirescope-ai",
    number: "02",
    category: "AI RESUME ANALYZER",
    titleMain: "HireScope",
    tagline: "Intelligent Resume Evaluation & Candidate Job Matching System",
    description: "Analyzes resumes and portfolios against target roles, surfacing keyword gaps, strengths, and improvement suggestions.",
    tech: ["NEXT.JS", "PUPPETEER", "CLAUDE API", "SERPER API"],
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai/job-gem-grader",
    slides: [
      {
        id: "hirescope-hero",
        type: "hero",
        bgTheme: "navy",
        tagline: "A practical career tool for reviewing resume content, portfolio signals, and target-role fit.",
        stats: [
          { label: "INPUTS", value: "Resume" },
          { label: "ROLE FIT", value: "Scored" },
          { label: "OUTPUT", value: "Feedback" },
        ],
      },
      {
        id: "hirescope-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "FEATURE HIGHLIGHT",
        title: "Resume Parsing, Role Targeting & Feedback",
        subtitle: "Deep PDF Parsing + LLM Analysis",
        description: "Combines uploaded resume content and target-role context to produce structured feedback that candidates can act on.",
        highlights: [
          "Extracts visible skills and experience signals from resume text",
          "Highlights missing keywords and weak areas for a target role",
          "Presents results through clear score, strength, and suggestion sections",
        ],
      },
      {
        id: "hirescope-quote",
        type: "quote",
        bgTheme: "warm",
        quoteText: "The product goal was simple: make resume feedback specific enough that a candidate knows what to fix next.",
        highlightedPhrase: "knows what to fix next",
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
            metrics: "Resume upload",
          },
          {
            heading: "02. EVALUATION",
            subheading: "Claude API Intelligence",
            items: ["Keyword overlap matrix", "Experience depth rating", "ATS compatibility score"],
            metrics: "Role-aware scoring",
          },
          {
            heading: "03. FEEDBACK",
            subheading: "Actionable Insights",
            items: ["Tailored resume bullet edits", "Missing skill identification", "One-click export"],
            metrics: "Actionable output",
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
        nextProjectCategory: "AI MESSAGE TOOL",
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
    description: "Generates personalized greetings and messages with tone presets, account flows, and a lightweight Flask API.",
    tech: ["REACT", "VITE", "FLASK", "GROQ API"],
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai/greetly",
    slides: [
      {
        id: "greetly-hero",
        type: "hero",
        bgTheme: "warm",
        tagline: "Generate occasion-specific messages with configurable tone, recipient context, and saved outputs.",
        stats: [
          { label: "INPUT", value: "Context" },
          { label: "BACKEND", value: "Flask API" },
          { label: "OUTPUT", value: "Messages" },
        ],
      },
      {
        id: "greetly-feature",
        type: "feature",
        bgTheme: "dark",
        badge: "PERFORMANCE HIGHLIGHT",
        title: "Tone-Controlled Message Generation",
        subtitle: "Groq Llama 3 Hardware Acceleration",
        description: "Uses structured prompts and a Flask backend to generate messages tuned for occasion, recipient, and tone.",
        highlights: [
          "Custom tone presets: Formal, Humorous, Inspiring, Casual",
          "Lightweight Python Flask backend hosted with serverless routing",
          "Saved message flow with authentication for returning users",
        ],
      },
      {
        id: "greetly-quote",
        type: "quote",
        bgTheme: "emerald",
        quoteText: "This project focused on making AI writing feel guided, specific, and reusable for everyday communication.",
        highlightedPhrase: "guided, specific, and reusable",
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
            metrics: "Structured context",
          },
          {
            heading: "02. GROQ ENGINE",
            subheading: "LPU Acceleration",
            items: ["Token streaming API", "Temperature optimization", "Zero-bounce retries"],
            metrics: "Groq API generation",
          },
          {
            heading: "03. OUTPUT CARDS",
            subheading: "Visual Export",
            items: ["One-click clipboard copy", "Custom card styling", "Social share links"],
            metrics: "Reusable output",
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
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    slides: [
      {
        id: "doom-hero",
        type: "hero",
        bgTheme: "crimson",
        tagline: "A cinematic front-end demo focused on WebGL, motion timing, and responsive visual storytelling.",
        stats: [
          { label: "FOCUS", value: "Motion" },
          { label: "RENDER ENGINE", value: "Three.js / WebGL" },
          { label: "UI", value: "Cinematic" },
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
            metrics: "WebGL scene",
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
        nextProjectTitle: "CourseForge",
        nextProjectCategory: "AI COURSE GENERATOR",
        nextProjectDescription: "Automated curriculum & lesson generator crafting courses from topic prompts using Gemini AI.",
        nextProjectTech: ["REACT", "TAILWIND", "GEMINI AI", "YOUTUBE API"],
      },
    ],
  },
];
