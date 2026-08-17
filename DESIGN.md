---
name: AskTwice
description: Marketing and client-intake site for a solo student freelancer — Apple-style cathedral of white space with a person's handwriting layered on top
colors:
  canvas-white: "#FFFFFF"
  canvas-gray: "#F5F5F7"
  primary-ink: "#1D1D1F"
  secondary-ink: "#707070"
  tertiary-ink: "#86868B"
  ink-inverse: "#FFFFFF"
  canvas-inverse: "#1D1D1F"
  electric-blue: "#0071E3"
  electric-blue-deep: "#0058B0"
  electric-blue-wash: "#E8E8ED"
  marigold-highlighter: "#FFD75E"
  marigold-highlighter-soft: "#FFF2C4"
  ember: "#B64400"
  ember-wash: "#FBE6D8"
  ok-green: "#2F6B46"
  hairline: "#D6D6D6"
  hairline-strong: "#B6B6B6"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 2.5rem + 4.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.5rem + 0.63vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.375rem + 0.47vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 0.9375rem + 0.16vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.8125rem + 0.08vw, 0.875rem)"
    fontWeight: 500
  marginalia:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(0.8125rem, 0.8125rem + 0.08vw, 0.875rem)"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "44px"
  8: "76px"
  9: "120px"
  10: "144px"
components:
  button-primary:
    backgroundColor: "{colors.electric-blue}"
    textColor: "{colors.canvas-white}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.electric-blue-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  card:
    backgroundColor: "{colors.canvas-white}"
    rounded: "{rounded.2xl}"
    padding: "32px"
  badge:
    backgroundColor: "{colors.electric-blue-wash}"
    textColor: "{colors.electric-blue-deep}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "24px"
  input:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 14px"
---

# Design System: AskTwice

## 1. Overview

**Creative North Star: "The Annotated Cathedral"**

The base system is Apple's own product-page architecture, deliberately adapted: a near-white monochrome canvas, oversized weight-800 headlines with generous negative space, one electric-blue accent reserved for interactive moments, and borderless cards separated by background-color alternation rather than rules or shadow. Alone, that reads as a clean but generic Apple homage — competent, forgettable, could belong to anyone.

What makes it AskTwice: two personal touches, both deliberately rationed rather than sprinkled. A `MarginNote` — Caveat handwriting, rotated −2°, in exactly 4 places on the whole page — reads as a real person's aside jotted in the margin, not a design flourish. A marigold `Highlight` swipe appears exactly twice (the hero's "handled." and one phrase in About) — a highlighter that marks everything marks nothing, so its rarity is what makes it land. The system explicitly rejects: gradient-mesh SaaS hero patterns, star ratings or seller badges (this is a freelancer-marketplace anti-pattern), paper textures or tape graphics, mascots, and decorative numbered markers on content that isn't a real sequence.

**Key characteristics:**
- One typeface (Inter) carrying the entire structural hierarchy through weight and size alone — 400 to 800, 15px to 96px
- Exactly one decorative accent color (electric blue) plus two rationed exceptions (marigold highlighter, twice; ember, functional-only)
- Borderless cards, pill buttons, alternating white/`#F5F5F7` section bands
- The hero centers; every other section is left-aligned or centers its card content by deliberate choice, never by default

## 2. Colors

Near-white canvas, near-black ink, one loud color used quietly.

### Primary
- **Electric Blue** (`#0071E3`): the only chromatic decoration in the UI. Filled CTAs, links, focus rings, the emphasized word in section captions.
- **Electric Blue Deep** (`#0058B0`): hover/pressed state for filled buttons.
- **Electric Blue Wash** (`#E8E8ED`): badge fills, selected states, text selection background.

### Accent (rationed, not primary)
- **Marigold Highlighter** (`#FFD75E`): the swipe-behind-text signature moment. Appears exactly twice on the entire page — hero + About. Never a third time, never as a UI color.
- **Ember** (`#B64400`): functional only — form validation and error states. Visually similar warmth to the highlighter but never used decoratively; the two must not be confused in code or on the page.

