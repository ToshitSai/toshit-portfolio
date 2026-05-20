export type ProjectCard = {
  title: string;
  summary: string;
  technologies: string;
  role: string;
  tone: string;
  href?: string;
  linkLabel?: string;
  videoSrc?: string;
  pageHref?: string;
};

export const skillGroups = [
  {
    title: "Web Technologies",
    items: ["HTML", "CSS", "JavaScript", "Responsive Design"],
  },
  {
    title: "Frameworks/Libraries",
    items: ["React", "Next.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Tools/Platforms",
    items: ["Git", "GitHub", "Antigravity", "Codex"],
  },
  {
    title: "Other Skills",
    items: ["Problem Solving", "Team Collaboration", "Adaptability", "Continuous Learning"],
  },
];

export const educationItems = [
  {
    title: "B.Tech Computer Science",
    school: "NxtWave Institute of Advanced Technologies (NIAT), Chaitanya deemed to be University",
    years: "2025-2029",
  },
  {
    title: "Intermediate (12th Grade) MPC",
    school: "Bhavishya Junior College",
    years: "2023-2025",
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/toshitsai",
    path: "M12 2C6.477 2 2 6.596 2 12.264c0 4.535 2.865 8.381 6.839 9.739.5.094.682-.222.682-.493 0-.244-.009-.891-.014-1.748-2.782.62-3.369-1.387-3.369-1.387-.455-1.18-1.11-1.494-1.11-1.494-.908-.636.069-.623.069-.623 1.004.072 1.531 1.052 1.531 1.052.892 1.56 2.341 1.11 2.91.849.091-.667.349-1.11.635-1.365-2.221-.259-4.555-1.134-4.555-5.047 0-1.115.389-2.027 1.029-2.741-.103-.259-.446-1.301.098-2.712 0 0 .84-.276 2.75 1.047A9.32 9.32 0 0 1 12 6.844a9.3 9.3 0 0 1 2.504.348c1.909-1.323 2.747-1.047 2.747-1.047.546 1.411.203 2.453.1 2.712.641.714 1.027 1.626 1.027 2.741 0 3.923-2.338 4.785-4.566 5.039.359.319.678.948.678 1.911 0 1.38-.012 2.493-.012 2.832 0 .273.18.592.688.492A10.285 10.285 0 0 0 22 12.264C22 6.596 17.523 2 12 2Z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/toshitsai",
    path: "M6.94 8.5H3.56V19h3.38V8.5Zm.23-3.24c0-1.06-.8-1.76-1.92-1.76-1.1 0-1.9.7-1.9 1.76 0 1.03.78 1.76 1.86 1.76h.02c1.13 0 1.94-.73 1.94-1.76ZM20.5 12.58c0-3.16-1.69-4.62-3.95-4.62-1.82 0-2.63 1.01-3.09 1.72V8.5h-3.38c.04.78 0 10.5 0 10.5h3.38v-5.86c0-.31.02-.62.11-.84.25-.62.82-1.27 1.78-1.27 1.26 0 1.76.96 1.76 2.37V19h3.39v-6.42Z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/toshit.codespace/",
    path: "M7.25 2h9.5A5.25 5.25 0 0 1 22 7.25v9.5A5.25 5.25 0 0 1 16.75 22h-9.5A5.25 5.25 0 0 1 2 16.75v-9.5A5.25 5.25 0 0 1 7.25 2Zm0 1.75a3.5 3.5 0 0 0-3.5 3.5v9.5a3.5 3.5 0 0 0 3.5 3.5h9.5a3.5 3.5 0 0 0 3.5-3.5v-9.5a3.5 3.5 0 0 0-3.5-3.5h-9.5Zm9.94 1.31a1.06 1.06 0 1 1 0 2.12 1.06 1.06 0 0 1 0-2.12ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 0 0 12 8.75Z",
  },
];

export const projectCards: ProjectCard[] = [
  {
    title: "CourseForge AI",
    summary:
      "An AI-powered learning platform project presented with a live demo preview and direct access to the deployed website.",
    technologies: "Next.js, React, Tailwind CSS, Vercel",
    role: "Full Stack Developer & AI Integration",
    tone: "Live Project",
    href: "https://courseforge-ai-pied.vercel.app/",
    linkLabel: "Open Live Site",
    videoSrc: "/videos/courseforge-demo.mp4",
    pageHref: "/projects",
  },
  {
    title: "HireScope AI",
    summary:
      "A resume and portfolio analyzer that scores job readiness, highlights resume gaps, and gives practical improvement tips.",
    technologies: "React, Vite, Tailwind CSS, PDF.js, Vercel",
    role: "Full Stack Developer & AI Integration",
    tone: "AI Career Tool",
    href: "https://job-gem-grader.vercel.app",
    linkLabel: "Open Live Site",
    videoSrc: "/videos/hirescope-ai.mp4",
    pageHref: "/projects",
  },
  {
    title: "Idea Launch AI",
    summary:
      "Turning an idea into a successful startup starts with validation. This AI-powered tool helps entrepreneurs, students, and innovators evaluate their startup ideas in seconds.",
    technologies: "AI Tools, Web Development, Product Design",
    role: "Full Stack Developer & AI Integration",
    tone: "AI Launch Tool",
    href: "https://ai-startup-idea-validator-teal.vercel.app/",
    linkLabel: "Open Project",
    videoSrc: "/videos/idea-launch-ai.mp4",
    pageHref: "/projects",
  },
];

export const resumeInfo = {
  downloadHref: "/resume/Toshit-Sai-Galam-Resume.docx",
  viewHref: "/resume/Toshit-Sai-Galam-Resume.pdf",
  updatedLabel: "May 2026",
};
