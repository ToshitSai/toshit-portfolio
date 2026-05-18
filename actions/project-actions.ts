"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { runCodeReview } from "@/lib/ai-review";
import { scanRequestSchema } from "@/types/codeguardian";

export async function createScanAction(input: z.infer<typeof scanRequestSchema>) {
  const parsed = scanRequestSchema.parse(input);
  const report = await runCodeReview(parsed);
  revalidatePath("/dashboard");
  return report;
}

export async function createProjectAction(input: unknown) {
  return {
    projectId: "codeguardian-local-project",
    site: input,
  };
}

export async function publishProjectAction(projectId: string) {
  revalidatePath("/dashboard/projects");
  return {
    id: projectId,
    slug: "codeguardian-report",
    url: "/reports/codeguardian-report",
  };
}
