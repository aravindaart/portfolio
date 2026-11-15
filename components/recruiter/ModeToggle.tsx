"use client";

import { useMode } from "@/lib/mode";

export function ModeToggle() {
  const { mode, toggle } = useMode();
  const recruiting = mode === "recruiter";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={recruiting}
      className="no-print fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-edge bg-surface/90 px-4 py-2 font-mono text-xs text-text backdrop-blur transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${recruiting ? "bg-accent" : "bg-dim"}`}
      />
      {recruiting ? "Agent Mode" : "Recruiter Mode"}
    </button>
  );
}
