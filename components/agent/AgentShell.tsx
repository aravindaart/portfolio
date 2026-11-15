"use client";

import { profile } from "@/content/profile";
import { harness } from "@/content/harness";
import { AgentHero } from "@/components/agent/AgentHero";
import { BootSequence } from "@/components/agent/BootSequence";
import { ChapterBlock } from "@/components/agent/ChapterBlock";
import { CompetencyBlock } from "@/components/agent/CompetencyBlock";
import { HarnessSection } from "@/components/agent/HarnessSection";
import { SkillsBlock } from "@/components/agent/SkillsBlock";
import { StatusBar } from "@/components/agent/StatusBar";
import { ToolBlock } from "@/components/agent/ToolBlock";
import { ContactSection } from "@/components/contact/ContactSection";
import { useChatOverlay } from "@/lib/chat-overlay";

export function AgentShell() {
  const { openChat } = useChatOverlay();

  return (
    <main className="bg-grid min-h-screen bg-bg text-text">
      <BootSequence />
      <StatusBar />

      <AgentHero profile={profile} />

      <ToolBlock
        tool="read_profile"
        args='{ section: "summary" }'
        status="ok · 3 chapters queued"
      >
        <div className="space-y-4 text-base leading-relaxed text-text/80">
          {profile.identity.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </ToolBlock>

      {profile.chapters.map((chapter) => (
        <ChapterBlock key={chapter.id} chapter={chapter} />
      ))}

      <CompetencyBlock profile={profile} />
      <HarnessSection harness={harness} />
      <SkillsBlock profile={profile} />

      <ToolBlock
        tool="open_session"
        args='{ model: "gemini-3.1-flash-lite", grounded: true }'
        status="ok · live — same tools, real model, nothing scripted"
      >
        <h2 className="text-2xl font-bold text-text sm:text-3xl">
          Don&apos;t take the page&apos;s word for it
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text/70">
          The live session is a real agent: it answers by calling the same
          tools this page was rendered with, grounded in the same profile —
          and you can watch every call it makes. Opens full screen.
        </p>
        <button
          type="button"
          onClick={() => openChat()}
          className="mt-5 rounded border border-accent bg-accent/10 px-4 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent/20"
        >
          ▶ open live session
        </button>
      </ToolBlock>

      <ContactSection profile={profile} />

      <footer className="mx-auto w-full max-w-4xl px-4 py-10 font-mono text-xs text-dim sm:px-6">
        <p>
          <span className="text-accent">⏺</span> finish(
          {'{ status: "ready to deploy" }'})
        </p>
        <p className="mt-2 pl-5">
          <span aria-hidden className="mr-2 text-edge">⎿</span>
          session complete — built with Next.js, react-three-fiber &amp; the AI
          SDK · © {new Date().getFullYear()} {profile.identity.name}
        </p>
      </footer>
    </main>
  );
}
