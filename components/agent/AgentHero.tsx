"use client";

import dynamic from "next/dynamic";
import type { Profile } from "@/lib/types";
import { TypingText } from "@/components/effects/TypingText";
import { useMode } from "@/lib/mode";
import { useChatOverlay } from "@/lib/chat-overlay";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// WebGL is client-only; keep the globe entirely out of the server bundle.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function AgentHero({ profile }: { profile: Profile }) {
  const reduced = useReducedMotion();
  const { setMode } = useMode();
  const { openChat } = useChatOverlay();

  return (
    <header className="relative flex min-h-[92svh] items-center overflow-hidden">
      {/* 3D backdrop — decorative, masked toward the text side */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-full opacity-70 sm:left-1/3 sm:w-auto sm:opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)]"
      >
        <HeroScene animate={!reduced} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6">
        <p className="font-mono text-xs text-dim">
          <span className="text-accent">$</span> agent run --task{" "}
          <span className="text-accent2">
            &quot;present aravindhan for fde roles&quot;
          </span>
        </p>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-6xl">
          {profile.identity.name}
        </h1>
        <p className="mt-3 font-mono text-sm text-accent sm:text-base">
          <TypingText text={profile.identity.title} />
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text/80">
          {profile.identity.thesis} Eleven years of client-embedded engineering
          — demos that ship live changes, production incidents commanded
          end-to-end, and an agent harness built where no model API existed.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
          <button
            type="button"
            onClick={() => openChat()}
            className="rounded border border-accent bg-accent/10 px-4 py-2.5 text-accent transition-colors hover:bg-accent/20"
          >
            ▶ open live session
          </button>
          <button
            type="button"
            onClick={() => setMode("overview")}
            className="rounded border border-edge px-4 py-2.5 text-dim transition-colors hover:border-accent2 hover:text-accent2"
          >
            human-readable mode
          </button>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-dim">
          <span>📍 {profile.identity.location} · open to relocation</span>
          <span className="text-accent">● available for FDE roles</span>
        </div>
      </div>
    </header>
  );
}
