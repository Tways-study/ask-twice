# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AskTwice

## Project status

Scaffolded and built — all 7 sections, the contact form, the `AskPanel`, and the Server Action → Formspree path are implemented and verified. The numbered `.md` files referenced below live in the `docs/` folder at the repo root.

Still outstanding (all non-blocking per `docs/01-prd.md` §8), all marked `[[TBD: …]]` in `src/lib/constants.ts`:
- Real pricing figures (the ₱ ranges on every service are placeholders)
- A domain (`resolveSiteUrl()` falls back to `https://asktwice.dev`)
- Per-sample `summary` / `deliverable` / `tools` prose on the portfolio entries

Portfolio samples themselves are done — six real `status: "filled"` entries. The `status: "placeholder"` variant and `PlaceholderCard` survive in the code but are currently unused.

## Commands

```bash
npm run dev            # dev server on :3000
npm run build          # production build (runs tsc)
npm run start          # serve the production build
npm run lint           # eslint (no path arg — lints the project)
npm run test           # vitest run
npm run test:watch     # vitest watch
npm run test:e2e       # playwright test
```

Single tests:

```bash
npx vitest run src/lib/chat-answers.test.ts        # one Vitest file
npx vitest run -t "quotes the real case study"     # one test by name
npx playwright test e2e/contact-form.spec.ts       # one spec
npx playwright test -g "inline validation errors"  # one e2e test by name
npx playwright test --headed --debug               # step through a spec
```

`npm run lint` emits one **expected** warning: React Compiler skips memoizing `contact-form.tsx` because React Hook Form's `watch()` can't be memoized safely. Zero errors is the passing bar; that warning is not a regression.

`node scripts/generate-apple-icon.mjs` rasterises `src/app/icon.svg` into `apple-icon.png`. Deliberately not part of `npm run build` — run it by hand and commit the PNG (see the header comment for why).

## Project summary

Marketing and client-intake website for Twice's freelance academic services. Single-page, statically generated, one server interaction (contact form → Formspree).

## Tech stack

- **Framework:** Next.js 16 App Router (TypeScript strict)
- **Styling:** Tailwind CSS v4 + CSS custom properties (see `docs/05-design-brief.md` for tokens)
- **Components:** shadcn/ui (base primitives, customized with project tokens)
- **Animation:** Framer Motion (hero entrance, scroll reveals, accordion, nav transitions)
- **Forms:** React Hook Form + Zod (shared schema for client + server validation), submitted via Formspree
- **Hosting:** Vercel

## Architecture

- Single-page with anchor sections, NOT multi-page routes
- All content is static (Server Components, SSG) except the contact form and `AskPanel` (Client Components)
- One Server Action: `submitContactForm` — validates with Zod, rate-limits, posts to Formspree. Three things about it are load-bearing:
  - **Opaque return.** It resolves `{ success: boolean }` and nothing else. Validation failure, rate-limit trip, and a Formspree 5xx are indistinguishable to the client by design; detail goes to `console.error`, not to the caller.
  - **In-memory per-IP rate limit** (5/min, keyed on `x-forwarded-for`). Resets on cold start — accepted at this scale per `docs/04-tdd.md` §11. Do not reach for a store to "fix" this.
  - **Unset `FORMSPREE_FORM_ID` is a supported path**, not a failure: it logs the payload and returns `{ success: true }`, so the whole journey works locally and in tests without burning quota.
- `siteConfig.url` comes from `resolveSiteUrl()` and is **server-only** — the Vercel vars it falls back to aren't `NEXT_PUBLIC`, so they're `undefined` in the browser bundle. It also refuses to honour a `localhost` `NEXT_PUBLIC_SITE_URL` when `VERCEL` is set, so a dev value pasted into the dashboard can't point canonicals and link previews at an unreachable machine.
- `AskPanel` is a corner-anchored launcher + panel mounted in `layout.tsx`, `z-30` (below nav at 40 and the drawer overlay at 50). It answers from a fixed intent table in `src/lib/chat-answers.ts`. No AI, no API, no network call — answers are looked up from `constants.ts` so the FAQ and the bot can never disagree on a number.
- Toasts sit `top-center`, not bottom-right: the Ask launcher owns that corner.
- NO database, NO auth, NO user accounts
- File sharing via URL (Google Drive link), NOT direct upload

## File structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx             # Single page composing all sections
│   ├── globals.css          # CSS custom properties (design tokens from design brief)
│   └── actions/
│       └── contact.ts      # Server Action: validate + post to Formspree (+ tests)
├── components/
│   ├── sections/           # Hero, Services, Portfolio, About, Faq, Contact, Footer
│   ├── ui/                 # shadcn components (customized to tokens)
│   └── layout/             # StickyNav, AskPanel, SectionWrapper, Container, MarginNote, Highlight, Reveal
└── lib/
    ├── schemas.ts          # Zod schemas (contactFormSchema, types) + tests
    ├── constants.ts        # Service data, FAQ data, pricing, site metadata, copy
    ├── chat-answers.ts     # AskPanel: intent table + matcher (+ tests)
    ├── motion.ts            # Shared durations/easings from the design brief §5
    └── utils.ts             # cn() and helpers

