"use client";

import type { Profile } from "@/lib/types";
import { ToolBlock } from "@/components/agent/ToolBlock";

export function SkillsBlock({ profile }: { profile: Profile }) {
  return (
    <ToolBlock
      tool="get_skills_and_certs"
      args="{}"
      status={`ok · ${profile.skills.length} skill groups · ${profile.certifications.length} certifications`}
    >
      <h2 className="text-2xl font-bold text-text sm:text-3xl">
        Stack &amp; certifications
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {profile.skills.map((group) => (
          <div
            key={group.group}
            className="rounded border border-edge bg-surface p-4"
          >
            <p className="font-mono text-xs tracking-widest text-accent2 uppercase">
              {group.group}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded border border-edge px-2 py-1 font-mono text-xs text-text/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-1.5 font-mono text-xs text-dim">
        {profile.certifications.map((cert) => (
          <li key={cert.name}>
            <span className="text-accent">✓</span> {cert.name} —{" "}
            {cert.issuer}, {cert.year}
          </li>
        ))}
      </ul>
    </ToolBlock>
  );
}
