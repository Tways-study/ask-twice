"use client";

import {
  Presentation,
  FileSearch,
  GraduationCap,
  Code2,
  NotebookPen,
  Microscope,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { copy, services } from "@/lib/constants";
import { type ServiceType } from "@/lib/schemas";
import { cardHoverLift, revealCard } from "@/lib/motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/layout/reveal";
import { MarginNote } from "@/components/layout/margin-note";
import { Button } from "@/components/ui/button";

// One glyph per service — a quiet visual anchor for each card, not decoration.
const SERVICE_ICONS: Record<ServiceType, LucideIcon> = {
  presentation: Presentation,
  case_study: FileSearch,
  capstone: GraduationCap,
  development: Code2,
  homework: NotebookPen,
  research_paper: Microscope,
  other: Sparkles,
};

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = SERVICE_ICONS[service.id];

  return (
    <Reveal
      index={index}
      variants={revealCard(index)}
      whileHover={cardHoverLift}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-paper-raised p-6 text-center sm:p-8"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-pen-wash text-pen transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-ink">{service.name}</h3>
      <p className="mt-2 max-w-[38ch] text-base leading-relaxed text-ink-soft">
        {service.description}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="whitespace-nowrap font-display text-lg font-semibold tabular-nums text-ink">
          {service.priceRange}
        </span>
        <Button asChild variant="outline" size="default">
          <a
            href="#contact"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("asktwice:select-service", { detail: service.id })
                );
              }
            }}
          >
            Ask about this
          </a>
        </Button>
      </div>

      {/* The pen underlines it: a thin rule draws in on hover, the same
          motif the row-based layout used before the card-grid redesign. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-pen transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
    </Reveal>
  );
}

export function Services() {
  return (
    <SectionWrapper id="services" tone="sunken">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
          What I take on
        </h2>
        <MarginNote className="mx-auto mt-2 w-fit">{copy.services.marginNote}</MarginNote>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
