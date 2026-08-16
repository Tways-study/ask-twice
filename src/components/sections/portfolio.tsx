import { FileTextIcon, PresentationIcon, GraduationCapIcon, ExternalLinkIcon, type LucideIcon } from "lucide-react";

import { copy, portfolioSamples } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { Reveal } from "@/components/layout/reveal";
import { Badge } from "@/components/ui/badge";

const icons: Record<string, LucideIcon> = {
  "Presentation sample": PresentationIcon,
  "Case study sample": FileTextIcon,
  "Capstone excerpt": GraduationCapIcon,
};

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
            const Icon = icons[sample.label];

            if (sample.status === "placeholder") {
              return (
                <Reveal key={sample.label} index={index}>
                  <div className="relative flex h-40 flex-col items-center justify-center gap-3 rounded-lg bg-paper-raised text-center">
                    <DashedBorder />
                    <Icon className="size-6 text-ink-faint" aria-hidden="true" />
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
                <a
                  href={sample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-40 flex-col justify-between rounded-lg border border-rule bg-paper-raised p-4 transition-colors hover:border-pen"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="size-6 text-pen" aria-hidden="true" />
                    <ExternalLinkIcon
                      className="size-4 text-ink-faint transition-colors group-hover:text-pen"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{sample.label}</p>
                    <p className="mt-1 text-sm text-ink-soft">{sample.caption}</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </SectionGrid>
    </SectionWrapper>
  );
}
