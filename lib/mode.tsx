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
      toggle: () =>
        setMode((current) => {
          const next: Mode = current === "story" ? "recruiter" : "story";
          localStorage.setItem(STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode(): ModeContextValue {
  return useContext(ModeContext);
}
