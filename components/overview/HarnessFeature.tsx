"use client";

import type { Harness } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";
import { useChatOverlay } from "@/lib/chat-overlay";

/**
 * The dark full-bleed feature section — the Apple "product moment" of the
 * page, telling the story of the agent harness built inside the bank.
 */
export function HarnessFeature({ harness }: { harness: Harness }) {
  const { openChat } = useChatOverlay();

  return (
    <section
      id="harness"
      className="scroll-mt-16 bg-cc-bg px-6 py-20 text-cc-text sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-center text-sm font-medium tracking-widest text-coral2 uppercase">
            Built, not just used
          </p>
          <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight sm:text-5xl">
            No model API? He built
            <br />
            the harness anyway.
          </h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 text-center text-base leading-relaxed text-cc-dim">
            {harness.problem.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        {/* Pipeline */}
        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-cc-edge bg-cc-edge sm:grid-cols-5">
            {harness.pipeline.map((step, index) => (
              <div key={step.label} className="bg-cc-panel p-5">
                <p className="font-ui-mono text-[11px] text-coral2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold capitalize">
                  {step.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cc-dim">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tool protocol + guardrails */}
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="h-full rounded-3xl border border-cc-edge bg-cc-panel p-6 sm:p-8">
              <p className="text-sm font-semibold">
                The model speaks a fixed tool protocol
              </p>
              <p className="mt-1 text-xs text-cc-dim">
                A reply that doesn&apos;t parse as one of these is rejected —
                never executed.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {harness.tools.map((tool) => (
                  <span
                    key={tool.name}
                    title={tool.description}
                    className="rounded-lg border border-cc-edge bg-cc-raise px-3 py-1.5 font-ui-mono text-xs text-cc-text/90"
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
              <ul className="mt-6 space-y-2 text-xs leading-relaxed text-cc-dim">
                {harness.guardrails.map((rail) => (
                  <li key={rail.slice(0, 30)} className="flex gap-2">
                    <span aria-hidden className="shrink-0 text-coral2">
                      ▪
                    </span>
                    <span>{rail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-cc-edge bg-cc-panel p-6 sm:p-8">
              <p className="text-sm font-semibold">
                {harness.extension.headline}
              </p>
              <div className="mt-3 space-y-3 text-xs leading-relaxed text-cc-dim">
                {harness.extension.detail.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openChat("Tell me about the agent harness he built")}
                className="mt-auto pt-6 text-left text-sm font-medium text-coral2 transition-colors hover:text-coral"
              >
                Ask the agent about the harness →
              </button>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 text-center font-ui-mono text-[11px] text-cc-dim">
          Internal system, built and run inside a bank — no public repo. He&apos;ll
          walk through the architecture live.
        </p>
      </div>
    </section>
  );
}
