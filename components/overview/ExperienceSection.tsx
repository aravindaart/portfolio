"use client";

import type { Chapter, Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <Reveal>
      <article
        id={chapter.id}
        className="scroll-mt-24 rounded-3xl border border-hairline bg-card p-7 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.18)] sm:p-10"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-medium tracking-widest text-coral uppercase">
            {chapter.kicker}
          </p>
          <p className="text-sm text-ink2">{chapter.period}</p>
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          {chapter.headline}
        </h3>
        <p className="mt-2 text-sm font-medium text-ink2">
          {chapter.role} · {chapter.company} · {chapter.location}
        </p>

        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ink/80">
          {chapter.narrative.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        {chapter.metrics && (
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
            {chapter.metrics.map((metric) => (
              <div key={metric.label} className="bg-card px-6 py-5 text-center">
                <p className="text-3xl font-semibold tracking-tight text-ink">
                  {metric.value}
                  {metric.suffix}
                </p>
                <p className="mt-1 text-xs text-ink2">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {chapter.highlights.map((highlight) => (
            <li
              key={highlight.slice(0, 40)}
              className="flex gap-3 text-sm leading-relaxed text-ink/75"
            >
              <span aria-hidden className="mt-0.5 shrink-0 text-coral">
                ✓
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {chapter.timeline && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-ink">
              The OTP-abuse incident, end to end
            </p>
            <ol className="mt-5 grid gap-6 sm:grid-cols-5">
              {chapter.timeline.map((step) => (
                <li key={step.phase} className="relative">
                  <p className="text-xs font-semibold tracking-wide text-coral">
                    {step.phase}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-ink">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink2">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>
    </Reveal>
  );
}

export function ExperienceSection({ profile }: { profile: Profile }) {
  return (
    <section id="experience" className="scroll-mt-16 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Three chapters.
            <br className="sm:hidden" /> One job description.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink2">
            {profile.identity.thesis} From live client demos to banking-grade
            production ownership.
          </p>
        </Reveal>
        <div className="mt-14 space-y-10">
          {profile.chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </section>
  );
}
