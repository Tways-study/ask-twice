import { FileTextIcon, PresentationIcon, GraduationCapIcon } from "lucide-react";

import { copy } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { Reveal } from "@/components/layout/reveal";
import { Badge } from "@/components/ui/badge";

const placeholders = [
  { label: "Presentation sample", icon: PresentationIcon },
  { label: "Case study sample", icon: FileTextIcon },
  { label: "Capstone excerpt", icon: GraduationCapIcon },
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
          {placeholders.map(({ label, icon: Icon }, index) => (
            <Reveal key={label} index={index}>
              <div className="relative flex h-40 flex-col items-center justify-center gap-3 rounded-lg bg-paper-raised text-center">
                <DashedBorder />
                <Icon className="size-6 text-ink-faint" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-ink-soft">{label}</p>
                  <Badge variant="highlight" className="mt-1">
                    Coming soon
                  </Badge>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionGrid>
    </SectionWrapper>
  );
}
