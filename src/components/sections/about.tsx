import { copy } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { MarginNote } from "@/components/layout/margin-note";
import { Highlight } from "@/components/layout/highlight";
import { Reveal } from "@/components/layout/reveal";

export function About() {
  return (
    <SectionWrapper id="about" tone="sunken">
      <SectionGrid note={<MarginNote>{copy.about.marginNote}</MarginNote>}>
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
            {copy.about.heading}
          </h2>
          <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-ink-soft">
            {copy.about.opener}
          </p>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink-soft">
            <Highlight>{copy.about.highlightedPhrase}</Highlight>. {copy.about.body}
          </p>
        </Reveal>
      </SectionGrid>
    </SectionWrapper>
  );
}
