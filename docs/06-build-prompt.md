> **Project:** AskTwice · **Doc:** Build Prompt — Motion & Polish Pass · **Version:** 0.1 · **Date:** 2026-08-15
> **Upstream:** Design Brief v0.2 ("Marginalia")
> **Purpose:** Paste into Claude Code. This is a *refinement* pass, not a redesign.

---

# Build prompt — AskTwice motion & polish pass

## Hard constraint before anything else

**Do not change the design direction.** The Marginalia direction in `docs/05-design-brief.md` is locked: warm paper, graphite ink, pen-blue margin notes, one rationed highlighter. Bricolage Grotesque / Plus Jakarta Sans / Caveat are locked. The palette tokens are locked. The 7/5 asymmetric service split and the real left margin column are locked.

Everything below is **additive refinement**. If a proposal here conflicts with the design brief, the design brief wins. If you find yourself introducing a new color, a fourth typeface, a card grid, or a texture, stop — you have drifted.

---

## 1. The one new structural idea: the margin spine

The layout already reserves a real left margin column (cols 1–2 at `lg`+) where the Caveat notes live. Right now that column is mostly empty. Make it load-bearing.

**Draw a 1px vertical pen-blue line down the center of the margin column**, running the full height of the content area. As the visitor scrolls, the line *grows downward* — its height tracks scroll progress through the page. The Caveat margin notes attach to it as annotations: a short 12px horizontal tick connects each note to the spine.

This is the connective tissue of the whole page. It turns "sections stacked vertically" into "one continuous annotated document," which is exactly what the direction promised and what the v0.2 build only implied.

```tsx
// The spine grows with scroll. useScroll gives 0→1 progress across the whole page;
// scaleY on a transform-origin:top element is GPU-composited, so this stays at 60fps
// even on the mid-range Android phones this audience is holding.
const { scrollYProgress } = useScroll()
const spineScale = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 })

<motion.div
  aria-hidden
  style={{ scaleY: spineScale, transformOrigin: 'top' }}
  className="absolute left-1/2 top-0 h-full w-px bg-[--pen] opacity-40"
/>
```

**Rules that keep it quiet:**
- `opacity: 0.4` — it is a pencil line, not a progress bar. It must never read as a UI chrome element.
- Hidden entirely below `lg`. On mobile there is no margin column, so there is no spine. Do not invent a mobile version.
- `aria-hidden="true"`. It carries no information a screen reader needs.
- Reduced motion: render the spine at full height, static. No growth.

**Why a spring and not a linear map:** a linear `scrollYProgress → scaleY` binding makes the line stick exactly to the scrollbar, which reads as a scroll indicator — a UI widget. The spring introduces ~150ms of lag and slight overshoot, so it reads as *ink catching up with the reader*. That distinction is the entire effect.

---

## 2. Handwritten reveal for the margin notes

Right now the Caveat notes fade in with everything else. They should look **written**, not faded.

Use a `clip-path` inset animating from `inset(0 100% 0 0)` to `inset(0 0% 0 0)` — a left-to-right reveal at handwriting pace (~55ms per character, capped at 900ms total). Pair it with a 4px `translateY` settle so the note lands rather than slides.

```tsx
// clip-path reveal reads as "being written" in a way opacity never does.
// Duration scales with text length so short and long notes feel like the same hand.
const duration = Math.min(note.length * 0.055, 0.9)

<motion.span
  initial={{ clipPath: 'inset(0 100% 0 0)', y: 4 }}
  whileInView={{ clipPath: 'inset(0 0% 0 0)', y: 0 }}
  viewport={{ once: true, margin: '-15%' }}
  transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
/>
```

The connecting tick to the spine draws first (120ms, `scaleX` from left), then the note reveals. Sequence, not simultaneity — the pen touches the line before it writes the words.

---

## 3. Hero: masked line reveal, then the highlighter

The headline currently animates as one unit. Split it per line inside `overflow: hidden` masks so each line rises from behind a hard edge, staggered 80ms.

```tsx
// Each line gets its own overflow-hidden wrapper. The inner span translates up from
// 100% — because the wrapper clips, the line appears to emerge from beneath the one
// above it rather than fading in from nowhere.
{lines.map((line, i) => (
  <span key={i} className="block overflow-hidden">
    <motion.span
      className="block"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.62, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {line}
    </motion.span>
  </span>
))}
```

