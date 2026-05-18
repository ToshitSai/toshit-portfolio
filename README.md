# CodeGuardian AI

AI-powered bug detection and code review SaaS built with Next.js 15/16 App Router, TypeScript, Tailwind CSS, shadcn-style primitives, Clerk, Prisma, PostgreSQL, Express, Stripe-ready billing, and OpenAI.

## Features

- Premium animated SaaS landing page with dark/light mode.
- Clerk authentication routes with Google, Facebook, and GitHub OAuth support when enabled in Clerk.
- Dashboard with analytics cards, scan history, insights, repositories, teams, billing, GitHub, and admin surfaces.
- Monaco-powered AI Bug Finder for pasted code, file uploads, ZIP repository imports, auto language detection, and local scan history.
- OpenAI review API for bugs, security vulnerabilities, performance issues, complexity, optimized code, and unit tests.
- Deterministic local review fallback when `OPENAI_API_KEY` is not set, so the app runs immediately.
- PostgreSQL Prisma schema for users, teams, projects, scans, reports, issues, notifications, usage, subscriptions, GitHub integrations, and audit logs.
- Secure Express API with Helmet, CORS, request validation, input sanitization, logging, and rate limiting.
- Docker, Docker Compose, CI workflow, seed data, and deployment notes.

## Quick Start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Express API runs on [http://localhost:4000/health](http://localhost:4000/health).

For a real AI review, set `OPENAI_API_KEY`. Without it, `/api/reviews` returns a useful local analysis so the product remains fully usable in development.

## Database

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
npm run prisma:migrate
npm run seed
```

## API

### `POST /api/reviews`

Next.js API route used by the app.

```json
{
  "language": "TypeScript",
  "fileName": "auth/login.ts",
  "code": "export function login() {}",
  "scanTypes": ["bugs", "security", "performance", "maintainability", "tests"]
}
```

Returns a scan report with `qualityScore`, `complexity`, `issues`, `optimizedCode`, and `unitTests`.

### `POST /api/v1/scans`

Express backend equivalent for external clients and deployment to Railway or Render.

## Deployment

### Vercel Frontend

1. Import this repository into Vercel.
2. Add the environment variables from `.env.example`.
3. Set the build command to `npm run build`.
4. Set the output framework to Next.js.

### Railway or Render Backend

1. Deploy the same repo.
2. Use `npm run server:build` as build command.
3. Use `npm run server:start` as start command.
4. Add `OPENAI_API_KEY`, `DATABASE_URL`, `CORS_ORIGIN`, and auth/billing variables.

## Docker

```bash
docker compose up --build
```

Services:
- `web`: Next.js app on port 3000
- `api`: Express API on port 4000
- `postgres`: PostgreSQL on port 5432

## Architecture

- `app/`: Next.js App Router pages and API routes.
- `components/`: reusable UI, dashboard shell, and CodeGuardian product components.
- `lib/`: OpenAI review orchestration, Prisma singleton, rate limiting, utilities.
- `prisma/`: schema and seed data.
- `server/`: standalone Express API for Railway/Render.
- `types/`: shared Zod schemas and TypeScript contracts.

## Production Checklist

- Configure Clerk Google, Facebook, and GitHub OAuth, then set `NEXT_PUBLIC_REQUIRE_AUTH=true`.
- Set a production `DATABASE_URL` and run migrations.
- Set `OPENAI_API_KEY`.
- Configure Stripe price IDs and webhook secret.
- Configure GitHub App credentials for repository and PR comment automation.
- Enable Vercel analytics/observability or your preferred monitoring stack.
