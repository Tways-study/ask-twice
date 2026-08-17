import type { TargetAndTransition } from "framer-motion";

// Timings and easings from docs/05-design-brief.md §5, as Framer Motion values (seconds).
export const easeHover = [0.4, 0, 0.2, 1] as const; // ease-out
export const easeReveal = [0.16, 1, 0.3, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;
export const easeHighlight = [0.65, 0, 0.35, 1] as const;
export const easeCardLift = [0.25, 1, 0.5, 1] as const; // ease-out-quart, card hover feedback

export const durationHover = 0.14;
export const durationReveal = 0.42;
export const durationAccordion = 0.24;
export const durationNav = 0.2;
export const durationDrawer = 0.3;
export const durationFormSuccess = 0.32;
export const durationHighlight = 0.38;
export const durationCardLift = 0.2;
export const durationCardAccent = 0.3;

export const revealStagger = 0.07;

// Content is always fully opaque — only position animates. Gating opacity on
// IntersectionObserver would ship invisible content to SSR/no-JS/crawlers,
// since Framer Motion bakes `initial` into the server-rendered inline style.
export function reveal(index = 0) {
  return {
    hidden: { opacity: 1, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durationReveal,
        ease: easeReveal,
        delay: index * revealStagger,
      },
    },
  };
}

// Cards settle into place rather than just sliding up — the same fade+rise
// as reveal(), plus a barely-perceptible scale (0.96 → 1). Kept to Services
// and Portfolio cards specifically, not applied to every Reveal user, so it
// reads as this grid's own choreography rather than a site-wide reflex.
export function revealCard(index = 0) {
  return {
    hidden: { opacity: 1, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: durationReveal,
        ease: easeReveal,
        delay: index * revealStagger,
      },
    },
  };
}

// The hover lift shared by Services and Portfolio cards: a barely-there
// scale, not a shadow (this system is borderless/shadowless by design —
// docs/05-design-brief.md §4). Kept subtle enough to read as the card
// responding, not performing.
export const cardHoverLift: TargetAndTransition = {
  scale: 1.012,
  transition: { duration: durationCardLift, ease: easeCardLift },
};
