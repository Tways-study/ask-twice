> **Project:** AskTwice · **Doc:** Backend Schema · **Version:** 0.1 · **Date:** 2026-08-10
> **Status:** Draft
> **Upstream:** PRD v0.1, App Flow v0.1

# AskTwice — Backend Schema

## 1. Architecture: No database in v1

AskTwice has no persistent data store. The only "backend" is a single Server Action that validates form input and forwards it to Formspree, which handles delivery. Twice's email inbox is the data store.

This is a deliberate decision, not a deferral. A database is unjustified until request volume exceeds what email can manage (~20+/week consistently) or Twice needs to track order status, history, or analytics beyond Vercel's built-in.

## 2. Data flow

```
Client (form)
    │
    ▼ POST (Server Action)
Zod validation
    │
    ├─ Invalid → return field errors → client shows inline messages
    │
    ▼ Valid
Formspree POST
    │
    ├─ Success → return success → client shows confirmation
    │
    ▼ Failure
Return error → client shows fallback email address
```

## 3. Form submission schema (Zod)

This is the closest thing to a "schema" in v1. Defined once, used for both client-side and server-side validation.

```typescript
import { z } from 'zod'

export const serviceTypes = [
  'presentation',
  'case_study',
  'capstone',
  'homework',
  'research_paper',
  'other',
] as const

export const budgetRanges = [
  'under_500',    // ₱0–₱500
  '500_1000',     // ₱500–₱1,000
  '1000_2000',    // ₱1,000–₱2,000
  '2000_plus',    // ₱2,000+
  'contact_quote', // Contact for custom quote
] as const

export const contactMethods = [
  'email',
  'messenger',
  'telegram',
] as const

export const contactFormSchema = z.object({
  // Client info
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  contactMethod: z.enum(contactMethods),

  // Request details
  serviceType: z.enum(serviceTypes),
  subject: z.string().min(3, 'Subject or course name is required').max(200),
  deadline: z.string().min(1, 'Deadline is required'), // ISO date string
  details: z.string().min(20, 'Please provide at least 20 characters of detail').max(5000),
  budgetRange: z.enum(budgetRanges),

  // Optional
  fileUrl: z.string().url().optional().or(z.literal('')),
  additionalNotes: z.string().max(1000).optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

## 4. Email delivery

The Server Action POSTs the validated form fields as JSON to `https://formspree.io/f/{FORMSPREE_FORM_ID}`, plus two of Formspree's reserved fields:

- `_subject`: `[AskTwice] New Request: {serviceType} — {subject}`
- `_replyto`: `{email}` — so Twice can hit reply directly on the notification email

Formspree auto-formats the rest of the submitted fields into a readable email; there's no hand-built template on our side.

## 5. Rate limiting

To prevent form spam without a database:

- **Client-side:** Disable submit button for 30 seconds after successful submission
- **Server-side:** Vercel's built-in rate limiting on the Server Action route, or a simple in-memory counter per IP (resets on cold start — acceptable for this scale)

No CAPTCHA in v1. If spam becomes an issue, add Cloudflare Turnstile (free, invisible).

## 6. File uploads

**v1 approach:** No server-side file upload. The form accepts a URL (Google Drive link, Dropbox link) rather than a direct file upload. This avoids needing storage infrastructure entirely.

**If direct upload is needed later:** Add Vercel Blob (free tier: 250MB) or Supabase Storage.

## 7. When to add a database

| Trigger | What to add | Why |
|---|---|---|
| >20 requests/week consistently | Supabase + `submissions` table | Email inbox becomes unmanageable |
| Need to track order status | Supabase + status enum + RLS | Clients asking "what's my order status" |
| Need payment records | Supabase + `payments` table + Stripe | Receipts and transaction history |
| Multiple operators | Supabase + Auth + role-based access | More than just Twice handling requests |