### Neutral
- **Canvas White** (`#FFFFFF`): primary page background, card surfaces.
- **Canvas Gray** (`#F5F5F7`): alternating section bands — the only device separating sections, no dividers.
- **Canvas Inverse** (`#1D1D1F`): the one dark section (Contact + Footer), the destination the page has been walking toward.
- **Primary Ink** (`#1D1D1F`): all primary text.
- **Secondary Ink** (`#707070`): captions, secondary text, labels.
- **Tertiary Ink** (`#86868B`): placeholders and disabled states ONLY — never real content, contrast is intentionally borderline there.
- **Hairline** (`#D6D6D6`): used sparingly — form input borders, accordion row dividers. Never on cards.

## 3. Typography

One family, Inter, doing every job through weight and size. Caveat is the single exception, load-bearing for exactly one purpose: the 4 margin notes.

- **Display** (`{typography.display}`): hero headline only. 800 weight, tracking as tight as −0.03em at max size — the "cathedral" scale moment on the page.
- **Headline** (`{typography.headline}`): section headings (h2), left-aligned except the centered hero. 600 weight.
- **Title** (`{typography.title}`): card titles, service/portfolio names. 600 weight.
- **Body** (`{typography.body}`): all body copy, 400 weight, 1.65 line-height, capped at 65ch measure.
- **Label** (`{typography.label}`): form labels, nav links, small UI text. 500 weight.
- **Marginalia** (`{typography.marginalia}`): Caveat, 500 weight, always rotated −2°, always in electric blue (or `ink-inverse/70` on the dark section). Never body, never buttons, never more than 4 instances on the page.

## 4. Elevation

Flat by policy. There is no shadow vocabulary — elevation is background-color alternation only (`canvas-white` sitting on `canvas-gray`, or vice versa). This is a direct constraint from the reference architecture: shadows and borders were both explicitly rejected in favor of color contrast doing the separating.

## 5. Components

**Feel: "Quiet and confident."** Nothing shouts for attention except the two rationed highlighter moments and the electric-blue CTAs — cards and inputs stay flat and un-bordered, buttons are pills, and the restraint itself is the design statement.

- **`button-primary`**: pill (`rounded.full`), electric-blue fill, white text, regular (400) weight label — not semibold. Hover deepens to `electric-blue-deep`.
- **`button-outline`**: pill, transparent fill, `ink/80` border, hover shifts border+text to electric blue. Used for secondary actions ("Ask about this," secondary hero CTA).
- **`card`**: `rounded.2xl` (28px), no border, no shadow, background is whichever neutral contrasts with its section band. Used for Service and Portfolio grids.
- **`badge`**: fully pill, electric-blue wash, used for category tags on portfolio cards.
- **`input`**: `rounded.lg` (10px), white background, hairline border, focuses to a 2px electric-blue ring with 2px offset.
- **`Logomark`**: the two-bar + marigold-accent favicon mark, reused inline next to the wordmark in nav and footer. `currentColor` ink bars so it follows text color on light and dark surfaces.

## 6. Do's and Don'ts

### Do
- Reserve electric blue for CTAs, links, focus rings — the single decorative accent.
- Keep the highlighter to exactly two appearances: hero + About. If a third shows up, that's a bug, not a feature.
- Keep margin notes to exactly four: hero caption, Services caption, About caption, Contact caption.
- Let weight and size carry hierarchy before reaching for a second color or font.
- Center the hero; center card-grid content by deliberate choice; leave the contact form and FAQ accordion rows left-aligned (those specific patterns read correctly left-aligned, not by default).

### Don't
- Don't add a third decorative color. Ember exists for validation only — never let it drift into a "brand accent."
- Don't add shadows or borders to cards. Separation is background alternation only.
- Don't use Caveat for anything but the 4 margin notes — not body copy, not buttons, not a fifth instance.
- Don't add star ratings, seller badges, countdown urgency, or a "Trusted by X" counter — this is a portfolio, not a marketplace listing.
- Don't animate for the sake of motion. Every existing animation signals something real (content arriving, a highlighter swiping, a panel opening) — new motion should hold to that bar.
