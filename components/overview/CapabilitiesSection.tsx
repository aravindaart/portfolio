"use client";

import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

const scrollToChapter = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export function CapabilitiesSection({ profile }: { profile: Profile }) {
  return (
    <section id="capabilities" className="scroll-mt-16 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
            <h2 className="font-display text-4xl text-ink sm:text-6xl">
              Claims, <em className="text-brand">with receipts.</em>
            </h2>
            <p className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
              03 — Capabilities
            </p>
          </div>
        </Reveal>

        {/* Competency ledger */}
        <Reveal>
          <div>
            {profile.fdeCompetencies.map((item) => (
              <button
                key={item.competency}
                type="button"
                onClick={() => scrollToChapter(item.chapterId)}
                className="group grid w-full gap-1 border-t border-hairline py-4 text-left transition-colors last:border-b hover:bg-card sm:grid-cols-12 sm:gap-6"
              >
                <p className="text-sm font-medium text-ink sm:col-span-4">
                  {item.competency}
                </p>
                <p className="text-sm leading-relaxed text-ink2 sm:col-span-6">
                  {item.evidence}
                </p>
                <p className="font-ui-mono text-xs text-brand opacity-70 group-hover:opacity-100 sm:col-span-2 sm:text-right">
                  proof: {item.chapterId} ↗
                </p>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="border-b border-ink pb-3 font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                Stack
              </p>
              <dl className="mt-1">
                {profile.skills.map((group) => (
                  <div
                    key={group.group}
                    className="grid gap-1 border-b border-hairline py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4"
                  >
                    <dt className="font-ui-mono text-xs text-brand uppercase">
                      {group.group}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink/80">
                      {group.items.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="border-b border-ink pb-3 font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                Certifications
              </p>
              <ul className="mt-1">
                {profile.certifications.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-3.5 text-sm"
                  >
                    <span className="text-ink/85">
                      {cert.name}
                      <span className="text-ink2"> — {cert.issuer}</span>
                    </span>
                    <span className="shrink-0 font-ui-mono text-xs text-ink2">
                      {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
