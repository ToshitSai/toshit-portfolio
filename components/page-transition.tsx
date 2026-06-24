"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    const isPortfolioRoute = pathname === "/" || pathname.startsWith("/projects");

    if (isPortfolioRoute) {
      document.body.classList.add("portfolio-body");
    } else {
      document.body.classList.remove("portfolio-body");
    }

    document.body.classList.remove("route-leave");
    document.body.classList.add("route-enter");

    const timeout = window.setTimeout(() => {
      document.body.classList.remove("route-enter");
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}
