"use client";

import { Reveal } from "@/components/story/Reveal";
import type { TimelineStep } from "@/lib/types";

export function IncidentTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="rounded-lg border border-edge bg-surface/60 p-6 sm:p-8">
      <p className="mb-6 font-mono text-sm text-warn">
        ⚠ incident replay — production OTP abuse
      </p>
      <ol className="relative space-y-8 border-l border-edge pl-6">
        {steps.map((step, index) => (
          <Reveal key={step.phase} delay={index * 0.12}>
            <li className="relative">
              <span
                aria-hidden
                className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border border-accent bg-bg"
              />
              <p className="font-mono text-xs text-accent">{step.phase}</p>
              <p className="mt-1 font-semibold text-text">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-dim">
                {step.detail}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
