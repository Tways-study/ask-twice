"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { processSteps } from "@/lib/constants";
import { durationReveal, easeReveal, revealStagger } from "@/lib/motion";

// Visibility is driven by the container, never by the rules themselves: a rule
// sitting at scale 0 has zero area, so IntersectionObserver would never satisfy
// an `amount` threshold and the draw would never fire.
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: revealStagger } },
};

// The rules are aria-hidden decoration, so they may start collapsed. Step text
// may not — it only translates, matching reveal() in lib/motion.ts, so the copy
// is present at full opacity in the SSR HTML.
const ruleDraw: Variants = {
  hidden: { scaleX: 0, scaleY: 0 },
  visible: {
    scaleX: 1,
    scaleY: 1,
    transition: { duration: durationReveal, ease: easeReveal },
  },
};

const stepRise: Variants = {
  hidden: { y: 12 },
  visible: { y: 0, transition: { duration: durationReveal, ease: easeReveal } },
};

export function ProcessStrip({ heading }: { heading: string }) {
  const reduceMotion = useReducedMotion();

  const Wrapper = reduceMotion ? "div" : motion.div;
  const Rule = reduceMotion ? "span" : motion.span;
  const Step = reduceMotion ? "li" : motion.li;

  const wrapperMotion = reduceMotion
    ? {}
    : {
        variants: container,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.3 },
      };
  const ruleMotion = reduceMotion ? {} : { variants: ruleDraw };
  const stepMotion = reduceMotion ? {} : { variants: stepRise };

  return (
    <div className="mt-8">
      <h3 className="font-display text-xl font-bold text-ink">{heading}</h3>

      <Wrapper className="relative mt-6 pl-6 lg:pt-6 lg:pl-0" {...wrapperMotion}>
        {/* Horizontal at lg+, vertical below — each drawing from the edge the
            reader starts at. Only one is ever displayed. */}
        <Rule
          aria-hidden="true"
          className="absolute inset-x-0 top-0 hidden h-px origin-left bg-pen lg:block"
          {...ruleMotion}
        />
        <Rule
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-pen lg:hidden"
          {...ruleMotion}
        />

        <ol className="grid gap-6 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Step key={step.label} className="relative" {...stepMotion}>
              {/* The tick crossing the rule: horizontal on mobile, vertical at lg+. */}
              <span
                aria-hidden="true"
                className="absolute -left-6 top-[0.55em] h-px w-3 bg-pen lg:top-auto lg:left-0 lg:-mt-6 lg:h-3 lg:w-px"
              />
              <span className="font-display text-sm font-bold tabular-nums text-pen">
                {index + 1}
              </span>
              <p className="mt-1 font-sans text-base font-semibold text-ink">{step.label}</p>
              <p className="mt-1 max-w-[38ch] text-sm leading-relaxed text-ink-soft">
                {step.detail}
              </p>
            </Step>
          ))}
        </ol>
      </Wrapper>
    </div>
  );
}
