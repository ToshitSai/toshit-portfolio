import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "HireScope AI / Job Gem Grader",
    description: "Advanced AI tool evaluating candidate resumes against job descriptions with real-time scraping, feedback analysis, and scoring metrics.",
    technologies: ["Next.js", "Puppeteer", "Claude API", "Serper API"],
    role: "AI Full-Stack Development",
    liveUrl: "https://job-gem-grader.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    featured: true,
  },
  {
    title: "Greetly",
    description: "Context-aware personalized greeting generator utilizing high-speed Groq API inference and Flask micro-service architecture.",
    technologies: ["React", "Vite", "Flask", "Groq API"],
    role: "Full-Stack & AI Integration",
    liveUrl: "https://toshit-greetly.vercel.app",
    githubUrl: "https://github.com/ToshitSai",
    featured: true,
  },
  {
    title: "CourseForge AI",
    description: "Generates structured 4-lesson courses on any topic instantly using AI, featuring automated quiz generation and curated YouTube videos.",
    technologies: ["React", "Vite", "Python", "AI Engine"],
    role: "AI Application Architecture",
    liveUrl: "https://courseforge-ai-pied.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/courseforge-ai",
    featured: true,
  },
  {
    title: "Avengers: Doomsday — Cinematic Experience",
    description: "Awwwards-style scroll-driven interactive web experience built with Next.js, React Three Fiber, GSAP, and Three.js.",
    technologies: ["Next.js", "React Three Fiber", "GSAP", "Lenis"],
    role: "Creative Technology & WebGL",
    liveUrl: "https://avengers-doomsday-rose.vercel.app/",
    githubUrl: "https://github.com/ToshitSai/Avengers-DoomsDay-",
    featured: true,
  },
];

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section-padding">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Projects</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Featured Work
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A collection of projects that showcase my skills and passion for building useful applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card-hover transition-all duration-300 flex flex-col ${
                project.featured ? "md:col-span-1" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="View GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="View Live Demo"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                <span className="inline-block text-xs font-medium text-accent mb-4">
                  {project.role}
                </span>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/ToshitSai" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View More on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
