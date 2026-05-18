import { Github, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070812]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-glow">
            <Sparkles className="size-5 text-cyan-200" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">CodeSense AI</h1>
            <p className="text-xs text-slate-400">Explain, convert, debug, optimize</p>
          </div>
        </div>

        <a
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
          href="https://github.com/"
          rel="noreferrer"
          target="_blank"
        >
          <Github className="size-4" />
          GitHub
        </a>
      </nav>
    </header>
  );
}
