"use client";

import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";
import { useChatOverlay } from "@/lib/chat-overlay";
import { useMode } from "@/lib/mode";

/** Static transcript still — a product shot of the real chat. */
const PREVIEW = {
  question: "Why is he a fit for an FDE role?",
  tool: 'search_experience({ query: "forward deployed" })',
  elbow: "done · 3 chapters matched",
  answer:
    "He's been doing the FDE job since before it had a title — live client demos at TCS, end-to-end systems at Walmart, production incident command at UOB…",
};

export function OverviewHero({ profile }: { profile: Profile }) {
  const { openChat } = useChatOverlay();
  const { setMode } = useMode();

  return (
    <section className="px-5 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-3 font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
            <span>Portfolio — Forward Deployed Engineer</span>
            <span>Singapore · open to relocation</span>
          </div>

          <h1 className="font-display mt-10 text-[17vw] leading-[0.95] tracking-tight text-ink sm:text-8xl md:text-9xl">
            Forward-deployed
            <br />
            <em className="text-coral">before it had a name.</em>
          </h1>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-10 border-t border-hairline pt-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                {profile.identity.name}
              </p>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink/80">
                11+ years embedded with clients across banking, retail, and
                enterprise. Sits with the stakeholder, understands the
                workflow, ships the change while they watch.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80"
                >
                  Ask my agent
                </button>
                <button
                  type="button"
                  onClick={() => setMode("recruiter")}
                  className="rounded-sm border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  View résumé
                </button>
              </div>
            </div>

            {/* Flat product shot of the chat; clicking opens the real thing */}
            <div className="md:col-span-7">
              <button
                type="button"
                onClick={() => openChat(PREVIEW.question)}
                aria-label="Open the live agent chat"
                className="group block w-full rounded-sm border border-ink bg-cc-bg p-5 text-left transition-colors hover:border-coral sm:p-6"
              >
                <p className="font-ui-mono text-[10px] tracking-[0.18em] text-cc-dim uppercase">
                  Live session — it really answers
                </p>
                <p className="mt-4 ml-auto w-fit max-w-[85%] rounded-sm bg-cc-raise px-3.5 py-2 text-sm text-cc-text">
                  {PREVIEW.question}
                </p>
                <p className="mt-3 font-ui-mono text-xs text-cc-dim">
                  <span className="text-coral2">⏺</span>{" "}
                  <span className="text-cc-text">{PREVIEW.tool}</span>
                </p>
                <p className="mt-1 pl-4 font-ui-mono text-xs text-cc-dim">
                  ⎿ {PREVIEW.elbow}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cc-text/85">
                  {PREVIEW.answer}
                </p>
                <p className="mt-4 font-ui-mono text-[11px] text-coral2 opacity-70 transition-opacity group-hover:opacity-100">
                  ▶ open session
                </p>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
