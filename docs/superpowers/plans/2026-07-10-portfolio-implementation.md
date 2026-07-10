# FDE Storytelling Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Aravindhan Mohan's storytelling portfolio site (spec: `docs/superpowers/specs/2026-07-10-portfolio-design.md`) — dark AI-terminal themed, scroll-driven FDE narrative, interactive terminal, Recruiter Mode, and an AI-twin chat that activates only when an API key is configured.

**Architecture:** Next.js App Router, static-first. One typed data layer (`content/profile.ts`) feeds every surface: story chapters, recruiter view, terminal, and the AI system prompt. Pure logic (terminal engine, prompt builder) lives in `lib/` and is unit-tested; visual components live in `components/` and are verified via dev-server preview.

**Tech Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion (`motion`) + Vercel AI SDK (`ai`) + Vitest.

## Global Constraints

- Published contact: email `sayhi@aravindaart.com`, GitHub `https://github.com/aravindaart`, LinkedIn `https://www.linkedin.com/in/aravindaart/`.
- Thesis line (exact copy): **"Forward-deployed before it had a name."**
- No broken/"coming soon" states: without an AI key, the `ai` terminal command explains the scripted mode and everything else works fully.
- `prefers-reduced-motion` disables particle canvas, typing effects (render final text instantly), and scroll animations.
- Recruiter Mode = `?mode=recruiter` URL param + header toggle, persisted in `localStorage` key `portfolio-mode`; animation-free, print-friendly.
- Headshot: use `public/headshot.jpg` if present at build/runtime via `next/image` with styled placeholder fallback (`components/story/Headshot.tsx` renders placeholder when image 404s / file absent).
- Performance: particle canvas lazy-loaded (`next/dynamic`, `ssr: false`), paused when off-screen.
- Immutability, small focused files (<400 lines), no hardcoded secrets. AI key read from `process.env.AI_GATEWAY_API_KEY` (fallback `ANTHROPIC_API_KEY`).
- Node 20 environment; npm as package manager.
- Commit after every green task (`feat:`/`test:`/`chore:` conventional commits, no attribution footer).

## File Structure

```
app/
  layout.tsx            # fonts, metadata, ModeProvider
  page.tsx              # assembles story sections / recruiter view
  globals.css           # Tailwind + theme tokens + print styles
  api/chat/route.ts     # AI twin endpoint (503 when no key)
content/profile.ts      # single source of truth (typed career data)
lib/
  types.ts              # Profile/Chapter/Metric/CommandResult types
  terminal/commands.ts  # pure command engine
  ai/system-prompt.ts   # profile -> grounding prompt
  mode.tsx              # ModeProvider + useMode (story|recruiter)
components/
  effects/ParticleField.tsx, TypingText.tsx, Scanline.tsx
  story/Hero.tsx, Chapter.tsx, MetricCard.tsx, IncidentTimeline.tsx,
        FdeThesis.tsx, Headshot.tsx
  terminal/Terminal.tsx, AiChat.tsx
  recruiter/RecruiterView.tsx, ModeToggle.tsx
  nav/ChapterNav.tsx, CommandPalette.tsx
  contact/ContactSection.tsx
tests/ (vitest, mirrors lib/)
```

---

### Task 1: Scaffold + theme tokens

**Files:** Create Next.js app in repo root (keep existing `docs/`, `.git`); modify `app/globals.css`, `app/layout.tsx`.

- [ ] **Step 1:** `npx --yes create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes` (run in a temp dir and merge if it refuses non-empty dir).
- [ ] **Step 2:** `npm i motion ai @ai-sdk/react zod && npm i -D vitest @vitest/coverage-v8` ; add `"test": "vitest run"` script.
- [ ] **Step 3:** Theme tokens in `globals.css` (`@theme` block): `--color-bg: #060a0f`, `--color-surface: #0b1118`, `--color-accent: #22d3ae` (phosphor teal-green), `--color-accent2: #67e8f9`, `--color-text: #d7e2ea`, `--color-dim: #7b8a96`; mono font `JetBrains Mono` + sans `Inter` via `next/font/google`. Scanline/grid utility classes.
- [ ] **Step 4:** `npm run build` passes. Commit `chore: scaffold next.js app with theme tokens`.

### Task 2: Types + profile data layer

**Files:** Create `lib/types.ts`, `content/profile.ts`, test `tests/profile.test.ts`.

**Interfaces (produced, used by all later tasks):**

