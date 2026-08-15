> **Project:** AskTwice · **Doc:** Intake & Constraints · **Version:** 0.1 · **Date:** 2026-08-10
> **Status:** Confirmed — 0 blocking questions

# AskTwice — Intake

## 1. In one sentence

A marketing and client-intake website for Twice's freelance academic services business — schoolwork, presentations, capstone projects, case studies, and homework — where potential clients can browse services, see estimated pricing, and submit work requests via a contact form that notifies Twice by email.

## 2. Constraints

| Dimension | Value | Source | Architectural consequence |
|---|---|---|---|
| Deadline | None fixed | inferred | Design quality prioritized over shipping speed |
| Team | Solo developer (Tways) | known | TypeScript only, no coordination overhead, Claude Code build |
| Budget | Free tier only | inferred | Vercel free, Resend free tier (100 emails/day), no paid DB |
| Data sensitivity | Low — no user accounts, no stored PII | inferred | No auth, no database, no RLS needed in v1 |
| Scale | Low — personal freelance service, ~tens of visitors/day | inferred | Static generation + one edge function for form submission |
| Interaction model | Request-response | inferred | No realtime, no offline, no WebSocket |
| Delivery target | Public web, SEO matters | known | Next.js SSR/SSG on Vercel |
| Non-negotiables | shadcn/ui, minimal design aesthetic, Claude Code workflow | stated | Component library is fixed; custom design token layer on top |

## 3. Tensions raised and how they were resolved

| Tension | Options offered | Decision | Decided by |
|---|---|---|---|
| None | — | — | — |

No constraints compete in this scope.

## 4. Open questions

| # | Question | Blocks | Placeholder token | Needed by |
|---|---|---|---|---|
| 1 | Exact service pricing ranges | No | `[[TBD: pricing]]` | Before launch |
| 2 | Domain name (asktwice.dev, asktwice.ph, etc.) | No | `[[TBD: domain]]` | Before launch |
| 3 | Resend API key | No | `[[TBD: resend-key]]` | Before form works |
| 4 | Portfolio samples / screenshots | No | Placeholder states designed | Before launch |
| 5 | Twice's professional email for receiving orders | No | `[[TBD: email]]` | Before form works |

## 5. Explicitly out of scope

- User authentication or client accounts
- Payment processing or checkout
- Admin dashboard or CMS
- Chat widget or live support
- Database or persistent storage of submissions
- Mobile app
- Blog or content management
- Analytics beyond Vercel Analytics free tier
