"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { copy } from "@/lib/constants";
import { durationReveal, easeReveal } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { MarginNote } from "@/components/layout/margin-note";
import { Highlight } from "@/components/layout/highlight";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [headlineSettled, setHeadlineSettled] = useState(!!reduceMotion);

  const entrance = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : durationReveal, ease: easeReveal },
  };

  return (
    <SectionWrapper tone="paper" className="pt-28 pb-8 lg:pt-40 lg:pb-9">
      <SectionGrid note={<MarginNote>{copy.hero.marginNote}</MarginNote>}>
        <h1 className="text-balance font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
          {/* Masked reveal: the wrapper clips, so the line appears to emerge
              from beneath a hard edge rather than fading in from nowhere. The
              highlighter fires off this animation's completion, not a
              hardcoded delay, so it stays in sync if the copy changes length. */}
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: reduceMotion ? 0 : "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => setHeadlineSettled(true)}
            >
              {copy.hero.headline} <Highlight active={headlineSettled}>{copy.hero.highlightedWord}</Highlight>
            </motion.span>
          </span>
        </h1>

        <motion.p
          {...entrance}
          transition={{ ...entrance.transition, delay: reduceMotion ? 0 : 0.08 }}
          className="mt-6 max-w-[65ch] text-lg leading-relaxed text-ink-soft"
        >
          {copy.hero.lead}
        </motion.p>

        <motion.div
          {...entrance}
          transition={{ ...entrance.transition, delay: reduceMotion ? 0 : 0.16 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="default">
            <a href="#contact">{copy.hero.primaryCta}</a>
          </Button>
          <Button asChild variant="outline" size="default">
            <a href="#services">{copy.hero.secondaryCta}</a>
          </Button>
        </motion.div>
      </SectionGrid>
    </SectionWrapper>
  );
}
