import JSZip from "jszip";
import { NextResponse } from "next/server";

import { buildFallbackSite } from "@/features/ai/generator";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get("site") || "nebula-export";
  const site = buildFallbackSite({
    prompt: `Exported Nebula project ${siteSlug}`,
    tone: "enterprise",
  });
  const zip = new JSZip();

  zip.file(
    "package.json",
    JSON.stringify(
      {
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: { next: "latest", react: "latest", "react-dom": "latest" },
        devDependencies: { typescript: "latest", tailwindcss: "latest" },
      },
      null,
      2,
    ),
  );
  zip.file("app/page.tsx", `export default function Page(){return <main><h1>${site.name}</h1><p>${site.seo.description}</p></main>}`);
  zip.file("README.md", `# ${site.name}\n\nExported from Nebula AI.\n`);

  const body = await zip.generateAsync({ type: "arraybuffer" });
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${siteSlug}.zip"`,
    },
  });
}
