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
    <motion.p
      aria-hidden="true"
      className={noteClass}
      initial={{ opacity: 1, y: 4 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.p>
  );
}
