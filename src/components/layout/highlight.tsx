"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { durationHighlight, easeHighlight } from "@/lib/motion";

// A slightly irregular polygon so the bar's edges aren't machine-straight —
// real highlighter ink doesn't lay down as a perfect rectangle.
const INK_EDGE = "polygon(0% 4%, 100% 0%, 100% 97%, 0% 100%)";

export function Highlight({
  children,
  delay = 0,
  className,
  active,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** When provided, the swipe is externally controlled (e.g. chained off a
   * parent animation) instead of firing on scroll-into-view. */
  active?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const externallyControlled = active !== undefined;

  const triggerProps = externallyControlled
    ? { animate: { scaleX: reduceMotion ? 1 : active ? 1 : 0 } }
    : { whileInView: { scaleX: 1 }, viewport: { once: true, amount: 0.9 } };

  return (
    <span className={cn("relative isolate inline-block whitespace-nowrap", className)}>
      <motion.span
        aria-hidden="true"
        className="absolute -inset-x-1 bottom-[0.05em] -z-10 h-[0.62em] bg-highlight"
        style={{ transformOrigin: "left", clipPath: INK_EDGE }}
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        {...triggerProps}
        transition={{
          duration: reduceMotion ? 0 : durationHighlight,
          ease: easeHighlight,
          delay: reduceMotion ? 0 : delay,
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}
