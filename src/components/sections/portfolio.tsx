"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";

import { copy, portfolioSamples, serviceTypeLabels, type PortfolioSample } from "@/lib/constants";
import { type ServiceType } from "@/lib/schemas";
import { cardHoverLift, revealCard } from "@/lib/motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/layout/reveal";
import { ProcessStrip } from "@/components/sections/process-strip";
import { Badge } from "@/components/ui/badge";

const CATEGORY_FILTERS: { id: "all" | ServiceType; label: string }[] = [
  { id: "all", label: "All samples" },
  { id: "presentation", label: "Presentations" },
  { id: "case_study", label: "Case studies" },
  { id: "capstone", label: "Capstone" },
  { id: "development", label: "Websites & apps" },
];

function DashedBorder() {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx="28"
        fill="none"
        stroke="var(--rule-strong)"
        strokeDasharray="6 4"
        className="animate-[dash-flow_12s_linear_infinite]"
      />
    </svg>
  );
}

function WorkCard({ sample, index }: { sample: Extract<PortfolioSample, { status: "filled" }>; index: number }) {
  const isPdf = sample.hrefKind === "pdf";
  const LinkIcon = isPdf ? FileTextIcon : ArrowUpRightIcon;

  return (
    <Reveal
      index={index}
      variants={revealCard(index)}
      whileHover={cardHoverLift}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-paper-raised text-center"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-sunken">
        <Image
          src={sample.thumbnail}
          alt={sample.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{sample.title}</h3>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <Badge>{serviceTypeLabels[sample.serviceType]}</Badge>
          <span className="text-sm text-ink-soft">{sample.subjectArea}</span>
        </div>

        {sample.summary && (
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{sample.summary}</p>
        )}

        {(sample.deliverable || sample.tools) && (
          <p className="mt-2 text-sm text-ink-soft">
            {[sample.deliverable, sample.tools?.join(", ")].filter(Boolean).join(" · ")}
          </p>
        )}

        <a
          href={sample.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-sans text-base font-medium text-pen outline-none hover:underline focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {sample.ctaLabel ?? (isPdf ? "Read the PDF" : "Open the live site")}
          <LinkIcon className="size-4" aria-hidden="true" />
        </a>
      </div>

      {/* The pen underlines it: same hover motif as ServiceCard, so the two
          card grids feel like one system. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-pen transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
    </Reveal>
  );
}

function PlaceholderCard({ sample, index }: { sample: Extract<PortfolioSample, { status: "placeholder" }>; index: number }) {
  return (
    // No hover lift here, unlike WorkCard — this card has no link, and a
    // hover affordance on something unclickable is a false promise.
    <Reveal
      index={index}
      variants={revealCard(index)}
      className="flex flex-col overflow-hidden rounded-2xl bg-paper-raised text-center"
    >
      <div className="relative flex aspect-[16/10] w-full items-end justify-center p-4">
        <DashedBorder />
        <Badge variant="highlight">{serviceTypeLabels[sample.serviceType]}</Badge>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink-soft">{sample.label}</h3>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          {copy.portfolio.placeholderBody}
        </p>
      </div>
    </Reveal>
  );
}

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<"all" | ServiceType>("all");

  const filteredSamples =
    activeFilter === "all"
      ? portfolioSamples
      : portfolioSamples.filter((sample) => sample.serviceType === activeFilter);

  return (
    <SectionWrapper id="portfolio" tone="paper">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
          {copy.portfolio.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[65ch] text-lg text-ink-soft">
          {copy.portfolio.body}{" "}
          <span className="block text-base">{copy.portfolio.subBody}</span>
        </p>

        {/* Category filter pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORY_FILTERS.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  isSelected
                    ? "border-pen bg-pen font-semibold text-paper"
                    : "border-rule bg-paper-raised text-ink-soft hover:border-pen hover:text-pen"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSamples.map((sample, index) =>
          sample.status === "placeholder" ? (
            <PlaceholderCard key={sample.label} sample={sample} index={index} />
          ) : (
            <WorkCard key={sample.slug} sample={sample} index={index} />
          )
        )}
      </div>

      <ProcessStrip heading={copy.portfolio.processHeading} />
    </SectionWrapper>
  );
}
