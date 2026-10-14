import { useEffect } from "react";
import type React from "react";

export interface RouteMetadataProps {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
}

const SITE_ORIGIN = "https://toshit-portfolio.vercel.app";

const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const RouteMetadata: React.FC<RouteMetadataProps> = ({ title, description, canonicalPath, noindex = false }) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
    document.title = title;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, noindex ? "noindex, nofollow" : "index, follow");
  }, [canonicalPath, description, noindex, title]);

  return null;
};

export default RouteMetadata;
