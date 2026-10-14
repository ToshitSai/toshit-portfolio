import { copyFile, access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";

const indexPath = new URL("../dist/index.html", import.meta.url);
const notFoundPath = new URL("../dist/404.html", import.meta.url);

await access(indexPath, constants.F_OK);

const indexHtml = await readFile(indexPath, "utf8");

const routeShells = [
  {
    path: "about",
    title: "About Toshit Sai Galam | AI/ML Engineer & Builder",
    description: "Learn about Toshit Sai Galam's AI/ML studies, full-stack engineering work, product-building practice, and creative technology approach.",
    canonical: "https://toshit-portfolio.vercel.app/about",
  },
  {
    path: "projects",
    title: "Projects & Experiments | Toshit Sai Galam",
    description: "Explore Toshit Sai Galam's AI applications, full-stack tools, and creative web projects built with modern technologies.",
    canonical: "https://toshit-portfolio.vercel.app/projects",
  },
  {
    path: "playground",
    title: "Playground & Certificates | Toshit Sai Galam",
    description: "Browse Toshit Sai Galam's AI, software engineering, and technology certificates in an interactive learning playground.",
    canonical: "https://toshit-portfolio.vercel.app/playground",
  },
];

const routeHtml = (route) => indexHtml
  .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
  .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`)
  .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${route.canonical}" />`)
  .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`)
  .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`)
  .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${route.canonical}" />`)
  .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`)
  .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);

for (const route of routeShells) {
  const routeDirectory = new URL(`../dist/${route.path}/`, import.meta.url);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(new URL("index.html", routeDirectory), routeHtml(route));
}

const notFoundHtml = indexHtml
  .replace(/<title>.*?<\/title>/, "<title>Page Not Found | Toshit Sai Galam</title>")
  .replace(/<meta name="robots" content=".*?" \/>/, "<meta name=\"robots\" content=\"noindex, nofollow\" />");
await writeFile(notFoundPath, notFoundHtml);
