import { copy } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/layout/reveal";
import { MarginNote } from "@/components/layout/margin-note";
import { Highlight } from "@/components/layout/highlight";

export function About() {
  return (
    <SectionWrapper id="about" tone="sunken">
      <div className="mx-auto max-w-[720px] text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
            {copy.about.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[65ch] text-lg leading-relaxed text-ink-soft">
            {copy.about.opener}
          </p>
          <p className="mx-auto mt-4 max-w-[65ch] text-base leading-relaxed text-ink-soft">
            <Highlight>{copy.about.highlightedPhrase}</Highlight>. {copy.about.body}
          </p>
          <MarginNote className="mx-auto mt-6 w-fit">{copy.about.marginNote}</MarginNote>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
