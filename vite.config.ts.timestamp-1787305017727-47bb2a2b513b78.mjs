// vite.config.ts
import { defineConfig } from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import dotenv from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/dotenv/lib/main.js";
import { componentTagger } from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/lovable-tagger/dist/index.js";

// src/server/contactHandler.ts
import { Resend } from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/resend/dist/index.mjs";
import nodemailer from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/nodemailer/lib/nodemailer.js";

// src/server/security.ts
import { Ratelimit } from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/@upstash/ratelimit/dist/index.js";
import { Redis } from "file:///C:/Users/Toshit/Desktop/portfolio/node_modules/@upstash/redis/nodejs.mjs";
var ratelimit = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/portfolio"
    });
  } catch (err) {
    console.error("[Upstash Init Error]:", err instanceof Error ? err.message : err);
  }
}
var rateLimitMap = /* @__PURE__ */ new Map();
var WINDOW_MS = 15 * 60 * 1e3;
var MAX_REQUESTS_PER_WINDOW = 5;
async function isRateLimited(ip) {
  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(ip);
      return !success;
    } catch (err) {
      console.error(
        "[Upstash RateLimit Error]: Falling back to memory limiter.",
        err instanceof Error ? err.message : err
      );
    }
  }
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((ts) => now - ts < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}
function sanitizeHeaderValue(value) {
  return value.replace(/[\r\n]/g, " ").trim();
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function validateAndSanitizeContactInput(body) {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid form payload." };
  }
  const payload = body;
  const website = String(payload.website ?? "").trim();
  if (website.length > 0) {
    return {
      isValid: false,
      isSpamBot: true
    };
  }
  const rawName = String(payload.name ?? "").trim();
  const rawEmail = String(payload.email ?? "").trim();
  const rawSubject = String(payload.subject ?? "").trim();
  const rawMessage = String(payload.message ?? "").trim();
  if (!rawName) {
    return { isValid: false, error: "Name is required." };
  }
  if (!rawEmail) {
    return { isValid: false, error: "Email address is required." };
  }
  if (!rawMessage) {
    return { isValid: false, error: "Message cannot be empty." };
  }
  if (rawName.length > 100) {
    return { isValid: false, error: "Name cannot exceed 100 characters." };
  }
  if (rawEmail.length > 254) {
    return { isValid: false, error: "Email cannot exceed 254 characters." };
  }
  if (rawSubject.length > 200) {
    return { isValid: false, error: "Subject cannot exceed 200 characters." };
  }
  if (rawMessage.length > 5e3) {
    return { isValid: false, error: "Message cannot exceed 5000 characters." };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(rawEmail)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  const name = sanitizeHeaderValue(rawName);
  const email = sanitizeHeaderValue(rawEmail);
  const subject = sanitizeHeaderValue(rawSubject);
  const message = rawMessage;
  return {
    isValid: true,
    data: {
      name,
      email,
      subject,
      message
    }
  };
}

// src/server/contactHandler.ts
async function processContactSubmission(body, clientIp = "127.0.0.1") {
  if (await isRateLimited(clientIp)) {
    return {
      status: 429,
      data: {
        success: false,
        error: "Too many submission attempts. Please wait 15 minutes before sending another message."
      }
    };
  }
  const validation = validateAndSanitizeContactInput(body);
  if (validation.isSpamBot) {
    console.info(`[Spam Guard] Suppressed honeypot submission from IP: ${clientIp}`);
    return {
      status: 200,
      data: { success: true, message: "Message processed." }
    };
  }
  if (!validation.isValid || !validation.data) {
    return {
      status: 400,
      data: { success: false, error: validation.error || "Invalid form submission." }
    };
  }
  const { name, email, subject, message } = validation.data;
  const recipientEmail = process.env.CONTACT_EMAIL?.trim();
  const resendApiKey = process.env.RESEND_API_KEY;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
  if (!recipientEmail) {
    console.error("[Contact Configuration Error]: CONTACT_EMAIL is not configured.");
    return {
      status: 503,
      data: {
        success: false,
        error: "Contact delivery is not configured. Please try again later."
      }
    };
  }
  if (formspreeEndpoint && formspreeEndpoint.trim() !== "") {
    try {
      const response = await fetch(formspreeEndpoint.trim(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || `New Portfolio Message from ${name}`,
          message
        })
      });
      if (response.ok) {
        console.log("[Formspree Email Sent Successfully]");
        return {
          status: 200,
          data: { success: true, message: "Message sent successfully" }
        };
      }
    } catch (fsErr) {
      console.error("[Formspree Exception]:", fsErr instanceof Error ? fsErr.message : fsErr);
    }
  }
  if (web3FormsKey && web3FormsKey.trim() !== "") {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: web3FormsKey.trim(),
          name,
          email,
          subject: subject || `New Portfolio Message from ${name}`,
          message,
          from_name: "Portfolio Contact Form"
        })
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.success) {
        console.log("[Web3Forms Email Dispatched]:", data?.message);
        return {
          status: 200,
          data: {
            success: true,
            message: "Message sent successfully"
          }
        };
      } else {
        console.error("[Web3Forms Error]:", data?.message || "Unknown error");
      }
    } catch (w3Err) {
      console.error("[Web3Forms Exception]:", w3Err instanceof Error ? w3Err.message : w3Err);
    }
  }
  if (resendApiKey && resendApiKey.trim() !== "") {
    try {
      const resend = new Resend(resendApiKey.trim());
      const emailSubject = subject || `New Portfolio Message from ${name}`;
      const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: email,
        subject: emailSubject,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1B1B18; border-bottom: 3px solid #D9A62C; padding-bottom: 10px; margin-top: 0;">New Portfolio Contact Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(emailSubject)}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <h4 style="color: #1B1B18; margin-bottom: 8px;">Message:</h4>
            <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #D9A62C; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(message)}</div>
          </div>
        `
      });
      if (error) {
        console.error("[Resend Error]:", error.message);
        return {
          status: 500,
          data: {
            success: false,
            error: "Unable to send your message right now. Please try again later."
          }
        };
      }
      console.log("[Resend Email Sent Successfully]: ID", data?.id);
      return {
        status: 200,
        data: {
          success: true,
          message: "Message sent successfully"
        }
      };
    } catch (err) {
      console.error("[Resend Exception]:", err instanceof Error ? err.message : err);
      return {
        status: 500,
        data: {
          success: false,
          error: "An unexpected error occurred while processing your request."
        }
      };
    }
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: subject || `New Portfolio Message from ${name}`,
        text: `From: ${name} (${email})

Message:
${message}`
      });
      return {
        status: 200,
        data: {
          success: true,
          message: "Message sent successfully"
        }
      };
    } catch (smtpErr) {
      console.error("[SMTP Error]:", smtpErr instanceof Error ? smtpErr.message : smtpErr);
    }
  }
  return {
    status: 503,
    data: {
      success: false,
      error: "Contact delivery is not configured. Please try again later."
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\Toshit\\Desktop\\portfolio";
dotenv.config();
function securityHeadersPlugin() {
  return {
    name: "security-headers-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none'; base-uri 'self';"
        );
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
          "Permissions-Policy",
          "camera=(), microphone=(), geolocation=(), payment=(), display-capture=()"
        );
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        if (req.url === "/api/contact" && req.method === "POST") {
          const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.headers["x-real-ip"] || req.socket?.remoteAddress || "127.0.0.1";
          let bodyStr = "";
          req.on("data", (chunk) => {
            bodyStr += chunk.toString();
            if (bodyStr.length > 10 * 1024) {
              res.statusCode = 413;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "Payload too large." }));
              req.destroy();
            }
          });
          req.on("end", async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
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
            } catch (err) {
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
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    securityHeadersPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3NlcnZlci9jb250YWN0SGFuZGxlci50cyIsICJzcmMvc2VydmVyL3NlY3VyaXR5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVG9zaGl0XFxcXERlc2t0b3BcXFxccG9ydGZvbGlvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxUb3NoaXRcXFxcRGVza3RvcFxcXFxwb3J0Zm9saW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1Rvc2hpdC9EZXNrdG9wL3BvcnRmb2xpby92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgUGx1Z2luLCBWaXRlRGV2U2VydmVyIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB0eXBlIHsgSW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQgeyBwcm9jZXNzQ29udGFjdFN1Ym1pc3Npb24gfSBmcm9tIFwiLi9zcmMvc2VydmVyL2NvbnRhY3RIYW5kbGVyXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuZnVuY3Rpb24gc2VjdXJpdHlIZWFkZXJzUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJzZWN1cml0eS1oZWFkZXJzLXBsdWdpblwiLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IFZpdGVEZXZTZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcTogSW5jb21pbmdNZXNzYWdlLCByZXM6IFNlcnZlclJlc3BvbnNlLCBuZXh0OiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIC8vIFNldCBIYXJkZW5lZCBIVFRQIFNlY3VyaXR5IEhlYWRlcnNcbiAgICAgICAgcmVzLnNldEhlYWRlcihcbiAgICAgICAgICBcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XCIsXG4gICAgICAgICAgXCJkZWZhdWx0LXNyYyAnc2VsZic7IHNjcmlwdC1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyAndW5zYWZlLWV2YWwnOyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tOyBmb250LXNyYyAnc2VsZicgZGF0YTogaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbTsgaW1nLXNyYyAnc2VsZicgZGF0YTogaHR0cHM6IGJsb2I6OyBjb25uZWN0LXNyYyAnc2VsZicgaHR0cHM6OyBmcmFtZS1hbmNlc3RvcnMgJ25vbmUnOyBvYmplY3Qtc3JjICdub25lJzsgYmFzZS11cmkgJ3NlbGYnO1wiXG4gICAgICAgICk7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJYLUZyYW1lLU9wdGlvbnNcIiwgXCJERU5ZXCIpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiWC1Db250ZW50LVR5cGUtT3B0aW9uc1wiLCBcIm5vc25pZmZcIik7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJSZWZlcnJlci1Qb2xpY3lcIiwgXCJzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luXCIpO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFxuICAgICAgICAgIFwiUGVybWlzc2lvbnMtUG9saWN5XCIsXG4gICAgICAgICAgXCJjYW1lcmE9KCksIG1pY3JvcGhvbmU9KCksIGdlb2xvY2F0aW9uPSgpLCBwYXltZW50PSgpLCBkaXNwbGF5LWNhcHR1cmU9KClcIlxuICAgICAgICApO1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwiU3RyaWN0LVRyYW5zcG9ydC1TZWN1cml0eVwiLCBcIm1heC1hZ2U9MzE1MzYwMDA7IGluY2x1ZGVTdWJEb21haW5zOyBwcmVsb2FkXCIpO1xuXG4gICAgICAgIC8vIEhhbmRsZSBQT1NUIC9hcGkvY29udGFjdFxuICAgICAgICBpZiAocmVxLnVybCA9PT0gXCIvYXBpL2NvbnRhY3RcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgICAgIGNvbnN0IGNsaWVudElwID1cbiAgICAgICAgICAgIChyZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXSBhcyBzdHJpbmcpPy5zcGxpdChcIixcIilbMF0/LnRyaW0oKSB8fFxuICAgICAgICAgICAgKHJlcS5oZWFkZXJzW1wieC1yZWFsLWlwXCJdIGFzIHN0cmluZykgfHxcbiAgICAgICAgICAgIHJlcS5zb2NrZXQ/LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAgIFwiMTI3LjAuMC4xXCI7XG5cbiAgICAgICAgICBsZXQgYm9keVN0ciA9IFwiXCI7XG4gICAgICAgICAgcmVxLm9uKFwiZGF0YVwiLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xuICAgICAgICAgICAgYm9keVN0ciArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICAgICAgLy8gUGF5bG9hZCBzaXplIHByb3RlY3Rpb246IGtpbGwgcmVxdWVzdCBpZiA+IDEwS0JcbiAgICAgICAgICAgIGlmIChib2R5U3RyLmxlbmd0aCA+IDEwICogMTAyNCkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQxMztcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiUGF5bG9hZCB0b28gbGFyZ2UuXCIgfSkpO1xuICAgICAgICAgICAgICByZXEuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmVxLm9uKFwiZW5kXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBib2R5U3RyID8gKEpTT04ucGFyc2UoYm9keVN0cikgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIDoge307XG4gICAgICAgICAgICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGJvZHkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJSZXF1ZXN0IGJvZHkgbXVzdCBiZSBhIEpTT04gb2JqZWN0LlwiIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvY2Vzc0NvbnRhY3RTdWJtaXNzaW9uKGJvZHksIGNsaWVudElwKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSByZXN1bHQuc3RhdHVzO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXN1bHQuZGF0YSkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiUmVxdWVzdCBib2R5IG11c3QgYmUgdmFsaWQgSlNPTi5cIiB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLlwiIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHNlY3VyaXR5SGVhZGVyc1BsdWdpbigpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbikgYXMgUGx1Z2luW10sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVG9zaGl0XFxcXERlc2t0b3BcXFxccG9ydGZvbGlvXFxcXHNyY1xcXFxzZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFRvc2hpdFxcXFxEZXNrdG9wXFxcXHBvcnRmb2xpb1xcXFxzcmNcXFxcc2VydmVyXFxcXGNvbnRhY3RIYW5kbGVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Ub3NoaXQvRGVza3RvcC9wb3J0Zm9saW8vc3JjL3NlcnZlci9jb250YWN0SGFuZGxlci50c1wiO2ltcG9ydCB7IFJlc2VuZCB9IGZyb20gXCJyZXNlbmRcIjtcbmltcG9ydCBub2RlbWFpbGVyIGZyb20gXCJub2RlbWFpbGVyXCI7XG5pbXBvcnQge1xuICBpc1JhdGVMaW1pdGVkLFxuICB2YWxpZGF0ZUFuZFNhbml0aXplQ29udGFjdElucHV0LFxuICBlc2NhcGVIdG1sLFxufSBmcm9tIFwiLi9zZWN1cml0eVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhY3RSZXF1ZXN0Qm9keSB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGVtYWlsPzogc3RyaW5nO1xuICBzdWJqZWN0Pzogc3RyaW5nO1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICB3ZWJzaXRlPzogc3RyaW5nOyAvLyBIb25leXBvdCBmaWVsZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhY3RBcGlSZXNwb25zZSB7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIG1lc3NhZ2U/OiBzdHJpbmc7XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0NvbnRhY3RTdWJtaXNzaW9uKFxuICBib2R5OiBDb250YWN0UmVxdWVzdEJvZHksXG4gIGNsaWVudElwOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiXG4pOiBQcm9taXNlPHsgc3RhdHVzOiBudW1iZXI7IGRhdGE6IENvbnRhY3RBcGlSZXNwb25zZSB9PiB7XG4gIC8vIDEuIFJhdGUgTGltaXRpbmcgR3VhcmQgKDUgcmVxdWVzdHMgcGVyIElQIHBlciAxNSBtaW51dGVzIHZpYSBVcHN0YXNoIFJlZGlzIG9yIE1lbW9yeSBGYWxsYmFjaylcbiAgaWYgKGF3YWl0IGlzUmF0ZUxpbWl0ZWQoY2xpZW50SXApKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogNDI5LFxuICAgICAgZGF0YToge1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiVG9vIG1hbnkgc3VibWlzc2lvbiBhdHRlbXB0cy4gUGxlYXNlIHdhaXQgMTUgbWludXRlcyBiZWZvcmUgc2VuZGluZyBhbm90aGVyIG1lc3NhZ2UuXCIsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvLyAyLiBTZXJ2ZXItc2lkZSBWYWxpZGF0aW9uLCBTYW5pdGl6YXRpb24sIExlbmd0aCAmIEhvbmV5cG90IENoZWNrc1xuICBjb25zdCB2YWxpZGF0aW9uID0gdmFsaWRhdGVBbmRTYW5pdGl6ZUNvbnRhY3RJbnB1dChib2R5KTtcblxuICAvLyBIb25leXBvdCBQcm90ZWN0aW9uOiBTaWxlbnRseSBhY2NlcHQgYm90IHN1Ym1pc3Npb24gd2l0aG91dCBzZW5kaW5nIGVtYWlsXG4gIGlmICh2YWxpZGF0aW9uLmlzU3BhbUJvdCkge1xuICAgIGNvbnNvbGUuaW5mbyhgW1NwYW0gR3VhcmRdIFN1cHByZXNzZWQgaG9uZXlwb3Qgc3VibWlzc2lvbiBmcm9tIElQOiAke2NsaWVudElwfWApO1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IDIwMCxcbiAgICAgIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogXCJNZXNzYWdlIHByb2Nlc3NlZC5cIiB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoIXZhbGlkYXRpb24uaXNWYWxpZCB8fCAhdmFsaWRhdGlvbi5kYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogNDAwLFxuICAgICAgZGF0YTogeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IHZhbGlkYXRpb24uZXJyb3IgfHwgXCJJbnZhbGlkIGZvcm0gc3VibWlzc2lvbi5cIiB9LFxuICAgIH07XG4gIH1cblxuICBjb25zdCB7IG5hbWUsIGVtYWlsLCBzdWJqZWN0LCBtZXNzYWdlIH0gPSB2YWxpZGF0aW9uLmRhdGE7XG4gIGNvbnN0IHJlY2lwaWVudEVtYWlsID0gcHJvY2Vzcy5lbnYuQ09OVEFDVF9FTUFJTD8udHJpbSgpO1xuICBjb25zdCByZXNlbmRBcGlLZXkgPSBwcm9jZXNzLmVudi5SRVNFTkRfQVBJX0tFWTtcbiAgY29uc3Qgd2ViM0Zvcm1zS2V5ID0gcHJvY2Vzcy5lbnYuV0VCM0ZPUk1TX0FDQ0VTU19LRVk7XG4gIGNvbnN0IGZvcm1zcHJlZUVuZHBvaW50ID0gcHJvY2Vzcy5lbnYuRk9STVNQUkVFX0VORFBPSU5UO1xuXG4gIGlmICghcmVjaXBpZW50RW1haWwpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiW0NvbnRhY3QgQ29uZmlndXJhdGlvbiBFcnJvcl06IENPTlRBQ1RfRU1BSUwgaXMgbm90IGNvbmZpZ3VyZWQuXCIpO1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IDUwMyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkNvbnRhY3QgZGVsaXZlcnkgaXMgbm90IGNvbmZpZ3VyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCIsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvLyAzLiBGb3Jtc3ByZWUgRGVsaXZlcnkgT3B0aW9uXG4gIGlmIChmb3Jtc3ByZWVFbmRwb2ludCAmJiBmb3Jtc3ByZWVFbmRwb2ludC50cmltKCkgIT09IFwiXCIpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmb3Jtc3ByZWVFbmRwb2ludC50cmltKCksIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgIHN1YmplY3Q6IHN1YmplY3QgfHwgYE5ldyBQb3J0Zm9saW8gTWVzc2FnZSBmcm9tICR7bmFtZX1gLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltGb3Jtc3ByZWUgRW1haWwgU2VudCBTdWNjZXNzZnVsbHldXCIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogXCJNZXNzYWdlIHNlbnQgc3VjY2Vzc2Z1bGx5XCIgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChmc0VycjogdW5rbm93bikge1xuICAgICAgY29uc29sZS5lcnJvcihcIltGb3Jtc3ByZWUgRXhjZXB0aW9uXTpcIiwgZnNFcnIgaW5zdGFuY2VvZiBFcnJvciA/IGZzRXJyLm1lc3NhZ2UgOiBmc0Vycik7XG4gICAgfVxuICB9XG5cbiAgLy8gNC4gV2ViM0Zvcm1zIEVtYWlsIERlbGl2ZXJ5IE9wdGlvblxuICBpZiAod2ViM0Zvcm1zS2V5ICYmIHdlYjNGb3Jtc0tleS50cmltKCkgIT09IFwiXCIpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vYXBpLndlYjNmb3Jtcy5jb20vc3VibWl0XCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBhY2Nlc3Nfa2V5OiB3ZWIzRm9ybXNLZXkudHJpbSgpLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgZW1haWwsXG4gICAgICAgICAgc3ViamVjdDogc3ViamVjdCB8fCBgTmV3IFBvcnRmb2xpbyBNZXNzYWdlIGZyb20gJHtuYW1lfWAsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBmcm9tX25hbWU6IFwiUG9ydGZvbGlvIENvbnRhY3QgRm9ybVwiLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkYXRhID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKSkgYXMgeyBzdWNjZXNzPzogYm9vbGVhbjsgbWVzc2FnZT86IHN0cmluZyB9IHwgbnVsbDtcblxuICAgICAgaWYgKHJlc3BvbnNlLm9rICYmIGRhdGE/LnN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbV2ViM0Zvcm1zIEVtYWlsIERpc3BhdGNoZWRdOlwiLCBkYXRhPy5tZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJNZXNzYWdlIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbV2ViM0Zvcm1zIEVycm9yXTpcIiwgZGF0YT8ubWVzc2FnZSB8fCBcIlVua25vd24gZXJyb3JcIik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAodzNFcnI6IHVua25vd24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbV2ViM0Zvcm1zIEV4Y2VwdGlvbl06XCIsIHczRXJyIGluc3RhbmNlb2YgRXJyb3IgPyB3M0Vyci5tZXNzYWdlIDogdzNFcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIDUuIEVtYWlsIERlbGl2ZXJ5IHZpYSBSZXNlbmQgQVBJXG4gIGlmIChyZXNlbmRBcGlLZXkgJiYgcmVzZW5kQXBpS2V5LnRyaW0oKSAhPT0gXCJcIikge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNlbmQgPSBuZXcgUmVzZW5kKHJlc2VuZEFwaUtleS50cmltKCkpO1xuICAgICAgY29uc3QgZW1haWxTdWJqZWN0ID0gc3ViamVjdCB8fCBgTmV3IFBvcnRmb2xpbyBNZXNzYWdlIGZyb20gJHtuYW1lfWA7XG5cbiAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHJlc2VuZC5lbWFpbHMuc2VuZCh7XG4gICAgICAgIGZyb206IFwiUG9ydGZvbGlvIENvbnRhY3QgPG9uYm9hcmRpbmdAcmVzZW5kLmRldj5cIixcbiAgICAgICAgdG86IHJlY2lwaWVudEVtYWlsLFxuICAgICAgICByZXBseVRvOiBlbWFpbCxcbiAgICAgICAgc3ViamVjdDogZW1haWxTdWJqZWN0LFxuICAgICAgICBodG1sOiBgXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWY7IG1heC13aWR0aDogNjAwcHg7IG1hcmdpbjogMCBhdXRvOyBwYWRkaW5nOiAyNHB4OyBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwOyBib3JkZXItcmFkaXVzOiAxMnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1wiPlxuICAgICAgICAgICAgPGgyIHN0eWxlPVwiY29sb3I6ICMxQjFCMTg7IGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjRDlBNjJDOyBwYWRkaW5nLWJvdHRvbTogMTBweDsgbWFyZ2luLXRvcDogMDtcIj5OZXcgUG9ydGZvbGlvIENvbnRhY3QgSW5xdWlyeTwvaDI+XG4gICAgICAgICAgICA8dGFibGUgc3R5bGU9XCJ3aWR0aDogMTAwJTsgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsgbWFyZ2luLWJvdHRvbTogMTZweDtcIj5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDZweCAwOyBjb2xvcjogIzY0NzQ4YjsgZm9udC13ZWlnaHQ6IDYwMDsgd2lkdGg6IDEyMHB4O1wiPk5hbWU6PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA2cHggMDsgY29sb3I6ICMwZjE3MmE7IGZvbnQtd2VpZ2h0OiA1MDA7XCI+JHtlc2NhcGVIdG1sKG5hbWUpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA2cHggMDsgY29sb3I6ICM2NDc0OGI7IGZvbnQtd2VpZ2h0OiA2MDA7XCI+RW1haWw6PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA2cHggMDsgY29sb3I6ICMwZjE3MmE7IGZvbnQtd2VpZ2h0OiA1MDA7XCI+PGEgaHJlZj1cIm1haWx0bzoke2VzY2FwZUh0bWwoZW1haWwpfVwiIHN0eWxlPVwiY29sb3I6ICMyNTYzZWI7XCI+JHtlc2NhcGVIdG1sKGVtYWlsKX08L2E+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDZweCAwOyBjb2xvcjogIzY0NzQ4YjsgZm9udC13ZWlnaHQ6IDYwMDtcIj5TdWJqZWN0OjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogNnB4IDA7IGNvbG9yOiAjMGYxNzJhOyBmb250LXdlaWdodDogNTAwO1wiPiR7ZXNjYXBlSHRtbChlbWFpbFN1YmplY3QpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPGhyIHN0eWxlPVwiYm9yZGVyOiBub25lOyBib3JkZXItdG9wOiAxcHggc29saWQgI2UyZThmMDsgbWFyZ2luOiAxNnB4IDA7XCIgLz5cbiAgICAgICAgICAgIDxoNCBzdHlsZT1cImNvbG9yOiAjMUIxQjE4OyBtYXJnaW4tYm90dG9tOiA4cHg7XCI+TWVzc2FnZTo8L2g0PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmOGZhZmM7IHBhZGRpbmc6IDE2cHg7IGJvcmRlci1sZWZ0OiA0cHggc29saWQgI0Q5QTYyQzsgYm9yZGVyLXJhZGl1czogNnB4OyB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7IGZvbnQtc2l6ZTogMTRweDsgbGluZS1oZWlnaHQ6IDEuNjsgY29sb3I6ICMzMzQxNTU7XCI+JHtlc2NhcGVIdG1sKG1lc3NhZ2UpfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiW1Jlc2VuZCBFcnJvcl06XCIsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IFwiVW5hYmxlIHRvIHNlbmQgeW91ciBtZXNzYWdlIHJpZ2h0IG5vdy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIixcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcIltSZXNlbmQgRW1haWwgU2VudCBTdWNjZXNzZnVsbHldOiBJRFwiLCBkYXRhPy5pZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJNZXNzYWdlIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xuICAgICAgY29uc29sZS5lcnJvcihcIltSZXNlbmQgRXhjZXB0aW9uXTpcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGVycik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQgd2hpbGUgcHJvY2Vzc2luZyB5b3VyIHJlcXVlc3QuXCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIDYuIEZhbGxiYWNrOiBTTVRQIC8gTm9kZW1haWxlclxuICBpZiAocHJvY2Vzcy5lbnYuU01UUF9IT1NUICYmIHByb2Nlc3MuZW52LlNNVFBfVVNFUiAmJiBwcm9jZXNzLmVudi5TTVRQX1BBU1MpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gICAgICAgIGhvc3Q6IHByb2Nlc3MuZW52LlNNVFBfSE9TVCxcbiAgICAgICAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52LlNNVFBfUE9SVCkgfHwgNTg3LFxuICAgICAgICBzZWN1cmU6IEJvb2xlYW4ocHJvY2Vzcy5lbnYuU01UUF9TRUNVUkUpLFxuICAgICAgICBhdXRoOiB7XG4gICAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuU01UUF9VU0VSLFxuICAgICAgICAgIHBhc3M6IHByb2Nlc3MuZW52LlNNVFBfUEFTUyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbCh7XG4gICAgICAgIGZyb206IGBcIiR7bmFtZX1cIiA8JHtwcm9jZXNzLmVudi5TTVRQX1VTRVJ9PmAsXG4gICAgICAgIHRvOiByZWNpcGllbnRFbWFpbCxcbiAgICAgICAgcmVwbHlUbzogZW1haWwsXG4gICAgICAgIHN1YmplY3Q6IHN1YmplY3QgfHwgYE5ldyBQb3J0Zm9saW8gTWVzc2FnZSBmcm9tICR7bmFtZX1gLFxuICAgICAgICB0ZXh0OiBgRnJvbTogJHtuYW1lfSAoJHtlbWFpbH0pXFxuXFxuTWVzc2FnZTpcXG4ke21lc3NhZ2V9YCxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJNZXNzYWdlIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKHNtdHBFcnI6IHVua25vd24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbU01UUCBFcnJvcl06XCIsIHNtdHBFcnIgaW5zdGFuY2VvZiBFcnJvciA/IHNtdHBFcnIubWVzc2FnZSA6IHNtdHBFcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIDcuIE1pc3NpbmcgS2V5cyBXYXJuaW5nXG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiA1MDMsXG4gICAgZGF0YToge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJDb250YWN0IGRlbGl2ZXJ5IGlzIG5vdCBjb25maWd1cmVkLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLlwiLFxuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFRvc2hpdFxcXFxEZXNrdG9wXFxcXHBvcnRmb2xpb1xcXFxzcmNcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxUb3NoaXRcXFxcRGVza3RvcFxcXFxwb3J0Zm9saW9cXFxcc3JjXFxcXHNlcnZlclxcXFxzZWN1cml0eS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVG9zaGl0L0Rlc2t0b3AvcG9ydGZvbGlvL3NyYy9zZXJ2ZXIvc2VjdXJpdHkudHNcIjsvKipcbiAqIFByb2R1Y3Rpb24gU2VjdXJpdHkgVXRpbGl0aWVzIGZvciBDb250YWN0IEFQSSAmIFNlcnZlciBSb3V0ZXNcbiAqIER1cmFibGUgVXBzdGFzaCBSZWRpcyBSYXRlIExpbWl0aW5nLCBJbnB1dCBTYW5pdGl6YXRpb24sIEFudGktU3BhbSBHdWFyZHMsICYgSGVhZGVyIEluamVjdGlvbiBQcmV2ZW50aW9uLlxuICovXG5cbmltcG9ydCB7IFJhdGVsaW1pdCB9IGZyb20gXCJAdXBzdGFzaC9yYXRlbGltaXRcIjtcbmltcG9ydCB7IFJlZGlzIH0gZnJvbSBcIkB1cHN0YXNoL3JlZGlzXCI7XG5cbi8vIEluaXRpYWxpemUgVXBzdGFzaCBSZWRpcyBkdXJhYmxlIHJhdGUgbGltaXRlciBpZiBjcmVkZW50aWFscyBleGlzdFxubGV0IHJhdGVsaW1pdDogUmF0ZWxpbWl0IHwgbnVsbCA9IG51bGw7XG5cbmlmIChwcm9jZXNzLmVudi5VUFNUQVNIX1JFRElTX1JFU1RfVVJMICYmIHByb2Nlc3MuZW52LlVQU1RBU0hfUkVESVNfUkVTVF9UT0tFTikge1xuICB0cnkge1xuICAgIGNvbnN0IHJlZGlzID0gbmV3IFJlZGlzKHtcbiAgICAgIHVybDogcHJvY2Vzcy5lbnYuVVBTVEFTSF9SRURJU19SRVNUX1VSTCxcbiAgICAgIHRva2VuOiBwcm9jZXNzLmVudi5VUFNUQVNIX1JFRElTX1JFU1RfVE9LRU4sXG4gICAgfSk7XG5cbiAgICByYXRlbGltaXQgPSBuZXcgUmF0ZWxpbWl0KHtcbiAgICAgIHJlZGlzLFxuICAgICAgbGltaXRlcjogUmF0ZWxpbWl0LnNsaWRpbmdXaW5kb3coNSwgXCIxNSBtXCIpLFxuICAgICAgYW5hbHl0aWNzOiB0cnVlLFxuICAgICAgcHJlZml4OiBcIkB1cHN0YXNoL3JhdGVsaW1pdC9wb3J0Zm9saW9cIixcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG4gICAgY29uc29sZS5lcnJvcihcIltVcHN0YXNoIEluaXQgRXJyb3JdOlwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogZXJyKTtcbiAgfVxufVxuXG4vLyBJbi1tZW1vcnkgZmFsbGJhY2sgcmF0ZSBsaW1pdGVyIGZvciBsb2NhbCBkZXYgLyB1bmNvbmZpZ3VyZWQgZW52aXJvbm1lbnRzXG5jb25zdCByYXRlTGltaXRNYXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyW10+KCk7XG5jb25zdCBXSU5ET1dfTVMgPSAxNSAqIDYwICogMTAwMDsgLy8gMTUgbWludXRlc1xuY29uc3QgTUFYX1JFUVVFU1RTX1BFUl9XSU5ET1cgPSA1O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGFuIElQIGFkZHJlc3MgaXMgcmF0ZS1saW1pdGVkICg1IHJlcXVlc3RzIHBlciAxNSBtaW5zKS5cbiAqIFVzZXMgVXBzdGFzaCBSZWRpcyBpZiBjb25maWd1cmVkLCBvdGhlcndpc2UgZmFsbHMgYmFjayB0byBzbGlkaW5nLXdpbmRvdyBtZW1vcnkgc3RvcmUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc1JhdGVMaW1pdGVkKGlwOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgaWYgKHJhdGVsaW1pdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHN1Y2Nlc3MgfSA9IGF3YWl0IHJhdGVsaW1pdC5saW1pdChpcCk7XG4gICAgICByZXR1cm4gIXN1Y2Nlc3M7XG4gICAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIltVcHN0YXNoIFJhdGVMaW1pdCBFcnJvcl06IEZhbGxpbmcgYmFjayB0byBtZW1vcnkgbGltaXRlci5cIixcbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IGVyclxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBGYWxsYmFjayBpbi1tZW1vcnkgcmF0ZSBsaW1pdGVyXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gIGNvbnN0IHRpbWVzdGFtcHMgPSAocmF0ZUxpbWl0TWFwLmdldChpcCkgfHwgW10pLmZpbHRlcigodHMpID0+IG5vdyAtIHRzIDwgV0lORE9XX01TKTtcblxuICBpZiAodGltZXN0YW1wcy5sZW5ndGggPj0gTUFYX1JFUVVFU1RTX1BFUl9XSU5ET1cpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRpbWVzdGFtcHMucHVzaChub3cpO1xuICByYXRlTGltaXRNYXAuc2V0KGlwLCB0aW1lc3RhbXBzKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBpbnB1dCB0byBwcmV2ZW50IFNNVFAgSGVhZGVyIEluamVjdGlvbiAoc3RyaXBzIFxcciBhbmQgXFxuIGZyb20gc2luZ2xlLWxpbmUgZmllbGRzKVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVIZWFkZXJWYWx1ZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL1tcXHJcXG5dL2csIFwiIFwiKS50cmltKCk7XG59XG5cbi8qKlxuICogRXNjYXBlcyBIVE1MIGNoYXJhY3RlcnMgdG8gcHJldmVudCBYU1MgaW4gSFRNTCBlbWFpbCB0ZW1wbGF0ZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHRcbiAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG59XG5cbi8qKlxuICogU3RyaWN0IElucHV0IFZhbGlkYXRpb24gYW5kIExlbmd0aCBDb25zdHJhaW50c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRlZENvbnRhY3REYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBzdWJqZWN0OiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQW5kU2FuaXRpemVDb250YWN0SW5wdXQoXG4gIGJvZHk6IHVua25vd25cbik6IHtcbiAgaXNWYWxpZDogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIGlzU3BhbUJvdD86IGJvb2xlYW47XG4gIGRhdGE/OiBWYWxpZGF0ZWRDb250YWN0RGF0YTtcbn0ge1xuICBpZiAoIWJvZHkgfHwgdHlwZW9mIGJvZHkgIT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6IFwiSW52YWxpZCBmb3JtIHBheWxvYWQuXCIgfTtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSBib2R5IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXG4gIC8vIDEuIEFudGktU3BhbSBIb25leXBvdCBDaGVja1xuICBjb25zdCB3ZWJzaXRlID0gU3RyaW5nKHBheWxvYWQud2Vic2l0ZSA/PyBcIlwiKS50cmltKCk7XG4gIGlmICh3ZWJzaXRlLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICBpc1NwYW1Cb3Q6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIC8vIDIuIEV4dHJhY3QgJiBTYW5pdGl6ZSBJbnB1dCBGaWVsZHNcbiAgY29uc3QgcmF3TmFtZSA9IFN0cmluZyhwYXlsb2FkLm5hbWUgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCByYXdFbWFpbCA9IFN0cmluZyhwYXlsb2FkLmVtYWlsID8/IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgcmF3U3ViamVjdCA9IFN0cmluZyhwYXlsb2FkLnN1YmplY3QgPz8gXCJcIikudHJpbSgpO1xuICBjb25zdCByYXdNZXNzYWdlID0gU3RyaW5nKHBheWxvYWQubWVzc2FnZSA/PyBcIlwiKS50cmltKCk7XG5cbiAgLy8gMy4gUmVxdWlyZWQgRmllbGQgVmFsaWRhdGlvblxuICBpZiAoIXJhd05hbWUpIHtcbiAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6IFwiTmFtZSBpcyByZXF1aXJlZC5cIiB9O1xuICB9XG4gIGlmICghcmF3RW1haWwpIHtcbiAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6IFwiRW1haWwgYWRkcmVzcyBpcyByZXF1aXJlZC5cIiB9O1xuICB9XG4gIGlmICghcmF3TWVzc2FnZSkge1xuICAgIHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcjogXCJNZXNzYWdlIGNhbm5vdCBiZSBlbXB0eS5cIiB9O1xuICB9XG5cbiAgLy8gNC4gTWF4aW11bSBMZW5ndGggRW5mb3JjZW1lbnRcbiAgaWYgKHJhd05hbWUubGVuZ3RoID4gMTAwKSB7XG4gICAgcmV0dXJuIHsgaXNWYWxpZDogZmFsc2UsIGVycm9yOiBcIk5hbWUgY2Fubm90IGV4Y2VlZCAxMDAgY2hhcmFjdGVycy5cIiB9O1xuICB9XG4gIGlmIChyYXdFbWFpbC5sZW5ndGggPiAyNTQpIHtcbiAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6IFwiRW1haWwgY2Fubm90IGV4Y2VlZCAyNTQgY2hhcmFjdGVycy5cIiB9O1xuICB9XG4gIGlmIChyYXdTdWJqZWN0Lmxlbmd0aCA+IDIwMCkge1xuICAgIHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcjogXCJTdWJqZWN0IGNhbm5vdCBleGNlZWQgMjAwIGNoYXJhY3RlcnMuXCIgfTtcbiAgfVxuICBpZiAocmF3TWVzc2FnZS5sZW5ndGggPiA1MDAwKSB7XG4gICAgcmV0dXJuIHsgaXNWYWxpZDogZmFsc2UsIGVycm9yOiBcIk1lc3NhZ2UgY2Fubm90IGV4Y2VlZCA1MDAwIGNoYXJhY3RlcnMuXCIgfTtcbiAgfVxuXG4gIC8vIDUuIFN0cmljdCBFbWFpbCBGb3JtYXQgUmVnZXggVmFsaWRhdGlvbiAoUkZDIDUzMjIgQ29tcGxpYW50IHN1YnNldClcbiAgY29uc3QgZW1haWxSZWdleCA9XG4gICAgL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyQvO1xuICBpZiAoIWVtYWlsUmVnZXgudGVzdChyYXdFbWFpbCkpIHtcbiAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy5cIiB9O1xuICB9XG5cbiAgLy8gNi4gSGVhZGVyIEluamVjdGlvbiBQcm90ZWN0aW9uXG4gIGNvbnN0IG5hbWUgPSBzYW5pdGl6ZUhlYWRlclZhbHVlKHJhd05hbWUpO1xuICBjb25zdCBlbWFpbCA9IHNhbml0aXplSGVhZGVyVmFsdWUocmF3RW1haWwpO1xuICBjb25zdCBzdWJqZWN0ID0gc2FuaXRpemVIZWFkZXJWYWx1ZShyYXdTdWJqZWN0KTtcbiAgY29uc3QgbWVzc2FnZSA9IHJhd01lc3NhZ2U7XG5cbiAgcmV0dXJuIHtcbiAgICBpc1ZhbGlkOiB0cnVlLFxuICAgIGRhdGE6IHtcbiAgICAgIG5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIHN1YmplY3QsXG4gICAgICBtZXNzYWdlLFxuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStSLFNBQVMsb0JBQTJDO0FBQ25WLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsdUJBQXVCOzs7QUNKMFMsU0FBUyxjQUFjO0FBQ2pXLE9BQU8sZ0JBQWdCOzs7QUNJdkIsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxhQUFhO0FBR3RCLElBQUksWUFBOEI7QUFFbEMsSUFBSSxRQUFRLElBQUksMEJBQTBCLFFBQVEsSUFBSSwwQkFBMEI7QUFDOUUsTUFBSTtBQUNGLFVBQU0sUUFBUSxJQUFJLE1BQU07QUFBQSxNQUN0QixLQUFLLFFBQVEsSUFBSTtBQUFBLE1BQ2pCLE9BQU8sUUFBUSxJQUFJO0FBQUEsSUFDckIsQ0FBQztBQUVELGdCQUFZLElBQUksVUFBVTtBQUFBLE1BQ3hCO0FBQUEsTUFDQSxTQUFTLFVBQVUsY0FBYyxHQUFHLE1BQU07QUFBQSxNQUMxQyxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDSCxTQUFTLEtBQWM7QUFDckIsWUFBUSxNQUFNLHlCQUF5QixlQUFlLFFBQVEsSUFBSSxVQUFVLEdBQUc7QUFBQSxFQUNqRjtBQUNGO0FBR0EsSUFBTSxlQUFlLG9CQUFJLElBQXNCO0FBQy9DLElBQU0sWUFBWSxLQUFLLEtBQUs7QUFDNUIsSUFBTSwwQkFBMEI7QUFNaEMsZUFBc0IsY0FBYyxJQUE4QjtBQUNoRSxNQUFJLFdBQVc7QUFDYixRQUFJO0FBQ0YsWUFBTSxFQUFFLFFBQVEsSUFBSSxNQUFNLFVBQVUsTUFBTSxFQUFFO0FBQzVDLGFBQU8sQ0FBQztBQUFBLElBQ1YsU0FBUyxLQUFjO0FBQ3JCLGNBQVE7QUFBQSxRQUNOO0FBQUEsUUFDQSxlQUFlLFFBQVEs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
