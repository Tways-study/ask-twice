> **Project:** AskTwice · **Doc:** TDD (Technical Design Document) · **Version:** 0.1 · **Date:** 2026-08-10
> **Status:** Draft
> **Upstream:** PRD v0.1, App Flow v0.1, Backend Schema v0.1

# AskTwice — Technical Design

## 1. Overview

AskTwice is a statically generated single-page marketing site with one server-side interaction: a contact form that validates input and sends a formatted email via the Resend API. The most consequential architectural decision is **no database** — the entire "backend" is a single Server Action, which keeps the project shippable in a weekend and eliminates every operational concern except Vercel uptime and Resend availability.

## 2. System context

```
┌──────────────────────────────────┐
│          AskTwice (Vercel)       │
│                                  │
│  Next.js App Router              │
│  ┌────────────┐  ┌────────────┐  │
│  │ Static     │  │ Server     │  │
│  │ Pages      │  │ Action     │  │      ┌─────────┐
│  │ (SSG)      │  │ /contact   │──┼─────▶│ Resend  │
│  └────────────┘  └────────────┘  │      │ API     │
│                                  │      └────┬────┘
└──────────────────────────────────┘           │
                                              ▼
                                     Twice's email inbox
```

| External dependency | What happens when unavailable |
|---|---|
| Resend API | Form submission fails → client sees error toast with direct email fallback |
| Vercel | Entire site down → no mitigation (acceptable for this scale) |
| Google Fonts | Fonts fall back to system stack → site remains usable, less polished |

## 3. Architecture

| Component | Responsibility | Technology | Notes |
|---|---|---|---|
| Landing page | Static marketing content | Next.js Server Components, SSG | Built once at deploy time |
| Navigation | Smooth-scroll anchor links, mobile drawer | Client Component (shadcn Sheet) | Sticky header |
| Services section | Display service cards with pricing | Server Component | Static data in code |
| Portfolio section | Display work samples or placeholders | Server Component | Images in `/public` |
| FAQ section | Expandable accordion | Client Component (shadcn Accordion) | Static Q&A data |
| Contact form | Validated intake form | Client Component (RHF + Zod + shadcn) | Only interactive section |
| Form handler | Validate + send email | Server Action | Single file, ~50 lines |
| Email delivery | Transactional email | Resend SDK | Free tier, 100/day |

## 4. Key decisions

### D1: Single-page with anchor sections vs. multi-page routes

- **Context:** 6 sections of content, no auth, no dynamic data
- **Decision:** Single page with smooth-scroll anchor navigation
- **Alternatives:** Separate routes per section (e.g., `/services`, `/about`, `/contact`)
- **Why alternative loses:** Multi-page adds route transitions, layout duplication, and complexity for zero user benefit. A marketing site this size loads faster and converts better as one scroll.
- **Consequences:** Cannot deep-link to individual service pages (not needed in v1). SEO is slightly less granular (one page vs. many) but structured data and proper heading hierarchy compensate.
- **Reversible?** Cheap — extracting sections into routes is straightforward refactoring.

### D2: Server Action vs. API route for form handling

- **Context:** One form, one email, no database
- **Decision:** Server Action (`"use server"`)
- **Alternatives:** API route (`/api/contact`)
- **Why alternative loses:** Server Actions co-locate with the form component, get automatic type safety, and avoid writing fetch boilerplate. An API route is justified when external consumers call the endpoint — there are none here.
- **Consequences:** Tightly coupled to Next.js. If the form handler ever needs to be called from outside Next.js (e.g., a mobile app), extract to an API route then.
- **Reversible?** Cheap — ~30 minutes of refactoring.

### D3: No database — email as the data store

- **Context:** Solo operator, <20 requests/week expected, no need for status tracking
- **Decision:** Form submissions go directly to email. No persistent storage.
- **Alternatives:** Supabase `submissions` table
- **Why alternative loses:** A database for <20 rows/week that are immediately acted on via email adds schema design, migration management, connection pooling, and RLS policies — all overhead with no user-facing benefit.
- **Consequences:** No order history, no analytics on submission data, no status tracking. Twice manages everything from email.
- **Reversible?** Cheap — add Supabase later, insert alongside the Resend call.

### D4: URL-based file sharing vs. direct upload

- **Context:** Clients may need to share reference files (PDFs, images, docs)
- **Decision:** Accept a Google Drive / Dropbox URL in the form rather than handling file uploads
- **Alternatives:** Vercel Blob or Supabase Storage for direct uploads
- **Why alternative loses:** Direct upload requires storage infrastructure, presigned URLs, size limits, virus scanning considerations, and cleanup policies — all for a field that most clients will leave empty.
- **Consequences:** Clients must upload their file elsewhere first and paste a link. Slight friction, but avoids all storage complexity.
- **Reversible?** Cheap — add Vercel Blob and a file input later.

## 5. Data flow

### Read (static content)

