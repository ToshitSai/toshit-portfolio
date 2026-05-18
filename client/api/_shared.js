const nvidiaModel = process.env.NVIDIA_MODEL || "mistralai/mistral-medium-3.5-128b";
const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1/chat/completions";

const systemPrompt = `You are CodeSense AI, a senior software engineer and patient code mentor.
Analyze only the code the user provides. Be precise, practical, and safe.
When returning code, include complete replacement snippets and preserve intent.
Use Markdown with concise headings and fenced code blocks when useful.`;

const taskInstructions = {
  explain: `Explain the code line-by-line or block-by-block.
Call out inputs, outputs, side effects, and hidden assumptions.`,
  convert: `Convert the code to the requested target language.
Return the converted code first, then briefly note important language differences.`,
  debug: `Detect bugs, edge cases, and failure modes.
Return a fixed version of the code and explain what changed.`,
  optimize: `Suggest a cleaner, faster, or more maintainable version.
Return the optimized code and explain the tradeoffs.`
};

function validate(body, mode) {
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const language = typeof body.language === "string" ? body.language : "auto";
  const targetLanguage = typeof body.targetLanguage === "string" ? body.targetLanguage : "";
  const beginnerMode = Boolean(body.beginnerMode);

  if (!code) {
    return { error: "Code is required.", status: 400 };
  }

  if (code.length > 45000) {
    return { error: "Code is too large. Please keep requests under 45,000 characters.", status: 413 };
  }

  if (mode === "convert" && !targetLanguage) {
    return { error: "Target language is required for conversion.", status: 400 };
  }

  return { code, language, targetLanguage, beginnerMode };
}

function buildPrompt(mode, payload) {
  const languageLine = payload.language === "auto" ? "Language: auto-detect it." : `Language: ${payload.language}.`;
  const beginnerLine = payload.beginnerMode
    ? "Explain beginner-friendly terms and avoid unexplained jargon."
    : "Keep explanations concise and engineering-focused.";
  const targetLine = mode === "convert" ? `Target language: ${payload.targetLanguage}.` : "";

  return `${languageLine}
${targetLine}
${beginnerLine}
Task: ${taskInstructions[mode]}

Code:
\`\`\`
${payload.code}
\`\`\``;
}

async function runNvidia(prompt) {
  const response = await fetch(nvidiaBaseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: nvidiaModel,
      reasoning_effort: "high",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1,
      stream: false
    })
  });

  const responseText = await response.text();
  const payload = responseText
    ? (() => {
        try {
          return JSON.parse(responseText);
        } catch {
          return null;
        }
      })()
    : null;

  if (!response.ok) {
    const error = new Error(payload?.error?.message || payload?.message || responseText || "NVIDIA API request failed.");
    error.status = response.status;
    error.type = payload?.error?.type || "nvidia_api_error";
    error.details = {
      contentType: response.headers.get("content-type"),
      payload,
      raw: payload ? undefined : responseText
    };
    throw error;
  }

  return payload?.choices?.[0]?.message?.content?.trim() || "";
}

export async function handleCodeTask(request, response, mode) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const validated = validate(request.body || {}, mode);

  if (validated.error) {
    response.status(validated.status).json({ error: validated.error });
    return;
  }

  if (!process.env.NVIDIA_API_KEY) {
    response.status(503).json({ error: "NVIDIA is not configured. Add NVIDIA_API_KEY in Vercel project settings." });
    return;
  }

  try {
    const prompt = buildPrompt(mode, validated);
    const output = await runNvidia(prompt);

    if (!output) {
      response.status(502).json({ error: "NVIDIA returned an empty response. Please try again." });
      return;
    }

    response.status(200).json({ output, provider: "nvidia" });
  } catch (error) {
    console.error(`CodeSense ${mode} failed:`, error);
    response.status(error?.status || 500).json({
      error: error?.message || "CodeSense AI could not process that request.",
      type: error?.type || "unknown_error",
      provider: "nvidia",
      details: error?.details || null
    });
  }
}
