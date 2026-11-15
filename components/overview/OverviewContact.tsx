"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/story/Reveal";

type SendState = "idle" | "sending" | "sent" | "error" | "rate-limited";

const inputClass =
  "w-full rounded-xl border border-hairline bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-coral sm:text-sm";

/** Light-themed contact section; same /api/contact flow as the terminal view. */
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
    <section id="contact" className="scroll-mt-16 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            The next chapter starts
            <br /> with a message.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-ink2">
            Based in {profile.identity.location} · open to relocation and
            remote · forward-deployed and client-facing roles.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85"
                >
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
                <button
                  type="button"
                  onClick={openMail}
                  className="rounded-full border border-hairline bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-coral"
                >
                  Open mail app
                </button>
              </div>
              <ul className="space-y-2 text-sm">
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

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink2">
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
                <span className="mb-1.5 block text-xs font-medium text-ink2">
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
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink2">
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
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral2 disabled:opacity-50"
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
