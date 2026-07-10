"use client";

import Image from "next/image";
import { useState } from "react";
import { Scanline } from "@/components/effects/Scanline";

/**
 * Renders /headshot-v2.jpg with a scanline treatment; falls back to a
 * styled terminal-avatar block until the photo file exists in /public.
 * Pre-cropped square (top-anchored, full head + shoulders) so
 * object-fit:cover needs no position bias here. Filename is versioned —
 * Next's image optimizer caches by URL for 4h, so any future photo swap
 * needs a new filename (not an overwrite) to bust client-side caches.
 */
export function Headshot({
  name,
  available = true,
}: {
  name: string;
  /** Server-checked file existence — skips the request entirely when absent. */
  available?: boolean;
}) {
  const [missing, setMissing] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Scanline className="h-32 w-32 shrink-0 rounded-2xl border border-edge bg-surface sm:h-56 sm:w-56">
      {!available || missing ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 font-mono">
          <span className="text-5xl text-accent">{initials}</span>
          <span className="text-[10px] tracking-widest text-dim">
            [ image: pending ]
          </span>
        </div>
      ) : (
        <>
          <Image
            src="/headshot-v2.jpg"
            alt={`Portrait of ${name}`}
            fill
            sizes="(min-width: 640px) 14rem, 11rem"
            className="object-cover saturate-90 brightness-95"
            onError={() => setMissing(true)}
            priority
          />
          {/* Vignette: the photo's bright office background otherwise reads
              as a cutout against the dark theme; this fades it into the
              card edge without touching the source image. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_35%,transparent_35%,var(--color-bg)_125%)] opacity-70"
          />
        </>
      )}
    </Scanline>
  );
}
