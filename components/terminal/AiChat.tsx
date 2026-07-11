"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/lib/ai/chat-guard";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import { TerminalCaretInput } from "@/components/terminal/TerminalCaretInput";

const CITE_PATTERN = /\[cite:([a-z]+)\]/g;
const CITE_HREF_PREFIX = "#cite-";

// The model returns real markdown (bold, bullet lists) plus our own
// [cite:xxx] tokens. Turning cite tokens into markdown links lets one
// parser (react-markdown) own the whole render instead of hand-splitting
// text and breaking list/paragraph structure.
const toMarkdownCitations = (text: string): string =>
  text.replace(CITE_PATTERN, (_match, id: string) => `[${id} ↗](${CITE_HREF_PREFIX}${id})`);

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href?.startsWith(CITE_HREF_PREFIX)) {
      const id = href.slice(CITE_HREF_PREFIX.length);
      return (
        <button
          type="button"
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
          className="mx-1 rounded border border-accent2/50 px-1.5 py-0.5 font-mono text-[10px] text-accent2 hover:bg-accent2/10"
        >
          {children}
        </button>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:text-accent"
      >
        {children}
      </a>
    );
  },
  p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface2 px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  ),
};

/** Renders assistant markdown, turning [cite:xxx] tokens into scroll links. */
function AssistantContent({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {toMarkdownCitations(text)}
    </ReactMarkdown>
  );
}

const SUGGESTIONS = [
  "Has he handled production incidents?",
  "Why is he a fit for an FDE role?",
  "What did he ship at Walmart?",
];

export function AiChat({ onExit }: { onExit: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  // Opening AI mode is already a deliberate action (typing 'ai', the Hero
  // CTA, ⌘K) — unlike the scripted terminal's passive scroll-into-view,
  // there's no "stole my focus while scrolling" risk here. preventScroll:
  // the caller already did its own scrollIntoView to reach the terminal —
  // a plain .focus() here would let the browser layer a second, uncontrolled
  // scroll-into-view correction on top of that.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Same mobile-keyboard re-settle as the scripted terminal input —
  // desktop has no keyboard to settle for, so skip it there.
  const onInputFocus = () => {
    if (!isMobileViewport()) return;
    window.setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  };

  const send = async (content: string) => {
    const question = content.trim().slice(0, 1000);
    if (!question || busy) return;
    setInput("");
    setBusy(true);
    const outgoing = [...messages, { role: "user" as const, content: question }];
    setMessages(outgoing);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoing.slice(-20) }),
      });

      if (!response.ok || !response.body) {
        setOffline(response.status === 503);
        setMessages([
          ...outgoing,
          {
            role: "assistant",
            content:
              response.status === 503
                ? "The AI twin is offline right now — but the scripted terminal knows everything. Type 'exit' to go back and try 'incidents' or 'experience uob'."
                : "Something went wrong — please try again.",
          },
        ]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...outgoing, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        const snapshot = assistant;
        setMessages([...outgoing, { role: "assistant", content: snapshot }]);
      }
    } catch {
      setMessages([
        ...outgoing,
        { role: "assistant", content: "Network hiccup — please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim().toLowerCase() === "exit") {
      onExit();
      return;
    }
    void send(input);
  };

  return (
    <div
      ref={rootRef}
      className="flex h-[clamp(20rem,55vh,32rem)] flex-col"
    >
      <div className="flex items-center justify-between border-b border-edge px-4 py-2">
        <p className="font-mono text-xs text-accent2">
          ai twin — grounded in the profile, cites its sources
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded px-2 py-2 font-mono text-xs text-dim hover:text-accent"
        >
          [exit]
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-dim">
              Ask anything a recruiter would. Suggestions:
            </p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="block w-full rounded border border-edge px-3 py-2.5 text-left font-mono text-xs text-text/80 hover:border-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              message.role === "user" ? "text-accent" : "text-text/85"
            }`}
          >
            <span className="mt-0.5 shrink-0 font-mono text-xs text-dim">
              {message.role === "user" ? "you ▸" : "twin ▸"}
            </span>
            <div className="min-w-0 flex-1">
              {message.role === "user" ? (
                <p className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                <AssistantContent text={message.content} />
              )}
            </div>
          </div>
        ))}
        {busy && <p className="font-mono text-xs text-dim">twin is thinking…</p>}
      </div>

      <form onSubmit={onSubmit} className="flex border-t border-edge p-3">
        <TerminalCaretInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onFocus={onInputFocus}
          placeholder={
            offline ? "AI offline — type exit" : "ask the AI twin… ('exit' to leave)"
          }
          ariaLabel="Ask the AI twin a question"
          textClassName="font-mono text-base sm:text-sm"
        />
      </form>
    </div>
  );
}