```ts
// lib/types.ts
export interface Metric { value: number; suffix: string; label: string }
export interface TimelineStep { phase: string; title: string; detail: string }
export interface Chapter {
  id: string;               // 'tcs' | 'walmart' | 'uob' — used as section anchor + AI citation id
  index: number; company: string; role: string; period: string; location: string;
  headline: string; kicker: string; narrative: string[];
  highlights: string[]; metrics?: Metric[]; timeline?: TimelineStep[];
}
export interface FdeCompetency { competency: string; evidence: string; chapterId: string }
export interface Profile {
  identity: { name: string; title: string; tagline: string; location: string; thesis: string; summary: string[] };
  contact: { email: string; github: string; linkedin: string };
  chapters: Chapter[];       // ordered TCS -> Walmart -> UOB
  fdeCompetencies: FdeCompetency[];
  skills: { group: string; items: string[] }[];
  certifications: { name: string; issuer: string; year: string }[];
  lookingFor: string[];
}
export type CommandAction = { type: 'clear' } | { type: 'ai' } | { type: 'recruiter' } | { type: 'scroll'; target: string };
export interface CommandResult { output: string[]; action?: CommandAction }
```

- [ ] **Step 1:** Failing test `tests/profile.test.ts`: profile has 3 chapters in order tcs/walmart/uob; every chapter has ≥2 highlights and non-empty narrative; walmart chapter has 3 metrics (80/30/50); uob chapter has a timeline with ≥4 steps; contact matches Global Constraints; every `fdeCompetency.chapterId` exists in chapters.
- [ ] **Step 2:** Configure vitest (`vitest.config.ts` with `@` alias), run — fails (no profile).
- [ ] **Step 3:** Write `content/profile.ts` populated verbatim-faithfully from the user profile (TCS live-demo/pre-sales/500+ trainees; Walmart bulk-upload 80%, cost 30%, ops 50%, COVID insurance platform-reuse; UOB WSM lead, multi-market lending platform, OTP-abuse incident timeline: Detect → Assess → Mitigate → Harden → Monitor; certifications list; FDE competency mapping).
- [ ] **Step 4:** Tests pass. Commit `feat: typed profile data layer`.

### Task 3: Terminal command engine (TDD)

**Files:** Create `lib/terminal/commands.ts`, test `tests/commands.test.ts`.

**Interfaces:** Produces `executeCommand(input: string, profile: Profile): CommandResult`; pure, no DOM. Commands: `help`, `whoami`, `experience [company]`, `skills`, `incidents`, `certs`, `contact`, `looking-for`, `recruiter`, `ai`, `clear`, `open <tcs|walmart|uob|contact>`; unknown → suggestion of closest command (Levenshtein ≤2) + `help` hint.

- [ ] **Step 1:** Failing tests: `help` lists all commands; `experience walmart` output contains "80%"; `open uob` returns `{action:{type:'scroll',target:'uob'}}`; `clear` returns clear action; unknown `experiense` suggests `experience`; input is case/whitespace-insensitive; `contact` includes `sayhi@aravindaart.com`.
- [ ] **Step 2:** Run — fails. **Step 3:** Implement (pure functions, command registry map, small Levenshtein helper). **Step 4:** Pass. **Step 5:** Commit `feat: terminal command engine`.

### Task 4: AI system prompt builder (TDD)

**Files:** Create `lib/ai/system-prompt.ts`, test `tests/system-prompt.test.ts`.

**Interfaces:** `buildSystemPrompt(profile: Profile): string`.

- [ ] **Step 1:** Failing tests: prompt contains all three chapter ids as `[cite:tcs]`-style citation instructions; contains grounding rule text "Only answer from the profile facts"; contains refusal instruction for out-of-scope; includes contact email; length > 1500 chars.
- [ ] **Steps 2–5:** Red → implement (template assembling identity, chapters w/ highlights+metrics, competencies, citation + refusal rules) → green → commit `feat: AI grounding prompt builder`.

### Task 5: Mode provider + Recruiter toggle logic

**Files:** Create `lib/mode.tsx` (`ModeProvider`, `useMode(): { mode: 'story'|'recruiter'; toggle(): void }` — reads `?mode=` then `localStorage['portfolio-mode']`, defaults `story`), `components/recruiter/ModeToggle.tsx`. Test `tests/mode.test.ts` for the pure resolver `resolveInitialMode(param: string|null, stored: string|null): Mode`.

- [ ] TDD the resolver (param wins over storage; invalid values → `story`), implement provider + accessible toggle button (labeled "Recruiter Mode"). Commit `feat: recruiter mode state`.

### Task 6: Effects components

**Files:** Create `components/effects/TypingText.tsx` (typewriter with caret; renders full text instantly under reduced motion), `components/effects/ParticleField.tsx` (canvas neural particles + connecting lines, `IntersectionObserver` pause, `dynamic` import, reduced-motion → static gradient), `components/effects/Scanline.tsx` (CSS overlay). Manual verification via dev server. Commit `feat: ambient effects`.

- [ ] Done + committed.

### Task 7: Hero + Headshot

**Files:** Create `components/story/Hero.tsx`, `components/story/Headshot.tsx`; wire into `app/page.tsx`.

