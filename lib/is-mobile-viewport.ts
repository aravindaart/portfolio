// Matches Tailwind's `sm` breakpoint — the same cutoff the rest of the
// site uses for mobile-only fixes (16px inputs, keyboard re-settle).
export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
}
