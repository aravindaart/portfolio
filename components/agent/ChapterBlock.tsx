"use client";

import type { Chapter } from "@/lib/types";
import { ToolBlock } from "@/components/agent/ToolBlock";

export function ChapterBlock({ chapter }: { chapter: Chapter }) {
  return (
    <ToolBlock
      id={chapter.id}
      tool="read_chapter"
      args={`{ id: "${chapter.id}" }`}
      status={`ok · ${chapter.company} · ${chapter.period}`}
    >
      <p className="font-mono text-xs tracking-widest text-accent2 uppercase">
        {chapter.kicker}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
        {chapter.headline}
      </h2>
      <p className="mt-2 font-mono text-sm text-dim">
        {chapter.role} · {chapter.company} · {chapter.location}
      </p>

      <div className="mt-5 space-y-4 text-base leading-relaxed text-text/80">
        {chapter.narrative.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      {chapter.metrics && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {chapter.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded border border-edge bg-surface p-4"
            >
              <p className="font-mono text-2xl font-bold text-accent">
                {metric.value}
                {metric.suffix}
              </p>
              <p className="mt-1 text-xs text-dim">{metric.label}</p>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-6 space-y-2 font-mono text-sm text-text/75">
        {chapter.highlights.map((highlight) => (
          <li key={highlight.slice(0, 40)} className="flex gap-2">
            <span aria-hidden className="shrink-0 text-accent">
              -
            </span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {chapter.timeline && (
        <div className="mt-8 rounded border border-edge bg-surface p-4 sm:p-5">
          <p className="font-mono text-xs text-warn">
            ⚠ production incident — OTP abuse, commanded end-to-end
          </p>
          <ol className="mt-4 space-y-4 border-l border-edge pl-4">
            {chapter.timeline.map((step) => (
              <li key={step.phase}>
                <p className="font-mono text-xs text-accent2">{step.phase}</p>
                <p className="mt-0.5 text-sm font-semibold text-text">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text/70">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ToolBlock>
  );
}