The highlighter swipe fires **after the last line settles** — chain it off the animation completion, do not hardcode a 500ms delay. A hardcoded delay desyncs the moment the copy changes length, and the copy will change.

**Keep the existing implementation note:** `transform: scaleX()` from `transform-origin: left`, never a width animation.

**One addition to the swipe:** give the marigold bar a `clip-path` with a slightly irregular polygon (±1.5px vertical variance across 4 points) so the top and bottom edges are not machine-straight. Real highlighter ink is not a rectangle. This is a 3-line change that is the difference between "CSS effect" and "someone drew this."

---

## 4. Service rows: the pen underline

Service rows currently have a hover state. Make it a pen stroke.

On hover, a 1px `--pen` line draws left-to-right along the bottom edge of the row over 260ms, `transform-origin: left`, `scaleX` 0→1. On mouse-out it retracts to the *right* (`transform-origin: right`) — the pen lifts from where it stopped, not from where it started. That asymmetry is 4 extra lines and it is the detail people notice without being able to name.

The price figure shifts `-2px` on the x-axis simultaneously (140ms, `ease-out`). Nothing else moves. No scale, no shadow, no background change.

Touch devices get no hover state — do not fake one with `:active`. On mobile the rows are already tappable and the entire row is the target.

---

## 5. Contact form: progressive disclosure

The form is the conversion point and it currently shows every field at once, which reads as long. Restructure it:

1. **Service type** (shadcn `Select`) is the only field visible initially, plus name and email.
2. On selection, the contextual fields expand in with `AnimatePresence` — height auto-animated, 280ms, staggered 50ms per field.
3. The fields that appear are conditioned on service type: capstone gets a "what stage are you at" field, presentations gets "how many slides," homework gets neither.

```tsx
// AnimatePresence + height:auto needs the child measured, so wrap in a div with
// overflow hidden. The stagger makes 5 fields appearing feel deliberate rather
// than like a layout shift.
<AnimatePresence mode="wait">
  {serviceType && (
    <motion.div
      key={serviceType}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      {/* contextual fields, each with delay: i * 0.05 */}
    </motion.div>
  )}
</AnimatePresence>
```

**Why this matters more than it looks:** a student on a phone seeing eleven fields closes the tab. Seeing three, then watching four more appear *because of a choice they made*, reads as the form responding to them. Same fields, half the perceived cost.

**Validation timing:** validate `onBlur`, not `onChange`. Errors appearing while someone is mid-word is hostile. Once a field has errored, switch that field to `onChange` so the error clears as they fix it.

---

## 6. Submit button: a real state machine

Four states, one element, no layout shift between them. Reserve the width of the widest label so the button never resizes.

| State | Label | Visual |
|---|---|---|
| `idle` | Send my request | `--pen` fill |
| `submitting` | Sending… | Label crossfades, 14px spinner fades in left of it |
| `success` | Sent | Checkmark **draws** via SVG `stroke-dashoffset` over 400ms, then the button settles to `--ok` fill |
| `error` | Try again | `--error` fill, 3-cycle 4px horizontal shake, 320ms total |

```tsx
// The checkmark draws rather than pops. pathLength normalizes the path to 0–1
// regardless of actual geometry, so the animation is identical whatever the icon size.
<motion.path
  d="M4 12l5 5L20 6"
  fill="none" stroke="currentColor" strokeWidth={2.5}
  strokeLinecap="round" strokeLinejoin="round"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
/>
```

After success, the whole form crossfades to the confirmation message over 320ms. Do not leave a dead form sitting under a toast.

---

## 7. Sticky nav condense

On scroll past the hero, the nav condenses: height `72px → 56px`, the wordmark drops from `--text-xl` to `--text-lg`, a `--rule` bottom border fades in, and the background goes from transparent to `--paper` at 92% opacity with `backdrop-filter: blur(8px)`.

Use Framer Motion `useScroll` + `useTransform` on a single motion element rather than toggling a class — toggling produces a hard snap at the threshold, and the whole point is that it should feel like the page settling.

