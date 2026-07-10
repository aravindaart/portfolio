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

- AI feature: **Both** — scripted terminal always works; live AI chat activates when `AI_GATEWAY_API_KEY` or `ANTHROPIC_API_KEY` is set (`NEXT_PUBLIC_AI_ENABLED=1` gates the client). Model string: `anthropic/claude-sonnet-5` via AI Gateway.
- Contact: email `sayhi@aravindaart.com` (routing confirmed), GitHub `aravindaart`, LinkedIn `/in/aravindaart/`.
- Headshot: photo pending — drop as `public/headshot.jpg`; `Headshot.tsx` auto-swaps from placeholder.
- Deploy: deferred until build complete; owner has `aravindaart.com`.
- Thesis copy (exact): "Forward-deployed before it had a name."

## Remaining work

Build complete (Tasks 1–13). Outstanding items owned by Aravindhan:

1. Drop the photo at `public/headshot.jpg` (auto-detected server-side; placeholder shows until then).
2. Deploy (owner has `aravindaart.com`; `metadataBase` already points there). Set `AI_GATEWAY_API_KEY` + `NEXT_PUBLIC_AI_ENABLED=1` to activate the AI twin.
3. Wire a real form service into `app/api/contact/route.ts` (currently logs server-side and returns `{ok:true}`).

## Gotchas discovered

- `create-next-app` scaffolds Next 16 now; `convertToModelMessages` returns a Promise in AI SDK v6 — pass `{role, content}` ModelMessages directly instead.
- Preview snapshots race hydration: recruiter-mode check needs a beat after navigation before reading the DOM.
- Vitest configured via `vitest.config.ts` with `@` alias; tests live in `tests/`, pure logic only.
