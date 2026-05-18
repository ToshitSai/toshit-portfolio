export type SuggestedProject = {
  title: string;
  summary: string;
  difficulty: string;
  impact: string;
};

export type AnalyzeResponse = {
  ats_score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missing_skills: string[];
  suggested_projects: SuggestedProject[];
  rewritten_bullets: string[];
  roast: string[];
};

export type JobMatchResponse = {
  match_percentage: number;
  missing_skills: string[];
  suggestions: string[];
};

export const analyzeResumeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ats_score: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    strengths: {
      type: "array",
      items: { type: "string" },
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
    },
    improvements: {
      type: "array",
      items: { type: "string" },
    },
    missing_skills: {
      type: "array",
      items: { type: "string" },
    },
    suggested_projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          difficulty: { type: "string" },
          impact: { type: "string" },
        },
        required: ["title", "summary", "difficulty", "impact"],
      },
    },
    rewritten_bullets: {
      type: "array",
      items: { type: "string" },
    },
    roast: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "ats_score",
    "strengths",
    "weaknesses",
    "improvements",
    "missing_skills",
    "suggested_projects",
    "rewritten_bullets",
    "roast",
  ],
} as const;

export const jobMatchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    match_percentage: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    missing_skills: {
      type: "array",
      items: { type: "string" },
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["match_percentage", "missing_skills", "suggestions"],
} as const;
