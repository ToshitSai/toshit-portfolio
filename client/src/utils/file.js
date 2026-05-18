import { targetLanguages } from "../config/languages";

export function getOutputFileName(activeTask, targetLanguage) {
  const language = targetLanguages.find((item) => item.value === targetLanguage);
  const extension = activeTask === "convert" && language?.extension ? language.extension : "md";
  return `codesense-${activeTask}-output.${extension}`;
}

export function downloadText(content, fileName) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
