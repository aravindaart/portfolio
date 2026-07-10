"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Boot" },
  { id: "tcs", label: "TCS" },
  { id: "walmart", label: "Walmart" },
  { id: "uob", label: "UOB" },
  { id: "thesis", label: "Thesis" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Contact" },
];

export function ChapterNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className="no-print fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="space-y-4">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={`group flex items-center gap-2 font-mono text-xs transition-colors ${
                active === section.id ? "text-accent" : "text-dim hover:text-text"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  active === section.id
                    ? "scale-125 bg-accent"
                    : "bg-edge group-hover:bg-dim"
                }`}
              />
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