The mobile drawer (shadcn `Sheet`) slides from the right, backdrop fades to `--ink` at 40%, and nav links stagger in at 40ms. Closes on link tap, on backdrop tap, and on Escape.

---

## 8. FAQ accordion

shadcn `Accordion` with the default height animation replaced by Framer's `height: auto`. The trigger indicator is **not** a chevron — it is a `+` that rotates 45° into a `×` over 240ms. Two 1px `--ink-soft` lines, one rotating. This costs nothing and is more on-brand than a chevron, which is the shape every accordion on the internet uses.

Open state: the question shifts to `--pen`, the answer reveals with a 60ms delay after the height animation starts so the text does not appear to be squeezed out of a closing gap.

---

## 9. Portfolio placeholder

The placeholder state is a designed state, not a gap. Give it:
- A 1px **dashed** `--rule-strong` border with `stroke-dasharray` slowly offsetting (12s linear infinite) — a "work in progress" signal that never demands attention.
- The copy from the brief, unchanged.
- A `--highlight-soft` badge with the service type it will hold.

Kill the dash animation entirely under `prefers-reduced-motion`.

---

## 10. shadcn components to use

Install and customize these against the design tokens. **Customize, do not accept defaults** — shadcn ships with `--radius: 0.5rem`, a neutral palette, and Inter-adjacent metrics, all three of which violate this brief.

| Component | Where | Required customization |
|---|---|---|
| `button` | CTAs, submit | `--pen` fill, 6px radius, Plus Jakarta 600, sentence case |
| `sheet` | Mobile nav | `--paper` bg, right side, no default shadow |
| `accordion` | FAQ | Replace chevron with the `+`→`×`; Framer height |
| `form` | Contact | RHF resolver wired to the shared Zod schema |
| `input` `textarea` | Contact | `--paper-raised` bg, `--rule` border, `--pen` focus ring at 2px/2px offset |
| `select` | Service type, budget | Match input styling exactly; no default chevron blue |
| `popover` + `calendar` | Deadline picker | `--paper-raised` surface; disable past dates |
| `sonner` | Toasts | `--paper-raised`, `--ink` text, 6px radius, bottom-right desktop / top mobile |
| `badge` | Service tags, placeholder labels | `--highlight-soft` bg with `--ink` text, or `--pen-wash` with `--pen` |
| `separator` | Section breaks | `--rule`, 1px |
| `skeleton` | Not needed | Everything is SSG; do not install |

**Do not install:** `card` (the brief specifies border-no-shadow, which is 3 lines of CSS), `dialog`, `dropdown-menu`, `tabs`, `avatar`. Unused shadcn components are dead code that later gets used because it is there.

---

## 11. Non-negotiables for this pass

- **`prefers-reduced-motion` is a correctness requirement.** Every animation above needs a static end-state fallback. Wire a `useReducedMotion()` hook once and gate every variant through it rather than remembering per-component.
- **Nothing animates on the critical render path.** Hero content must be in the SSG HTML and visible without JS. Animations enhance an already-correct page.
- **No animation exceeds 620ms** except the spine (continuous) and the placeholder dash (ambient). If something needs longer, it is doing too much.
- **Every animated property must be `transform` or `opacity`** — the only two properties the compositor handles without layout or paint. The single exception is `height: auto` in the accordion and form disclosure, which Framer handles correctly.
- **Test at 320px.** The margin column, the spine, and the note ticks all disappear below `lg`. Verify the layout does not just survive that but is *designed* for it.
- **Lighthouse ≥ 95 on performance and 100 on accessibility.** If an animation costs you the score, the animation loses.

---

## 12. Order of work

1. Wire the design tokens into `globals.css` and the Tailwind config. Nothing else until the palette and type scale are correct.
2. Install and restyle the shadcn components from §10 against those tokens.
3. Build all sections **static, no motion**. Verify layout at 320px, 768px, 1280px.
4. Add the margin column, spine, and note ticks.
5. Layer motion in, section by section, in this order: hero → nav → services → FAQ → form.
6. Reduced-motion pass. Keyboard pass. 320px pass.
7. Lighthouse.

Do not write animation code before step 5. Motion added to a layout that is still moving is motion you will write twice.