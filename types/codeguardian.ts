import { z } from "zod";

export const supportedLanguages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust"] as const;

export const scanRequestSchema = z.object({
  language: z.enum(supportedLanguages),
  code: z.string().min(20, "Paste at least 20 characters of code.").max(120_000),
  fileName: z.string().min(1).max(160).optional(),
  scanTypes: z.array(z.enum(["bugs", "security", "performance", "maintainability", "tests"])).default([
    "bugs",
    "security",
    "performance",
    "maintainability",
    "tests",
  ]),
});

export type SupportedLanguage = (typeof supportedLanguages)[number];
export type ScanRequest = z.infer<typeof scanRequestSchema>;

export type ReviewIssue = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "bug" | "security" | "performance" | "maintainability" | "complexity" | "test";
  line: number;
  explanation: string;
  fix: string;
  snippet: string;
};

export type ScanReport = {
  id: string;
  fileName: string;
  language: SupportedLanguage;
  summary: string;
  qualityScore: number;
  complexity: "Low" | "Medium" | "High";
  issues: ReviewIssue[];
  optimizedCode: string;
  unitTests: string;
  createdAt: string;
  tokensUsed: number;
};
