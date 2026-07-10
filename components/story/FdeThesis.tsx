import { Reveal } from "@/components/story/Reveal";
import type { Profile } from "@/lib/types";

const CHAPTER_LABELS: Record<string, string> = {
  tcs: "TCS",
  walmart: "Walmart",
  uob: "UOB",
};

export function FdeThesis({ profile }: { profile: Profile }) {
  return (
    <section
      id="thesis"
      className="border-y border-edge bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <Reveal>
          <p className="font-mono text-sm tracking-widest text-accent2 uppercase">
            Chapter 04 — The Thesis
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-text sm:text-5xl">
            The industry invented a title for what he was already doing.
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-dim">
            Forward Deployed Engineering means sitting with the client,
            understanding the workflow, and shipping production systems inside
            their constraints. Map the competencies to the career:
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {profile.fdeCompetencies.map((comp, index) => (
            <Reveal key={comp.competency} delay={index * 0.06}>
              <a
                href={`#${comp.chapterId}`}
                className="group block h-full rounded-lg border border-edge bg-surface p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-text">{comp.competency}</h3>
                  <span className="shrink-0 rounded-full border border-edge px-2 py-0.5 font-mono text-[10px] text-accent2 group-hover:border-accent2">
                    {CHAPTER_LABELS[comp.chapterId] ?? comp.chapterId} ↗
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  {comp.evidence}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