```
Browser → Vercel CDN → pre-rendered HTML + JS bundle → hydrate on client
```

All content is static. No server round-trips for reads. ISR not needed — content changes only on redeploy.

### Write (form submission)

```
1. Client fills form → RHF manages state
2. Client submits → Zod validates client-side
   ├─ Invalid → inline field errors, no server call
   └─ Valid ↓
3. Server Action receives FormData
4. Server-side Zod validation (same schema)
   ├─ Invalid → return { errors } → client shows server errors
   └─ Valid ↓
5. Resend.emails.send({
     from: 'AskTwice <noreply@[[TBD: domain]]>',
     to: '[[TBD: email]]',
     subject: `[AskTwice] New: ${serviceType} — ${subject}`,
     html: formatEmailHtml(validatedData)
   })
   ├─ Success → return { success: true } → client shows confirmation
   └─ Failure → return { error: 'send_failed' } → client shows fallback email
```

**Validation boundary:** Zod runs on both sides. Client-side for UX (instant feedback). Server-side for security (client can be bypassed). Same schema object, imported in both places.

## 6. API surface

| Method | Route / action | Auth | Input schema | Returns | Errors |
|---|---|---|---|---|---|
| Server Action | `submitContactForm` | None (public, rate-limited) | `contactFormSchema` (Zod) | `{ success: true }` | `{ errors: FieldErrors }` or `{ error: 'send_failed' }` |

One endpoint. That's the entire API.

## 7. Authentication and authorization

None. The site is fully public. The Server Action is the only server-side code and it sends email — no data to protect, no roles to enforce.

**If auth is ever needed:** Supabase Auth, integrated with RLS. But that's a different project.

## 8. Error handling and failure modes

| Failure | Detection | User-visible behaviour | Recovery |
|---|---|---|---|
| Form validation fails (client) | Zod parse error | Inline error messages per field, red borders | Fix fields and resubmit |
| Form validation fails (server) | Zod parse error | Same inline errors, shown after round-trip | Fix and resubmit |
| Resend API unavailable | Fetch throws / non-200 response | Toast: "Couldn't send your request. Email us directly at [[TBD: email]]" | Direct email fallback |
| Resend rate limit hit | 429 response | Same fallback toast | Wait or email directly |
| Client offline | Fetch throws network error | Toast: "No internet connection. Please try again." | Reconnect and retry |
| Google Fonts unavailable | Font loading timeout | System font fallback renders | Site remains fully usable |

## 9. Performance budget

| Operation | Target | Ceiling | Strategy |
|---|---|---|---|
| Initial page load (LCP) | <2.5s | 4s | SSG, optimized images, font `display: swap` |
| Form submission round-trip | <3s | 5s | Server Action is lightweight; Resend API is fast |
| Total JS bundle | <150KB gzip | 200KB | shadcn tree-shakes; Framer Motion is the largest dep (~30KB) |
| Largest image | <200KB | 500KB | Next.js Image component with WebP, responsive sizes |

## 10. Testing strategy

| Layer | What is tested | Tooling | Coverage intent |
|---|---|---|---|
| Unit | Zod schema validation — valid and invalid inputs | Vitest | Every field's constraints and edge cases |
| Integration | Server Action: validates, calls Resend, returns correct shape | Vitest + Resend mock | Happy path + Resend failure + invalid input |
| E2E | Full form fill → submission → success state | Playwright | One critical path: the form journey |

Minimal test suite — this is a marketing site, not a SaaS product. The form is the only thing that can break meaningfully.

## 11. Deployment and environments

| Environment | Purpose | Data | Deploy trigger |
|---|---|---|---|
| Production | Live site | Real Resend sends | Push to `main` |
| Preview | PR review | Resend test mode (no real emails) | Push to any branch |
| Local | Development | Resend test mode or console.log | `next dev` |

**Environment variables:**

```
RESEND_API_KEY=[[TBD: resend-key]]
CONTACT_EMAIL=[[TBD: email]]
NEXT_PUBLIC_SITE_URL=[[TBD: domain]]
```

No migrations. No database. No rollback concerns beyond git revert.

## 12. Observability

Vercel's built-in: deploy logs, function invocation logs, and Analytics. Server Action errors logged via `console.error` and visible in Vercel's function logs.

No external error tracking (Sentry, etc.) in v1. If form submission failures go unnoticed, Twice will know because no emails arrive — the feedback loop is inherently tight at this scale.

## 13. Out of scope for v1

| Deferred | Trigger to revisit |
|---|---|
| Database / persistent submissions | >20 requests/week or need for status tracking |
| CAPTCHA / bot protection | Spam volume becomes noticeable |
| Direct file upload | Clients consistently struggle with URL-based sharing |
| i18n | Filipino-language audience requests (unlikely — English is standard for academic work) |
| Email confirmation to client | Clients request confirmation that their submission was received |
| Rate limiting beyond Vercel defaults | Abuse detected |
