"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

type SendState = "idle" | "sending" | "sent" | "error" | "rate-limited";

const inputClass =
  "w-full border-0 border-b border-hairline bg-transparent px-0 py-3 text-base text-ink outline-none transition-colors focus:border-ink sm:text-sm";

/** Editorial contact section; same /api/contact flow as before. */
export function OverviewContact({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");

  // No mailto: href in the rendered HTML — the address only surfaces
  // when a visitor acts, which keeps it out of scraper sweeps.
  const openMail = () => {
    window.location.href = `mailto:${profile.contact.email}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      openMail();
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSendState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (response.status === 429) {
        setSendState("rate-limited");
        return;
      }
      if (!response.ok) throw new Error(`status ${response.status}`);
      setSendState("sent");
      form.reset();
    } catch {
      setSendState("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-8">
            <h2 className="font-display text-4xl text-ink sm:text-6xl">
              The next chapter starts
              <br />
              <em className="text-coral">with a message.</em>
            </h2>
            <p className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
              04 — Contact
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="space-y-6">
              <p className="max-w-sm text-base leading-relaxed text-ink/80">
                Based in {profile.identity.location} · open to relocation and
                remote · forward-deployed and client-facing roles.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80"
                >
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
                <button
                  type="button"
                  onClick={openMail}
                  className="rounded-sm border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Open mail app
                </button>
              </div>
              <ul className="space-y-2 font-ui-mono text-xs">
                <li>
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink2 transition-colors hover:text-coral"
                  >
                    github.com/aravindaart ↗
                  </a>
                </li>
                <li>
                  <a
                    href={profile.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink2 transition-colors hover:text-coral"
                  >
                    linkedin.com/in/aravindaart ↗
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-7">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                    Name
                  </span>
                  <input
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className="font-ui-mono text-[11px] tracking-[0.18em] text-ink2 uppercase">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  maxLength={2000}
                  rows={4}
                  className={inputClass}
                />
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="rounded-sm bg-coral px-6 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
                >
                  {sendState === "sending" ? "Sending…" : "Send message"}
                </button>
                <p aria-live="polite" className="text-xs text-ink2">
                  {sendState === "sent" && "Delivered — expect a reply soon."}
                  {sendState === "error" &&
                    "Delivery failed — use the email button instead."}
                  {sendState === "rate-limited" &&
                    "Too many messages recently — try again shortly, or use the email button."}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
