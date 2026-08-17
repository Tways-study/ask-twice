"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";

import { copy, portfolioSamples, serviceTypeLabels, type PortfolioSample } from "@/lib/constants";
import { type ServiceType } from "@/lib/schemas";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
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
        rx="6"
        fill="none"
        stroke="var(--rule-strong)"
        strokeDasharray="6 4"
        className="animate-[dash-flow_12s_linear_infinite]"
      />
    </svg>
  );
}

function WorkRow({ sample }: { sample: Extract<PortfolioSample, { status: "filled" }> }) {
  const isPdf = sample.hrefKind === "pdf";
  const LinkIcon = isPdf ? FileTextIcon : ArrowUpRightIcon;

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
        {/* Capped below lg: at ~768px an uncapped column renders a 689px-wide
            image, which dwarfs the copy beside it. */}
        <div className="relative aspect-[16/10] w-full max-w-[420px] overflow-hidden rounded-lg border border-rule bg-paper-sunken transition-colors group-hover:border-pen lg:col-span-5 lg:max-w-none">
          <Image
            src={sample.thumbnail}
            alt={sample.alt}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 420px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div className="mt-4 lg:col-span-7 lg:mt-0">
          <h3 className="font-display text-xl font-bold text-ink">{sample.title}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge>{serviceTypeLabels[sample.serviceType]}</Badge>
            <span className="text-sm text-ink-soft">{sample.subjectArea}</span>
          </div>

          {sample.summary && (
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-ink-soft">
              {sample.summary}
            </p>
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
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-sans text-base font-semibold text-pen underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            {sample.ctaLabel ?? (isPdf ? "Read the PDF" : "Open the live site")}
            <LinkIcon className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right bg-pen [transform:scaleX(0)] transition-transform duration-[260ms] ease-out group-hover:origin-left group-hover:[transform:scaleX(1)] group-focus-within:origin-left group-focus-within:[transform:scaleX(1)]"
      />
    </>
  );
}

function PlaceholderRow({ sample }: { sample: Extract<PortfolioSample, { status: "placeholder" }> }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
      <div className="relative flex aspect-[16/10] w-full items-end rounded-lg bg-paper-raised p-4 lg:col-span-5">
        <DashedBorder />
        <Badge variant="highlight">{serviceTypeLabels[sample.serviceType]}</Badge>
      </div>
      <div className="mt-4 lg:col-span-7 lg:mt-0">
        <h3 className="font-display text-xl font-bold text-ink-soft">{sample.label}</h3>
        <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink-soft">
          {copy.portfolio.placeholderBody}
        </p>
      </div>
    </div>
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
      <SectionGrid>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          {copy.portfolio.heading}
        </h2>
        <p className="mt-3 max-w-[65ch] text-lg text-ink-soft">
          {copy.portfolio.body}{" "}
          <span className="block text-base">{copy.portfolio.subBody}</span>
        </p>

        {/* Category filter pills */}
        <div className="mt-6 flex flex-wrap gap-2">
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

        <ul className="mt-8">
          {filteredSamples.map((sample, index) => (
            <Reveal
              as="li"
              key={sample.status === "filled" ? sample.slug : sample.label}
              index={index}
              className="group relative border-b border-rule py-6 first:pt-0 last:border-b-0"
            >
              {sample.status === "placeholder" ? (
                <PlaceholderRow sample={sample} />
              ) : (
                <WorkRow sample={sample} />
              )}
            </Reveal>
          ))}
        </ul>

        <ProcessStrip heading={copy.portfolio.processHeading} />
      </SectionGrid>
    </SectionWrapper>
  );
}

