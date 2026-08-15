"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MarginNote({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const noteClass = cn("-rotate-2 font-hand text-sm text-pen lg:pr-4", className);

  if (reduceMotion) {
    return (
      <p aria-hidden="true" className={noteClass}>
        {children}
      </p>
    );
  }

  return (
    <p aria-hidden="true" className={noteClass}>
      <motion.span
        className="mr-1.5 inline-block h-px w-3 -translate-y-1 bg-pen align-middle"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      />
      {/* Content stays fully painted — only position animates, so a missed
          or delayed viewport trigger never leaves real text invisible. */}
      <motion.span
        className="inline-block"
        initial={{ opacity: 1, y: 4 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.3, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.span>
    </p>
  );
}
