"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TypingText } from "@/components/effects/TypingText";
import { Headshot } from "@/components/story/Headshot";
import type { Profile } from "@/lib/types";

const ParticleField = dynamic(
  () => import("@/components/effects/ParticleField"),
  { ssr: false },
);

const BOOT_LINES = [
  "> initializing aravindhan.mohan …",
  "> loading 11 years of production systems … ok",
  "> banking · retail · enterprise … ok",
  "> role.target = forward_deployed_engineer",
];

export function Hero({ profile }: { profile: Profile }) {
  const [bootStep, setBootStep] = useState(0);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-grid"
    >
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-24 sm:flex-row sm:items-center sm:gap-14">
        <Headshot name={profile.identity.name} />
        <div className="min-w-0">
          {/* Identity is plain SSR HTML — visible before any animation runs. */}
          <p className="font-mono text-sm text-accent">
            {profile.identity.location} · {profile.identity.tagline}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-6xl">
            {profile.identity.name}
          </h1>
          <p className="mt-2 text-lg text-dim sm:text-xl">
            {profile.identity.title}
          </p>

          <div className="mt-8 rounded-lg border border-edge bg-surface/80 p-4 font-mono text-sm text-dim backdrop-blur">
            <div className="mb-3 flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
            </div>
            {BOOT_LINES.slice(0, bootStep + 1).map((line, i) => (
              <p key={line} className="leading-relaxed">
                {i === bootStep ? (
                  <TypingText
                    text={line}
                    onDone={() =>
                      setBootStep((s) => Math.min(s + 1, BOOT_LINES.length))
                    }
                  />
                ) : (
                  line
                )}
              </p>
            ))}
            {bootStep >= BOOT_LINES.length && (
              <p className="mt-2 text-base text-accent">
                <TypingText
                  text={`“${profile.identity.thesis}”`}
                  speed={40}
                  showCaret
                />
              </p>
            )}
          </div>
        </div>
      </div>
      <a
        href="#tcs"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-xs text-dim transition-colors hover:text-accent"
      >
        ▼ scroll to begin the story
      </a>
    </section>
  );
}
