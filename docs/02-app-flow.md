> **Project:** AskTwice · **Doc:** App Flow · **Version:** 0.1 · **Date:** 2026-08-10
> **Status:** Draft
> **Upstream:** PRD v0.1

# AskTwice — Application Flow

## 1. Route map

This is a single-page marketing site with anchor sections, plus one API endpoint. No authentication, no protected routes.

| Route | Screen/Section | Access | Primary action | Data read | Data written |
|---|---|---|---|---|---|
| `/` | Full landing page | Public | Browse, scroll to sections | Static content | — |
| `/#services` | Services section (anchor) | Public | View pricing, click CTA to contact | Static content | — |
| `/#portfolio` | Portfolio section (anchor) | Public | Browse work samples | Static content | — |
| `/#about` | About section (anchor) | Public | Read background | Static content | — |
| `/#faq` | FAQ section (anchor) | Public | Expand/collapse questions | Static content | — |
| `/#contact` | Contact/order form (anchor) | Public | Submit work request | Static content | Form data → email |
| `/api/contact` or Server Action | Form handler | Public (rate-limited) | Process submission, send email | Request body | Resend API → email |

**Architecture note:** Single-page with smooth-scroll anchor navigation rather than separate routes. This keeps the site fast (one page load), simple (no routing logic), and appropriate for a 6-section marketing page. The nav links scroll to sections rather than triggering page transitions.

## 2. Navigation structure

```
┌─────────────────────────────────────────────┐
│  Logo (AskTwice)    Services  Portfolio      │
│                     About  FAQ  [Get Started]│ ← sticky nav, collapses to hamburger on mobile
└─────────────────────────────────────────────┘
         │
         ▼ (scroll)
┌─────────────────┐
│   Hero Section   │  ← value prop, CTA button scrolls to #contact
├─────────────────┤
│   Services       │  ← service cards with pricing ranges
├─────────────────┤
│   Portfolio       │  ← work sample grid (placeholders initially)
├─────────────────┤
│   About          │  ← Twice's story + credibility signals
├─────────────────┤
│   FAQ            │  ← accordion, common questions
├─────────────────┤
│   Contact Form   │  ← intake form + submit
├─────────────────┤
│   Footer         │  ← email, socials, copyright
└─────────────────┘
```

**Mobile navigation:** Hamburger menu → slide-out drawer with section links. Closes on link click.

## 3. Core journeys

### J1: Browse and evaluate — Prospective client

**Trigger:** Client lands on the site via shared link, social media, or search.
**Precondition:** None — public access.

1. Client sees hero → reads tagline and value prop → understands what AskTwice does
2. Scrolls to Services → sees service types with price ranges → identifies their need
3. Scrolls to Portfolio → browses work samples → evaluates quality
4. Scrolls to About → reads Twice's background → builds trust
5. Clicks "Get Started" CTA → smooth-scrolls to Contact form

**Success:** Client has enough information to decide whether to submit a request.
**Failure paths:**

| Where | Cause | User sees | Recovery |
|---|---|---|---|
| Any section | Content doesn't answer their question | FAQ section below | FAQ covers common concerns; footer has direct email |
| Portfolio | No samples yet (placeholder state) | "Portfolio coming soon" with message that samples are being prepared | Trust built through About section and pricing transparency instead |

### J2: Submit a work request — Prospective client

**Trigger:** Client clicks CTA or scrolls to contact form.
**Precondition:** None.

1. Client selects service type from dropdown → form reveals relevant fields
2. Fills in: subject/course, deadline date, details (textarea), optional file upload
3. Selects budget range from options
4. Enters contact info: name, email, preferred contact method
5. Client-side Zod validation runs → inline errors shown if invalid
6. Submits → loading state on button → Server Action fires
7. Server validates with same Zod schema → calls Resend API → sends formatted email to Twice
8. Client sees success toast/message with confirmation and expected response time

**Success:** Twice receives a well-structured email with all details needed to quote.
**Failure paths:**

| Where | Cause | User sees | Recovery |
|---|---|---|---|
| Step 5 | Validation fails (missing required fields) | Inline error messages on each invalid field | Fix errors — form preserves all entered data |
| Step 7 | Server validation fails | "Something went wrong. Please try again." toast | Retry — form data preserved in state |
| Step 7 | Resend API down or rate limited | "We couldn't send your request right now. Please email directly at [[TBD: email]]" | Direct email fallback shown |
| Step 6 | File too large (>10MB) | "File must be under 10MB" inline error | Compress or remove file |

**Interruption:** Form data is held in React state. Closing the tab loses it — acceptable for a single-page form. No draft persistence needed.

## 4. State machines

No entity lifecycle in v1. Form submission is fire-and-forget to email. If a database is added later, an order status machine would be:

```
[*] → submitted → quoted → accepted → in_progress → delivered → [*]
                → declined → [*]
```

This is documented for future reference only.

## 5. Screen states

Since this is a single-page site, "screens" are sections:

| Section | Loading | Empty | Error | Notes |
|---|---|---|---|---|
| Hero | SSG — no loading state | N/A (always has content) | N/A | Static |
| Services | SSG | N/A | N/A | Static content in code |
| Portfolio | SSG | **Placeholder state:** "Portfolio samples coming soon" with suggested content types | N/A | Must look intentional, not broken |
| About | SSG | N/A | N/A | Static |
| FAQ | SSG | N/A | N/A | Accordion starts collapsed |
| Contact form | Immediate (client component) | Default state with empty fields | Validation errors inline; submission error as toast | Form is the only interactive section |

## 6. Notifications and asynchronous events

| Event | Channel | Recipient | Timing | Failure behaviour |
|---|---|---|---|---|
| Form submitted successfully | Email via Resend | Twice | Immediate (within seconds) | Show fallback email address to client; log error server-side |

Single notification path. No scheduled jobs, no background processing, no webhooks.

## 7. Offline and connectivity

Nothing works offline. This is a static marketing site with one server interaction (form submit). If the client has no connection, the form submission fails and they see an error with a direct email fallback. No offline queueing, no service worker, no local storage.
