"use client";

import { useMode } from "@/lib/mode";
import type { Mode } from "@/lib/mode-resolver";

const OPTIONS: { value: Mode; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "terminal", label: "Terminal" },
  { value: "recruiter", label: "Résumé" },
];

/**
 * Fixed segmented control to switch between the three views. Styled per
 * theme: frosted light chip on the overview, dark chip on the terminal.
 */
export function ViewSwitcher() {
  const { mode, setMode } = useMode();
  const dark = mode === "terminal" || mode === "recruiter";

  return (
    <nav
      aria-label="Site view"
      className={`no-print fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full border p-1 text-xs shadow-lg backdrop-blur-md ${
        dark
          ? "border-edge bg-surface/90 font-mono"
          : "border-hairline bg-card/80 shadow-sm"
      }`}
    >
      {OPTIONS.map((option) => {
        const active = option.value === mode;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setMode(option.value)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active
                ? dark
                  ? "bg-accent/15 text-accent"
                  : "bg-ink text-paper"
                : dark
                  ? "text-dim hover:text-text"
                  : "text-ink2 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}
