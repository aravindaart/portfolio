"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMode } from "@/lib/mode";
import { TERMINAL_AI_EVENT } from "@/lib/terminal/events";
import { COMMAND_PALETTE_OPEN_EVENT } from "@/lib/nav/events";

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function CommandPalette() {
  const { toggle } = useMode();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const items: PaletteItem[] = [
    { id: "hero", label: "Jump: Boot sequence", hint: "#hero", keywords: "home top intro", run: () => scrollTo("hero") },
    { id: "tcs", label: "Jump: Chapter 01 — TCS", hint: "#tcs", keywords: "tata consultancy pre-sales demo", run: () => scrollTo("tcs") },
    { id: "walmart", label: "Jump: Chapter 02 — Walmart", hint: "#walmart", keywords: "retail bulk upload metrics", run: () => scrollTo("walmart") },
    { id: "uob", label: "Jump: Chapter 03 — UOB", hint: "#uob", keywords: "bank lending incident otp", run: () => scrollTo("uob") },
    { id: "thesis", label: "Jump: FDE thesis", hint: "#thesis", keywords: "forward deployed competencies", run: () => scrollTo("thesis") },
    { id: "terminal", label: "Jump: Terminal", hint: "#terminal", keywords: "shell commands interactive", run: () => scrollTo("terminal") },
    { id: "contact", label: "Jump: Contact", hint: "#contact", keywords: "email github linkedin reach", run: () => scrollTo("contact") },
    { id: "recruiter", label: "Action: Toggle Recruiter Mode", hint: "resume view", keywords: "pdf print hiring resume", run: toggle },
    {
      id: "ai",
      label: "Action: Interview the AI twin",
      hint: "terminal",
      keywords: "chat ask question claude",
      run: () => {
        scrollTo("terminal");
        window.dispatchEvent(new CustomEvent(TERMINAL_AI_EVENT));
      },
    },
  ];

  const q = query.trim().toLowerCase();
  const visible = q
    ? items.filter((item) =>
        `${item.label} ${item.keywords}`.toLowerCase().includes(q),
      )
    : items;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        setQuery("");
        setCursor(0);
      } else if (event.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Mobile has no ⌘K — the visible nav trigger dispatches this instead.
  useEffect(() => {
    const onExternalOpen = () => {
      setOpen(true);
      setQuery("");
      setCursor(0);
    };
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, onExternalOpen);
    return () =>
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, onExternalOpen);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const select = (item: PaletteItem) => {
    close();
    item.run();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === "Enter" && visible[cursor]) {
      select(visible[cursor]);
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-start justify-center bg-bg/80 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-edge bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
          <span aria-hidden className="font-mono text-sm text-accent">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Type to filter — chapters, actions…"
            aria-label="Filter commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-options"
            aria-activedescendant={
              visible[cursor] ? `palette-option-${visible[cursor].id}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
            className="w-full appearance-none rounded bg-transparent font-mono text-base text-text outline-none placeholder:text-dim focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
          />
          <kbd className="rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-dim">
            esc
          </kbd>
        </div>
        <ul
          id="palette-options"
          role="listbox"
          aria-label="Commands"
          className="max-h-72 overflow-y-auto p-2"
        >
          {visible.length === 0 && (
            <li className="px-3 py-2 font-mono text-sm text-dim">
              no matches — try &apos;walmart&apos; or &apos;recruiter&apos;
            </li>
          )}
          {visible.map((item, index) => (
            <li
              key={item.id}
              id={`palette-option-${item.id}`}
              role="option"
              aria-selected={index === cursor}
            >
              <button
                type="button"
                onClick={() => select(item)}
                onMouseEnter={() => setCursor(index)}
                tabIndex={-1}
                className={`flex w-full items-center justify-between rounded px-3 py-3 text-left font-mono text-sm transition-colors ${
                  index === cursor
                    ? "bg-surface2 text-accent"
                    : "text-text/80"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-dim">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
