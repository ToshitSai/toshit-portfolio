"use client";

import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import {
  Download,
  FileCheck2,
  FileArchive,
  FileCode2,
  History,
  Loader2,
  MessageSquareText,
  PanelRightOpen,
  Play,
  ShieldCheck,
  Share2,
  Sparkles,
  Upload,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ScanReport, SupportedLanguage } from "@/types/codeguardian";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-[520px] place-items-center text-sm text-muted-foreground">Loading editor...</div>,
});

const HISTORY_KEY = "codeguardian.scanHistory.v1";

const languageMap: Record<SupportedLanguage, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  Go: "go",
  Rust: "rust",
};

export function ScanWorkbench() {
  const [fileName, setFileName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [report, setReport] = React.useState<ScanReport | null>(null);
  const [notes, setNotes] = React.useState("Review this code for bugs, vulnerabilities, performance problems, and missing tests.");
  const [history, setHistory] = React.useState<ScanReport[]>([]);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [autoFixAfterScan, setAutoFixAfterScan] = React.useState(false);
  const autoFixRequestedRef = React.useRef(false);
  const detectedLanguage = React.useMemo(() => detectLanguage({ fileName, code }), [fileName, code]);
  const canRun = code.trim().length >= 20 && !scanMutationIsBlocked(code);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored) as ScanReport[]);
    } catch {
      setHistory([]);
    }
  }, []);

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language: detectedLanguage,
          fileName: fileName || `inline.${extensionForLanguage(detectedLanguage)}`,
          code,
          scanTypes: ["bugs", "security", "performance", "maintainability", "tests"],
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Review failed");
      }

      return (await response.json()) as ScanReport;
    },
    onSuccess: (data) => {
      setReport(data);
      if (autoFixRequestedRef.current && data.optimizedCode.trim()) {
        setCode(data.optimizedCode);
        toast.success("Code corrected", { description: "The AI fix was applied to the editor." });
      }
      const nextHistory = [data, ...history.filter((item) => item.id !== data.id)].slice(0, 20);
      setHistory(nextHistory);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      toast.success("AI review completed", { description: `${data.issues.length} findings generated.` });
    },
    onError: (error) => toast.error("Review failed", { description: error.message }),
    onSettled: () => {
      autoFixRequestedRef.current = false;
      setAutoFixAfterScan(false);
    },
  });

  async function handleUpload(file: File) {
    if (file.name.endsWith(".zip")) {
      const zip = await JSZip.loadAsync(file);
      const firstCodeFile = Object.values(zip.files).find((entry) => /\.(ts|tsx|js|jsx|py|java|cpp|go|rs)$/.test(entry.name));
      if (!firstCodeFile) {
        toast.error("No supported source file found in ZIP.");
        return;
      }
      setFileName(firstCodeFile.name);
      const importedCode = await firstCodeFile.async("string");
      setCode(importedCode);
      setReport(null);
      toast.success("Repository ZIP imported", { description: firstCodeFile.name });
      return;
    }

    setFileName(file.name);
    setCode(await file.text());
    setReport(null);
    toast.success("File imported", { description: file.name });
  }

  function exportReport() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.id}-codeguardian-report.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Badge variant="outline" className="gap-2 border-sky-300/20 bg-sky-300/10 text-sky-200">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Bug Finder
          </Badge>
          <h1 className="neon-text mt-3 text-4xl font-semibold tracking-tight">Scan code like a senior reviewer.</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Paste code, upload files, or import a ZIP repository. CodeGuardian returns bug, security, performance,
            maintainability, test, and refactoring guidance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setHistoryOpen((value) => !value)}>
            <History className="h-4 w-4" />
            History
          </Button>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white hover:bg-white/[0.08]">
            <Upload className="h-4 w-4" />
            Upload file or ZIP
            <input
              className="sr-only"
              type="file"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.go,.rs,.zip"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </label>
          <Button
            onClick={() => {
              if (!canRun) {
                toast.error("Add code first", { description: "Paste or upload at least 20 characters of source code." });
                return;
              }
              scanMutation.mutate();
            }}
            disabled={scanMutation.isPending}
          >
            {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run Analysis
          </Button>
          <Button
            variant="outline"
            className="border-emerald-400/25 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15"
            onClick={() => {
              if (report?.optimizedCode?.trim()) {
                setCode(report.optimizedCode);
                toast.success("Code corrected", { description: "The latest AI fix was applied to the editor." });
                return;
              }
              if (!canRun) {
                toast.error("Add code first", { description: "Paste or upload code before auto-fixing." });
                return;
              }
              autoFixRequestedRef.current = true;
              setAutoFixAfterScan(true);
              scanMutation.mutate();
            }}
            disabled={scanMutation.isPending}
          >
            {scanMutation.isPending && autoFixAfterScan ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
            Auto Fix Code
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <Card className="neon-border overflow-hidden rounded-3xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-primary" />
              <input
                value={fileName}
                onChange={(event) => {
                  setFileName(event.target.value);
                  setReport(null);
                }}
                placeholder="optional/file/name.ts"
                className="w-56 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
                aria-label="File name"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Auto-detected: <span className="font-medium text-foreground">{detectedLanguage}</span>
            </div>
          </div>
          <MonacoEditor
            height="560px"
            language={languageMap[detectedLanguage]}
            theme="vs-dark"
            value={code}
            onChange={(value) => {
              setCode(value || "");
              setReport(null);
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "Geist Mono, monospace",
              padding: { top: 18, bottom: 18 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Card>

        <div className="grid content-start gap-4">
          {historyOpen ? (
            <HistoryPanel
              history={history}
              onSelect={(item) => {
                setReport(item);
                setFileName(item.fileName);
                setHistoryOpen(false);
              }}
              onClear={() => {
                setHistory([]);
                window.localStorage.removeItem(HISTORY_KEY);
              }}
            />
          ) : null}
          <Card className="rounded-3xl border-white/10 bg-white/[0.045] p-4">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">AI assistant context</h2>
            </div>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 resize-none" />
          </Card>
          <ResultsPanel report={report} loading={scanMutation.isPending} onExport={exportReport} />
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({
  history,
  onSelect,
  onClear,
}: {
  history: ScanReport[];
  onSelect: (report: ScanReport) => void;
  onClear: () => void;
}) {
  return (
    <Card className="rounded-xl border-border bg-card/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <History className="h-4 w-4 text-primary" />
          Previous work
        </h2>
        {history.length ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2">
        {history.length ? (
          history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="rounded-lg border border-border bg-secondary/35 p-3 text-left transition hover:bg-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-mono text-sm">{item.fileName}</span>
                <Badge variant={item.qualityScore > 85 ? "success" : "outline"}>{item.qualityScore}</Badge>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {item.language} / {new Date(item.createdAt).toLocaleString()}
              </p>
            </button>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Completed scans will appear here for quick client handoff and follow-up reviews.
          </p>
        )}
      </div>
    </Card>
  );
}

function detectLanguage({ fileName, code }: { fileName: string; code: string }): SupportedLanguage {
  const lowerName = fileName.toLowerCase();
  const source = code.trim();

  if (/\.(ts|tsx)$/.test(lowerName) || /\binterface\s+\w+|:\s*(string|number|boolean)\b|type\s+\w+\s*=/.test(source)) return "TypeScript";
  if (/\.(js|jsx|mjs|cjs)$/.test(lowerName) || /\b(const|let|var)\s+\w+\s*=|=>|module\.exports|require\(/.test(source)) return "JavaScript";
  if (/\.py$/.test(lowerName) || /\bdef\s+\w+\(|import\s+\w+|from\s+\w+\s+import|print\(/.test(source)) return "Python";
  if (/\.java$/.test(lowerName) || /\bpublic\s+class\b|System\.out\.println|private\s+\w+\s+\w+/.test(source)) return "Java";
  if (/\.(cpp|cc|cxx|hpp|h)$/.test(lowerName) || /#include\s*<|std::|cout\s*<</.test(source)) return "C++";
  if (/\.go$/.test(lowerName) || /\bpackage\s+main\b|func\s+\w+\(|fmt\.Print/.test(source)) return "Go";
  if (/\.rs$/.test(lowerName) || /\bfn\s+\w+\(|let\s+mut\b|println!\(/.test(source)) return "Rust";

  return "TypeScript";
}

function extensionForLanguage(language: SupportedLanguage) {
  return {
    JavaScript: "js",
    TypeScript: "ts",
    Python: "py",
    Java: "java",
    "C++": "cpp",
    Go: "go",
    Rust: "rs",
  }[language];
}

function scanMutationIsBlocked(code: string) {
  return code.trim().length > 120_000;
}

function ResultsPanel({
  report,
  loading,
  onExport,
}: {
  report: ScanReport | null;
  loading: boolean;
  onExport: () => void;
}) {
  if (loading) {
    return (
      <Card className="rounded-xl border-border bg-card/75 p-5">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Streaming AI review, tracing risky branches...
        </div>
        <div className="mt-5 space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="rounded-xl border-border bg-card/75 p-6">
        <PanelRightOpen className="h-5 w-5 text-primary" />
        <h2 className="mt-4 font-semibold">Review results appear here</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Run an analysis to generate findings, quality score, optimized code, unit tests, a shareable report, and exportable audit data.
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <FileArchive className="h-4 w-4" />
          ZIP imports scan the first supported source file.
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-border bg-card/75 p-0">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{report.fileName}</p>
            <h2 className="mt-1 text-2xl font-semibold">{report.qualityScore}/100 quality score</h2>
          </div>
          <Badge variant={report.qualityScore > 85 ? "outline" : "destructive"}>{report.complexity} complexity</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{report.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Share link created", { description: "/reports/demo" })}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      <Tabs defaultValue="issues" className="p-5">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="fix">Fix</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="issues" className="mt-4 space-y-3">
          {report.issues.map((issue) => (
            <details key={issue.id} className="rounded-lg border border-border bg-secondary/35 p-4" open={issue.severity === "critical"}>
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant={issue.severity === "critical" || issue.severity === "high" ? "destructive" : "outline"}>
                      {issue.severity}
                    </Badge>
                    <p className="mt-3 font-medium">{issue.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Line {issue.line} / {issue.category}</p>
                  </div>
                </div>
              </summary>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{issue.explanation}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs">{issue.snippet}</pre>
              <p className="mt-3 text-sm font-medium">Suggested fix</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{issue.fix}</p>
            </details>
          ))}
        </TabsContent>
        <TabsContent value="fix" className="mt-4">
          <pre className="max-h-[520px] overflow-auto rounded-lg bg-background p-4 font-mono text-xs leading-6 text-muted-foreground">
            {report.optimizedCode}
          </pre>
        </TabsContent>
        <TabsContent value="tests" className="mt-4">
          <pre className="max-h-[520px] overflow-auto rounded-lg bg-background p-4 font-mono text-xs leading-6 text-muted-foreground">
            {report.unitTests}
          </pre>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
