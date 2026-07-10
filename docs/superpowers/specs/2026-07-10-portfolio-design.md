# Portfolio Website — Design Spec

**Date:** 2026-07-10
**Owner:** Aravindhan Mohan
**Goal:** A trend-setting, storytelling portfolio positioning Aravindhan for Forward Deployed Engineer (FDE) roles. Theme: AI-driven techie. Audience: recruiters and hiring managers at AI-forward companies.

---

## 1. Positioning & Narrative

**Core thesis:** *"Forward-deployed before it had a name."*

Aravindhan's 11-year career is retold as an FDE origin story:

- **TCS (2015–2020):** Demoed POS solutions live to international clients, changing features in real time during demos; technical advisor in pre-sales; trained 500+ engineers per batch. → *Client-facing engineering instincts.*
- **Walmart (2020–2022):** Full-stack ownership with measurable impact — ~80% compliance-submission time reduction, ~30% infra cost cut, ~50% ops time saved; recognized platform-reuse opportunity for COVID insurance enrollment. → *Impact-obsessed, systems thinking.*
- **UOB (2022–present):** Embedded frontend lead in regulated banking; led OTP-abuse incident response end-to-end (detect → mitigate → harden); drove multi-market lending platform transformation bridging business and engineering. → *Embedded in the client's fire.*

Every section reinforces: this person already does the FDE job.

## 2. Audience-First UX Decisions

- **Recruiter test:** who/what/level/impact visible above the fold before any animation completes. Hero copy renders immediately; animation is progressive enhancement.
- **Recruiter Mode toggle** (header + `?mode=recruiter` URL param, persisted in localStorage): collapses the story into a scannable one-page, ATS-friendly summary with a **PDF resume download**. All animation disabled in this mode.
- **Story must never hold content hostage:** sticky chapter navigation, command palette (⌘K) jump-to-anything, `prefers-reduced-motion` fully respected.

## 3. Site Structure (Story Mode)

1. **Hero — Boot Sequence.** Terminal types identity/role/location over a lazy-loaded neural-particle canvas. Ends on the thesis line. Photo (user-provided) gets a scan-line reveal treatment. Placeholder until photo is supplied.
2. **Chapter 1 — TCS: "Deployed before it was a job title."** Live-demo story, pre-sales advisor role, 500+ trained per batch.
3. **Chapter 2 — Walmart: "Full-stack, full ownership."** Metric cards (80% / 30% / 50%) counting up on scroll; COVID insurance platform-reuse story.
4. **Chapter 3 — UOB: "Embedded in the fire."** Interactive incident timeline for the OTP-abuse response; multi-market lending platform story; zero-downtime/regulated-environment credentials.
5. **Chapter 4 — The FDE Thesis.** Skills-to-FDE-competency mapping (client empathy, rapid prototyping, production reliability, cross-team bridging) drawing lines back to chapters 1–3.
6. **Terminal + AI Twin.** Interactive terminal: `help`, `experience`, `skills`, `incidents`, `certs`, `contact`, `recruiter` (toggles mode), `ai`. The `ai` command hands off to a live LLM chat **only when an API key is configured**; otherwise the scripted terminal is the complete experience — no broken or "coming soon" states.
7. **Contact.** Email copy-to-clipboard (lightly obfuscated from scrapers), LinkedIn, GitHub, contact form (serverless route; form service wired at deploy time).

## 4. AI Twin (the trend-setter feature)

- **Mode chosen: Both.** Scripted terminal always works (static, free). Real AI chat activates when `AI_GATEWAY_API_KEY` / Anthropic key is present.
- Serverless route `/api/chat` using Vercel AI SDK (v6), streaming responses.
- System prompt grounded exclusively in the typed profile data layer; instructed to decline out-of-scope questions and never invent facts.
- Answers include **section citations** that scroll the page to the relevant chapter.
- Rate limiting on the route; input length caps; no PII beyond published profile.

## 5. Architecture

- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion. Static-first; the chat route is the only server dependency.
- **Single source of truth:** `content/profile.ts` — typed career data (roles, stories, metrics, skills, certs, contact). Story mode, Recruiter Mode, terminal responses, PDF resume, and the AI system prompt all derive from it.
- **Key modules (small, focused files):**
  - `content/profile.ts` — data layer
  - `lib/terminal/commands.ts` — pure command parser/executor (unit-testable)
  - `lib/ai/system-prompt.ts` — profile → grounding prompt transform
  - `components/story/*` — one component per chapter
  - `components/terminal/*`, `components/recruiter/*`, `components/effects/*` (particles, typing, scan-line)
  - `app/api/chat/route.ts` — AI endpoint (graceful 503 → terminal fallback when no key)

## 6. Theme & Visual Language

Dark AI-terminal aesthetic: near-black background, phosphor-green/cyan accent, monospace display type paired with a clean sans for body. Motifs: terminal frames, code-block cards, subtle grid, scan-lines, neural particle field. Restraint rule: max one ambient effect per viewport; content legibility always wins.

## 7. Performance & Accessibility Budget

- Lighthouse ≥ 95 across the board (a performance lead's portfolio must be fast — it's self-demonstrating).
- Particle canvas lazy-loaded, paused off-screen, disabled on `prefers-reduced-motion` and low-power devices.
- Semantic HTML, keyboard-navigable terminal and palette, WCAG AA contrast.

## 8. Testing

- Unit tests: terminal command parser, profile→prompt transform, recruiter-mode state logic (Vitest + Testing Library).
- Route test for `/api/chat` fallback behavior without a key.
- Manual visual QA via local preview at each milestone.

## 9. Implementation Plan (phases)

1. **Scaffold:** Next.js + TS + Tailwind + Framer Motion; git init; base theme tokens; `content/profile.ts` fully populated from the provided profile.
2. **Story Mode:** hero boot sequence → chapters 1–4 → FDE thesis section, with scroll animations and chapter nav.
3. **Terminal:** parser + UI + commands (TDD on the parser).
4. **Recruiter Mode:** toggle, condensed view, print-friendly PDF resume.
5. **AI Twin:** chat route, streaming UI, citations, no-key fallback.
6. **Polish:** command palette, contact section + form, a11y/perf pass, Lighthouse audit.
7. **Deploy (deferred):** Vercel + `aravindaart.com` when you're ready.

## 10. Open Inputs (blocking items marked)

| Input | Status |
| --- | --- |
| Design approval | **Pending — blocks build** |
| Published email: `sayhi@aravindaart.com` (recommended, needs forwarding) vs `aravindaart23@gmail.com` | Pending — placeholder until decided |
| LinkedIn URL | Pending — placeholder link until provided |
| GitHub username (or omit) | Pending — placeholder until provided |
| Headshot photo | Pending — styled placeholder until provided; drop the file anywhere in the project folder |
| Domain/deploy | Deferred by choice until build complete |
