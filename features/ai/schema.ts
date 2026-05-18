import { z } from "zod";

export const generationPromptSchema = z.object({
  prompt: z.string().trim().min(10, "Describe the website you want in at least 10 characters.").max(1000),
  template: z.string().optional(),
  tone: z.enum(["minimal", "bold", "playful", "enterprise", "luxury"]).default("enterprise"),
});

export const generatedSiteSchema = z.object({
  name: z.string(),
  slug: z.string(),
  prompt: z.string(),
  palette: z.object({
    background: z.string(),
    foreground: z.string(),
    primary: z.string(),
    accent: z.string(),
  }),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["navbar", "hero", "features", "bento", "stats", "pricing", "testimonials", "faq", "cta", "footer"]),
      eyebrow: z.string().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      body: z.string().optional(),
      items: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            meta: z.string().optional(),
          }),
        )
        .optional(),
      cta: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    }),
  ),
});

export type GenerationPromptInput = z.infer<typeof generationPromptSchema>;
