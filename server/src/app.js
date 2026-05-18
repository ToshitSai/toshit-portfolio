import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
        return;
      }

      callback(new Error("This origin is not allowed by CodeSense AI."));
    }
  })
);
app.use(express.json({ limit: "250kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "CodeSense AI API" });
});

app.use("/", aiRoutes);

app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error);
  res.status(error.status || 500).json({
    error: error.message || "CodeSense AI hit an unexpected error."
  });
});

export default app;
