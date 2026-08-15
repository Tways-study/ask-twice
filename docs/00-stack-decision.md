> **Project:** AskTwice · **Doc:** Stack Decision · **Version:** 0.1 · **Date:** 2026-08-10
> **Upstream:** Intake v0.1

# AskTwice — Stack Decision

## Recommendation

**Next.js 15 (App Router) · TypeScript strict · shadcn/ui + Tailwind CSS · Framer Motion · React Hook Form + Zod · Resend (email) · Vercel**

No database. No auth. No backend beyond a single Server Action or API route for form submission.

| Layer | Choice | Alternative considered | Why the alternative loses here |
|---|---|---|---|
| Framework | Next.js 15 App Router | Astro | Next.js wins because Tways's entire workflow, tooling, and deployment pipeline are built around it. Astro would save ~20KB of runtime JS but adds a context switch for zero meaningful gain on a 6-page site that already needs React for shadcn/ui. |
| Language | TypeScript strict | — | Only option. Solo dev, Zod validation, shadcn/ui — all TypeScript. No polyglot justification. |
| Styling | Tailwind CSS + CSS custom properties | Plain CSS modules | shadcn/ui requires Tailwind. Custom properties layer on top for design tokens. |
| Components | shadcn/ui | Radix primitives only | User-mandated. shadcn gives accessible primitives + styled defaults that can be token-overridden. Building from raw Radix adds work with no payoff for a marketing site. |
| Animation | Framer Motion | CSS-only transitions | Framer Motion earns its place for scroll-triggered reveals, page transitions, and the hero — effects that are painful to orchestrate in pure CSS. For a marketing site, motion is a differentiator, not overhead. |
| Forms | React Hook Form + Zod | Server Action with FormData | RHF gives client-side validation UX (inline errors, field-level feedback) that raw FormData cannot. Zod schema shared between client validation and server validation. |
| Email | Resend | Supabase Edge Function → SMTP / Nodemailer | Resend has the cleanest DX, free tier covers 100 emails/day (orders of magnitude above expected volume), and a single API call from a Server Action. No database trigger needed because there is no database. |
| Hosting | Vercel | Cloudflare Pages | Tways's existing deployment pipeline. Git push → deploy. Free tier is sufficient. |
| Analytics | Vercel Analytics | Umami self-hosted | Free, zero-config, already in the Vercel dashboard. Self-hosted analytics is unjustified overhead for this scope. |

## What would change this decision

- **If Twice needs to store and manage submissions (order history, status tracking, client notes):** Add Supabase. This converts the site from a marketing funnel into a lightweight CRM and changes the architecture meaningfully — schema, RLS, auth would all come into play.
- **If a blog or frequently updated content is needed:** Add MDX or a headless CMS (Notion API). Currently static content lives in code.
- **If payment processing is required:** Add Stripe. This also forces a database for order records and receipt tracking.

None of these are expected in v1.
