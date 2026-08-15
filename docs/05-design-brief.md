> **Project:** AskTwice · **Doc:** Design Brief · **Version:** 0.2 · **Date:** 2026-08-14
> **Status:** Draft — supersedes v0.1 ("quiet competence")
> **Upstream:** PRD v0.1, App Flow v0.1

# AskTwice — Design Brief

## 1. Direction

**"Marginalia"** — the visual language of a good student's annotated notebook: warm paper, graphite ink, pen-blue notes in the margin, and a highlighter used exactly where it matters. Clean modern layout underneath; the handwriting is an accent, never the structure.

**Why this and not something else.** The person landing on this page is a college student with a deadline, deciding whether to trust a stranger with their grade. Two things have to be true at once: *this person is organized* and *this person is one of us, and easy to talk to.* A corporate-clean layout only delivers the first. Paper, pen-blue annotation, and a highlighter stroke are artifacts from the visitor's own daily life — they deliver the second without costing the first, because the underlying grid, type scale, and spacing stay disciplined.

The register is a capable classmate, not a vendor. Warm, direct, unpretentious. Never cutesy, never salesy.

---

## 2. Typography

Three faces. No serif display — the warmth comes from letterform character and the handwriting accent, not from a high-contrast serif, which is the reflexive choice for "warm" and lands as generic.

| Role | Face | Weights | Used for |
|---|---|---|---|
| **Display** | **Bricolage Grotesque** | 500, 700, 800 | Hero headline, section headings, service names, pricing figures |
| **Body** | **Plus Jakarta Sans** | 400, 500, 600 | All body copy, form labels, buttons, nav, FAQ |
| **Marginalia** | **Caveat** | 500 | Margin notes ONLY. Never in UI, never body, never buttons. |

All three load from `next/font/google` — no manual `@font-face` setup, no layout shift, no external request at runtime.

**Why Bricolage Grotesque:** its letterforms are slightly irregular and its variable width and optical-size axes let headlines feel drawn rather than set. It reads as human without reading as informal. Paired with a sans body, the size contrast — not style contrast — carries the hierarchy, which is deliberate: serif-display-on-cream is the single most recognizable "designed by AI" signature right now, and this brief needs to not look like that.

**Why Caveat, and the rule that keeps it from being twee:** Caveat is legible, unfussy handwriting — no loops, no marker gimmick. It appears **at most 4 times on the entire page**, always in the left gutter (or above the heading on mobile), always at `--text-sm`, always in `--pen`, rotated −2°. If a fifth one shows up, delete one.

**Scale (fluid):**

```css
--font-display: 'Bricolage Grotesque', system-ui, sans-serif;
--font-body:    'Plus Jakarta Sans', system-ui, sans-serif;
--font-hand:    'Caveat', cursive;

--text-xs:   clamp(0.75rem,   0.72rem + 0.15vw, 0.8125rem);  /* 12–13 · tags, meta */
--text-sm:   clamp(0.8125rem, 0.79rem + 0.20vw, 0.9375rem);  /* 13–15 · captions, marginalia */
--text-base: clamp(0.9375rem, 0.90rem + 0.25vw, 1.0625rem);  /* 15–17 · body */
--text-lg:   clamp(1.125rem,  1.05rem + 0.40vw, 1.3125rem);  /* 18–21 · lead paragraph */
--text-xl:   clamp(1.375rem,  1.20rem + 0.70vw, 1.75rem);    /* 22–28 · card titles */
--text-2xl:  clamp(1.875rem,  1.55rem + 1.30vw, 2.625rem);   /* 30–42 · section headings */
--text-3xl:  clamp(2.5rem,    1.90rem + 2.60vw, 4rem);       /* 40–64 · hero */
```

**Usage rules**

- Hero: Bricolage 800, `--text-3xl`, tracking `-0.03em`, line-height `1.02`
- Section headings: Bricolage 700, `--text-2xl`, tracking `-0.02em`
- Body: Plus Jakarta 400, `--text-base`, line-height `1.65`, max width `65ch`
- Pricing: Bricolage 700 with `font-variant-numeric: tabular-nums` so ₱ figures align down a column
- Buttons: Plus Jakarta 600, `--text-base`, sentence case — **never ALL CAPS**; shouting is the opposite of this brief
- Form labels: Plus Jakarta 500, `--text-sm`, sentence case, `--ink-soft`

---

## 3. Colour

