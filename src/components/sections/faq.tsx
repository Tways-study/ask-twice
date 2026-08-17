"use client";

import { useState } from "react";

import { copy, faqItems } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
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
      <h2 className="text-center font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
        {copy.faq.heading}
      </h2>
      <Reveal className="mx-auto mt-6 max-w-[720px]">
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
    </SectionWrapper>
  );
}
