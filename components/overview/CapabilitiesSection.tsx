"use client";

import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

const scrollToChapter = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export function CapabilitiesSection({ profile }: { profile: Profile }) {
  return (
    <section id="capabilities" className="scroll-mt-16 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            The FDE competency map
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink2">
            Every claim links to the chapter that proves it — the same
            grounding rule the agent answers under.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.fdeCompetencies.map((item, index) => (
            <Reveal key={item.competency} delay={(index % 3) * 0.06}>
              <button
                type="button"
                onClick={() => scrollToChapter(item.chapterId)}
                className="h-full w-full rounded-2xl border border-hairline bg-card p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(28,25,23,0.3)]"
              >
                <p className="text-sm font-semibold text-ink">
                  {item.competency}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink2">
                  {item.evidence}
                </p>
                <p className="mt-4 text-xs font-medium text-coral">
                  See the proof →
                </p>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 grid gap-10 border-t border-hairline pt-14 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-ink">Stack</h3>
              <div className="mt-5 space-y-5">
                {profile.skills.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-medium tracking-widest text-ink2 uppercase">
                      {group.group}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-hairline bg-card px-3 py-1 text-xs text-ink/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-ink">
                Certifications
              </h3>
              <ul className="mt-5 space-y-3">
                {profile.certifications.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline pb-3 text-sm"
                  >
                    <span className="text-ink/85">
                      {cert.name}
                      <span className="text-ink2"> — {cert.issuer}</span>
                    </span>
                    <span className="shrink-0 text-xs text-ink2">
                      {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
