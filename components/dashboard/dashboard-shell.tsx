"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Command, Menu, Moon, Search, Shield, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

const searchItems = [
  { href: "/dashboard/scan", label: "Run AI bug scan", keywords: "scan review bug finder fix code" },
  { href: "/dashboard/projects", label: "Repositories", keywords: "github repos projects import" },
  { href: "/dashboard/analytics", label: "Analytics", keywords: "metrics score vulnerabilities issues" },
  { href: "/dashboard/team", label: "Team workspace", keywords: "members roles clients" },
  { href: "/dashboard/github", label: "GitHub integration", keywords: "pull requests comments oauth" },
  { href: "/dashboard/settings", label: "Settings", keywords: "api keys theme policies" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const filtered = searchItems.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = filtered[0]?.href || "/dashboard/scan";
    setSearchOpen(false);
    setQuery("");
    router.push(target);
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white lg:grid lg:grid-cols-[248px_1fr]">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-50" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_42%_-8%,rgba(124,58,237,0.24),transparent_36%),radial-gradient(circle_at_84%_0%,rgba(14,165,233,0.18),transparent_30%)]" />
      <aside className="relative hidden border-r border-white/10 bg-black/25 p-4 backdrop-blur-2xl lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[82vw] max-w-xs border-r border-white/10 bg-[#070711] p-4" onClick={(event) => event.stopPropagation()}>
            <SidebarContent pathname={pathname} />
          </aside>
        </div>
      ) : null}

      <div className="relative min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/35 px-4 py-3 backdrop-blur-2xl md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Button className="lg:hidden" size="icon" variant="ghost" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="h-4 w-4" />
            </Button>
            <form onSubmit={submitSearch} className="relative block">
              <div className="flex w-[48vw] min-w-[170px] max-w-[430px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-400 shadow-lg shadow-black/20 transition focus-within:border-sky-400/50 sm:w-[340px] md:w-[430px] md:gap-3">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search scans, repositories, reports..."
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                />
                <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] sm:inline">Enter</kbd>
              </div>
              {searchOpen && query ? (
                <Card className="absolute left-0 top-12 z-40 w-full rounded-2xl border-white/10 bg-[#090913]/95 p-2 shadow-2xl">
                  {filtered.length ? (
                    filtered.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setSearchOpen(false);
                          setQuery("");
                          router.push(item.href);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/[0.07] hover:text-white"
                      >
                        <Search className="h-3.5 w-3.5 text-sky-300" />
                        {item.label}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-500">No matching workspace actions.</p>
                  )}
                </Card>
              ) : null}
            </form>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] sm:inline-flex">
              <Link href="/dashboard/scan">
                <Sparkles className="h-4 w-4" />
                Run analysis
              </Link>
            </Button>
            <Button size="icon" variant="ghost" aria-label="Toggle dark mode" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" aria-label="Command palette" onClick={() => setSearchOpen((value) => !value)}>
              <Command className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <UserButton />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-sky-200">
                CG
              </span>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <Link href="/" className="flex items-center gap-3 px-2 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
          <Shield className="h-4 w-4" />
        </span>
        <span className="font-semibold">CodeGuardian AI</span>
      </Link>
      <Card className="mt-4 rounded-2xl border-white/10 bg-white/[0.055] p-3">
        <p className="text-sm font-medium text-white">Guardian Workspace</p>
        <p className="mt-1 text-xs text-slate-500">Client reviews and AI fixes</p>
      </Card>
      <nav className="mt-6 grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.07] hover:text-white",
              pathname === item.href && "bg-gradient-to-r from-violet-500/18 to-sky-400/14 text-white ring-1 ring-sky-300/20",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-violet-500/12 to-sky-400/10 p-4">
        <p className="text-sm font-medium text-sky-200">Review engine</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">Auto-detect, analyze, and apply fixes from one focused workspace.</p>
      </div>
    </>
  );
}
