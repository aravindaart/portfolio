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
      {/* Sticky translucent nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            {profile.identity.name}
          </a>
          <nav className="hidden items-center gap-7 text-sm text-ink2 sm:flex">
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
            className="rounded-full bg-coral px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-coral2"
          >
            Ask my agent
          </button>
        </div>
      </header>

      <main id="top">
        <OverviewHero profile={profile} />

        {/* Stats strip */}
        <section className="border-y border-hairline bg-card px-6 py-12">
          <Reveal>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-semibold tracking-tight text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs text-ink2">{stat.label}</p>
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

      <footer className="border-t border-hairline px-6 py-10 pb-24">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-ink2">
          <p>
            © {new Date().getFullYear()} {profile.identity.name} · Built with
            Next.js and a real agent.
          </p>
          <button
            type="button"
            onClick={() => openChat()}
            className="font-medium text-coral transition-colors hover:text-coral2"
          >
            Ask my agent anything →
          </button>
        </div>
      </footer>
    </div>
  );
}
