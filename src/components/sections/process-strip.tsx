"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MessageSquare, Receipt, Hammer, PackageCheck, type LucideIcon } from "lucide-react";

import { processSteps } from "@/lib/constants";
import { durationReveal, easeReveal, revealStagger } from "@/lib/motion";

const STEP_ICONS: LucideIcon[] = [MessageSquare, Receipt, Hammer, PackageCheck];

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
    <div className="mt-8 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">{heading}</h3>

      <Wrapper className="relative mt-10" {...wrapperMotion}>
        {/* The connecting rule sits behind the row of icon badges, at their
            vertical center — a single line the four steps sit on top of. */}
        <Rule
          aria-hidden="true"
          className="absolute inset-x-0 top-[1.375rem] hidden h-px origin-left bg-pen lg:block"
          {...ruleMotion}
        />

        <ol className="grid gap-8 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <Step
                key={step.label}
                className="relative flex flex-col items-center"
                {...stepMotion}
              >
                <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-pen bg-paper text-pen">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="mt-3 font-display text-xs font-bold tabular-nums text-pen">
                  Step {index + 1}
                </span>
                <p className="mt-1 font-sans text-base font-semibold text-ink">{step.label}</p>
                <p className="mt-1 max-w-[32ch] text-sm leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
              </Step>
            );
          })}
        </ol>
      </Wrapper>
    </div>
  );
}
