"use client";

import { motion, useReducedMotion } from "framer-motion";
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
export function Reveal({
  children,
  index = 0,
  className,
  as = "div",
  onHoverStart,
  onHoverEnd,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li";
  onHoverStart?: HoverHandler;
  onHoverEnd?: HoverHandler;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Static = as;
    // Framer's onHoverStart/End take (PointerEvent, info); native mouse events
    // don't carry that shape, and every current caller ignores the arguments
    // anyway, so the adapters below just drop them.
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
      variants={reveal(index)}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {children}
    </Comp>
  );
}
