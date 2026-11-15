"use client";

import type { Harness } from "@/lib/types";
import { ToolBlock } from "@/components/agent/ToolBlock";

/** Illustrative only — shows the shape of the protocol, not real payloads. */
const EXAMPLE_RESPONSE = `{
  "tool": "replace_lines",
  "file": "src/services/otp-client.ts",
  "start": 42,
  "end": 58,
  "content": ["const limiter = createRateLimiter({ windowMs: 60_000 })", "…"]
}`;

export function HarnessSection({ harness }: { harness: Harness }) {
  return (
    <ToolBlock
      id="harness"
      tool="get_harness_spec"
      args="{}"
      status={`ok · ${harness.tools.length} tools · ${harness.guardrails.length} guardrails`}
    >
      <p className="font-mono text-xs tracking-widest text-accent2 uppercase">
        Built, not just used
      </p>
      <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
        {harness.name}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-text/80">
        {harness.tagline}
      </p>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-text/80">
        {harness.problem.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      {/* Pipeline */}
      <div className="mt-8">
        <p className="font-mono text-xs text-dim">{"// the loop"}</p>
        <ol className="mt-3 space-y-0">
          {harness.pipeline.map((step, index) => (
            <li key={step.label} className="relative flex gap-4 pb-5">
              {index < harness.pipeline.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-7 left-[11px] bottom-0 w-px bg-edge"
                />
              )}
              <span className="z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-surface font-mono text-[10px] text-accent">
                {index + 1}
              </span>
              <div>
                <p className="font-mono text-sm font-semibold text-accent2">
                  {step.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text/70">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Tool protocol */}
      <div className="mt-6">
        <p className="font-mono text-xs text-dim">
          {"// the tool vocabulary the model must answer with"}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {harness.tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded border border-edge bg-surface px-3 py-2.5"
            >
              <p className="font-mono text-sm text-accent">{tool.name}</p>
              <p className="mt-0.5 text-xs text-dim">{tool.description}</p>
            </div>
          ))}
        </div>
        <pre className="mt-4 overflow-x-auto rounded border border-edge bg-surface p-4 font-mono text-xs leading-relaxed text-text/70">
          <code>{`// a reply the executor accepts (illustrative)\n${EXAMPLE_RESPONSE}`}</code>
        </pre>
      </div>

      {/* Guardrails + extension */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded border border-edge bg-surface p-4">
          <p className="font-mono text-xs text-warn">guardrails</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text/70">
            {harness.guardrails.map((rail) => (
              <li key={rail.slice(0, 30)} className="flex gap-2">
                <span aria-hidden className="shrink-0 text-warn">
                  ▪
                </span>
                <span>{rail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border border-edge bg-surface p-4">
          <p className="font-mono text-xs text-accent2">
            {harness.extension.headline.toLowerCase()}
          </p>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-text/70">
            {harness.extension.detail.map((paragraph) => (
              <p key={paragraph.slice(0, 30)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-dim">
        * internal system, built and run inside a bank — no public repo, happy
        to walk through the architecture live.
      </p>
    </ToolBlock>
  );
}
