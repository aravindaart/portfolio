"use client";

import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";
import { useChatOverlay } from "@/lib/chat-overlay";
import { useMode } from "@/lib/mode";

/** Static transcript snippet — a product shot of the real chat. */
const PREVIEW_LINES = [
  { kind: "user" as const, text: "Why is he a fit for an FDE role?" },
  { kind: "tool" as const, text: 'search_experience({ query: "forward deployed" })' },
  { kind: "elbow" as const, text: "done · 3 chapters matched" },
  {
    kind: "answer" as const,
    text: "He's been doing the FDE job since before it had a title — live client demos at TCS, end-to-end systems at Walmart, production incident command at UOB…",
  },
];

export function OverviewHero({ profile }: { profile: Profile }) {
  const { openChat } = useChatOverlay();
  const { setMode } = useMode();

  return (
    <section className="px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-sm font-medium tracking-widest text-coral uppercase">
            Forward Deployed Engineer
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
            Forward-deployed
            <br />
            before it had a name.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink2 sm:text-xl">
            {profile.identity.name} — 11+ years embedded with clients across
            banking, retail, and enterprise. Sits with the stakeholder,
            understands the workflow, ships the change while they watch.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openChat()}
              className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral2"
            >
              Ask my agent
            </button>
            <button
              type="button"
              onClick={() => setMode("recruiter")}
              className="text-sm font-medium text-coral transition-colors hover:text-coral2"
            >
              View résumé →
            </button>
          </div>
        </Reveal>

        {/* Product shot: a real-looking still of the chat, click to open it */}
        <Reveal delay={0.2}>
          <button
            type="button"
            onClick={() => openChat("Why is he a fit for an FDE role?")}
            aria-label="Open the live agent chat"
            className="group mx-auto mt-16 block w-full max-w-2xl rounded-3xl border border-hairline bg-cc-bg p-1.5 text-left shadow-[0_24px_60px_-24px_rgba(28,25,23,0.35)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-1.5 px-4 py-2.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-cc-edge" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-cc-edge" />
              <span className="ml-2 font-ui-mono text-[11px] text-cc-dim">
                aravindhan · fde session
              </span>
            </div>
            <div className="space-y-2.5 rounded-[1.1rem] bg-cc-panel px-5 py-5">
              <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-cc-raise px-3.5 py-2 text-sm text-cc-text">
                {PREVIEW_LINES[0].text}
              </p>
              <p className="font-ui-mono text-xs text-cc-dim">
                <span className="text-coral2">⏺</span>{" "}
                <span className="text-cc-text">{PREVIEW_LINES[1].text}</span>
              </p>
              <p className="pl-4 font-ui-mono text-xs text-cc-dim">
                ⎿ {PREVIEW_LINES[2].text}
              </p>
              <p className="text-sm leading-relaxed text-cc-text/85">
                {PREVIEW_LINES[3].text}
              </p>
              <p className="pt-1 text-center font-ui-mono text-[11px] text-coral2 opacity-80 transition-opacity group-hover:opacity-100">
                ▶ open the live session — it really answers
              </p>
            </div>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
