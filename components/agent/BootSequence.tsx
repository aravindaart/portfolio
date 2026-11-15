"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const STORAGE_KEY = "agent-boot-done";
const LINE_DELAY_MS = 220;
const EXIT_DELAY_MS = 500;

const BOOT_LINES = [
  "$ harness boot --profile aravindhan",
  "▸ loading content/profile.ts ........ ok",
  "▸ mounting 3d scene ................. ok",
  "▸ starting gemini session ........... ok",
  "▸ guardrails: grounded-answers ...... on",
  "✓ agent ready — rendering portfolio",
];

/**
 * Full-screen boot overlay on the first visit of a session. Types its lines
 * once, then fades; any click/keypress skips it. Reduced motion or a repeat
 * visit in the same tab session renders nothing at all.
 */
export function BootSequence() {
  const reduced = useReducedMotion();
  // null = undecided (SSR + first client render agree: render nothing yet)
  const [active, setActive] = useState<boolean | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Deferred a tick: sessionStorage is client-only and the lint rule
    // (set-state-in-effect) forbids a synchronous setState cascade here.
    const id = window.setTimeout(() => {
      let shouldBoot = true;
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) {
          shouldBoot = false;
        } else {
          sessionStorage.setItem(STORAGE_KEY, "1");
        }
      } catch {
        // Storage blocked (private mode): still boot once, just unremembered.
      }
      setActive(shouldBoot);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (visibleLines >= BOOT_LINES.length) {
      const exit = window.setTimeout(() => setLeaving(true), EXIT_DELAY_MS);
      return () => window.clearTimeout(exit);
    }
    const timer = window.setTimeout(
      () => setVisibleLines((count) => count + 1),
      LINE_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, visibleLines]);

  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => setActive(false), 400);
    return () => window.clearTimeout(done);
  }, [leaving]);

  if (!active || reduced) return null;

  return (
    <div
      role="presentation"
      onClick={() => setActive(false)}
      onKeyDown={() => setActive(false)}
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-bg transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md px-6 font-mono text-sm">
        {BOOT_LINES.slice(0, visibleLines).map((line) => (
          <p
            key={line}
            className={
              line.startsWith("✓")
                ? "text-accent"
                : line.startsWith("$")
                  ? "text-text"
                  : "text-dim"
            }
          >
            {line}
          </p>
        ))}
        <span className="caret" aria-hidden />
        <p className="mt-6 text-xs text-dim/60">click to skip</p>
      </div>
    </div>
  );
}
