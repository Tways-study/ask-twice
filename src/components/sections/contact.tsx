import { copy } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { MarginNote } from "@/components/layout/margin-note";
import { ContactForm } from "@/components/sections/contact-form";

export function Contact() {
  return (
    <SectionWrapper id="contact" tone="inverse">
      <SectionGrid note={<MarginNote className="text-ink-inverse/70">{copy.contact.marginNote}</MarginNote>}>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink-inverse">
          {copy.contact.heading}
        </h2>
        <p className="mt-3 max-w-[65ch] text-lg text-ink-inverse/80">
          {copy.contact.lead}
        </p>
        <ContactForm />
      </SectionGrid>
    </SectionWrapper>
  );
}
