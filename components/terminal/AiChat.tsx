"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/ai/chat-guard";
import { isMobileViewport } from "@/lib/is-mobile-viewport";

const CITE_PATTERN = /\[cite:([a-z]+)\]/g;

/** Renders assistant text, turning [cite:xxx] tokens into scroll links. */
function CitedText({ text }: { text: string }) {
  const parts = text.split(CITE_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <button
            key={`${part}-${index}`}
            type="button"
            onClick={() =>
              document
                .getElementById(part)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mx-1 rounded border border-accent2/50 px-1.5 py-0.5 font-mono text-[10px] text-accent2 hover:bg-accent2/10"
          >
            {part} ↗
          </button>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

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
    <div ref={rootRef} className="flex h-80 flex-col">
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

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
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
          <p
            key={index}
            className={`leading-relaxed whitespace-pre-wrap ${
              message.role === "user" ? "text-accent" : "text-text/85"
            }`}
          >
            <span className="mr-2 font-mono text-xs text-dim">
              {message.role === "user" ? "you ▸" : "twin ▸"}
            </span>
            <CitedText text={message.content} />
          </p>
        ))}
        {busy && <p className="font-mono text-xs text-dim">twin is thinking…</p>}
      </div>

      <form onSubmit={onSubmit} className="border-t border-edge p-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={onInputFocus}
          placeholder={
            offline ? "AI offline — type exit" : "ask the AI twin… ('exit' to leave)"
          }
          aria-label="Ask the AI twin a question"
          className="w-full appearance-none bg-transparent font-mono text-base text-text caret-accent outline-none placeholder:text-dim focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
        />
      </form>
    </div>
  );
}
