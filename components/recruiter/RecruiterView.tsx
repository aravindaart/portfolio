"use client";

import type { Profile } from "@/lib/types";

/** Strips the protocol and www for a compact on-screen label; href keeps the full URL. */
function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/**
 * Condensed, animation-free, ATS-friendly single page.
 * Print styles in globals.css turn this into the PDF resume.
 */
export function RecruiterView({ profile }: { profile: Profile }) {
  return (
    // The page body is light (overview theme) — this view keeps its own
    // dark screen styling, while print media stays white.
    <main className="mx-auto w-full max-w-3xl bg-bg px-6 py-16 text-text shadow-2xl print:bg-white print:py-4 print:shadow-none sm:my-10 sm:rounded-xl">
      <header className="border-b border-edge pb-6 print:border-neutral-300">
        <h1 className="text-3xl font-bold text-text print:text-black">
          {profile.identity.name}
        </h1>
        <p className="mt-1 text-dim print:text-neutral-700">
          {profile.identity.title} · {profile.identity.location}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-accent print:text-neutral-700">
          <a
            href={`mailto:${profile.contact.email}`}
            className="hover:underline print:text-neutral-700"
          >
            {profile.contact.email}
          </a>
          <span aria-hidden className="text-dim print:text-neutral-400">
            ·
          </span>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline print:text-neutral-700"
          >
            {shortUrl(profile.contact.github)}
          </a>
          <span aria-hidden className="text-dim print:text-neutral-400">
            ·
          </span>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline print:text-neutral-700"
          >
            {shortUrl(profile.contact.linkedin)}
          </a>
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print mt-4 rounded border border-accent px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          ↓ Download PDF resume
        </button>
      </header>

      <section className="mt-8">
        <h2 className="font-mono text-sm tracking-widest text-accent2 uppercase print:text-neutral-600">
          Summary
        </h2>
        <div className="mt-3 space-y-2">
          {profile.identity.summary.map((line) => (
            <p
              key={line.slice(0, 32)}
              className="text-sm leading-relaxed text-text/90 print:text-black"
            >
              {line}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-sm tracking-widest text-accent2 uppercase print:text-neutral-600">
          Experience
        </h2>
        {[...profile.chapters].reverse().map((chapter) => (
          <article key={chapter.id} className="mt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold text-text print:text-black">
                {chapter.role} — {chapter.company}
              </h3>
              <p className="font-mono text-xs text-dim print:text-neutral-600">
                {chapter.period} · {chapter.location}
              </p>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {chapter.highlights.map((highlight) => (
                <li
                  key={highlight.slice(0, 32)}
                  className="text-sm leading-relaxed text-text/85 print:text-black"
                >
                  {highlight}
                </li>
              ))}
              {chapter.metrics?.map((metric) => (
                <li
                  key={metric.label}
                  className="text-sm leading-relaxed text-text/85 print:text-black"
                >
                  {metric.value}
                  {metric.suffix} {metric.label}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-sm tracking-widest text-accent2 uppercase print:text-neutral-600">
          Skills
        </h2>
        <div className="mt-3 space-y-1">
          {profile.skills.map((group) => (
            <p
              key={group.group}
              className="text-sm text-text/85 print:text-black"
            >
              <span className="font-semibold">{group.group}:</span>{" "}
              {group.items.join(", ")}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-sm tracking-widest text-accent2 uppercase print:text-neutral-600">
          Certifications
        </h2>
        <ul className="mt-3 space-y-1">
          {profile.certifications.map((cert) => (
            <li key={cert.name} className="text-sm text-text/85 print:text-black">
              {cert.name} — {cert.issuer}, {cert.year}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-sm tracking-widest text-accent2 uppercase print:text-neutral-600">
          Looking for
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {profile.lookingFor.map((item) => (
            <li key={item} className="text-sm text-text/85 print:text-black">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
