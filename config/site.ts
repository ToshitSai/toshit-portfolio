import {
  Activity,
  BarChart3,
  Bot,
  Brush,
  CreditCard,
  Globe2,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

export const siteConfig = {
  name: "CodeGuardian AI",
  description:
    "AI-powered bug detection, security review, and code quality intelligence for engineering teams.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supportEmail: "security@codeguardian.ai",
};

export const navItems = [
  { href: "/dashboard/scan", label: "AI Bug Finder", icon: Sparkles },
  { href: "/dashboard/projects", label: "Repositories", icon: Globe2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/github", label: "GitHub", icon: Shield },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const adminItems = [
  { label: "AI reviews", value: "2.4M tokens", icon: Bot },
  { label: "Scanned repos", value: "18,420", icon: Globe2 },
  { label: "Security events", value: "312 blocked", icon: Shield },
  { label: "Fixes suggested", value: "91,203", icon: Activity },
];

export const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 5,
    cta: "Start free",
    features: ["5 scans per day", "Single user workspace", "AI bug detection", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    credits: 999999,
    cta: "Upgrade to Pro",
    priceIdEnv: "STRIPE_PRO_PRICE_ID",
    featured: true,
    features: ["Unlimited scans", "GitHub pull request reviews", "PDF reports", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    credits: 12000,
    cta: "Talk to sales",
    priceIdEnv: "STRIPE_TEAM_PRICE_ID",
    features: ["Team workspaces", "RBAC", "Audit logs", "SAML-ready architecture", "Dedicated security review"],
  },
];

export const templates = [
  "AI SaaS",
  "Startup",
  "Agency",
  "Portfolio",
  "Ecommerce",
  "Blog",
  "Crypto",
  "Developer tools",
  "Mobile app",
  "Productivity app",
];

export const componentLibrary = [
  { type: "hero", label: "Hero", icon: Sparkles },
  { type: "features", label: "Features", icon: Sparkles },
  { type: "pricing", label: "Pricing", icon: CreditCard },
  { type: "testimonials", label: "Testimonials", icon: Users },
  { type: "faq", label: "FAQ", icon: Bot },
  { type: "cta", label: "CTA", icon: Brush },
];
