# Toshit Sai Galam — Portfolio

## Overview

This is the personal portfolio of Toshit Sai Galam, a B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning. The site presents practical AI/web projects, technical skills, education context, resume access, and contact options for internship recruiters and collaborators.

## Live Website

https://toshit-portfolio.vercel.app/

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- shadcn/Radix UI primitives
- Vercel serverless API route
- FormSubmit contact delivery fallback
- Upstash Redis rate limiting support

## Features

- Editorial portfolio homepage with animated hero and project showcase
- Recruiter-focused project cards with verified live demo and repository links
- Case-study style project story viewer
- About, projects, and contact routes
- Resume PDF access from the site
- Contact form with validation, honeypot spam guard, rate limiting, success/error states, and mail fallback
- SEO metadata, Open Graph tags, structured data, and custom favicon/OG assets
- Reduced-motion handling for major animated components

## Featured Projects

### HireScope

Resume and portfolio analyzer that helps candidates review role fit, keywords, strengths, and improvement areas.

- Technologies: Next.js, Puppeteer, Claude API, Serper API
- GitHub: https://github.com/ToshitSai/job-gem-grader
- Live demo: https://job-gem-grader.vercel.app

### CourseForge

AI course generator that turns a topic into structured lessons, quizzes, and curated video resources.

- Technologies: React, Gemini API, YouTube API, Vercel
- GitHub: https://github.com/ToshitSai/courseforge-ai
- Live demo: https://courseforge-ai-pied.vercel.app/

### Greetly

Personalized greeting and message generator with tone controls, authentication, and saved message flows.

- Technologies: React, Flask, Groq API, JWT auth
- GitHub: https://github.com/ToshitSai/greetly
- Live demo: https://toshit-greetly.vercel.app

### Avengers Doomsday

Cinematic fan-concept landing page demonstrating creative frontend motion, 3D presentation, and scroll interaction.

- Technologies: Next.js, Three.js, GSAP, Lenis
- GitHub: https://github.com/ToshitSai/Avengers-DoomsDay-
- Live demo: https://avengers-doomsday-rose.vercel.app/

## Getting Started

```bash
npm install
npm run dev
```

The local development server runs on:

```text
http://localhost:8080
```

## Production Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Environment Variables

Create `.env.local` for local development when using the contact API:

```bash
CONTACT_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`CONTACT_EMAIL` is required for server-side contact delivery. Upstash variables are optional; the app falls back to in-memory rate limiting locally.

## Project Structure

```text
api/                         Vercel serverless API routes
public/                      Static assets, resume PDF, project images/videos
src/components/portfolio/    Portfolio UI sections and interactive components
src/components/ui/           Reusable shadcn/Radix UI primitives
src/data/                    Project and case-study content
src/pages/                   Route-level pages
src/server/                  Contact handler, validation, and rate limiting helpers
```

## Quality Notes

The project is designed to preserve a creative editorial identity while keeping recruiter-critical information easy to find: identity, education focus, projects, skills, resume, GitHub, LinkedIn, and contact.
