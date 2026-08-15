"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Container } from "@/components/layout/container";

// The spine grows with scroll. useScroll gives 0→1 progress across the whole
// page; scaleY on a transform-origin:top element is GPU-composited, so this
// stays smooth even on mid-range phones. The spring (not a linear map) adds
// ~150ms of lag and slight overshoot, so it reads as ink catching up with the
// reader rather than a scroll-position indicator.
export function MarginSpine() {
  const { scrollYProgress } = useScroll();
  const spineScale = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <Container className="relative h-full">
        <div className="absolute inset-y-0 left-0 grid w-full grid-cols-12 gap-x-6">
          <div className="relative col-span-2 col-start-1">
            <motion.div
              style={reduceMotion ? undefined : { scaleY: spineScale, transformOrigin: "top" }}
              className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-pen opacity-40"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
