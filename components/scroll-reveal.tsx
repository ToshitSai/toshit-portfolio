"use client";

import { useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -18px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
