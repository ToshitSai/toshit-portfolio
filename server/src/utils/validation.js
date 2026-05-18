const supportedTasks = new Set(["explain", "convert", "debug", "optimize"]);

export function validateCodeRequest(body, mode) {
  if (!supportedTasks.has(mode)) {
    const error = new Error("Unsupported CodeSense task.");
    error.status = 404;
    throw error;
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const language = typeof body.language === "string" ? body.language : "auto";
  const targetLanguage = typeof body.targetLanguage === "string" ? body.targetLanguage : "";
  const beginnerMode = Boolean(body.beginnerMode);

  if (!code) {
    const error = new Error("Code is required.");
    error.status = 400;
    throw error;
  }

  if (code.length > 45000) {
    const error = new Error("Code is too large. Please keep requests under 45,000 characters.");
    error.status = 413;
    throw error;
  }

  if (mode === "convert" && !targetLanguage) {
    const error = new Error("Target language is required for conversion.");
    error.status = 400;
    throw error;
  }

  return {
    beginnerMode,
    code,
    language,
    targetLanguage
  };
}
