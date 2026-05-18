import { Brain, Code2, Wand2 } from "lucide-react";
import { useMemo, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-typescript";
import { languages } from "../config/languages";

function detectLanguage(code) {
  const patterns = [
    [/^\s*def\s+\w+|import\s+\w+|print\(/m, "Python"],
    [/^\s*package\s+main|func\s+\w+\(/m, "Go"],
    [/public\s+class|System\.out\.println/m, "Java"],
    [/#include\s*<|std::/m, "C++"],
    [/using\s+System|Console\.WriteLine/m, "C#"],
    [/fn\s+\w+\(|let\s+mut|println!/m, "Rust"],
    [/<\?php|\$\w+\s*=/m, "PHP"],
    [/^\s*puts\s+|def\s+\w+\s*$/m, "Ruby"],
    [/func\s+\w+\(|let\s+\w+:\s*\w+|print\(/m, "Swift"],
    [/type\s+\w+\s*=|interface\s+\w+|:\s*(string|number|boolean)/m, "TypeScript"],
    [/function\s+\w+|const\s+\w+|=>|console\.log/m, "JavaScript"]
  ];

  return patterns.find(([pattern]) => pattern.test(code))?.[1] || "Unknown";
}

export default function CodeInputPanel({
  beginnerMode,
  code,
  language,
  onBeginnerModeChange,
  onCodeChange,
  onLanguageChange
}) {
  const highlightRef = useRef(null);
  const selectedLanguage = languages.find((item) => item.value === language) || languages[0];
  const detectedLanguage = useMemo(() => detectLanguage(code), [code]);
  const grammar = Prism.languages[selectedLanguage.prism] || Prism.languages.javascript;
  const highlightedCode = Prism.highlight(code, grammar, selectedLanguage.prism);

  function handleEditorScroll(event) {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  }

  return (
    <section className="flex min-h-[680px] flex-col rounded-[28px] border border-white/10 bg-white/[0.055] shadow-panel backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-violet-400/15 text-violet-200">
            <Code2 className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Code Input</h2>
            <p className="text-sm text-slate-400">Detected: {language === "auto" ? detectedLanguage : selectedLanguage.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-xl border border-white/10 bg-[#0a0d1b] px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-200 transition hover:bg-white/[0.08]">
            <input
              checked={beginnerMode}
              className="size-4 accent-cyan-300"
              type="checkbox"
              onChange={(event) => onBeginnerModeChange(event.target.checked)}
            />
            <Brain className="size-4 text-cyan-200" />
            Beginner
          </label>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-b-[28px]">
        <div className="pointer-events-none absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
          <Wand2 className="size-3.5" />
          AI ready
        </div>
        <pre
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden p-6 pr-24 font-mono text-sm leading-7 text-slate-100"
          ref={highlightRef}
        >
          <code dangerouslySetInnerHTML={{ __html: highlightedCode || " " }} />
        </pre>
        <textarea
          aria-label="Code editor"
          className="absolute inset-0 resize-none overflow-auto bg-transparent p-6 pr-24 font-mono text-sm leading-7 text-transparent caret-cyan-200 outline-none selection:bg-cyan-300/25"
          spellCheck="false"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          onScroll={handleEditorScroll}
        />
      </div>
    </section>
  );
}
