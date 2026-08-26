import { defineConfig, Plugin, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dotenv from "dotenv";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";
import { processContactSubmission } from "./src/server/contactHandler";

dotenv.config();

function securityHeadersPlugin(): Plugin {
  return {
    name: "security-headers-plugin",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Set Hardened HTTP Security Headers
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none'; base-uri 'self';"
        );
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
          "Permissions-Policy",
          "camera=(), microphone=(), geolocation=(), payment=(), display-capture=()"
        );
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        // Handle POST /api/contact
        if (req.url === "/api/contact" && req.method === "POST") {
          const clientIp =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            (req.headers["x-real-ip"] as string) ||
            req.socket?.remoteAddress ||
            "127.0.0.1";

          let bodyStr = "";
          req.on("data", (chunk: Buffer) => {
            bodyStr += chunk.toString();
            // Payload size protection: kill request if > 10KB
            if (bodyStr.length > 10 * 1024) {
              res.statusCode = 413;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "Payload too large." }));
              req.destroy();
            }
          });

          req.on("end", async () => {
            try {
              const body = bodyStr ? (JSON.parse(bodyStr) as Record<string, unknown>) : {};
              if (!body || typeof body !== "object" || Array.isArray(body)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, error: "Request body must be a JSON object." }));
                return;
              }
              const result = await processContactSubmission(body, clientIp);
              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result.data));
            } catch (err: unknown) {
              if (err instanceof SyntaxError) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, error: "Request body must be valid JSON." }));
                return;
              }
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "An unexpected error occurred." }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    securityHeadersPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
  },
}));
