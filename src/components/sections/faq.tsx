"use client";

import { useState } from "react";

import { copy, faqItems } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { Reveal } from "@/components/layout/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  return (
    <SectionWrapper id="faq" tone="paper">
      <SectionGrid>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          {copy.faq.heading}
        </h2>
        <Reveal className="mt-6">
          <Accordion type="single" collapsible value={openValue} onValueChange={setOpenValue}>
            {faqItems.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent open={openValue === item.question}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </SectionGrid>
    </SectionWrapper>
  );
}
