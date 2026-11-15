"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveInitialMode, type Mode } from "@/lib/mode-resolver";

const STORAGE_KEY = "portfolio-mode";

interface ModeContextValue {
  mode: Mode;
  setMode: (next: Mode) => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "overview",
  setMode: () => {},
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Server renders the overview; the effect resolves the visitor's real
  // preference after hydration to avoid SSR/localStorage mismatches.
  const [mode, setModeState] = useState<Mode>("overview");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("mode");
    setModeState(resolveInitialMode(param, localStorage.getItem(STORAGE_KEY)));
  }, []);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      // The three views are different documents, not scroll positions on the
      // same one — keeping the old scrollY after a swap can land the visitor
      // on blank space of a much shorter layout. Only the explicit switch
      // resets scroll; the initial resolution above must not, or it would
      // fight a deep link's anchor scroll on first load.
      setMode: (next: Mode) => {
        if (next === mode) return;
        localStorage.setItem(STORAGE_KEY, next);
        // behavior: "instant" — html has global scroll-behavior:smooth for
        // anchor links; an animated scroll racing the DOM swap gets clamped
        // when the page height shrinks mid-animation.
        window.scrollTo({ top: 0, behavior: "instant" });
        setModeState(next);
      },
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  return useContext(ModeContext);
}
