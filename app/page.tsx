import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Brush,
  Code2,
  Download,
  Eye,
  FolderKanban,
  GitBranch,
  GraduationCap,
  LayoutTemplate,
  MonitorSmartphone,
  Sparkles,
  SquareCode,
  TerminalSquare,
  Wrench,
} from "lucide-react";

import { ContactSection } from "@/components/contact-section";
import { PageTransition } from "@/components/page-transition";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TransitionLink } from "@/components/transition-link";
import {
  educationItems,
  projectCards,
  resumeInfo,
  skillGroups,
  socialLinks,
} from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Toshit Sai Galam | Portfolio",
  description:
    "Portfolio of Toshit Sai Galam, a web development student building real-world projects with modern technologies.",
};

const skillIcons: Record<string, LucideIcon> = {
  HTML: Code2,
  CSS: LayoutTemplate,
  JavaScript: SquareCode,
  "Responsive Design": MonitorSmartphone,
  React: Sparkles,
  "Next.js": ArrowUpRight,
  "Tailwind CSS": Brush,
  Bootstrap: BookOpen,
  Git: TerminalSquare,
  GitHub: GitBranch,
  Antigravity: Sparkles,
  Codex: Wrench,
  "Problem Solving": BriefcaseBusiness,
  "Team Collaboration": BriefcaseBusiness,
  Adaptability: Sparkles,
  "Continuous Learning": GraduationCap,
};

const portfolioProject = {
  title: "Personal Portfolio Website",
  summary:
    "Designed and developed a responsive personal portfolio to showcase skills, projects, and contact details with a clean, recruiter-friendly layout.",
  technologies: "HTML, CSS, JavaScript",
  role: "Design & Development",
};

export default function HomePage() {
  return (
    <main className="portfolio-page">
      <PageTransition />

      <div className="portfolio-backdrop" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
        <header className="sticky top-0 z-30 -mx-6 border-b border-stone-200/70 bg-[#f8f4ee]/88 px-6 backdrop-blur sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between">
            <TransitionLink href="/" className="text-sm font-semibold tracking-[0.18em] text-stone-900 uppercase">
              Toshit Sai Galam
            </TransitionLink>
            <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
              <a className="transition hover:text-stone-950" href="#about">
                About
              </a>
              <a className="transition hover:text-stone-950" href="#education">
                Education
              </a>
              <a className="transition hover:text-stone-950" href="#skills">
                Skills
              </a>
              <TransitionLink href="/projects" className="transition hover:text-stone-950">
                Projects
              </TransitionLink>
              <a className="transition hover:text-stone-950" href="#resume">
                Resume
              </a>
              <a className="transition hover:text-stone-950" href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-5rem)] items-center py-16 sm:py-20">
          <ScrollReveal className="hero-shell" delay={60} immediate>
            <p className="section-eyebrow">Web Development Student</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              Toshit Sai Galam
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-stone-600 sm:text-2xl">
              Building projects while learning modern technologies
            </p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-stone-600">
              I build thoughtful student projects, improve quickly through real-world work,
              and care about clear interfaces that feel polished on both mobile and desktop.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <TransitionLink className="primary-link" href="/projects">
                View Projects
              </TransitionLink>
              <a className="secondary-link" href={resumeInfo.viewHref} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </div>
          </ScrollReveal>
        </section>

        <section id="about" className="portfolio-section">
          <ScrollReveal className="content-panel" delay={80}>
            <p className="section-eyebrow">About</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Focused on learning through real product work
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-9 text-stone-700">
              I am a motivated student with a strong interest in web development and
              emerging technologies. I enjoy building real-world projects that help me
              improve my problem-solving and technical skills. My goal is to secure an
              internship or entry-level role where I can learn, grow, and contribute to
              meaningful software solutions.
            </p>
          </ScrollReveal>
        </section>

        <section id="education" className="portfolio-section">
          <ScrollReveal delay={100}>
            <div className="section-heading">
              <p className="section-eyebrow">Education</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Academic foundation with a practical mindset
              </h2>
            </div>
          </ScrollReveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {educationItems.map((item, index) => (
              <ScrollReveal key={item.title} delay={140 + index * 80}>
                <article className="content-panel education-card">
                  <div className="education-icon">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-stone-500">
                    {item.years}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-stone-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-8 text-stone-700">{item.school}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="skills" className="portfolio-section">
          <ScrollReveal delay={100}>
            <div className="section-heading">
              <p className="section-eyebrow">Skills</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Tools and technologies I work with while learning
              </h2>
            </div>
          </ScrollReveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {skillGroups.map((group, index) => (
              <ScrollReveal key={group.title} delay={140 + index * 80}>
                <article className="content-panel skill-card">
                  <h3 className="text-2xl font-semibold text-stone-950">{group.title}</h3>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {group.items.map((item) => {
                      const Icon = skillIcons[item] ?? Sparkles;

                      return (
                        <div key={item} className="skill-pill">
                          <span className="skill-pill-icon">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <ScrollReveal delay={100}>
            <div className="section-heading">
              <p className="section-eyebrow">Projects</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                A growing set of projects built with modern web tools
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <ScrollReveal delay={140}>
              <article className="content-panel project-highlight">
                <div className="project-badge">
                  <FolderKanban className="h-4 w-4" />
                  <span>Portfolio Project</span>
                </div>
                <h3 className="mt-5 text-3xl font-semibold text-stone-950">{portfolioProject.title}</h3>
                <p className="mt-4 text-base leading-8 text-stone-700">{portfolioProject.summary}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="detail-block">
                    <p className="text-sm uppercase tracking-[0.16em] text-stone-500">Technologies</p>
                    <p className="mt-2 text-base font-medium text-stone-900">{portfolioProject.technologies}</p>
                  </div>
                  <div className="detail-block">
                    <p className="text-sm uppercase tracking-[0.16em] text-stone-500">Role</p>
                    <p className="mt-2 text-base font-medium text-stone-900">{portfolioProject.role}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <TransitionLink className="primary-link" href="/projects">
                    Explore Project Page
                  </TransitionLink>
                </div>
              </article>
            </ScrollReveal>

            <div className="grid gap-5">
              {projectCards.map((project, index) => (
                <ScrollReveal key={project.title} delay={180 + index * 80}>
                  <article className="content-panel project-summary-card">
                    <div className="project-badge">
                      <Sparkles className="h-4 w-4" />
                      <span>{project.tone}</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-stone-950">{project.title}</h3>
                    <p className="mt-3 text-base leading-8 text-stone-700">{project.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        className="secondary-link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.linkLabel}
                      </a>
                      <TransitionLink className="secondary-link" href="/projects">
                        View Demo
                      </TransitionLink>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" className="portfolio-section pt-10">
          <ScrollReveal className="resume-footer-cta" delay={140}>
            <div className="resume-footer-copy">
              <p className="section-eyebrow">Resume</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Keep my resume handy
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-stone-600">
                A quick, clean way to download it or open it in a new tab after
                exploring the portfolio.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a className="primary-link" href={resumeInfo.downloadHref} download>
                <Download className="h-4 w-4" />
                Download Resume
              </a>
              <a className="secondary-link" href={resumeInfo.viewHref} target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4" />
                View Online
              </a>
            </div>
            <p className="mt-6 text-sm text-stone-500">Last updated: {resumeInfo.updatedLabel}</p>
          </ScrollReveal>
        </section>

        <ContactSection socialLinks={socialLinks} />
      </div>
    </main>
  );
}
