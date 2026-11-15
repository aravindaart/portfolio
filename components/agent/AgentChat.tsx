"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  getToolName,
  isToolUIPart,
  type ToolUIPart,
  type UIMessage,
} from "ai";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { TerminalCaretInput } from "@/components/terminal/TerminalCaretInput";
import { isMobileViewport } from "@/lib/is-mobile-viewport";

const CITE_PATTERN = /\[cite:([a-z]+)\]/g;
const CITE_HREF_PREFIX = "#cite-";
const MAX_INPUT_CHARS = 1000;

const SUGGESTIONS = [
  "Why is he a fit for an FDE role?",
  "Tell me about the harness he built",
  "Has he handled production incidents?",
];

// The model returns markdown plus [cite:xxx] tokens; turning cites into
// markdown links lets react-markdown own the whole render.
const toMarkdownCitations = (text: string): string =>
  text.replace(
    CITE_PATTERN,
    (_match, id: string) => `[${id} ↗](${CITE_HREF_PREFIX}${id})`,
  );

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

const compactJson = (value: unknown): string => {
  try {
    const json = JSON.stringify(value, null, 1) ?? "";
    return json.length > 600 ? `${json.slice(0, 600)}…` : json;
  } catch {
    return "[unserializable]";
  }
};

/** One tool invocation rendered Claude-Code style: ⏺ call line + ⎿ result. */
function ToolCallView({ part }: { part: ToolUIPart }) {
  const [open, setOpen] = useState(false);
  const name = getToolName(part);
  const args =
    part.state === "input-streaming"
      ? "…"
      : compactJson(part.input).replace(/\s+/g, " ");

  return (
    <div className="my-2 font-mono text-xs">
      <p className="flex items-baseline gap-2">
        <span
          aria-hidden
          className={
            part.state === "output-error" ? "text-warn" : "text-accent"
          }
        >
          ⏺
        </span>
        <span className="text-text/90">{name}</span>
        <span className="truncate text-dim">({args})</span>
      </p>
      <div className="mt-0.5 pl-5 text-dim">
        {part.state === "input-streaming" || part.state === "input-available" ? (
          <p>
            <span aria-hidden className="mr-2 text-edge">⎿</span>
            <span className="thinking">running…</span>
          </p>
        ) : part.state === "output-error" ? (
          <p>
            <span aria-hidden className="mr-2 text-edge">⎿</span>
            <span className="text-warn">error: {part.errorText}</span>
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="text-left hover:text-accent2"
            >
              <span aria-hidden className="mr-2 text-edge">⎿</span>
              done {open ? "▾ hide result" : "▸ view result"}
            </button>
            {open && (
              <pre className="mt-1 max-h-48 overflow-auto rounded border border-edge bg-bg/60 p-2 text-[11px] leading-relaxed whitespace-pre-wrap">
                {compactJson(part.output)}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MessageView({ message }: { message: UIMessage }) {
  if (message.role === "user") {
    const text = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
    return (
      <p className="font-mono text-sm text-accent">
        <span className="mr-2 text-dim">&gt;</span>
        {text}
      </p>
    );
  }

  return (
    <div className="text-sm text-text/85">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="my-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {toMarkdownCitations(part.text)}
              </ReactMarkdown>
            </div>
          );
        }
        if (isToolUIPart(part) && part.type !== "dynamic-tool") {
          return <ToolCallView key={part.toolCallId} part={part} />;
        }
        return null;
      })}
    </div>
  );
}

/**
 * The live agent session: real Gemini tool-calling streamed as typed parts
 * and rendered as a coding-harness transcript.
 */
export function AgentChat() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  const send = (text: string) => {
    const question = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!question || busy) return;
    setInput("");
    void sendMessage({ text: question });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(input);
  };

  // Mobile keyboard re-settle, same as the old terminal input.
  const onInputFocus = () => {
    if (!isMobileViewport()) return;
    window.setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 300);
  };

  return (
    <section
      id="agent-chat"
      className="mx-auto w-full max-w-4xl scroll-mt-24 px-4 py-10 sm:px-6"
    >
      <div
        ref={rootRef}
        className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_0_60px_-20px_rgba(34,211,174,0.25)]"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-edge bg-surface2/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-dim/50" />
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent/70" />
            <p className="ml-2 font-mono text-xs text-dim">
              live session — ask the agent anything about Aravindhan
            </p>
          </div>
          <p className="hidden font-mono text-[10px] text-dim sm:block">
            gemini-3.1-flash-lite · tools: 6
          </p>
        </div>

        <div
          ref={scrollRef}
          className="h-[clamp(20rem,55vh,30rem)] space-y-3 overflow-y-auto p-4"
        >
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-dim">
                The agent answers with real tool calls over the same content
                this page renders — watch it look things up. Try:
              </p>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="block w-full rounded border border-edge px-3 py-2.5 text-left font-mono text-xs text-text/80 hover:border-accent"
                >
                  &gt; {suggestion}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) => (
            <MessageView key={message.id} message={message} />
          ))}

          {status === "submitted" && (
            <p className="thinking font-mono text-xs text-dim">✳ thinking…</p>
          )}
          {error && (
            <p className="font-mono text-xs text-warn">
              ⚠ session error — the free-tier quota may be exhausted. Try
              again in a bit, or just email him (section below).
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex border-t border-edge p-3">
          <TerminalCaretInput
            value={input}
            onChange={setInput}
            onFocus={onInputFocus}
            placeholder="ask the agent… e.g. 'what did he build at walmart?'"
            ariaLabel="Ask the portfolio agent a question"
            textClassName="font-mono text-base sm:text-sm"
          />
        </form>
      </div>
    </section>
  );
}
