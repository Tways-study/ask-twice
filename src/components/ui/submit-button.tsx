"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

const LABELS: Record<SubmitStatus, string> = {
  idle: "Send my request",
  submitting: "Sending…",
  success: "Sent",
  error: "Try again",
};

const STATUS_FILL: Record<SubmitStatus, string> = {
  idle: "bg-pen hover:bg-pen-deep",
  submitting: "bg-pen",
  success: "bg-ok",
  error: "bg-error",
};

export function SubmitButton({ status }: { status: SubmitStatus }) {
  const reduceMotion = useReducedMotion();
  const busy = status === "submitting" || status === "success";

  return (
    <motion.button
      type="submit"
      disabled={busy}
      aria-live="polite"
      animate={status === "error" && !reduceMotion ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.32 }}
      className={cn(
        "inline-flex h-11 w-full min-w-[11.5rem] items-center justify-center gap-2 rounded-full border border-transparent font-sans text-base font-normal text-paper transition-colors disabled:cursor-not-allowed sm:w-auto",
        STATUS_FILL[status]
      )}
    >
      {status === "submitting" && <Loader2Icon aria-hidden="true" className="size-3.5 animate-spin" />}
      {status === "success" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
          />
        </svg>
      )}
      <span>{LABELS[status]}</span>
    </motion.button>
  );
}
