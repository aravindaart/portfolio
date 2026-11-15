"use client";

import { useEffect, useState } from "react";

const pad = (n: number): string => String(n).padStart(2, "0");

const formatUptime = (seconds: number): string =>
  `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

/**
 * Fixed harness status bar: session identity, model, and a real uptime
 * counter since page load. Sits top-left; the mode toggle owns top-right.
 */
export function StatusBar() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setUptime((current) => current + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="no-print pointer-events-none fixed top-4 left-4 z-50 flex items-center gap-3 rounded-full border border-edge bg-surface/90 px-4 py-2 font-mono text-xs text-dim backdrop-blur">
      <span className="flex items-center gap-1.5 text-accent">
        <span aria-hidden className="live-dot h-2 w-2 rounded-full bg-accent" />
        live
      </span>
      <span className="hidden text-text/80 sm:inline">
        aravindhan@portfolio
      </span>
      <span className="hidden md:inline">model: gemini-3.1-flash-lite</span>
      <span>up {formatUptime(uptime)}</span>
    </div>
  );
}
