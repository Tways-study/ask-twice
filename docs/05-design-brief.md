> **Project:** AskTwice · **Doc:** Design Brief · **Version:** 0.4 · **Date:** 2026-08-17
> **Status:** Current — supersedes v0.3 ("Cathedral," a full Marginalia replacement) by reintroducing two of its signature personal touches
> **Upstream:** PRD v0.1, App Flow v0.1
> **Source:** structure/type/color adapted from the "Apple (España)" style at styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856; two accents carried forward from v0.2 ("Marginalia")

# AskTwice — Design Brief

## 1. Direction

**"Cathedral, annotated"** — the v0.3 replacement's near-white monochrome canvas, oversized weight-800 headlines, electric-blue accent, and borderless card grids, with two of the original "Marginalia" build's personal touches layered back in: handwritten `MarginNote` asides and the marigold `Highlight` swipe. Everything else about the Apple-style rebuild stands as-is.

**Why bring anything back.** A pure copy of the reference's own architecture reads as exactly that — a copy, not a person. The two touches that come back are specifically the ones that carried Twice's individual voice rather than generic page furniture: a note that looks like it was jotted by hand, and a highlighter mark that looks like it was actually dragged across the page. Both are deliberately rationed (same rules as v0.2) so they read as accents, not a second design system fighting the first.

**What's back, and where:**
- **`MarginNote`** (Caveat, `-rotate-2`, `text-pen`) — exactly 4 places: the caption under the hero CTAs, under "What I take on," the phrase under About's second paragraph, and under Contact's lead. Same "4 max, or delete one" rule as v0.2.
- **`Highlight`** (marigold swipe, `bg-highlight`) — exactly twice: "handled." in the hero, "I'm a student too" in About. Same "twice, maximum" rule as v0.2. It fires off the hero's masked-line reveal completing, not a scroll trigger, so the two stay in sync.
- The `opengraph-image` and `icon.svg` were updated to match — the OG card shows the same marigold swipe as the live hero, and the favicon carries a small highlighter-behind-text motif again (recolored: white background, ink-black bars, not the old warm paper).

**What did NOT come back** (still v0.3, not v0.2):
- The warm paper / pen-blue / cream palette — canvas is still near-white, ink is still `#1D1D1F`, the one interactive/brand color is still electric blue.
- Bricolage Grotesque and Plus Jakarta Sans — display and body copy are still one Inter family across the page. Caveat is back, but strictly for the 4 margin notes.
- The left-margin asymmetric grid — Services and Portfolio are still card grids, the hero is still centered, margin notes render inline in normal content flow rather than in a dedicated left gutter.
- Card borders and shadows — cards are still borderless, separated by background-color alternation only.

The register is unchanged throughout every version: a capable classmate, not a vendor. Warm, direct, unpretentious. Never cutesy, never salesy.

---

## 2. Typography

Two faces. Inter carries every structural role; Caveat exists solely for the 4 margin notes.

| Role | Face | Weight | Used for |
|---|---|---|---|
| **Display** | Inter | 800 | Hero headline only |
| **Heading** | Inter | 600 | Section headings, card titles, service/portfolio names |
| **Body** | Inter | 400–500 | All body copy, nav, FAQ answers |
| **Button** | Inter | 400 | Button labels — regular weight, per the reference; never semibold |
| **Marginalia** | Caveat | 500 | The 4 `MarginNote` asides ONLY. Never in UI, never body, never buttons. |

Inter loads once via `next/font/google` as a single variable feeding both `--font-display` and `--font-sans` — weight is what separates "hero headline" from "form label," not a font swap. This mirrors the reference's own fallback: it specifies SF Pro Display/Text, which aren't distributable web fonts, and documents Inter as the substitute for both. Caveat loads separately as `--font-hand`, used only by `MarginNote`.

All weights/faces load from `next/font/google` — no manual `@font-face`, no layout shift.

