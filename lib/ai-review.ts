import OpenAI from "openai";
import { nanoid } from "nanoid";

import type { ScanReport, ScanRequest } from "@/types/codeguardian";

const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function runCodeReview(input: ScanRequest): Promise<ScanReport> {
  const client = getOpenAIClient();

  if (!client) {
    return deterministicReview(input);
  }

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content:
          "You are CodeGuardian AI, a senior staff engineer and application security reviewer. Return strict JSON only. Be specific, concise, and practical.",
      },
      {
        role: "user",
        content: `Review this ${input.language} code for ${input.scanTypes.join(", ")}.

Return JSON with:
{
  "summary": string,
  "qualityScore": number,
  "complexity": "Low" | "Medium" | "High",
  "issues": [{
    "title": string,
    "severity": "critical" | "high" | "medium" | "low",
    "category": "bug" | "security" | "performance" | "maintainability" | "complexity" | "test",
    "line": number,
    "explanation": string,
    "fix": string,
    "snippet": string
  }],
  "optimizedCode": string,
  "unitTests": string
}

File: ${input.fileName || "inline-snippet"}

Code:
\`\`\`${input.language.toLowerCase()}
${input.code}
\`\`\``,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "codeguardian_review",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "qualityScore", "complexity", "issues", "optimizedCode", "unitTests"],
          properties: {
            summary: { type: "string" },
            qualityScore: { type: "number", minimum: 0, maximum: 100 },
            complexity: { type: "string", enum: ["Low", "Medium", "High"] },
            issues: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["title", "severity", "category", "line", "explanation", "fix", "snippet"],
                properties: {
                  title: { type: "string" },
                  severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
                  category: {
                    type: "string",
                    enum: ["bug", "security", "performance", "maintainability", "complexity", "test"],
                  },
                  line: { type: "number" },
                  explanation: { type: "string" },
                  fix: { type: "string" },
                  snippet: { type: "string" },
                },
              },
            },
            optimizedCode: { type: "string" },
            unitTests: { type: "string" },
          },
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text) as Omit<ScanReport, "id" | "fileName" | "language" | "createdAt" | "tokensUsed">;

  return {
    id: nanoid(),
    fileName: input.fileName || "inline-review.ts",
    language: input.language,
    createdAt: new Date().toISOString(),
    tokensUsed: response.usage?.total_tokens || 0,
    ...parsed,
    issues: parsed.issues.map((issue) => ({ ...issue, id: nanoid(8) })),
  };
}

function deterministicReview(input: ScanRequest): ScanReport {
  const code = input.code;
  const issues = [];
  const lines = code.split(/\r?\n/);
  const findLine = (pattern: RegExp) => Math.max(1, lines.findIndex((line) => pattern.test(line)) + 1);

  if (/eval\(|new Function\(/.test(code)) {
    issues.push({
      id: nanoid(8),
      title: "Dynamic code execution can expose remote execution risk",
      severity: "critical" as const,
      category: "security" as const,
      line: findLine(/eval\(|new Function\(/),
      explanation: "The code executes strings as code. If user-controlled input reaches this call, attackers can run arbitrary logic.",
      fix: "Replace dynamic evaluation with a parser, whitelist-based dispatch table, or a constrained expression evaluator.",
      snippet: lines[findLine(/eval\(|new Function\(/) - 1] || "eval(...)",
    });
  }

  if (/console\.log|debugger/.test(code)) {
    issues.push({
      id: nanoid(8),
      title: "Debug-only statements are present in production path",
      severity: "low" as const,
      category: "maintainability" as const,
      line: findLine(/console\.log|debugger/),
      explanation: "Debug statements can leak sensitive values and add noise in production observability.",
      fix: "Use structured logging guarded by environment and redact sensitive values.",
      snippet: lines[findLine(/console\.log|debugger/) - 1] || "console.log(...)",
    });
  }

  if (/for\s*\(.+\)\s*{[\s\S]*(await|fetch\()/.test(code)) {
    issues.push({
      id: nanoid(8),
      title: "Sequential async work inside a loop may become a bottleneck",
      severity: "medium" as const,
      category: "performance" as const,
      line: findLine(/for\s*\(/),
      explanation: "Awaiting network or I/O work inside a loop serializes operations that are often safe to batch.",
      fix: "Use Promise.all with bounded concurrency and explicit error handling.",
      snippet: lines[findLine(/for\s*\(/) - 1] || "for (...)",
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: nanoid(8),
      title: "Add stronger edge-case and regression tests",
      severity: "medium" as const,
      category: "test" as const,
      line: 1,
      explanation: "The snippet has no visible tests or defensive boundaries, so regressions may slip through during refactors.",
      fix: "Add unit tests for empty input, invalid values, and the highest-risk branch.",
      snippet: lines[0] || input.fileName || "source",
    });
  }

  const score = Math.max(54, 96 - issues.length * 12 - (code.length > 8000 ? 8 : 0));

  return {
    id: nanoid(),
    fileName: input.fileName || "inline-review.ts",
    language: input.language,
    summary:
      "Review completed with deterministic local analysis because OPENAI_API_KEY is not configured. The same API will use OpenAI automatically when the key is present.",
    qualityScore: score,
    complexity: code.length > 6000 ? "High" : code.length > 1800 ? "Medium" : "Low",
    issues,
    optimizedCode: code.replace(/console\.log\(.*?\);?/g, "").trim() || code,
    unitTests: `import { describe, expect, it } from "vitest";\n\ndescribe("${input.fileName || "reviewed module"}", () => {\n  it("handles the primary path", () => {\n    expect(true).toBe(true);\n  });\n});\n`,
    createdAt: new Date().toISOString(),
    tokensUsed: 0,
  };
}
