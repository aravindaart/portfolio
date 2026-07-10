"use client";

import { useState } from "react";
import { Reveal } from "@/components/story/Reveal";
import type { Profile } from "@/lib/types";

type SendState = "idle" | "sending" | "sent" | "error";

export function ContactSection({ profile }: { profile: Profile }) {
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
      if (!response.ok) throw new Error(`status ${response.status}`);
      setSendState("sent");
      form.reset();
    } catch {
      setSendState("error");
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl px-6">
        <Reveal>
          <p className="font-mono text-sm tracking-widest text-accent2 uppercase">
            Chapter 06 — Open Channel
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-text sm:text-5xl">
            The next chapter starts with a message.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded border border-accent px-4 py-3 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-bg"
                >
                  {copied ? "copied ✓" : "copy email"}
                </button>
                <button
                  type="button"
                  onClick={openMail}
                  className="rounded border border-edge px-4 py-3 font-mono text-sm text-dim transition-colors hover:border-accent2 hover:text-accent2"
                >
                  open mail app
                </button>
              </div>
              <ul className="space-y-2 font-mono text-sm">
                <li>
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim transition-colors hover:text-accent"
                  >
                    github.com/aravindaart ↗
                  </a>
                </li>
                <li>
                  <a
                    href={profile.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim transition-colors hover:text-accent"
                  >
                    linkedin.com/in/aravindaart ↗
                  </a>
                </li>
              </ul>
              <p className="max-w-md text-sm leading-relaxed text-dim">
                Based in {profile.identity.location}. Open to conversations
                about forward-deployed and client-facing engineering roles.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block font-mono text-xs text-dim">
                  name
                </span>
                <input
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded border border-edge bg-surface px-3 py-3 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-xs text-dim">
                  email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className="w-full rounded border border-edge bg-surface px-3 py-3 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-xs text-dim">
                  message
                </span>
                <textarea
                  name="message"
                  required
                  maxLength={2000}
                  rows={4}
                  className="w-full rounded border border-edge bg-surface px-3 py-3 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="rounded bg-accent px-4 py-3 font-mono text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {sendState === "sending" ? "sending…" : "send message"}
                </button>
                <p aria-live="polite" className="font-mono text-xs text-dim">
                  {sendState === "sent" && "delivered — expect a reply soon."}
                  {sendState === "error" &&
                    "delivery failed — use the email button instead."}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
