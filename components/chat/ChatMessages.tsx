"use client";

import { useState } from "react";
import {
  getToolName,
  isToolUIPart,
  type ToolUIPart,
  type UIMessage,
} from "ai";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const CITE_PATTERN = /\[cite:([a-z]+)\]/g;
const CITE_HREF_PREFIX = "#cite-";

/** Chapter anchors live on the page under the overlay — close it first. */
export type CiteHandler = (chapterId: string) => void;

// The model returns markdown plus [cite:xxx] tokens; turning cites into
// markdown links lets react-markdown own the whole render.
const toMarkdownCitations = (text: string): string =>
  text.replace(
    CITE_PATTERN,
    (_match, id: string) => `[${id} ↗](${CITE_HREF_PREFIX}${id})`,
  );

const buildMarkdownComponents = (onCite: CiteHandler): Components => ({
  a: ({ href, children }) => {
    if (href?.startsWith(CITE_HREF_PREFIX)) {
      const id = href.slice(CITE_HREF_PREFIX.length);
      return (
        <button
          type="button"
          onClick={() => onCite(id)}
          className="mx-1 rounded border border-brand2/50 px-1.5 py-0.5 font-ui-mono text-[10px] text-brand2 hover:bg-brand2/10"
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
        className="text-brand2 underline decoration-dotted underline-offset-2"
      >
        {children}
      </a>
    );
  },
  p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-cc-text">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-cc-raise px-1.5 py-0.5 font-ui-mono text-[0.85em]">
      {children}
    </code>
  ),
});

const compactJson = (value: unknown): string => {
  try {
    const json = JSON.stringify(value, null, 1) ?? "";
    return json.length > 600 ? `${json.slice(0, 600)}…` : json;
  } catch {
    return "[unserializable]";
  }
};

/** One tool invocation, Claude-Code style: ⏺ call line + ⎿ result elbow. */
function ToolCallView({ part }: { part: ToolUIPart }) {
  const [open, setOpen] = useState(false);
  const name = getToolName(part);
  const args =
    part.state === "input-streaming"
      ? "…"
      : compactJson(part.input).replace(/\s+/g, " ");

  return (
    <div className="my-3 font-ui-mono text-xs">
      <p className="flex items-baseline gap-2">
        <span
          aria-hidden
          className={part.state === "output-error" ? "text-warn" : "text-brand2"}
        >
          ⏺
        </span>
        <span className="text-cc-text">{name}</span>
        <span className="truncate text-cc-dim">({args})</span>
      </p>
      <div className="mt-1 pl-5 text-cc-dim">
        {part.state === "input-streaming" || part.state === "input-available" ? (
          <p>
            <span aria-hidden className="mr-2 text-cc-edge">⎿</span>
            <span className="thinking">running…</span>
          </p>
        ) : part.state === "output-error" ? (
          <p>
            <span aria-hidden className="mr-2 text-cc-edge">⎿</span>
            <span className="text-warn">error: {part.errorText}</span>
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="text-left hover:text-brand2"
            >
              <span aria-hidden className="mr-2 text-cc-edge">⎿</span>
              done {open ? "▾ hide result" : "▸ view result"}
            </button>
            {open && (
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-cc-edge bg-cc-bg p-3 text-[11px] leading-relaxed whitespace-pre-wrap">
                {compactJson(part.output)}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({
  message,
  onCite,
}: {
  message: UIMessage;
  onCite: CiteHandler;
}) {
  if (message.role === "user") {
    const text = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-cc-raise px-4 py-2.5 text-sm leading-relaxed text-cc-text">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="text-sm text-cc-text/90">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="my-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={buildMarkdownComponents(onCite)}
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
