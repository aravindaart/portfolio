"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { executeCommand } from "@/lib/terminal/commands";
import { TERMINAL_AI_EVENT } from "@/lib/terminal/events";
import { useMode } from "@/lib/mode";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import { profile } from "@/content/profile";

// The AI SDK client only ships when a visitor actually activates the twin.
const AiChat = dynamic(
  () => import("@/components/terminal/AiChat").then((m) => m.AiChat),
  { ssr: false },
);

const PROMPT = "guest@aravindaart:~$";

interface LogEntry {
  id: number;
  kind: "input" | "output";
  text: string;
}

const WELCOME: string[] = [
  "aravindaart shell v1.0 — the interactive resume",
  "type 'help' to explore, 'ai' to interview the AI twin",
];

export function Terminal() {
  const { toggle } = useMode();
  const aiEnabled = process.env.NEXT_PUBLIC_AI_ENABLED === "1";
  const [log, setLog] = useState<LogEntry[]>(
    WELCOME.map((text, id) => ({ id, kind: "output", text })),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [aiActive, setAiActive] = useState(false);
  const nextId = useRef(WELCOME.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Mobile keyboards animate open over ~250-300ms; the browser's native
  // scroll-into-view fires before that finishes and lands in the wrong
  // place. Re-settle once the keyboard (and viewport resize) has caught up.
  // Desktop has no on-screen keyboard, so this must not fire there — it
  // was yanking the page out from under desktop visitors on every click.
  const onInputFocus = () => {
    if (!isMobileViewport()) return;
    window.setTimeout(() => {
      boxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [log, aiActive]);

  useEffect(() => {
    const onAiRequest = () => {
      if (aiEnabled) {
        setAiActive(true);
      } else {
        setLog((current) => [
          ...current,
          {
            id: nextId.current++,
            kind: "output",
            text: "AI twin is offline in this build — the scripted shell knows everything anyway. Try 'incidents' or 'experience walmart'.",
          },
        ]);
        inputRef.current?.focus();
      }
    };
    window.addEventListener(TERMINAL_AI_EVENT, onAiRequest);
    return () => window.removeEventListener(TERMINAL_AI_EVENT, onAiRequest);
  }, [aiEnabled]);

  const append = (entries: Omit<LogEntry, "id">[]) => {
    setLog((current) => [
      ...current,
      ...entries.map((entry) => ({ ...entry, id: nextId.current++ })),
    ]);
  };

  const submit = () => {
    const command = input.trim();
    setInput("");
    setHistoryIndex(-1);
    if (!command) return;
    setHistory((h) => [command, ...h]);

    const result = executeCommand(command, profile);
    const echo: Omit<LogEntry, "id">[] = [
      { kind: "input", text: `${PROMPT} ${command}` },
      ...result.output.map((text) => ({ kind: "output" as const, text })),
    ];

    switch (result.action?.type) {
      case "clear":
        setLog([]);
        return;
      case "scroll":
        append(echo);
        document
          .getElementById(result.action.target)
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      case "recruiter":
        append(echo);
        toggle();
        return;
      case "ai":
        if (aiEnabled) {
          append(echo);
          setAiActive(true);
        } else {
          append([
            ...echo,
            {
              kind: "output",
              text: "AI twin is offline in this build — the scripted shell knows everything anyway. Try 'incidents' or 'experience walmart'.",
            },
          ]);
        }
        return;
      default:
        append(echo);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(Math.max(next, -1));
      setInput(next >= 0 ? (history[next] ?? "") : "");
    } else if (event.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <section
      id="terminal"
      className="mx-auto w-full max-w-5xl scroll-mt-6 px-6 py-24"
    >
      <p className="font-mono text-sm tracking-widest text-accent2 uppercase">
        Chapter 05 — Hands-On
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-5xl">
        Don&apos;t read the resume. Query it.
      </h2>

      <div
        ref={boxRef}
        className="mt-10 overflow-hidden rounded-lg border border-edge bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-1.5 border-b border-edge px-4 py-3">
          <span aria-hidden className="h-3 w-3 rounded-full bg-edge" />
          <span aria-hidden className="h-3 w-3 rounded-full bg-edge" />
          <span aria-hidden className="h-3 w-3 rounded-full bg-accent/60" />
          <span className="ml-3 font-mono text-xs text-dim">
            aravindaart — zsh
          </span>
        </div>

        {aiActive ? (
          <AiChat onExit={() => setAiActive(false)} />
        ) : (
          <div
            ref={scrollRef}
            className="h-[clamp(20rem,55vh,32rem)] overflow-y-auto p-4 font-mono text-sm [mask-image:linear-gradient(to_bottom,transparent,black_16px)]"
            onClick={() => inputRef.current?.focus()}
          >
            {log.map((entry) => (
              <p
                key={entry.id}
                className={`whitespace-pre-wrap leading-relaxed ${
                  entry.kind === "input" ? "text-accent" : "text-text/80"
                }`}
              >
                {entry.text}
              </p>
            ))}
            <div className="flex items-center gap-2 text-base sm:text-sm">
              <span className="shrink-0 text-accent">{PROMPT}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                onFocus={onInputFocus}
                aria-label="Terminal command input"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full appearance-none bg-transparent text-text caret-accent outline-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
