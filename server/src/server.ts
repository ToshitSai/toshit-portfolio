import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";

import { runCodeReview } from "../../lib/ai-review";
import { scanRequestSchema } from "../../types/codeguardian";

const app = express();
const port = Number(process.env.API_PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use((req, _res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  next();
});
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "codeguardian-api", timestamp: new Date().toISOString() });
});

app.post("/api/v1/scans", async (req, res, next) => {
  try {
    const input = scanRequestSchema.parse(req.body);
    const report = await runCodeReview(input);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/reports/:id", (req, res) => {
  res.json({
    id: req.params.id,
    status: "available",
    message: "Connect PostgreSQL persistence to load durable reports in production.",
  });
});

app.post("/api/v1/github/pr-comments", (req, res) => {
  const schema = z.object({
    repository: z.string(),
    pullRequest: z.number(),
    findings: z.array(z.object({ line: z.number(), body: z.string() })),
  });
  const payload = schema.parse(req.body);
  res.json({
    queued: true,
    repository: payload.repository,
    pullRequest: payload.pullRequest,
    comments: payload.findings.length,
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Validation failed", details: error.flatten() });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`CodeGuardian API listening on http://localhost:${port}`);
  });
}

export { app };

function sanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, item]) => [key, sanitize(item)]),
    ) as T;
  }

  return value;
}
