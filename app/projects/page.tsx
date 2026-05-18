import { PageTransition } from "@/components/page-transition";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TransitionLink } from "@/components/transition-link";
import { projectCards } from "@/lib/portfolio-data";

const featuredProject = projectCards[0];

export default function ProjectsPage() {
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
              <TransitionLink href="/" className="transition hover:text-stone-950">
                Home
              </TransitionLink>
              <TransitionLink href="/projects" className="transition hover:text-stone-950">
                Projects
              </TransitionLink>
            </nav>
          </div>
        </header>

        <div className="flex flex-col gap-12 py-10 sm:py-12">
          <ScrollReveal className="hero-shell project-hero" delay={60} immediate>
            <p className="section-eyebrow">Projects</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              Real projects, clear demos, and a portfolio page that feels consistent.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-stone-600">
              This page keeps the same warm, clean portfolio language while giving each
              project room for a video preview, stack details, and a direct live link.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                className="primary-link"
                href={featuredProject.href}
                target="_blank"
                rel="noreferrer"
              >
                Open {featuredProject.title}
              </a>
              <TransitionLink className="secondary-link" href="/">
                Back to Home
              </TransitionLink>
            </div>
          </ScrollReveal>

          <section className="grid gap-5">
            {projectCards.map((project, index) => (
              <ScrollReveal key={project.title} delay={120 + index * 80}>
                <article className="content-panel">
                  <div className="grid gap-8 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
                    <div>
                      <div className="project-badge">
                        <span>{project.tone}</span>
                      </div>
                      <h2 className="mt-4 text-3xl font-semibold text-stone-950">
                        {project.title}
                      </h2>
                      <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">
                        {project.summary}
                      </p>
                      <div className="project-media project-media-large mt-8">
                        <video
                          className="h-full w-full object-cover"
                          controls
                          preload="metadata"
                        >
                          <source src={project.videoSrc} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="detail-block">
                        <p className="text-sm uppercase tracking-[0.16em] text-stone-500">
                          Technologies
                        </p>
                        <p className="mt-2 text-base font-medium text-stone-900">
                          {project.technologies}
                        </p>
                      </div>
                      <div className="detail-block">
                        <p className="text-sm uppercase tracking-[0.16em] text-stone-500">Role</p>
                        <p className="mt-2 text-base font-medium text-stone-900">
                          {project.role}
                        </p>
                      </div>
                      <div className="detail-block">
                        <p className="text-sm uppercase tracking-[0.16em] text-stone-500">
                          Live Link
                        </p>
                        <a
                          className="mt-3 secondary-link w-full"
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {project.linkLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
