"use client";

import { useEffect, useRef, useState } from "react";
import { executeCommand } from "@/lib/terminal/commands";
import { TerminalCaretInput } from "@/components/terminal/TerminalCaretInput";
import { profile } from "@/content/profile";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import { useChatOverlay } from "@/lib/chat-overlay";
import { useMode } from "@/lib/mode";

const PROMPT = "visitor@aravindaart:~$";

const BANNER = [
  " ███████╗ ██████╗  ███████╗",
  " ██╔════╝ ██╔══██╗ ██╔════╝",
  " █████╗   ██║  ██║ █████╗",
  " ██╔══╝   ██║  ██║ ██╔══╝",
  " ██║      ██████╔╝ ███████╗",
  " ╚═╝      ╚═════╝  ╚══════╝",
];

const INTRO = [
  "",
  `aravindaart tty — ${profile.identity.name}, Forward Deployed Engineer`,
  "11+ years prototype → production · TCS → Walmart → UOB Bank",
  "",
  "type 'help' for commands · 'ai' opens a live agent session",
  "",
];

interface Line {
  kind: "banner" | "cmd" | "out";
  text: string;
}

const INITIAL_LINES: Line[] = [
  ...BANNER.map((text) => ({ kind: "banner" as const, text })),
  ...INTRO.map((text) => ({ kind: "out" as const, text })),
];

/**
 * The terminal view is an actual terminal: full-screen amber-phosphor TTY
 * with a prompt, scrollback, history, and the scripted command engine.
 */
export function Tty() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { openChat } = useChatOverlay();
  const { setMode } = useMode();

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  // Terminals own the keyboard on open — but not on mobile, where an
  // uninvited on-screen keyboard eats half the viewport.
  useEffect(() => {
    if (isMobileViewport()) return;
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // The document behind this view is paper-colored; without this, rubber-band
  // overscroll flashes a light band around the black terminal.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.background;
    root.style.background = "#0d0b07";
    return () => {
      root.style.background = previous;
    };
  }, []);

  const run = (raw: string) => {
    const text = raw.trim();
    setInput("");
    setHistoryIndex(-1);
    if (!text) {
      setLines((current) => [...current, { kind: "cmd", text: "" }]);
      return;
    }
    setHistory((current) => [...current, text]);

    const result = executeCommand(text, profile);
    if (result.action?.type === "clear") {
      setLines([]);
      return;
    }
    setLines((current) => [
      ...current,
      { kind: "cmd", text },
      ...result.output.map((line) => ({ kind: "out" as const, text: line })),
    ]);
    if (result.action?.type === "ai") openChat();
    if (result.action?.type === "mode") setMode(result.action.mode);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      run(input);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  return (
    // click-to-focus mirrors real terminal emulators; the input itself
    // stays keyboard-accessible
    <div
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="tty scanlines relative min-h-svh cursor-text overflow-hidden px-4 py-6 font-mono text-sm sm:px-8 sm:py-10"
    >
      {/* CRT vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-3xl pb-24">
        {lines.map((line, index) =>
          line.kind === "cmd" ? (
            <p key={index} className="mt-2 whitespace-pre-wrap">
              <span className="tty-dim">{PROMPT}</span> {line.text}
            </p>
          ) : (
            <p
              key={index}
              className={`whitespace-pre-wrap ${
                line.kind === "banner"
                  ? "text-[9px] leading-tight font-bold sm:text-xs"
                  : ""
              }`}
            >
              {line.text || " "}
            </p>
          ),
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="tty-dim shrink-0">{PROMPT}</span>
          <TerminalCaretInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onKeyDown={onKeyDown}
            ariaLabel="Terminal command input"
            textClassName="font-mono text-base sm:text-sm"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