Warm paper, graphite ink, one pen, one highlighter. That is the entire system, and it comes from the subject rather than from a palette generator.

```css
:root {
  /* Paper */
  --paper:          #FAF5EB;  /* dominant surface — warm and saturated enough to read as paper */
  --paper-sunken:   #F2E9D9;  /* alternating sections, quiet blocks */
  --paper-raised:   #FFFDF8;  /* cards, form fields — lifts off the page */
  --paper-inverse:  #2A2724;  /* footer, and the one dark section */

  /* Graphite */
  --ink:            #2A2724;  /* primary text */
  --ink-soft:       #6B635A;  /* secondary text, labels, captions */
  --ink-faint:      #A79C8D;  /* placeholders and disabled ONLY */
  --ink-inverse:    #FAF5EB;  /* text on dark */

  /* Rules */
  --rule:           #E5DAC7;  /* hairlines, card borders */
  --rule-strong:    #C9B99E;  /* hover borders, active field borders */

  /* Pen — the interactive colour */
  --pen:            #2F5D8A;  /* links, CTAs, marginalia, focus ring */
  --pen-deep:       #1E4266;  /* hover / pressed */
  --pen-wash:       #E4EDF6;  /* selected states, quiet badges */

  /* Highlighter — meaning, not decoration */
  --highlight:      #FFD75E;  /* the swipe behind key words */
  --highlight-soft: #FFF2C4;  /* badge / tag backgrounds */

  /* States */
  --ok:             #3D6B4F;
  --error:          #B4402F;
  --error-wash:     #FBEDEA;
}
```

**Contrast** (against `--paper` `#FAF5EB` unless noted)

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | ~12.9:1 | AAA ✅ |
| `--ink-soft` on `--paper` | ~4.9:1 | AA body ✅ |
| `--pen` on `--paper` | ~6.4:1 | AA body ✅ |
| `--paper` on `--pen` (filled button) | ~6.4:1 | AA body ✅ |
| `--ink` on `--highlight` | ~9.1:1 | AAA ✅ |
| `--ink-inverse` on `--paper-inverse` | ~12.9:1 | AAA ✅ |
| `--ink-faint` on `--paper` | ~2.9:1 | ⚠️ placeholders/disabled only — never real content |

**The highlighter rule.** `--highlight` appears **twice on the page, maximum**: once behind one word in the hero, once behind one phrase in About. Everywhere else that needs emphasis uses weight or `--pen`. A highlighter that marks everything marks nothing — true on paper, true here.

**Why not the obvious alternatives:** cream-plus-terracotta is the current default "warm" palette and reads as templated. Pastel-and-rounded reads as a study app for children. Pen-blue on paper is specific to the subject, passes contrast comfortably, and leaves one genuinely bright accent (marigold) that stays meaningful because it is rationed.

---

## 4. Layout

**Grid:** 12 columns, max content width **1180px**, gutters `clamp(1.25rem, 5vw, 5rem)`.

**The margin column is real.** From `lg` up, content sits in columns 3–11, leaving a genuine left margin where the Caveat notes live. This is why the layout is not centered — the margin is structural, not leftover. Below `lg`, marginalia moves above its heading and the layout becomes a single full-width column.

```
DESKTOP (≥1024px)                        MOBILE (<1024px)
┌──────┬───────────────────────────┐     ┌────────────────────┐
│  ↖   │  Section heading          │     │ ↖ note             │
│ note │  Body copy, cards, form   │     │ Section heading    │
│      │                           │     │ Body, cards        │
└──────┴───────────────────────────┘     └────────────────────┘
  2 col            9 col
```

**Spacing scale** — use these values only. Arbitrary padding is the visual equivalent of inconsistent indentation.

```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
--space-7: 3rem;     --space-8: 4rem;     --space-9: 6rem;   --space-10: 8rem;
```

**Section rhythm:** alternate `--paper` → `--paper-sunken` → `--paper`. Vertical padding `--space-9` desktop, `--space-8` mobile. Contact is the one dark block (`--paper-inverse`) — it arrives as the destination the whole page has been walking toward.

**Composition rules**

