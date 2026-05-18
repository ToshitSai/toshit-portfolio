export type SiteSectionType =
  | "navbar"
  | "hero"
  | "features"
  | "bento"
  | "stats"
  | "pricing"
  | "testimonials"
  | "faq"
  | "cta"
  | "footer";

export type SiteSection = {
  id: string;
  type: SiteSectionType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  items?: Array<{
    title: string;
    description: string;
    meta?: string;
  }>;
  cta?: {
    label: string;
    href: string;
  };
};

export type GeneratedSite = {
  name: string;
  slug: string;
  prompt: string;
  palette: {
    background: string;
    foreground: string;
    primary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  seo: {
    title: string;
    description: string;
  };
  sections: SiteSection[];
};

export type EditorDevice = "desktop" | "tablet" | "mobile";
