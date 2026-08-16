# AskTwice — CLAUDE.md

## Project status

Scaffolded and built — all 7 sections, the contact form, and the Server Action → Formspree path are implemented and verified. The numbered `.md` files referenced below live in the `docs/` folder at the repo root.

Commands:
- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`
- `npm run test` (Vitest) / `npm run test:watch`
- `npm run test:e2e` (Playwright)

Still outstanding (all non-blocking per `docs/01-prd.md` §8): real pricing figures, domain, `FORMSPREE_FORM_ID`, and portfolio samples — currently placeholders in `src/lib/constants.ts` and `.env.example`.

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
- All content is static (Server Components, SSG) except the contact form and the Ask section (Client Components)
- One Server Action: `submitContactForm` — validates with Zod, posts to Formspree
- The Ask section answers from a fixed intent table in `src/lib/chat-answers.ts`. No AI, no API, no network call — answers are looked up from `constants.ts` so the FAQ and the bot can never disagree on a number.
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
│   ├── sections/           # Hero, Services, Portfolio, About, Faq, Ask, Contact, Footer
│   ├── ui/                 # shadcn components (customized to tokens)
│   └── layout/             # StickyNav, SectionWrapper, SectionGrid, Container, MarginNote, Highlight, Reveal
└── lib/
    ├── schemas.ts          # Zod schemas (contactFormSchema, types) + tests
    ├── constants.ts        # Service data, FAQ data, pricing, site metadata, copy
    ├── chat-answers.ts     # Ask section: intent table + matcher (+ tests)
    ├── motion.ts            # Shared durations/easings from the design brief §5
    └── utils.ts             # cn() and helpers

e2e/                         # Playwright specs
vitest.config.mts · playwright.config.ts
```

## Design rules (non-negotiable)

Direction: **"Marginalia"** — warm paper, graphite ink, pen-blue margin notes, one highlighter.
Register: a capable classmate, not a vendor. Warm and direct, never cutesy or salesy.
Full spec in `docs/05-design-brief.md` — read it before writing any CSS.

- **Typography:** Bricolage Grotesque (display) · Plus Jakarta Sans (body) · Caveat (margin notes only, max 4 on the page). All via `next/font/google`.
- **Palette:** paper `#FAF5EB` · ink `#2A2724` · pen blue `#2F5D8A` · highlighter `#FFD75E`
- **Highlighter appears exactly twice on the page.** Once in the hero, once in About. Nowhere else.
- **Layout:** left-aligned, real left margin column (cols 3–11 at `lg`+) where the Caveat notes live. Services use a 7/5 asymmetric split, not a 3-up card grid. Mobile-first, 320px up.
- **Cards:** 1px `--rule` border, no shadow, 6px radius. Elevation via `--paper-raised` on `--paper`.
- **Signature motion:** highlighter swipe behind one hero word — `transform: scaleX()` from `transform-origin: left`, NOT a width animation (layout thrash on mid-range Android).
- **Copy:** first person singular ("I", never "we"). Buttons name the outcome. Sentence case everywhere, never ALL CAPS.
- **NO:** Inter/Roboto/Arial · purple-blue gradients · cream+serif+terracotta · paper textures or torn-edge graphics · star ratings or seller badges · decorative `01/02/03` markers · centered text stacks.

## Validation

Every form input validated with Zod on BOTH client (RHF resolver) and server (Server Action). Same schema object imported in both places. Never trust client-side validation alone.

## Testing strategy

- Unit + integration: Vitest — Zod schema validation, Server Action logic with `fetch` mocked
- E2E: Playwright — one full contact-form journey (fill → submit → success state)
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
