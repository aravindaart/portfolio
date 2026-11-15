"use client";

import type { Profile } from "@/lib/types";
import { ToolBlock } from "@/components/agent/ToolBlock";

const scrollToChapter = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export function CompetencyBlock({ profile }: { profile: Profile }) {
  return (
    <ToolBlock
      tool="search_experience"
      args={'{ query: "forward deployed evidence" }'}
      status={`ok · ${profile.fdeCompetencies.length} competencies mapped to chapters`}
    >
      <h2 className="text-2xl font-bold text-text sm:text-3xl">
        The FDE competency map
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-text/70">
        Every claim links back to the chapter that proves it — the same
        grounding rule the live agent below runs under.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.fdeCompetencies.map((item) => (
          <button
            key={item.competency}
            type="button"
            onClick={() => scrollToChapter(item.chapterId)}
            className="group rounded border border-edge bg-surface p-4 text-left transition-colors hover:border-accent"
          >
            <p className="font-mono text-sm font-semibold text-accent">
              {item.competency}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text/70">
              {item.evidence}
            </p>
            <p className="mt-3 font-mono text-xs text-dim group-hover:text-accent2">
              [cite:{item.chapterId}] ↗
            </p>
          </button>
        ))}
      </div>
    </ToolBlock>
  );
}
