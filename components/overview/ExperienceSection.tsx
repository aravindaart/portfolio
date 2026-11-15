"use client";

import type { Chapter, Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

function ChapterRow({ chapter }: { chapter: Chapter }) {
  return (
    <Reveal>
      <article
        id={chapter.id}
        className="grid scroll-mt-24 gap-6 border-t border-hairline py-10 md:grid-cols-12 md:gap-10 md:py-14"
      >
        {/* Meta column */}
        <div className="md:col-span-4">
          <p className="font-ui-mono text-[11px] tracking-[0.18em] text-coral uppercase">
            {String(chapter.index).padStart(2, "0")} — {chapter.company}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{chapter.role}</p>
          <p className="mt-1 font-ui-mono text-xs text-ink2">
            {chapter.period}
            <br />
            {chapter.location}
          </p>
          {chapter.metrics && (
            <dl className="mt-6 space-y-3 border-t border-hairline pt-5">
              {chapter.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="font-ui-mono text-2xl text-ink">
                    {metric.value}
                    {metric.suffix}
                  </dt>
                  <dd className="text-xs text-ink2">{metric.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Story column */}
        <div className="md:col-span-8">
          <h3 className="font-display text-3xl leading-tight text-ink sm:text-5xl">
            {chapter.headline}
          </h3>
          <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-ink/80">
            {chapter.narrative.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-7 max-w-2xl space-y-2.5">
            {chapter.highlights.map((highlight) => (
              <li
                key={highlight.slice(0, 40)}
                className="flex gap-3 text-sm leading-relaxed text-ink/75"
              >
                <span aria-hidden className="shrink-0 text-coral">
                  —
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {chapter.timeline && (
            <div className="mt-9 border border-ink/80 p-5 sm:p-6">
              <p className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                Incident log — OTP abuse, commanded end to end
              </p>
              <ol className="mt-4 space-y-3">
                {chapter.timeline.map((step) => (
                  <li
                    key={step.phase}
                    className="grid gap-1 border-t border-hairline pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[7.5rem_1fr] sm:gap-4"
                  >
                    <p className="font-ui-mono text-xs text-coral">
                      {step.phase}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink2">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export function ExperienceSection({ profile }: { profile: Profile }) {
  return (
    <section id="experience" className="scroll-mt-16 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
            <h2 className="font-display text-4xl text-ink sm:text-6xl">
              Three chapters, <em className="text-coral">one job description.</em>
            </h2>
            <p className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
              01 — Experience
            </p>
          </div>
        </Reveal>
        {profile.chapters.map((chapter) => (
          <ChapterRow key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}
