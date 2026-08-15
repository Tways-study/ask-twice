"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { durationAccordion } from "@/lib/motion";
import { PlusIcon } from "lucide-react";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-rule", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex min-h-11 flex-1 items-center justify-between gap-4 py-4 text-left font-sans text-lg font-semibold text-ink outline-none transition-colors group-aria-expanded/accordion-trigger:text-pen focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          className
        )}
        {...props}
      >
        {children}
        <PlusIcon className="size-5 shrink-0 text-pen transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  open,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { open: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AccordionPrimitive.Content
      forceMount
      inert={!open}
      aria-hidden={!open}
      data-slot="accordion-content"
      className="overflow-hidden text-base"
      {...props}
    >
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: reduceMotion ? 0 : durationAccordion, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.2,
            delay: reduceMotion || !open ? 0 : 0.06,
            ease: "easeOut",
          }}
          className={cn("pt-0 pb-4 leading-relaxed text-ink-soft", className)}
        >
          {children}
        </motion.div>
      </motion.div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
