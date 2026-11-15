"use client";

import { profile } from "@/content/profile";
import { harness } from "@/content/harness";
import { CapabilitiesSection } from "@/components/overview/CapabilitiesSection";
import { ExperienceSection } from "@/components/overview/ExperienceSection";
import { HarnessFeature } from "@/components/overview/HarnessFeature";
import { OverviewContact } from "@/components/overview/OverviewContact";
import { OverviewHero } from "@/components/overview/OverviewHero";
import { Reveal } from "@/components/story/Reveal";
import { useChatOverlay } from "@/lib/chat-overlay";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#harness", label: "Harness" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#contact", label: "Contact" },
];

const STATS = [
  { value: "11+", label: "years prototype → production" },
  { value: "80%", label: "faster client rollouts at TCS" },
  { value: "30%", label: "infra cost cut at Walmart" },
  { value: "500+", label: "engineers trained per batch" },
];

export function OverviewShell() {
  const { openChat } = useChatOverlay();

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Flat editorial nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-baseline gap-3">
            {/* Typographic monogram: serif Am with a cobalt full stop */}
            <span aria-hidden className="font-display text-2xl leading-none italic">
              Am<span className="text-brand">.</span>
            </span>
            <span className="hidden font-ui-mono text-[11px] tracking-[0.18em] uppercase sm:inline">
              {profile.identity.name}
            </span>
          </a>
          <nav className="hidden items-center gap-7 font-ui-mono text-[11px] tracking-[0.15em] text-ink2 uppercase sm:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => openChat()}
            className="rounded-sm bg-ink px-4 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-80"
          >
            Ask my agent
          </button>
        </div>
      </header>

      <main id="top">
        <OverviewHero profile={profile} />

        {/* Figures row */}
        <section className="px-5 pt-16 sm:px-8 sm:pt-24">
          <Reveal>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-paper p-5 sm:p-6">
                  <p className="font-ui-mono text-3xl text-ink sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <ExperienceSection profile={profile} />
        <HarnessFeature harness={harness} />
        <CapabilitiesSection profile={profile} />
        <OverviewContact profile={profile} />
      </main>

      <footer className="border-t border-ink px-5 py-8 pb-24 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-ui-mono text-[11px] tracking-[0.15em] text-ink2 uppercase">
          <p>
            © {new Date().getFullYear()} {profile.identity.name}
          </p>
          <button
            type="button"
            onClick={() => openChat()}
            className="text-brand transition-colors hover:text-ink"
          >
            Ask my agent anything →
          </button>
        </div>
      </footer>
    </div>
  );
}
