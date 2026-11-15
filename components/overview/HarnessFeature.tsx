"use client";

import type { Harness } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";
import { useChatOverlay } from "@/lib/chat-overlay";

/**
 * The matte-dark feature section: the agent harness built inside the bank.
 */
export function HarnessFeature({ harness }: { harness: Harness }) {
  const { openChat } = useChatOverlay();

  return (
    <section
      id="harness"
      className="scroll-mt-16 bg-ink px-5 py-16 text-paper sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-paper/25 pb-8">
            <h2 className="font-display max-w-3xl text-4xl leading-tight sm:text-6xl">
              No model API?
              <br />
              <em className="text-brand2">He built the harness anyway.</em>
            </h2>
            <p className="font-ui-mono text-[11px] tracking-[0.18em] text-paper/50 uppercase">
              02 — The harness
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <div className="space-y-4 text-base leading-relaxed text-paper/75 md:col-span-5">
              {harness.problem.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <button
                type="button"
                onClick={() =>
                  openChat("Tell me about the agent harness he built")
                }
                className="mt-2 rounded-sm border border-paper/60 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Ask the agent about it
              </button>
            </div>

            {/* The loop, as a numbered log */}
            <ol className="md:col-span-7">
              {harness.pipeline.map((step, index) => (
                <li
                  key={step.label}
                  className="grid gap-1 border-t border-paper/20 py-4 first:border-t-0 first:pt-0 sm:grid-cols-[6rem_1fr] sm:gap-6"
                >
                  <p className="font-ui-mono text-xs text-brand2">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    <span className="uppercase">{step.label}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-paper/70">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-px border border-paper/25 bg-paper/25 sm:grid-cols-2 lg:grid-cols-4">
            {harness.tools.map((tool) => (
              <div key={tool.name} className="bg-ink p-4">
                <p className="font-ui-mono text-sm text-brand2">{tool.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-paper/60">
                  {tool.description}
                </p>
              </div>
            ))}
            <div className="bg-ink p-4">
              <p className="font-ui-mono text-sm text-paper/80">guardrails</p>
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-paper/60">
                {harness.guardrails.map((rail) => (
                  <li key={rail.slice(0, 30)}>— {rail}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <p className="font-ui-mono text-[11px] tracking-[0.18em] text-paper/50 uppercase md:col-span-5">
              {harness.extension.headline}
            </p>
            <div className="space-y-3 text-sm leading-relaxed text-paper/70 md:col-span-7">
              {harness.extension.detail.map((paragraph) => (
                <p key={paragraph.slice(0, 30)}>{paragraph}</p>
              ))}
              <p className="pt-2 font-ui-mono text-[11px] text-paper/45">
                Internal system, built and run inside a bank — no public repo.
                He&apos;ll walk through the architecture live.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
