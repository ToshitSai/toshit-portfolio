import OpenAI from "openai";

import {
  analyzeResumeSchema,
  jobMatchSchema,
  type AnalyzeResponse,
  type JobMatchResponse,
} from "@/types/resume";

const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your environment variables.");
  }

  return new OpenAI({ apiKey });
}

export async function analyzeResume(resumeText: string): Promise<AnalyzeResponse> {
  const client = getClient();

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are an expert recruiter, ATS reviewer, resume writer, and career coach. Be honest, practical, concise, and return JSON only.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analyze this resume and return in JSON:
{
  "ats_score": number,
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "missing_skills": [],
  "suggested_projects": [],
  "rewritten_bullets": [],
  "roast": []
}

Rules:
- ATS score must be 0-100.
- Strengths, weaknesses, improvements, missing_skills, rewritten_bullets, and roast should each contain 3-6 items.
- suggested_projects should contain 3-5 portfolio-worthy ideas with title, summary, difficulty, and impact.
- Roast mode must be funny but non-offensive and still constructive.
- Focus on impact, clarity, metrics, keywords, structure, and marketability.

Resume:
${resumeText}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "resume_analysis",
        schema: analyzeResumeSchema,
        strict: true,
      },
    },
  });

  return parseStructuredOutput<AnalyzeResponse>(response.output_text);
}

export async function analyzeJobMatch(
  resumeText: string,
  jobDescription: string,
): Promise<JobMatchResponse> {
  const client = getClient();

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are an expert technical recruiter. Compare resumes to target job descriptions and return JSON only.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Compare this resume with this job description and return:
{
  "match_percentage": number,
  "missing_skills": [],
  "suggestions": []
}

Rules:
- match_percentage must be 0-100.
- missing_skills should list missing or weakly evidenced skills.
- suggestions should contain 3-5 concrete actions to improve alignment.

Resume:
${resumeText}

Job Description:
${jobDescription}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "job_match",
        schema: jobMatchSchema,
        strict: true,
      },
    },
  });

  return parseStructuredOutput<JobMatchResponse>(response.output_text);
}

function parseStructuredOutput<T>(outputText: string): T {
  try {
    return JSON.parse(outputText) as T;
  } catch (error) {
    console.error("Failed to parse OpenAI JSON output", outputText, error);
    throw new Error("The AI response could not be parsed into the expected format.");
  }
}
