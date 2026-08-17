# Product

## Register

brand

## Users

**Prospective client** — a college student at a provincial Philippine university, mobile-first, browsing between classes or late at night before a deadline. They're deciding whether to trust a stranger with their grade. They need to evaluate whether Twice can handle their work, understand pricing, and submit a detailed request without 3-5 rounds of back-and-forth clarification. Their current alternative is word-of-mouth and scattered Messenger group chats — no portfolio to pre-qualify, no public pricing signal, no professional point of contact.

**Twice (operator)** — receives email notifications on form submit, evaluates requests, responds with quotes. Needs enough context up front to quote accurately without chasing details.

*(Sources: docs/01-prd.md §2-3, docs/00-intake.md §1)*

## Product Purpose

A marketing and client-intake site for Twice's freelance academic services (presentations, case studies, capstone documents, homework, research papers, small web dev work). It replaces informal Messenger-based intake with a real portfolio, transparent pricing ranges, an FAQ that pre-answers the questions clients are too polite to ask, and a structured request form that gets Twice enough detail to quote without back-and-forth. Success looks like: a visitor understands what's offered and what it costs in under 10 seconds, trusts the portfolio enough to commit, and submits a request with enough detail to quote on the first read.

*(Source: docs/01-prd.md §1, §4)*

## Brand Personality

**A capable classmate, not a vendor.** Warm, direct, unpretentious. Never cutesy, never salesy. First person singular throughout ("I", never "we") — this is Twice, one person, not a studio.

The two things that have to be true at once: *this person is organized* (so a stranger will hand over their grade) and *this person is one of us, and easy to talk to* (so the ask doesn't feel like hiring a vendor). The site answers four unspoken anxieties, in order: is it any good (portfolio), will it be late (process strip, turnaround FAQ), will anyone find out (confidentiality FAQ, stated plainly), can I afford it (pricing on every service card, no "contact for pricing" hedge).

*(Source: docs/05-design-brief.md §1, §9)*

## Anti-references

Explicit anti-goals, carried since the original design brief and still binding:

- **Not a SaaS landing page.** No gradient mesh, no floating dashboard screenshot, no "Trusted by 500+ students" counter.
- **Not a freelancer-marketplace clone.** No star ratings, no seller badges, no countdown urgency.
- **Not decorated.** No paper textures, no torn edges, no tape graphics, no sticker emoji, no gratuitous accent colors, no decorative 01/02/03 markers on content that isn't a real sequence (the one exception — the 4-step process strip — genuinely is a sequence).
- **Not cutesy.** Approachable ≠ childish. No mascots, no stacked exclamation marks.
- **Not shadowed or bordered.** Cards are borderless — no drop shadow, no visible stroke. Separation is background-color alternation only.
- **Not centered everywhere except deliberately.** The hero centers; card grids and their content center by design decision; the contact form and FAQ accordion rows stay left-aligned because that's how those specific interaction patterns read correctly.

*(Source: docs/05-design-brief.md §8, plus decisions made across the redesign sessions)*

## Design Principles

1. **The size-contrast hierarchy carries weight, not decoration.** One display face (Inter) used at extreme weight/size range (400→800, 15px→96px) does the work that a second typeface or a color system would otherwise do.
2. **Every accent is rationed and has exactly one job.** Electric blue is the only interactive/decorative color. The marigold highlighter appears exactly twice on the entire page (hero + About) — a highlighter that marks everything marks nothing. Ember exists only for form validation, never decoration.
3. **Personal touches are structural, not sprinkled.** The 4 handwritten margin notes and the highlighter swipe are the site's signature — deliberately rationed so they read as *a person's* voice inside a disciplined system, not generic AI-page flourish.
4. **Motion explains state, it doesn't perform.** Existing motion (scroll reveals, the highlighter swipe, accordion open/close, nav condense) all signals something real — content arriving, a word being emphasized, a panel opening. Nothing animates just to look alive.
5. **Real content over placeholder polish.** Portfolio thumbnails are real screenshots of real work (anonymized where needed), not stock photography or fabricated mockups. When content isn't ready, the placeholder state is designed on purpose, not hidden.

## Accessibility & Inclusion

- Every text token meets AA against its surface; body text ≥4.5:1, large text ≥3:1. `--ink-faint` is restricted to placeholders/disabled states only, never real content.
- Focus: 2px electric-blue ring, 2px offset, on every interactive element. Never `outline: none` without a replacement.
- Targets ≥44×44px on all tappable elements, including FAQ triggers and nav links.
- Full keyboard path: nav → sections → form → submit. Accordion on Enter/Space. Drawer closes on Escape.
- One `h1` (hero), one `h2` per section, `h3` per card. `MarginNote` is `aria-hidden="true"` (atmosphere, not content).
- The highlighter is decorative — it reinforces a word that's already load-bearing in its sentence, never carries meaning alone.
- `prefers-reduced-motion` honoured throughout: durations → 0, reveals render visible immediately, highlighter renders in final state with no wipe.

*(Source: docs/05-design-brief.md §7)*
