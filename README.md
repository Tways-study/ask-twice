# AskTwice

Marketing and client-intake site for Twice's freelance academic services — presentations, case studies, capstone support, homework, and research papers. Single-page, statically generated, with one server interaction: a contact form that forwards to Formspree.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, and React Hook Form + Zod. Full design direction ("Marginalia") and architecture decisions live in [`docs/`](./docs) and [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in FORMSPREE_FORM_ID once you have one
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without `FORMSPREE_FORM_ID` set, contact form submissions log to the console instead of sending — the site still works end to end.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Unit/integration tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | End-to-end tests (Playwright) |

## Environment variables

| Variable | Purpose |
|---|---|
| `FORMSPREE_FORM_ID` | Formspree form ID the contact Server Action posts to. Recipient email is configured on Formspree's dashboard, not here. |
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for metadata. |

## Project structure

See [`CLAUDE.md`](./CLAUDE.md) for the full file layout, design rules, and validation conventions. Short version: everything is static except `src/components/sections/contact-form.tsx` and its Server Action (`src/app/actions/contact.ts`), which is the only part of the site that talks to a network service.

## Still outstanding

Non-blocking per `docs/01-prd.md`: real pricing figures, a domain, `FORMSPREE_FORM_ID`, and portfolio samples to replace the current placeholders in `src/lib/constants.ts`.