e2e/                         # Playwright specs
vitest.config.mts · playwright.config.ts
```

## Design rules (non-negotiable)

Direction: **"Cathedral, annotated"** — adapted from the Apple-style reference at styles.refero.design (style `c9cabb96-32fa-4896-837a-f2497ce1c856`, "Apple (España)"): near-white monochrome canvas, oversized weight-800 headlines, one electric-blue accent, borderless cards, alternating white/gray section bands. Two personal touches from the original "Marginalia" build (v0.2) are layered back on top, deliberately rationed: handwritten `MarginNote` asides (4 max) and the marigold `Highlight` swipe (twice max, hero + About). Everything else about the Apple-style rebuild — palette, Inter-only type, centered hero, borderless card grids, no margin column — stands as-is; `SectionGrid` and Bricolage/Jakarta are still gone.
Register: a capable classmate, not a vendor. Warm and direct, never cutesy or salesy — the visual system changed, the voice didn't.
Full spec in `docs/05-design-brief.md` — read it before writing any CSS.

- **Typography:** Inter for everything structural, via `next/font/google` (`--font-inter` feeds both `--font-display` and `--font-sans`; weight carries the display/body distinction — 800 hero, 600 headings, 400–500 body/buttons). Caveat (`--font-hand`) exists ONLY for the 4 `MarginNote` instances — never body, never UI, never buttons.
- **Palette:** paper `#FFFFFF` · sunken/alternating band `#F5F5F7` · ink `#1D1D1F` · ink-soft `#707070` · electric blue (primary accent — CTAs, links, focus ring) `#0071E3` · marigold highlighter (rationed, twice max) `#FFD75E` · ember (functional state/validation only, never decorative) `#B64400` · hairline `#D6D6D6`.
- **The highlighter appears exactly twice on the page.** Once behind "handled." in the hero, once behind "I'm a student too" in About. Nowhere else — a highlighter that marks everything marks nothing.
- **`MarginNote` appears at most 4 times.** Hero caption, Services caption, About caption, Contact caption. Caveat, `-rotate-2`, `text-pen`, `aria-hidden="true"`. If a fifth shows up, delete one.
- **Layout:** centered "Product Hero" (eyebrow → oversized headline with the highlighter → lead → pill CTAs → margin note), everything below it left-aligned in cards — not the old asymmetric left-margin column; margin notes render inline where they're used, not in a dedicated gutter. Services and Portfolio are card grids (`rounded-2xl`, borderless), not row lists. Mobile-first, 320px up.
- **Cards:** borderless — no `border`, no shadow. Elevation is `--paper-raised` (white) sitting on `--paper-sunken` (`#F5F5F7`), or vice versa. Radius `--radius-2xl` (28px) on cards/portfolio images, `--radius` (10px) on inputs/panels/popovers, `rounded-full` (pill) on every button.
- **Buttons:** always pill-shaped (`rounded-full`), regular weight (400) label — never semibold, never ALL CAPS.
- **Copy:** first person singular ("I", never "we"). Buttons name the outcome. Sentence case everywhere.
- **NO:** shadows or elevation on cards · a third accent color beyond electric blue + the rationed marigold (ember is functional/state-only) · border-radius below 10px on interactive elements · centered body paragraphs (only the hero centers) · serif display faces · Caveat anywhere but the 4 margin notes.

## Validation

Every form input validated with Zod on BOTH client (RHF resolver) and server (Server Action). Same schema object imported in both places. Never trust client-side validation alone.

## Testing strategy

- Unit + integration: Vitest — Zod schema validation, Server Action logic with `fetch` mocked, `chat-answers` intent matching. `jsdom` environment; specs are **colocated** next to the source (`src/**/*.test.{ts,tsx}`), not in a separate tree
- E2E: Playwright — the full contact-form journey (fill → submit → success state), chromium only
- `playwright.config.ts` starts its own dev server with `FORMSPREE_FORM_ID: ""` and `reuseExistingServer: false`. Both matter: the suite submits the real form, so it must take the log-instead-of-send path. **Never set `reuseExistingServer: true`** — it would attach to a server running with the real `.env` and post test submissions to Formspree (50/month free tier), emailing Twice a fake "Jamie Cruz" every run
- Full detail: `docs/04-tdd.md` §10

## Performance budget

- LCP < 2.5s (ceiling 4s) · form round-trip < 3s
- JS bundle < 150KB gzip (ceiling 200KB) · largest image < 200KB (ceiling 500KB)
- Full detail: `docs/04-tdd.md` §9

## Deployment & environments

- Production: push to `main` → Vercel, live `FORMSPREE_FORM_ID`
- Preview: push to any branch → shares the same Formspree form (free tier caps at 50 submissions/month — watch usage if Preview traffic is high)
- Local: `next dev`, console.log fallback when `FORMSPREE_FORM_ID` is unset
- No error-tracking service in v1 — rely on Vercel function logs + `console.error` (`docs/04-tdd.md` §12)

## Environment variables

```
FORMSPREE_FORM_ID=     # Formspree form ID (recipient email is set on Formspree's dashboard)
NEXT_PUBLIC_SITE_URL=  # Production URL
```

## Key documents

- `docs/00-intake.md` — Constraints and scope
- `docs/00-stack-decision.md` — Stack rationale and what would change it
- `docs/01-prd.md` — Product requirements
- `docs/02-app-flow.md` — Navigation, journeys, screen states
- `docs/03-backend-schema.md` — Form schema (Zod), no database
- `docs/04-tdd.md` — Technical decisions, testing strategy, performance budget, deployment
- `docs/05-design-brief.md` — Typography, colour, layout, motion, components

Read all docs before generating code. The design brief is the most critical — every CSS decision derives from it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
