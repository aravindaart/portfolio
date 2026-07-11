# Session Handoff — 2026-07-10

Resume point for the FDE portfolio build. Read this first when continuing from CLI.

## Where things stand

- Branch: `feat/site` (main has only docs). All work committed; working tree clean.
- Spec: `docs/superpowers/specs/2026-07-10-portfolio-design.md` (approved).
- Plan: `docs/superpowers/plans/2026-07-10-portfolio-implementation.md` (13 tasks, checkbox-tracked).
- Tests: 31 passing (`npm test`). Build green (`npm run build`).
- Dev server: `npm run dev` → localhost:3000.

## Task status

| # | Task | Status |
|---|------|--------|
| 1 | Scaffold Next.js 16 + TS + Tailwind v4 + theme tokens | ✅ done |
| 2 | `lib/types.ts` + `content/profile.ts` data layer (TDD) | ✅ done |
| 3 | `lib/terminal/commands.ts` command engine (TDD) | ✅ done |
| 4 | `lib/ai/system-prompt.ts` grounding prompt (TDD) | ✅ done |
| 5 | `lib/mode.tsx` recruiter-mode state (TDD) | ✅ done |
| 6 | Effects: TypingText, ParticleField, Scanline | ✅ done |
| 7 | Hero boot sequence + Headshot fallback | ✅ done |
| 8 | Story chapters, MetricCards, IncidentTimeline, FdeThesis | ✅ done |
| 9 | Terminal UI (`components/terminal/Terminal.tsx`) | ✅ done |
| 10 | AI chat route + AiChat UI (503 fallback verified) | ✅ done |
| 11 | RecruiterView + print-to-PDF (verified at `/?mode=recruiter`) | ✅ done |
| 12 | ChapterNav + ⌘K CommandPalette + ContactSection + `/api/contact` | ✅ done — nav wired + browser-QA'd; palette (Ctrl/⌘K, filter, jump, recruiter/ai actions via `terminal:ai` event); contact form verified end-to-end (valid→200, invalid→400) |
| 13 | Metadata/OG, a11y + perf audit, Lighthouse, merge to main | ✅ done — Lighthouse desktop 100×4, mobile 90/100/100/100 (residual = simulated CPU throttle on hydration); console clean; CLS 0 |

## Key decisions (approved by Aravindhan)

- AI feature: **Both** — scripted terminal always works; live AI chat activates when `GOOGLE_GENERATIVE_AI_API_KEY` is set (`NEXT_PUBLIC_AI_ENABLED=1` gates the client). Model: `gemini-3.1-flash-lite` via `@ai-sdk/google` direct provider (switched 2026-07-11 from paid Anthropic/AI Gateway — Gemini's free tier hard-rate-limits instead of billing, so a public unauthenticated chat endpoint can't run up a bill; later same day switched again from `gemini-3.5-flash`, whose free quota on this project turned out to be only 20 requests/day and got exhausted by our own testing — flash-lite gets 1,000/day on the same key, confirmed live, no quality tradeoff for this grounded-Q&A use case). Get a free key at aistudio.google.com.
- Contact: email `sayhi@aravindaart.com` (routing confirmed), GitHub `aravindaart`, LinkedIn `/in/aravindaart/`.
- Headshot: photo pending — drop as `public/headshot.jpg`; `Headshot.tsx` auto-swaps from placeholder.
- Deploy: deferred until build complete; owner has `aravindaart.com`.
- Thesis copy (exact): "Forward-deployed before it had a name."

## Post-launch fixes (2026-07-10, same day)

- Design review pass: 6 findings fixed (mobile hero viewport overflow, Recruiter Mode contact links not clickable, touch targets across contact form/palette/AI chat, keyboard focus-visible + ARIA gaps). Full report: `~/.gstack/projects/portfolio/designs/design-audit-20260710/`.
- Mobile terminal input fixed: iOS Safari was auto-zooming/jumping on focus because the input rendered under 16px. All site inputs now 16px on mobile; added `interactiveWidget: 'resizes-content'` viewport meta so the keyboard doesn't leave a dead gap.
- Headshot photo added at `public/headshot.jpg` with a CSS vignette (`components/story/Headshot.tsx`) so the photo's bright background blends into the dark theme instead of reading as a cutout.

## Remaining work

Build complete (Tasks 1–13), design-reviewed, headshot live. Outstanding items owned by Aravindhan:

1. Deploy (owner has `aravindaart.com`; `metadataBase` already points there). Set `AI_GATEWAY_API_KEY` + `NEXT_PUBLIC_AI_ENABLED=1` to activate the AI twin.
2. ~~Wire a real form service into `app/api/contact/route.ts`~~ — done (2026-07-11). `/api/contact` now sends via Resend (`lib/contact/format-email.ts`); `contactGuard` returns 503 `email_unavailable` if `RESEND_API_KEY` is unset. Still needs on Aravindhan's side: set `RESEND_API_KEY` in Vercel env, and verify the `aravindaart.com` domain in the Resend dashboard so `CONTACT_FROM_EMAIL` can send from it (defaults to Resend's sandbox `onboarding@resend.dev`, which only reaches the Resend account owner's own address until the domain is verified).

## Gotchas discovered

- `create-next-app` scaffolds Next 16 now; `convertToModelMessages` returns a Promise in AI SDK v6 — pass `{role, content}` ModelMessages directly instead.
- Preview snapshots race hydration: recruiter-mode check needs a beat after navigation before reading the DOM.
- Vitest configured via `vitest.config.ts` with `@` alias; tests live in `tests/`, pure logic only.