- [ ] Boot-sequence: terminal frame types `> initializing aravindhan.mohan …` lines then thesis **"Forward-deployed before it had a name."**; name/title/location rendered in SSR HTML immediately (animation overlays, never gates content). Headshot: `next/image` from `/headshot.jpg` with `onError` fallback to styled ASCII-ish placeholder block; scanline overlay. Scroll cue. Commit `feat: hero boot sequence`.

### Task 8: Story chapters + FDE thesis

**Files:** Create `components/story/Chapter.tsx` (generic chapter shell: kicker, headline, narrative, highlights), `MetricCard.tsx` (count-up on in-view via `motion`), `IncidentTimeline.tsx` (vertical stepper animating per step for UOB), `FdeThesis.tsx` (competency grid linking evidence → chapter anchors); assemble all chapters in `app/page.tsx` with section `id={chapter.id}`.

- [ ] Implement + visual QA at all breakpoints (preview tools). Commit `feat: story chapters and FDE thesis`.

### Task 9: Terminal UI

**Files:** Create `components/terminal/Terminal.tsx` — input with prompt `guest@aravindaart:~$`, history (up/down arrows), output log, executes via `executeCommand`; handles actions: `clear` empties log, `scroll` → `document.getElementById(target)?.scrollIntoView`, `recruiter` → `useMode().toggle()`, `ai` → swaps in `AiChat` when `NEXT_PUBLIC_AI_ENABLED==='1'`, else prints scripted explanation line.

- [ ] Implement + keyboard a11y (focus trap opt-in, Esc blurs). Commit `feat: interactive terminal`.

### Task 10: AI chat route + UI

**Files:** Create `app/api/chat/route.ts`, `components/terminal/AiChat.tsx`. Test `tests/chat-route.test.ts` for the pure guard `chatGuard(env, body)`.

```ts
// route behavior
const key = process.env.AI_GATEWAY_API_KEY ?? process.env.ANTHROPIC_API_KEY;
if (!key) return Response.json({ error: 'ai_unavailable' }, { status: 503 });
// validate body: messages array ≤ 20, each content ≤ 1000 chars (zod) → 400 otherwise
// streamText({ model: 'anthropic/claude-sonnet-5' (gateway string), system: buildSystemPrompt(profile), messages })
```

- [ ] TDD `chatGuard` (no key → 503 shape; oversized input → 400 shape; valid → ok). AiChat UI: `useChat` from `@ai-sdk/react`, renders `[cite:xxx]` tokens as buttons that scroll to `#xxx`. Graceful client fallback when 503. Commit `feat: AI twin chat with graceful fallback`.

### Task 11: Recruiter view + PDF resume

**Files:** Create `components/recruiter/RecruiterView.tsx` (single-page condensed: summary, per-role bullets with metrics, skills, certs, contact — zero animation), print stylesheet in `globals.css` (`@media print`), "Download PDF" button → `window.print()` (print-to-PDF, headshot + colors simplified).

- [ ] Implement; `app/page.tsx` renders RecruiterView when `mode==='recruiter'`. Commit `feat: recruiter mode view`.

### Task 12: Navigation + command palette + contact

**Files:** Create `components/nav/ChapterNav.tsx` (sticky side dots + labels, active-section highlight via IntersectionObserver), `components/nav/CommandPalette.tsx` (⌘K overlay listing jump targets + actions, filter-as-you-type), `components/contact/ContactSection.tsx` (copy-email button with obfuscated mailto assembled at click, GitHub/LinkedIn links, contact form POSTing to `app/api/contact/route.ts` which validates via zod and — until a form service is wired at deploy — returns `{ok:true}` and logs server-side).

- [x] Implement + commit `feat: navigation, palette, contact`.

### Task 13: Metadata, a11y & performance polish

**Files:** Modify `app/layout.tsx` (title "Aravindhan Mohan — Forward Deployed Engineer", description, OpenGraph), `app/icon.svg`; audit pass.

- [x] Reduced-motion audit, keyboard pass, contrast check (AA), `npm run build` + Lighthouse run via preview; fix findings. Final commit `chore: metadata + a11y/perf polish`. (Lighthouse: desktop 100/100/100/100; mobile 90/100/100/100 — residual is simulated 4× CPU throttle on hydration; observed FCP=LCP 1.2s, CLS 0.)

---

## Self-Review Notes

- Spec coverage: chapters/hero (§3 → T7–8), AI twin (§4 → T4, T10), architecture (§5 → T1–2), theme (§6 → T1, T6), perf/a11y (§7 → T6, T13), testing (§8 → T2–5, T10), recruiter mode (§2 → T5, T11), contact (§3.7 → T12). No gaps.
- Type names consistent (`CommandResult`, `CommandAction`, `Profile`).
- No placeholders; visual tasks verified by preview rather than unit tests by design.
