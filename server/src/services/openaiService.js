import "dotenv/config";

const nvidiaModel = process.env.NVIDIA_MODEL || "mistralai/mistral-medium-3.5-128b";
const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1/chat/completions";

const systemPrompt = `You are CodeSense AI, a senior software engineer and patient code mentor.
Analyze only the code the user provides. Be precise, practical, and safe.
When returning code, include complete replacement snippets and preserve intent.
Use Markdown with concise headings and fenced code blocks when useful.`;

function taskPrompt(mode, payload) {
  const languageLine = payload.language === "auto" ? "Language: auto-detect it." : `Language: ${payload.language}.`;
  const beginnerLine = payload.beginnerMode
    ? "Explain beginner-friendly terms and avoid unexplained jargon."
    : "Keep explanations concise and engineering-focused.";

  const taskInstructions = {
    explain: `Explain the code line-by-line or block-by-block.
Call out inputs, outputs, side effects, and hidden assumptions.`,
    convert: `Convert the code to ${payload.targetLanguage}.
Return the converted code first, then briefly note important language differences.`,
    debug: `Detect bugs, edge cases, and failure modes.
Return a fixed version of the code and explain what changed.`,
    optimize: `Suggest a cleaner, faster, or more maintainable version.
Return the optimized code and explain the tradeoffs.`
  };

  return `${languageLine}
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

export async function runCodeTask(mode, payload) {
  if (!process.env.NVIDIA_API_KEY) {
    const error = new Error("NVIDIA is not configured. Add NVIDIA_API_KEY to the server environment.");
    error.status = 503;
    throw error;
  }

  const output = await runNvidia(taskPrompt(mode, payload));

  if (!output) {
    const error = new Error("NVIDIA returned an empty response. Please try again.");
    error.status = 502;
    throw error;
  }

  return output;
}
