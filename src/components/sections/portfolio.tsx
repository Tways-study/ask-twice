"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLinkIcon, GraduationCapIcon } from "lucide-react";

import { copy, portfolioSamples, type PortfolioSample } from "@/lib/constants";
import { durationHover, easeHover } from "@/lib/motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { Reveal } from "@/components/layout/reveal";
import { Badge } from "@/components/ui/badge";

function DashedBorder() {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="6"
        fill="none"
        stroke="var(--rule-strong)"
        strokeDasharray="6 4"
        className="animate-[dash-flow_12s_linear_infinite]"
      />
    </svg>
  );
}

function WorkCard({ sample }: { sample: Extract<PortfolioSample, { status: "filled" }> }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={sample.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-paper-raised transition-colors hover:border-pen"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      whileTap={reduceMotion ? undefined : { y: 0, scale: 0.98 }}
      transition={{ duration: durationHover, ease: easeHover }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-sunken">
        <Image
          src={sample.thumbnail}
          alt=""
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink/30 to-transparent" aria-hidden="true" />
        <div
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-paper-inverse/70 text-ink-inverse opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
          aria-hidden="true"
        >
          <ExternalLinkIcon className="size-3.5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5 p-3">
        <p className="text-sm font-medium text-ink">{sample.label}</p>
        <p className="line-clamp-2 text-sm text-ink-soft">{sample.caption}</p>
      </div>
    </motion.a>
  );
}

export function Portfolio() {
  return (
    <SectionWrapper id="portfolio" tone="paper">
      <SectionGrid>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          {copy.portfolio.heading}
        </h2>
        <p className="mt-3 max-w-[65ch] text-lg text-ink-soft">
          {copy.portfolio.body}{" "}
          <span className="block text-base">{copy.portfolio.subBody}</span>
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {portfolioSamples.map((sample, index) => {
            if (sample.status === "placeholder") {
              return (
                <Reveal key={sample.label} index={index}>
                  <div className="group relative flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-lg bg-paper-raised text-center transition-colors">
                    <DashedBorder />
                    <GraduationCapIcon
                      className="size-6 text-ink-faint transition-colors group-hover:text-ink-soft"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink-soft">{sample.label}</p>
                      <Badge variant="highlight" className="mt-1">
                        Coming soon
                      </Badge>
                    </div>
                  </div>
                </Reveal>
              );
            }

            return (
              <Reveal key={sample.label} index={index}>
                <WorkCard sample={sample} />
              </Reveal>
            );
          })}
        </div>
      </SectionGrid>
    </SectionWrapper>
  );
}
