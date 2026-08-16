"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { copy, services } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
import { MarginNote } from "@/components/layout/margin-note";
import { Reveal } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";

function PriceTag({ priceRange, hovered }: { priceRange: string; hovered: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      animate={{ x: reduceMotion ? 0 : hovered ? -2 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.14, ease: "easeOut" }}
      className="whitespace-nowrap font-display text-xl font-bold tabular-nums text-ink"
    >
      {priceRange}
    </motion.span>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  // The underline draws in from the left and lifts back out to the right —
  // the pen leaves from where it stopped, not from where it started.
  const [origin, setOrigin] = useState<"left" | "right">("left");

  return (
    <Reveal
      as="li"
      index={index}
      className="relative border-b border-rule py-6 first:pt-0 last:border-b-0"
      onHoverStart={() => {
        setOrigin("left");
        setHovered(true);
      }}
      onHoverEnd={() => {
        setOrigin("right");
        setHovered(false);
      }}
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-7">
          <h3 className="font-display text-xl font-bold text-ink">{service.name}</h3>
          <p className="mt-1.5 max-w-[65ch] text-base leading-relaxed text-ink-soft">
            {service.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:col-span-5 lg:mt-0 lg:justify-end">
          <PriceTag priceRange={service.priceRange} hovered={hovered} />
          <Button asChild variant="outline" size="default">
            <a href="#contact">Ask about this</a>
          </Button>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-pen"
        style={{ transformOrigin: origin }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
      />
    </Reveal>
  );
}

export function Services() {
  return (
    <SectionWrapper id="services" tone="sunken">
      <SectionGrid note={<MarginNote>{copy.services.marginNote}</MarginNote>}>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          What I take on
        </h2>
        <ul className="mt-8">
          {services.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </ul>
      </SectionGrid>
    </SectionWrapper>
  );
}
