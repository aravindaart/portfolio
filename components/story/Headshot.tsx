"use client";

import Image from "next/image";
import { useState } from "react";
import { Scanline } from "@/components/effects/Scanline";

/**
 * Renders /headshot.jpg with a scanline treatment; falls back to a styled
 * terminal-avatar block until the photo file exists in /public.
 */
export function Headshot({ name }: { name: string }) {
  const [missing, setMissing] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Scanline className="h-44 w-44 shrink-0 rounded-2xl border border-edge bg-surface sm:h-56 sm:w-56">
      {missing ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 font-mono">
          <span className="text-5xl text-accent">{initials}</span>
          <span className="text-[10px] tracking-widest text-dim">
            [ image: pending ]
          </span>
        </div>
      ) : (
        <Image
          src="/headshot.jpg"
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 640px) 14rem, 11rem"
          className="object-cover"
          onError={() => setMissing(true)}
          priority
        />
      )}
    </Scanline>
  );
}
