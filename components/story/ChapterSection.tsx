import { IncidentTimeline } from "@/components/story/IncidentTimeline";
import { MetricCard } from "@/components/story/MetricCard";
import { Reveal } from "@/components/story/Reveal";
import type { Chapter } from "@/lib/types";

export function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <section
      id={chapter.id}
      className="mx-auto w-full max-w-5xl scroll-mt-16 px-6 py-24 sm:py-32"
    >
      <Reveal>
        <p className="font-mono text-sm tracking-widest text-accent2 uppercase">
          {chapter.kicker}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-5xl">
          {chapter.headline}
        </h2>
        <p className="mt-3 font-mono text-sm text-dim">
          {chapter.company} · {chapter.role} · {chapter.period} ·{" "}
          {chapter.location}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 max-w-3xl space-y-4">
        {chapter.narrative.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="leading-relaxed text-text/90">
            {paragraph}
          </p>
        ))}
      </Reveal>

      {chapter.metrics && (
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {chapter.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      )}

      <Reveal delay={0.15} className="mt-12">
        <ul className="grid gap-3 sm:grid-cols-2">
          {chapter.highlights.map((highlight) => (
            <li
              key={highlight.slice(0, 32)}
              className="rounded-md border border-edge bg-surface/50 p-4 text-sm leading-relaxed text-text/85"
            >
              <span aria-hidden className="mr-2 font-mono text-accent">
                ▸
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </Reveal>

      {chapter.timeline && (
        <div className="mt-12">
          <IncidentTimeline steps={chapter.timeline} />
        </div>
      )}
    </section>
  );
}