- **Left-aligned everything.** A centered stack is the shape a layout takes when nobody chose one.
- **Services are asymmetric.** On desktop, a 7/5 split — description column wider than the price/CTA column. Not a 3-up grid of equal cards.
- **Cards get a 1px `--rule` border and no shadow.** Elevation comes from `--paper-raised` sitting on `--paper`, which is how stacked paper actually behaves.
- **Radius:** `6px` on cards and inputs, `999px` on tags only. Nothing else fully rounded — over-rounding is where "professional" leaks out.

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280`. Mobile-first; base styles are the 320px case.

---

## 5. Motion

| Purpose | Duration | Easing |
|---|---|---|
| Hover / press feedback | 140ms | `ease-out` |
| Scroll reveal (fade + 16px rise) | 420ms | `cubic-bezier(0.16, 1, 0.3, 1)`, 70ms stagger |
| Accordion open / close | 240ms | `ease-out` |
| Nav condense on scroll | 200ms | `ease` |
| Mobile drawer | 300ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Form success transition | 320ms | `ease-out` |

### Signature interaction — the highlighter swipe

On hero load, after the headline settles (~500ms), a marigold bar wipes left-to-right behind one word over **380ms**, easing `cubic-bezier(0.65, 0, 0.35, 1)`. It sits *behind* the text (`z-index: -1`), height ~`0.62em`, anchored near the baseline, overshooting the word by ~4px on each side, with slightly uneven edges — the way real highlighter ink lays down.

**Implementation note:** build it as an absolutely-positioned span animated with `transform: scaleX()` from `transform-origin: left`, **not** a width animation. Width animations trigger layout on every frame and will judder on the mid-range Android phones most of this audience is holding.

This is the one bold moment on the page. Everything else stays quiet.

**Reduced motion:** all durations → 0, stagger → 0, scroll reveals render visible immediately, and the highlighter renders in its final state with no wipe. Not optional.

---

## 6. Component inventory

| Component | Section | Variants | States | Notes |
|---|---|---|---|---|
| `StickyNav` | global | transparent, condensed | default, drawer-open | shadcn `Sheet` for mobile |
| `MarginNote` | 4 places max | — | — | Caveat, `--pen`, rotate −2°, moves above heading below `lg` |
| `Highlight` | hero, about | animated, static | — | The signature; respects reduced-motion |
| `Hero` | top | — | — | Headline, lead, dual CTA |
| `ServiceRow` | services | — | default, hover | 7/5 asymmetric split, tabular pricing |
| `PriceTag` | services | range, "ask me" | — | Bricolage 700, `tabular-nums` |
| `WorkCard` | portfolio | filled, **placeholder** | default, hover | Placeholder is a designed state, not a gap |
| `FaqItem` | faq | — | collapsed, expanded | shadcn `Accordion` |
| `ContactForm` | contact | — | idle, submitting, success, error | On `--paper-inverse`; fields are `--paper-raised` |
| `Field` | form | text, textarea, select, date | default, focus, error, disabled | Error text `--error`, `aria-live="polite"` |
| `SubmitButton` | form | — | idle, loading, disabled, done | Label changes idle→loading→done, never a generic "Submit" |
| `Toast` | form | success, error | — | shadcn `Sonner` |
| `Footer` | bottom | — | — | `--paper-inverse`, email, socials |

---

## 7. Accessibility

- Every text token meets AA against its surface (§3). `--ink-faint` is restricted to placeholders and disabled states.
- **Focus:** 2px `--pen` ring, 2px offset, on every interactive element. Never `outline: none` without a replacement.
- **Targets:** ≥44×44px on all tappable elements, including FAQ triggers and nav links.
- **Keyboard:** full tab path nav → sections → form → submit. Accordion on Enter/Space. Drawer closes on Escape.
- **Semantics:** one `h1` (hero), one `h2` per section, `h3` per card. Marginalia is `aria-hidden="true"` — it is atmosphere, and a screen reader announcing a rotated aside mid-heading is noise.
- **Highlighter is decorative.** It never carries meaning alone; the highlighted word is already load-bearing in the sentence.
- `prefers-reduced-motion` honoured throughout (§5).

---

## 8. Anti-goals

- **Not a SaaS landing page.** No gradient mesh, no floating dashboard screenshot, no "Trusted by 500+ students" counter, no three equal icon-cards.
- **Not a freelancer-marketplace clone.** No star ratings, no seller badges, no countdown urgency.
- **Not a scrapbook.** No paper textures, no torn edges, no tape graphics, no fake ruled lines, no sticker emoji. The paper feeling comes from colour and restraint only — the moment a texture image appears, this becomes a Canva template.
- **Not cutesy.** Approachable ≠ childish. No mascots, no rounded-everything, no stacked exclamation marks.
- **Not the AI default.** No Inter/Roboto/Arial, no purple-blue gradient, no cream-plus-serif-plus-terracotta, no decorative `01 / 02 / 03` markers on content that is not a sequence.

---

## 9. Voice, and the copy placeholders

**Voice rules**

- **First person singular.** This is *Twice*, not "our team." "I'll get back to you within a day," never "We aim to respond promptly."
- **Say the thing plainly.** "₱300–₱1,500" beats "affordable rates." "Two revisions included" beats "we value your satisfaction."
- **Name the anxiety and answer it.** Students worry about four things: is it any good, will it be late, will anyone find out, can I afford it. Every section should be quietly answering one of them.
- **Warm, not chirpy.** No exclamation marks in headings. No "Let's do this!" energy.
- **Buttons say what happens.** "Tell me about your project" → the resulting toast says "Sent — I'll reply within a day."

### Hero

- **Headline:** `Schoolwork,` **`handled`**`.` — highlighter on *handled*
- Alternatives if that doesn't land: *"Good work. On time. No stress."* · *"You've got a deadline. I've got this."*
- **Lead:** "Presentations, case studies, capstone documents, and the assignments piling up behind them. Tell me what you need and when — I'll tell you what it costs."
- **Primary CTA:** `Tell me about your project` · **Secondary:** `See what I charge`
- **Margin note:** *"no commitment — ask first, decide after"*

### Services — `[[TBD: replace every figure with a real range]]`

| Service | Copy placeholder | Range placeholder |
|---|---|---|
| Presentations | "Slide decks that don't look like a template. PowerPoint, Google Slides, or Canva — your call." | ₱300–₱1,500 |
| Case studies | "Proper structure, real analysis, citations formatted the way your instructor wants them." | ₱500–₱2,000 |
| Capstone & thesis support | "Documentation, technical writing, and the deliverables around your build. I'm doing my own capstone — I know exactly where this gets painful." | ₱1,000–₱3,000+ |
| Homework & assignments | "Problem sets, essays, reports, weekly submissions. The steady stuff." | ₱200–₱800 |
| Research papers | "Literature review through methodology, formatted to APA, IEEE, or whatever your department uses." | ₱800–₱2,500 |
| Something else | "Not on the list? Describe it and I'll quote it." | Ask me |

**Margin note:** *"rush jobs cost more — but I'll always tell you first"*

### Portfolio

Placeholder copy: **"Samples going up soon."** / "Ask and I'll send a few over privately — most of my past work belongs to the people who paid for it."

That second line does double duty: it explains the empty state *and* signals confidentiality, which is the thing this audience is quietly worried about.

When real content exists, aim for 2–3 presentation screenshots, 1–2 case-study first pages, and 1 capstone excerpt (table of contents or methodology). Anonymize everything — swap names for "Client A." Caption each with service type, subject area, and turnaround.

### About

- Structure: who you are (medical laboratory science → developer → this) · what you actually do all day (3rd-year BSIT, building your own capstone) · why this exists.
- Suggested opener: "I'm Twice. I'm a third-year IT student now — I started out in Medical Laboratory Science before shifting — and I've spent the last two years building software and writing documentation since."
- Highlighter goes on one phrase here — suggest **"I'm a student too"** or **"I've been on your side of this."**
- **Margin note:** *"same deadlines as you, honestly"*

### FAQ

Write the answers in Twice's voice, not a policy voice.

1. **How does this work?** → form → quote within a day → you approve → I build → I deliver
2. **How fast can you turn something around?** → standard vs. rush, and be honest about the floor
3. **What if I need changes?** → `[[TBD: revision count]]` rounds included, then a rate
4. **Will anyone know?** → "No. I don't share client work, names, or files. Ever." Short answer, no hedging.
5. **How do I pay?** → `[[TBD: GCash / bank transfer]]`, and when payment is due
6. **What subjects can you handle?** → name the strengths, then name a limit. Admitting one is the most credible thing on the page.

### Contact

- **Heading:** "Tell me what you need."
- **Lead:** "The more detail you give me, the faster I can quote it. Nothing here is a commitment."
- **Submit:** idle `Send my request` → loading `Sending…` → done `Sent`
- **Success:** "Got it — I'll reply to `{email}` within a day."
- **Failure:** "That didn't send. Email me directly at `[[TBD: email]]` and I'll pick it up there."
- **Margin note:** *"I read every one of these myself"*
