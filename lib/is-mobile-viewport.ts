// Matches Tailwind's `lg` breakpoint (ChapterNav/MobileNavTrigger's
// cutoff), not `sm` — this used to be 639px, which meant a touch tablet
// in the 640-1023px range (e.g. iPad portrait) got the desktop nav-input
// focus behavior (scroll-into-view auto-focus on scroll, no keyboard
// re-settle) while every visible nav element treated it as mobile. That
// let the terminal auto-focus while someone was just scrolling past on a
// touch device, popping the on-screen keyboard unexpectedly — the exact
// jank this function exists to prevent. Keeping every mobile-behavior
// check on one shared breakpoint avoids this class of bug recurring.
export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
}
