"use client";

import { motion, useReducedMotion } from "framer-motion";
import { reveal } from "@/lib/motion";

export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reveal(index)}
    >
      {children}
    </motion.div>
  );
}
