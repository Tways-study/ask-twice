> **Project:** AskTwice · **Doc:** PRD · **Version:** 0.1 · **Date:** 2026-08-10
> **Status:** Draft — 2 unresolved placeholders
> **Upstream:** Intake v0.1, Stack Decision v0.1

# AskTwice — Product Requirements

## 1. Problem

Students at provincial Philippine universities need help with academic deliverables — presentations, case studies, capstone documents, homework — but finding reliable, quality freelancers is word-of-mouth, scattered across Messenger group chats and Facebook posts. There is no professional point of contact, no portfolio to evaluate quality, and no structured way to describe a request with enough detail for accurate quoting.

**Evidence:** Twice already receives work requests informally through chat; this site formalizes and scales that existing demand.

## 2. Users

| Role | Context | Primary job | Frequency |
|---|---|---|---|
| **Prospective client** | College student, mobile-first, browsing between classes or late at night before a deadline | Evaluate whether Twice can handle their work, understand pricing, and submit a detailed request | Per-need, ~1–5 times per semester |
| **Twice (operator)** | Receives email notifications, evaluates requests, responds with quotes | Review incoming requests with enough context to quote accurately without back-and-forth | Daily during peak season |

## 3. Current alternative

Clients message Twice directly on Messenger or find him through word-of-mouth. This works at low volume but fails because: (a) no portfolio to pre-qualify — clients ask without knowing what Twice can do, (b) requests arrive with incomplete details, requiring 3–5 clarification exchanges before quoting, (c) no public pricing signal — every inquiry starts from zero, (d) no web presence for discoverability beyond existing social circles.

## 4. Scope

### Must have — MVP

| # | Feature | User | Job it does | Acceptance |
|---|---|---|---|---|
| M1 | Landing page with value proposition | Prospective client | Understand what AskTwice offers in <10 seconds | Hero section with clear tagline, service summary, and CTA |
| M2 | Services section with pricing ranges | Prospective client | See what's offered and ballpark cost before committing to contact | Each service type listed with estimated price range and "Contact for custom quote" option |
| M3 | Portfolio/work samples section | Prospective client | Evaluate quality of past work | Grid/gallery of anonymized work samples with placeholder states for content not yet ready |
| M4 | About section | Prospective client | Build trust by understanding who Twice is | Background story, credibility signals (med lab science → dev, project count, tools used) |
| M5 | Contact/order intake form | Prospective client | Submit a detailed work request with all info Twice needs to quote | Form with: service type, subject/course, deadline, details textarea, file upload, budget range, contact method — validated with Zod |
| M6 | Email notification on form submit | Twice (operator) | Receive formatted request details without checking a dashboard | Resend delivers a structured email with all form fields to Twice's inbox |
| M7 | FAQ section | Prospective client | Get answers to common questions without contacting | Turnaround times, revision policy, confidentiality, payment methods, how-it-works |
| M8 | Responsive, mobile-first layout | Prospective client | Browse and submit from a phone (primary device) | No breakage 320px–1440px, touch targets ≥44px, form usable on mobile |

### Should have — post-MVP

| # | Feature | User | Job |
|---|---|---|---|
| S1 | Real portfolio content replacing placeholders | Client | Evaluate actual past work quality |
| S2 | Testimonials / social proof section | Client | See that others trust Twice |
| S3 | SEO optimization (meta tags, OG images, structured data) | — | Discoverability via search |
| S4 | Analytics dashboard review | Twice | Understand traffic sources and conversion |

### Could have — if time permits

| # | Feature |
|---|---|
| C1 | Dark mode toggle |
| C2 | Animated page transitions between sections |
| C3 | WhatsApp/Messenger direct-link fallback button |
| C4 | Service request status page (requires database) |

### Will not have — explicit non-goals

| Excluded | Why | Revisit when |
|---|---|---|
| User accounts / auth | No need — form submissions go to email | Volume exceeds what email can handle |
| Payment processing | Twice handles payment off-platform (GCash, bank transfer) | Enough volume to justify transaction fees |
| Admin dashboard | Twice manages requests from email inbox | Request volume > 20/week consistently |
| Chat widget | Adds complexity, Twice prefers async email | Client feedback demands it |
| Blog / CMS | Static content is sufficient for v1 | Content update frequency > monthly |
| Database | No data persistence needed — email is the store | Need to track order history or status |

## 5. Success metrics

| Metric | Baseline | Target | How measured |
|---|---|---|---|
| Monthly unique visitors | 0 | `[[TBD: target]]` | Vercel Analytics |
| Form submissions / month | 0 (all via Messenger) | `[[TBD: target]]` | Count Resend emails received |
| Incomplete-request rate | ~60% via chat (missing details) | <20% via structured form | Manual observation |
| Time from first contact to quote | ~24h (clarification exchanges) | <4h (form has all details) | Manual observation |

## 6. Constraints

See `00-intake.md` (in this folder). Key: free tier only, solo dev, no database, no auth, web-only, mobile-first audience.

## 7. Assumptions and risks

| Assumption | If wrong | Detection | Mitigation |
|---|---|---|---|
| Students will use the form instead of messaging directly | Site launches but form submissions are zero while Messenger volume stays the same | Track form submissions vs. DM volume after launch | Add Messenger link as secondary CTA; simplify form further |
| Estimated pricing ranges are sufficient — clients don't need exact quotes upfront | Clients bounce at pricing section due to ambiguity | Heatmap / scroll depth shows drop-off at pricing | Add more granular pricing tiers or a calculator |
| 100 emails/day Resend free tier is sufficient | Exceed limit during peak (finals week) | Resend dashboard / bounced submissions | Upgrade Resend tier ($20/mo) or add a queue |
| Mobile-first audience (Philippine college students) | Desktop traffic dominates | Vercel Analytics device breakdown | Adjust layout priorities — both should work regardless |

## 8. Open questions

| # | Question | Blocks | Owner | Needed by |
|---|---|---|---|---|
| 1 | Final pricing ranges per service | No — placeholders work | Twice | Before launch |
| 2 | Portfolio content (screenshots, samples) | No — placeholder states designed | Twice | Before launch |
