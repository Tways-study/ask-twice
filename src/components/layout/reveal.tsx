"use client";

import { motion, useReducedMotion, type TargetAndTransition, type Variants } from "framer-motion";
import { reveal } from "@/lib/motion";

type HoverHandler = (event: PointerEvent, info: { point: { x: number; y: number } }) => void;

// `as="li"` lets the revealed element be the real list item rather than a
// wrapper around it. That matters for any caller using `first:`/`last:`
// variants — nested one level down, every child is both first and last.
//
// `onHoverStart`/`onHoverEnd` forward to the underlying motion element so a
// caller's row-level hover state (e.g. ServiceRow's pen underline) can live
// on this same element instead of adding another wrapper. Under reduced
// motion the fallback is a plain element, so the handlers are wired to
// native mouse events instead — same hover state, no animation dependency.
//
// `variants` lets a caller swap the entrance choreography (e.g. cards settle
// in with a touch of scale, per docs/05-design-brief.md) without every other
// Reveal user inheriting it. `whileHover` is a gesture target layered on top
// of the same motion value — framer composes it with the entrance variant
// rather than fighting it, so a caller can add e.g. a card-lift without a
// second wrapper. Both default to the original plain fade+rise with no hover.
export function Reveal({
  children,
  index = 0,
  className,
  as = "div",
  variants,
  whileHover,
  onHoverStart,
  onHoverEnd,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li";
  variants?: Variants;
  whileHover?: TargetAndTransition;
  onHoverStart?: HoverHandler;
  onHoverEnd?: HoverHandler;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Static = as;
    // Framer's onHoverStart/End take (PointerEvent, info); native mouse events
    // don't carry that shape, and every current caller ignores the arguments
    // anyway, so the adapters below just drop them. `whileHover` is dropped
    // outright — a scale/lift gesture is exactly the kind of motion reduced-
    // motion users are asking to skip.
    return (
      <Static
        className={className}
        onMouseEnter={
          onHoverStart && ((event: React.MouseEvent) => onHoverStart(event.nativeEvent as unknown as PointerEvent, { point: { x: event.clientX, y: event.clientY } }))
        }
        onMouseLeave={
          onHoverEnd && ((event: React.MouseEvent) => onHoverEnd(event.nativeEvent as unknown as PointerEvent, { point: { x: event.clientX, y: event.clientY } }))
        }
      >
        {children}
      </Static>
    );
  }

  const Comp = as === "li" ? motion.li : motion.div;

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants ?? reveal(index)}
      whileHover={whileHover}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {children}
    </Comp>
  );
}
