import { copy } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ContactForm } from "@/components/sections/contact-form";
import { MarginNote } from "@/components/layout/margin-note";

export function Contact() {
  return (
    <SectionWrapper id="contact" tone="inverse">
      <div className="mx-auto max-w-[720px]">
        {/* Heading/lead/note center; the form below stays left-aligned —
            centering form labels above left-aligned inputs reads as broken,
            not intentional. */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink-inverse">
            {copy.contact.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-[65ch] text-lg text-ink-inverse/80">
            {copy.contact.lead}
          </p>
          <MarginNote className="mx-auto mt-2 w-fit text-ink-inverse/70">
            {copy.contact.marginNote}
          </MarginNote>
        </div>
        <ContactForm />
      </div>
    </SectionWrapper>
  );
}