**Scale (fluid, retargeted to the reference's px scale):**

```css
--font-display: var(--font-inter);
--font-sans:    var(--font-inter);

--text-xs:   clamp(0.6875rem, 0.6875rem + 0.08vw, 0.75rem);   /* 11–12 · micro, meta */
--text-sm:   clamp(0.8125rem, 0.8125rem + 0.08vw, 0.875rem);  /* 13–14 · captions */
--text-base: clamp(0.9375rem, 0.9375rem + 0.16vw, 1.0625rem); /* 15–17 · body */
--text-lg:   clamp(1.125rem,  1.125rem + 0.23vw, 1.3125rem);  /* 18–21 · lead paragraph */
--text-xl:   clamp(1.375rem,  1.375rem + 0.47vw, 1.75rem);    /* 22–28 · card titles */
--text-2xl:  clamp(1.5rem,    1.5rem + 0.63vw, 2rem);         /* 24–32 · section headings */
--text-3xl:  clamp(2.5rem,    2.5rem + 4.4vw, 6rem);          /* 40–96 · hero display */
```

**Usage rules**

- Hero: Inter 800, `--text-3xl`, tracking `-0.03em`, line-height `1.04`, centered
- Section headings: Inter 600, `--text-2xl`, tracking `-0.01em`, left-aligned
- Body: Inter 400, `--text-base`, line-height `1.65`, max width `65ch`
- Pricing: Inter 600 with `font-variant-numeric: tabular-nums` so ₱ figures align down a column
- Buttons: Inter 400, `--text-base`, sentence case — **never ALL CAPS**
- Form labels: Inter 500, `--text-sm`, sentence case, `--ink-soft`

---

## 3. Colour

Near-white canvas, ink-black text, one electric-blue accent. Color appears nowhere else as decoration — the reference's own rule ("let the product carry the color") translates here to "let weight and whitespace carry the hierarchy."

```css
:root {
  /* Canvas */
  --paper:          #FFFFFF;  /* primary page background, card surfaces */
  --paper-sunken:   #F5F5F7;  /* alternating section bands */
  --paper-raised:   #FFFFFF;  /* cards, form fields — same as paper; separation is via --paper-sunken */
  --paper-inverse:  #1D1D1F;  /* the one dark section — Contact + Footer */

  /* Ink */
  --ink:            #1D1D1F;  /* primary text */
  --ink-soft:       #707070;  /* secondary text, labels, captions */
  --ink-faint:      #86868B;  /* placeholders and disabled ONLY */
  --ink-inverse:    #FFFFFF;  /* text on dark */

  /* Hairline — used sparingly, per the reference's own "rarely used" note */
  --rule:           #D6D6D6;
  --rule-strong:    #B6B6B6;

  /* Electric Blue — the one chromatic accent */
  --pen:            #0071E3;  /* filled CTAs, links, focus ring, emphasized words */
  --pen-deep:       #0058B0;  /* hover / pressed */
  --pen-wash:       #E8E8ED;  /* selected states, quiet badges, text selection */

  /* Highlighter — the one personal touch carried over from v0.2. Distinct
     from --error/--error-wash below, which stay their own ember tone. */
  --highlight:      #FFD75E;
  --highlight-soft: #FFF2C4;

  /* States (kept independent of the highlighter) */
  --ok:             #2F6B46;
  --error:          #B64400;
  --error-wash:     #FBE6D8;
}
```

**Contrast** (against `--paper` `#FFFFFF` unless noted)

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | ~17.9:1 | AAA ✅ |
| `--ink-soft` on `--paper` | ~4.6:1 | AA body ✅ |
| `--pen` on `--paper` | ~4.6:1 | AA body ✅ |
| `--paper` on `--pen` (filled button) | ~4.6:1 | AA body ✅ |
| `--ink-inverse` on `--paper-inverse` | ~17.5:1 | AAA ✅ |
| `--ink-faint` on `--paper` | ~3.3:1 | ⚠️ placeholders/disabled only — never real content |

**The accent rule.** `--pen` (electric blue) is the primary chromatic color — filled buttons, links, focus rings. `--highlight` (marigold) is the one deliberate exception: the swipe behind exactly two words on the whole page (§5). `--error` (ember) is functional-only and never decorative. Three colors, each with exactly one job — nothing is chromatic just to be chromatic.

---

## 4. Layout

**Grid:** content max-width **1200px**, gutters `clamp(1.25rem, 5vw, 5rem)`.

**The hero is centered; everything else is left-aligned.** This is the reference's own pattern (Product Hero centers; Section Headers and Feature Showcase Cards are left-aligned) and it's why there's no more margin column — centering is reserved for the one "Product Hero" moment, not the whole page.

```
HERO (centered)                          OTHER SECTIONS (left-aligned)
┌─────────────────────────┐              ┌─────────────────────────┐
│        eyebrow           │              │ Section heading          │
│   Big centered headline  │              │ ┌────────┐ ┌────────┐    │
│   Lead, centered         │              │ │  card  │ │  card  │    │
│  [CTA] [CTA]  · caption  │              │ └────────┘ └────────┘    │
└─────────────────────────┘              └─────────────────────────┘
```

**Spacing scale** — retargeted to the reference's own spacing list (4/8/12/16/24/32/44/76/120/144):

```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
--space-7: 2.75rem;  --space-8: 4.75rem;  --space-9: 7.5rem;  --space-10: 9rem;
```

**Section rhythm:** alternate `--paper` → `--paper-sunken` → `--paper`. Vertical padding `--space-9` (120px) desktop, `--space-8` (76px) mobile — matches the reference's own stated 100–120px section-gap range. Contact is the one dark block (`--paper-inverse`), same as before.

**Composition rules**

- **Hero centers; every other section is left-aligned.** A centered body paragraph anywhere else is the shape a layout takes when nobody chose one (the reference's own "don't center body paragraphs" rule).
- **Services and Portfolio are card grids**, not row lists — `rounded-2xl` (28px), borderless, sitting on the alternating canvas.
- **Cards are borderless.** No `border`, no shadow. Elevation is `--paper-raised` (white) against `--paper-sunken` (`#F5F5F7`) — color contrast alone, per the reference's "rely on background-color alternation and radii, not borders or shadow."
- **Radius:** `--radius` (10px, the reference's "links" token) on inputs/panels/popovers. `--radius-2xl` (28px, the reference's "cards"/"productImages" token) on cards and portfolio thumbnails. `rounded-full` (980px pill) on every button.

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

### Signature moment — the highlighter swipe

Back from v0.2, unchanged in mechanics. On hero load, after the headline's masked-line reveal completes, a marigold bar wipes left-to-right behind "handled." over 380ms, `cubic-bezier(0.65, 0, 0.35, 1)`. It sits *behind* the text (`z-index: -1`), height ~`0.62em`, anchored near the baseline, with slightly uneven edges via `clip-path` — the way real highlighter ink lays down. It's chained off the headline animation's `onAnimationComplete`, not a hardcoded delay, so it stays in sync if the copy changes length.

About's highlighter (`I'm a student too`) fires on scroll-into-view instead, since it isn't part of a chained entrance sequence.

**Implementation note:** built as an absolutely-positioned span animated with `transform: scaleX()` from `transform-origin: left`, **not** a width animation — width animations trigger layout on every frame and judder on mid-range Android.

This is the one bold moment on the page, exactly as it was in v0.2. Everything else — including the rest of this Apple-derived system — stays quiet.

**Reduced motion:** all durations → 0, stagger → 0, scroll reveals render visible immediately, and the highlighter renders in its final state with no wipe. Not optional.

---

## 6. Component inventory

| Component | Section | Variants | States | Notes |
|---|---|---|---|---|
| `StickyNav` | global | transparent, condensed | default, drawer-open | shadcn `Sheet` for mobile |
| `MarginNote` | 4 places max | — | — | Caveat, `--pen`, rotate −2°. Renders inline where it's used (no margin column) |
| `Highlight` | hero, about | externally-controlled, scroll-triggered | — | The signature; respects reduced-motion |
| `Hero` | top | — | — | Centered: eyebrow, headline (with `Highlight`), lead, dual pill CTA, `MarginNote` |
| `ServiceCard` | services | — | default | `rounded-2xl` card grid, tabular pricing, pill CTA |
| `WorkCard` | portfolio | filled, **placeholder** | default | Card grid; placeholder is a designed state, not a gap |
| `FaqItem` | faq | — | collapsed, expanded | shadcn `Accordion`, electric-blue trigger when open |
| `ContactForm` | contact | — | idle, submitting, success, error | On `--paper-inverse`; fields are `--paper-raised` (white) |
| `Field` | form | text, textarea, select, date | default, focus, error, disabled | Error text `--error` (ember), `aria-live="polite"` |
| `SubmitButton` | form | — | idle, loading, disabled, done | Pill, regular weight; label changes idle→loading→done |
| `Toast` | form | success, error | — | shadcn `Sonner` |
| `Footer` | bottom | — | — | `--paper-inverse`, email, socials |
| `AskPanel` | global corner | — | closed, open | Launcher deliberately stays a squared tab (`--radius`, not pill) — the one intentional break from the pill convention, so it doesn't read as a generic chat FAB |

---

## 7. Accessibility

- Every text token meets AA against its surface (§3). `--ink-faint` is restricted to placeholders and disabled states.
- **Focus:** 2px `--pen` ring, 2px offset, on every interactive element. Never `outline: none` without a replacement.
- **Targets:** ≥44×44px on all tappable elements, including FAQ triggers and nav links.
- **Keyboard:** full tab path nav → sections → form → submit. Accordion on Enter/Space. Drawer closes on Escape.
- **Semantics:** one `h1` (hero), one `h2` per section, `h3` per card. `MarginNote` is `aria-hidden="true"` — it is atmosphere, and a screen reader announcing a rotated aside mid-flow is noise.
- **The highlighter is decorative.** It never carries meaning alone; the highlighted word is already load-bearing in the sentence.
- `prefers-reduced-motion` honoured throughout (§5).

---

## 8. Anti-goals

- **Not a SaaS landing page.** No gradient mesh, no floating dashboard screenshot, no "Trusted by 500+ students" counter.
- **Not a freelancer-marketplace clone.** No star ratings, no seller badges, no countdown urgency.
- **Not decorated beyond the two rationed touches.** No paper textures, no torn edges, no tape graphics, no sticker emoji, no third accent color, no decorative `01/02/03` markers on content that isn't a sequence. The highlighter and margin notes are exceptions because they're capped (§1) — everything else stays quiet.
- **Not cutesy.** Approachable ≠ childish. No mascots, no stacked exclamation marks.
- **Not shadowed or bordered.** Cards get zero shadow and no visible stroke — the v0.2 "1px rule border" rule is gone along with the rest of Marginalia. Separation is background-color alternation only.
- **Not centered everywhere.** Only the hero centers. A centered body paragraph anywhere else is a mistake, not a style.

---

## 9. Voice, and the copy placeholders

**Voice rules (unchanged from v0.2 — the visual system changed, the voice didn't)**

- **First person singular.** This is *Twice*, not "our team." "I'll get back to you within a day," never "We aim to respond promptly."
- **Say the thing plainly.** "₱300–₱1,500" beats "affordable rates." "Two revisions included" beats "we value your satisfaction."
- **Name the anxiety and answer it.** Students worry about four things: is it any good, will it be late, will anyone find out, can I afford it. Every section should be quietly answering one of them.
- **Warm, not chirpy.** No exclamation marks in headings. No "Let's do this!" energy.
- **Buttons say what happens.** "Tell me about your project" → the resulting toast says "Sent — I'll reply within a day."

### Hero

- **Eyebrow:** "For students, by a student"
- **Headline:** `Schoolwork,` **`handled.`** — marigold highlighter swipe behind "handled."
- **Lead:** "Presentations, case studies, capstone documents, and the assignments piling up behind them. Tell me what you need and when — I'll tell you what it costs."
- **Primary CTA:** `Tell me about your project` · **Secondary:** `See what I charge`
- **Margin note under the CTAs:** "No commitment — ask first, decide after."

### Services — `[[TBD: replace every figure with a real range]]`

| Service | Copy placeholder | Range placeholder |
|---|---|---|
| Presentations | "Slide decks that don't look like a template. PowerPoint, Google Slides, or Canva — your call." | ₱300–₱1,500 |
| Case studies | "Proper structure, real analysis, citations formatted the way your instructor wants them." | ₱500–₱2,000 |
| Capstone & thesis support | "Documentation, technical writing, and the deliverables around your build. I'm doing my own capstone — I know exactly where this gets painful." | ₱1,000–₱3,000+ |
| Homework & assignments | "Problem sets, essays, reports, weekly submissions. The steady stuff." | ₱200–₱800 |
| Research papers | "Literature review through methodology, formatted to APA, IEEE, or whatever your department uses." | ₱800–₱2,500 |
| Something else | "Not on the list? Describe it and I'll quote it." | Ask me |

**Margin note:** "Rush jobs cost more — but I'll always tell you first."

### Portfolio

Placeholder copy: **"Samples going up soon."** / "Ask and I'll send a few over privately — most of my past work belongs to the people who paid for it."

That second line does double duty: it explains the empty state *and* signals confidentiality, which is the thing this audience is quietly worried about.

When real content exists, aim for 2–3 presentation screenshots, 1–2 case-study first pages, and 1 capstone excerpt (table of contents or methodology). Anonymize everything — swap names for "Client A." Caption each with service type, subject area, and turnaround.

### About

- Structure: who you are (medical laboratory science → developer → this) · what you actually do all day (3rd-year BSIT, building your own capstone) · why this exists.
- Suggested opener: "I'm Twice. I'm a third-year IT student now — I started out in Medical Laboratory Science before shifting — and I've spent the last two years building software and writing documentation since."
- The highlighter's second and last appearance goes on one phrase here — **"I'm a student too"**.
- **Margin note below:** "Same deadlines as you, honestly."

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
- **Margin note below the lead:** "I read every one of these myself."
- **Submit:** idle `Send my request` → loading `Sending…` → done `Sent`
- **Success:** "Got it — I'll reply to `{email}` within a day."
- **Failure:** "That didn't send. Email me directly at `[[TBD: email]]` and I'll pick it up there."
