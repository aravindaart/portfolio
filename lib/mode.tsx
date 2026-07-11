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
  toggle: () => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "story",
  toggle: () => {},
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Server renders story mode; the effect resolves the visitor's real
  // preference after hydration to avoid SSR/localStorage mismatches.
  const [mode, setMode] = useState<Mode>("story");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("mode");
    setMode(resolveInitialMode(param, localStorage.getItem(STORAGE_KEY)));
  }, []);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      // Story and Recruiter Mode are different documents, not a scroll
      // position on the same one — keeping the old scrollY after a swap
      // can land the visitor on blank space or an unrelated section of
      // the new (much shorter) layout. Only the explicit toggle resets
      // scroll; the initial mode resolution below must not, or it would
      // fight a deep link's anchor scroll on first load.
      toggle: () => {
        const next: Mode = mode === "story" ? "recruiter" : "story";
        localStorage.setItem(STORAGE_KEY, next);
        // behavior: "instant" — html has global scroll-behavior:smooth for
        // anchor links, which this would otherwise inherit. An animated
        // scroll racing the DOM swap below (setMode unmounts the current
        // view and mounts the other) got interrupted/clamped when the swap
        // shrank the page height (story's long scroll -> recruiter's short
        // resume), so the animation never reached 0. Instant has no
        // animation for the swap to race against.
        window.scrollTo({ top: 0, behavior: "instant" });
        setMode(next);
      },
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  return useContext(ModeContext);
}
