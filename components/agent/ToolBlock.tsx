"use client";

import { Reveal } from "@/components/story/Reveal";

export interface ToolBlockProps {
  /** Anchor id — chapter ids double as AI citation targets */
  id?: string;
  /** Tool name as the agent would call it, e.g. "read_chapter" */
  tool: string;
  /** Rendered inside the parens, e.g. '{ id: "walmart" }' */
  args?: string;
  /** Short status line after the ⎿ elbow, e.g. "ok · 3 highlights" */
  status?: string;
  children: React.ReactNode;
}

/**
 * Presents a page section as one tool call in the agent's transcript:
 * a ⏺ header line with the call, a ⎿ status elbow, then the "output".
 */
export function ToolBlock({ id, tool, args, status, children }: ToolBlockProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-4xl scroll-mt-24 px-4 py-10 sm:px-6">
      <Reveal>
        <div className="font-mono text-sm">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span aria-hidden className="text-accent">
              ⏺
            </span>
            <span className="text-text">{tool}</span>
            <span className="text-dim">({args ?? ""})</span>
          </p>
          {status && (
            <p className="mt-1 pl-5 text-xs text-dim">
              <span aria-hidden className="mr-2 text-edge">
                ⎿
              </span>
              {status}
            </p>
          )}
        </div>
        <div className="mt-4 border-l border-edge pl-5 sm:pl-6">{children}</div>
      </Reveal>
    </section>
  );
}
