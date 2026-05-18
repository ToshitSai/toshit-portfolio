import { useEffect, useState } from "react";
import { codeSenseApi } from "./api/codesense";
import CodeInputPanel from "./components/CodeInputPanel";
import Navbar from "./components/Navbar";
import OutputPanel from "./components/OutputPanel";
import Toast from "./components/Toast";
import { sampleCode } from "./config/languages";
import { downloadText, getOutputFileName } from "./utils/file";

const taskOrder = ["explain", "convert", "debug", "optimize"];

export default function App() {
  const [activeTask, setActiveTask] = useState("explain");
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [code, setCode] = useState(sampleCode);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [outputs, setOutputs] = useState({});
  const [targetLanguage, setTargetLanguage] = useState("python");
  const [toast, setToast] = useState(null);

  const output = outputs[activeTask] || "";

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  async function handleRun() {
    if (!code.trim()) {
      showToast("Add code before asking CodeSense AI to help.", "error");
      return;
    }

    setIsLoading(true);
    setCopied(false);

    try {
      const payload = {
        code,
        language,
        beginnerMode,
        targetLanguage
      };
      const result = await codeSenseApi[activeTask](payload);
      setOutputs((current) => ({ ...current, [activeTask]: result.output }));
      showToast(`${taskOrder.indexOf(activeTask) + 1}/4 ${activeTask} complete.`);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    showToast("Output copied to clipboard.");
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (!output) return;
    downloadText(output, getOutputFileName(activeTask, targetLanguage));
    showToast("Output downloaded.");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060710] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(168,85,247,0.22),transparent_32%),linear-gradient(135deg,#060710_0%,#0a1024_50%,#080914_100%)]" />
      <div className="fixed left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <Navbar />

      <main className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">CodeSense Workspace</h2>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300">
            <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" />
            Workspace ready
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
          <CodeInputPanel
            beginnerMode={beginnerMode}
            code={code}
            language={language}
            onBeginnerModeChange={setBeginnerMode}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
          />
          <OutputPanel
            activeTask={activeTask}
            copied={copied}
            isLoading={isLoading}
            output={output}
            targetLanguage={targetLanguage}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onRun={handleRun}
            onTargetLanguageChange={setTargetLanguage}
            onTaskChange={setActiveTask}
          />
        </div>
      </main>

      <Toast toast={toast} />
    </div>
  );
}
