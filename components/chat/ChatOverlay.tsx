"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatMessage } from "@/components/chat/ChatMessages";
import { useChatOverlay } from "@/lib/chat-overlay";

const MAX_INPUT_CHARS = 1000;

const SESSIONS: { id: string; label: string; question: string }[] = [
  {
    id: "fde-fit",
    label: "fde-fit-check",
    question: "Why is he a fit for an FDE role?",
  },
  {
    id: "harness",
    label: "harness-deep-dive",
    question: "Tell me about the agent harness he built",
  },
  {
    id: "incident",
    label: "incident-walkthrough",
    question: "Walk me through the production incident he handled",
  },
  {
    id: "walmart",
    label: "walmart-shipping-log",
    question: "What did he ship at Walmart?",
  },
];

/**
 * Full-screen Claude-Code-desktop-style chat. Always mounted so the
 * conversation survives close/reopen; `open` only toggles visibility.
 * Full-screen (not an embedded section) so mobile visitors own the whole
 * viewport — no accidental page scroll stealing the transcript.
 */
export function ChatOverlay() {
  const { open, closeChat, pendingQuestion, consumePendingQuestion } =
    useChatOverlay();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  // Lock the page scroll while the overlay owns the screen.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  // A CTA elsewhere queued a question — send it once the overlay is open.
  useEffect(() => {
    if (!open || !pendingQuestion || busy) return;
    const question = pendingQuestion;
    consumePendingQuestion();
    void sendMessage({ text: question });
  }, [open, pendingQuestion, busy, consumePendingQuestion, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  const send = (text: string) => {
    const question = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!question || busy) return;
    setInput("");
    void sendMessage({ text: question });
  };

  const onCite = (chapterId: string) => {
    closeChat();
    // Wait for the page behind the overlay to be scrollable again.
    window.setTimeout(() => {
      document
        .getElementById(chapterId)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Aravindhan's portfolio agent"
      className={`fixed inset-0 z-[80] flex-col bg-cc-bg text-cc-text ${
        open ? "flex" : "hidden"
      }`}
    >
      {/* Title bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-cc-edge bg-cc-panel px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
            />
            <span aria-hidden className="h-3 w-3 rounded-full bg-cc-edge" />
            <span aria-hidden className="h-3 w-3 rounded-full bg-cc-edge" />
          </div>
          <p className="font-ui-mono text-xs text-cc-dim">
            aravindhan · fde session
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden font-ui-mono text-[11px] text-cc-dim sm:block">
            gemini-3.1-flash-lite · 6 tools
          </p>
          <button
            type="button"
            onClick={closeChat}
            className="rounded-md border border-cc-edge px-2.5 py-1 font-ui-mono text-xs text-cc-dim transition-colors hover:border-coral2 hover:text-coral2"
          >
            esc ✕
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-cc-edge bg-cc-panel/60 p-3 md:flex">
          <p className="px-2 py-1.5 font-ui-mono text-[10px] tracking-widest text-cc-dim uppercase">
            Suggested sessions
          </p>
          <div className="mt-1 space-y-0.5">
            {SESSIONS.map((session) => (
              <button
                key={session.id}
                type="button"
                disabled={busy}
                onClick={() => send(session.question)}
                className="block w-full truncate rounded-lg px-2 py-2 text-left font-ui-mono text-xs text-cc-text/80 transition-colors hover:bg-cc-raise disabled:opacity-50"
              >
                <span aria-hidden className="mr-1.5 text-coral2">▸</span>
                {session.label}
              </button>
            ))}
          </div>
          <div className="mt-auto rounded-lg border border-cc-edge p-3">
            <p className="font-ui-mono text-[10px] text-cc-dim">
              Every answer is grounded: the agent calls real tools over the
              same profile this site renders.
            </p>
          </div>
        </aside>

        {/* Transcript */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6">
              {messages.length === 0 && (
                <div className="pt-8">
                  <p className="text-center text-2xl font-semibold text-cc-text">
                    Ask about Aravindhan
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-center text-sm text-cc-dim">
                    A live agent over his real profile — watch it call tools
                    before it answers.
                  </p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {SESSIONS.map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => send(session.question)}
                        className="rounded-xl border border-cc-edge bg-cc-panel px-4 py-3 text-left text-sm text-cc-text/85 transition-colors hover:border-coral2/60"
                      >
                        {session.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCite={onCite}
                />
              ))}

              {status === "submitted" && (
                <p className="thinking font-ui-mono text-xs text-cc-dim">
                  ✳ thinking…
                </p>
              )}
              {error && (
                <p className="font-ui-mono text-xs text-warn">
                  ⚠ session error — the free-tier quota may be exhausted. Try
                  again shortly, or email sayhi@aravindaart.com.
                </p>
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-cc-edge bg-cc-panel/60 px-4 py-3">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-cc-edge bg-cc-panel px-4 py-2 focus-within:border-coral2/60"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the agent anything…"
                aria-label="Ask the portfolio agent a question"
                autoComplete="off"
                className="h-9 min-w-0 flex-1 bg-transparent text-sm text-cc-text outline-none placeholder:text-cc-dim"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral2 text-cc-bg transition-opacity disabled:opacity-40"
              >
                ↑
              </button>
            </form>
            <p className="mx-auto mt-2 w-full max-w-2xl text-center font-ui-mono text-[10px] text-cc-dim">
              grounded in the live profile · answers cite their sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
