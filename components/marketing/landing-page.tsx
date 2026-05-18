"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Code2,
  GitPullRequest,
  Lock,
  Moon,
  Play,
  Shield,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { plans } from "@/config/site";

const features = [
  {
    title: "AI bug intelligence",
    description: "Find runtime defects, unsafe branches, race conditions, and fragile edge cases before review fatigue sets in.",
    icon: Bot,
  },
  {
    title: "Security review",
    description: "Detect injection paths, exposed secrets, auth mistakes, dependency risk, and risky data handling patterns.",
    icon: Shield,
  },
  {
    title: "Pull request copilot",
    description: "Import repositories, scan diffs, and generate precise GitHub-style comments your team can act on.",
    icon: GitPullRequest,
  },
  {
    title: "Quality reports",
    description: "Export executive-ready reports with severity, quality score, complexity, remediation, and test suggestions.",
    icon: Code2,
  },
];

const testimonials = [
  "CodeGuardian cut our review backlog by 42% without watering down standards.",
  "The security findings are direct, explainable, and easy to turn into tickets.",
  "It feels like pairing with a staff engineer who never gets tired.",
];

const faqs = [
  ["Does it support private repositories?", "Yes. GitHub OAuth and repository imports are designed for private and team repositories."],
  ["Can we use our own OpenAI key?", "Yes. Configure OPENAI_API_KEY on the backend and the scanner automatically uses it."],
  ["Is there a free plan?", "The Free plan includes 5 scans per day. Pro unlocks unlimited scans and PDF reports."],
  ["Do users need to choose a language?", "No. The scanner auto-detects the language from the file name and code patterns before running review."],
];

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] text-white">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-70" />
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-lg shadow-sky-500/20">
              <Shield className="h-4 w-4" />
            </span>
            CodeGuardian AI
          </Link>
          <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a href="#features">Features</a>
            <Link href="/pricing">Pricing</Link>
            <a href="#faq">FAQ</a>
            <Link href="/dashboard/scan">Dashboard</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/scan">Start Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl content-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-5 w-fit gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Production-grade AI code review
            </Badge>
            <h1 className="neon-text max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              AI-Powered Bug Detection & Code Review Platform
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Scan code, repositories, and pull requests with a security-aware AI reviewer that explains bugs, proposes fixes,
              generates tests, and turns engineering risk into clear action.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard/scan">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="demo"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="relative"
        >
          <Card className="glass neon-border overflow-hidden rounded-3xl p-0">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-xs text-slate-500">review.ts</span>
            </div>
            <div className="grid lg:grid-cols-[1fr_260px]">
              <pre className="min-h-[420px] overflow-hidden p-5 text-sm leading-7 text-slate-300">
                <code>{`async function approveInvoice(user, invoice) {
  if (user.role = "admin") {
    console.log(invoice.cardNumber)
    return await charge(invoice)
  }
}

// CodeGuardian flags assignment,
// sensitive logging, missing auth checks,
// and missing negative-path tests.`}</code>
              </pre>
              <div className="border-t border-white/10 bg-black/25 p-4 lg:border-l lg:border-t-0">
                {[
                  ["Critical", "Assignment in auth branch", "bg-red-500/15 text-red-300"],
                  ["High", "Sensitive payment data logged", "bg-amber-500/15 text-amber-300"],
                  ["Medium", "Sequential async path", "bg-sky-500/15 text-sky-300"],
                ].map(([severity, title, color]) => (
                  <div key={title} className="mb-3 rounded-xl border border-white/10 bg-white/[0.055] p-3">
                    <span className={`rounded-md px-2 py-1 text-xs ${color}`}>{severity}</span>
                    <p className="mt-3 text-sm font-medium">{title}</p>
                  </div>
                ))}
                <div className="mt-5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4">
                  <p className="text-sm font-medium text-emerald-300">Quality score: 84</p>
                  <p className="mt-1 text-xs text-muted-foreground">Fix ready with unit tests.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Badge variant="outline">Review suite</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Everything your review queue needs.</h2>
          </div>
          <ChevronDown className="hidden h-6 w-6 text-muted-foreground md:block" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="glass h-full rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-300/35">
                <feature.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((quote) => (
            <Card key={quote} className="glass rounded-2xl p-6">
              <p className="text-lg leading-8">&ldquo;{quote}&rdquo;</p>
              <p className="mt-5 text-sm text-muted-foreground">Verified engineering leader</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Pricing</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Start small. Scale into enterprise review.</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`rounded-2xl p-6 ${plan.featured ? "glass neon-border" : "glass"}`}>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-4 text-4xl font-semibold">${plan.price}</p>
              <p className="text-sm text-muted-foreground">per month</p>
              <Button className="mt-6 w-full" variant={plan.featured ? "default" : "outline"} asChild>
                <Link href="/dashboard/billing">{plan.cta}</Link>
              </Button>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight">Questions, answered.</h2>
        <div className="mt-10 space-y-3">
          {faqs.map(([question, answer]) => (
            <Card key={question} className="glass rounded-2xl p-5">
              <p className="font-medium">{question}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span className="flex items-center gap-2 text-foreground">
            <Lock className="h-4 w-4" />
            CodeGuardian AI
          </span>
          <span>Security-first AI review for modern teams.</span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            SOC2-ready architecture
          </span>
        </div>
      </footer>
    </main>
  );
}
