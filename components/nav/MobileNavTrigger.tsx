"use client";

import { COMMAND_PALETTE_OPEN_EVENT } from "@/lib/nav/events";

/**
 * ChapterNav (the dot-indicator sidebar) and ⌘K are both desktop-only —
 * the sidebar is hidden below `lg`, and there's no keyboard to trigger the
 * palette on mobile. This is the mobile substitute: a single on-theme
 * trigger (terminal prompt, not a hamburger icon) that opens the same
 * command palette, giving mobile visitors the same chapter-jump + action
 * list desktop gets via ⌘K.
 */
export function MobileNavTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_OPEN_EVENT))}
      aria-label="Open navigation"
      className="no-print fixed right-4 bottom-4 z-40 flex items-center gap-1.5 rounded-full border border-edge bg-surface/90 px-4 py-3 font-mono text-xs text-text backdrop-blur transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
    >
      <span aria-hidden className="text-accent">
        &gt;
      </span>
      nav
    </button>
  );
}
