"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AuthScreen({
  mode,
  children,
}: {
  mode: "sign-in" | "sign-up";
  children: ReactNode;
}) {
  const router = useRouter();
  const title = mode === "sign-in" ? "Welcome back" : "Create your workspace";
  const copy =
    mode === "sign-in"
      ? "Continue with Google, Facebook, or secure email to review code faster."
      : "Create a secure workspace with social login or email in seconds.";

  function continueDemo(provider: string) {
    window.localStorage.setItem(
      "codeguardian.demoUser",
      JSON.stringify({ provider, signedInAt: new Date().toISOString() }),
    );
    toast.success(`Signed in with ${provider}`, { description: "Demo auth is active for this browser." });
    router.push("/dashboard/scan");
  }

  return (
    <main className="min-h-screen bg-[#05050a] px-4 py-8 text-white">
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-50" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,0.28),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.22),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_440px]">
        <section>
          <Link href="/" className="mb-12 inline-flex w-fit items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to CodeGuardian AI
          </Link>
          <div className="max-w-2xl">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
            </div>
            <h1 className="neon-text text-5xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{copy}</p>
            <div className="mt-8 grid max-w-lg gap-3 text-sm text-slate-300">
              {["OAuth-ready Google and Facebook login", "Protected dashboard routes", "Session handoff to scan history"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <div className="w-full max-w-md">{children}</div>
          ) : (
            <Card className="neon-border rounded-3xl border-white/10 bg-white/[0.06] p-5 text-white shadow-2xl backdrop-blur">
              <div className="mb-5">
                <p className="text-sm text-slate-400">Demo access</p>
                <h2 className="mt-1 text-2xl font-semibold">Sign in to continue</h2>
              </div>
              <div className="grid gap-3">
                <Button className="h-12 justify-start bg-white text-slate-950 hover:bg-slate-200" onClick={() => continueDemo("Google")}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white font-semibold text-blue-600">G</span>
                  Continue with Google
                </Button>
                <Button className="h-12 justify-start bg-[#1877f2] text-white hover:bg-[#166fe5]" onClick={() => continueDemo("Facebook")}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white font-bold text-[#1877f2]">f</span>
                  Continue with Facebook
                </Button>
                <Button variant="outline" className="h-12 justify-start border-white/10 bg-white/[0.03] text-white hover:bg-white/10" onClick={() => continueDemo("Email")}>
                  <Mail className="h-4 w-4" />
                  Continue with email
                </Button>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-400">
                Add Clerk production keys and enable Google/Facebook OAuth to switch these demo buttons to real provider auth automatically.
              </p>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

export const clerkAppearance = {
  elements: {
    rootBox: "mx-auto w-full",
    cardBox: "shadow-2xl border border-white/10 rounded-2xl bg-[#0b1020] text-white",
    socialButtonsBlockButton:
      "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition rounded-xl",
    formFieldInput: "bg-white/[0.04] border-white/10 text-white",
    formButtonPrimary: "bg-sky-500 text-white hover:bg-sky-400",
    footerActionLink: "text-sky-300 hover:text-sky-200",
  },
};
