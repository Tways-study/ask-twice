"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { XIcon } from "lucide-react";

import { copy } from "@/lib/constants";
import { matchQuestion, starterIntents, type Intent } from "@/lib/chat-answers";
import { durationHover, easeHover, easeReveal } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Exchange = {
  id: number;
  question: string;
  answer: string;
  offerContact: boolean;
  suggestions: readonly Intent[];
};

function SuggestionChips({
  intents,
  onPick,
  label,
}: {
  intents: readonly Intent[];
  onPick: (intent: Intent) => void;
  label: string;
}) {
  if (intents.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-ink-soft">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {intents.map((intent) => (
          <li key={intent.id}>
            {/* min-h-11 not min-h-9: the spacing scale is remapped 1–10, so `9`
                would be 6rem. 11 falls through to the default ramp = 44px. */}
            <button
              type="button"
              onClick={() => onPick(intent)}
              className="inline-flex min-h-11 items-center rounded-full border border-rule px-3.5 text-xs font-medium text-ink-soft transition-colors outline-none hover:border-pen hover:text-pen focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper-raised"
            >
              {intent.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExchangeRow({ exchange, onPick }: { exchange: Exchange; onPick: (intent: Intent) => void }) {
  return (
    <li className="border-b border-rule py-4 first:pt-0 last:border-b-0">
      <p className="font-sans text-sm font-semibold text-ink">{exchange.question}</p>

      {exchange.answer.split("\n").map((line, index) => (
        <p
          key={index}
          className={index === 0 ? "mt-1 text-sm leading-relaxed text-ink-soft" : "text-sm leading-relaxed text-ink-soft"}
        >
          {line}
        </p>
      ))}

      <SuggestionChips intents={exchange.suggestions} onPick={onPick} label={copy.ask.missPrompt} />

      {exchange.offerContact && (
        <a
          href="#contact"
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-pen underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper-raised"
        >
          {copy.ask.contactCta}
        </a>
      )}
    </li>
  );
}

export function AskPanel() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  const reduceMotion = useReducedMotion();
  const nextId = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const inputId = useId();

  // Escape closes and hands focus back to the launcher, matching the drawer
  // behaviour the brief specifies for the mobile nav.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Land the caret in the composer as soon as the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the newest answer in view as the transcript grows.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [exchanges]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (trimmed.length === 0) return;

    const result = matchQuestion(trimmed);
    nextId.current += 1;

    setExchanges((previous) => [
      ...previous,
      {
        id: nextId.current,
        question: trimmed,
        answer: result.answer,
        offerContact: result.offerContact,
        suggestions: result.suggestions,
      },
    ]);
    setDraft("");
    inputRef.current?.focus();
  }

  return (
    // z-30 sits above page content but below the nav (40) and the mobile
    // drawer overlay (50), so opening the menu still covers this.
    <div
      ref={wrapperRef}
      className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={copy.ask.heading}
            className="flex w-[calc(100vw-2rem)] flex-col rounded-lg border border-rule bg-paper-raised sm:w-96"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: easeReveal }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-rule p-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">{copy.ask.heading}</h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{copy.ask.disclosure}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label={copy.ask.launcherClose}
                className="-m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors outline-none hover:text-pen focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper-raised"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div ref={transcriptRef} className="max-h-[min(50vh,24rem)] overflow-y-auto p-4">
              {exchanges.length === 0 ? (
                <SuggestionChips
                  intents={starterIntents}
                  onPick={(intent) => ask(intent.label)}
                  label={copy.ask.starterPrompt}
                />
              ) : (
                <ul role="log" aria-live="polite">
                  {exchanges.map((exchange) => (
                    <ExchangeRow
                      key={exchange.id}
                      exchange={exchange}
                      onPick={(intent) => ask(intent.label)}
                    />
                  ))}
                </ul>
              )}
            </div>

            <form
              className="flex gap-2 border-t border-rule p-4"
              onSubmit={(event) => {
                event.preventDefault();
                ask(draft);
              }}
            >
              <Label htmlFor={inputId} className="sr-only">
                {copy.ask.inputLabel}
              </Label>
              <Input
                id={inputId}
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.ask.placeholder}
                autoComplete="off"
                className="flex-1"
              />
              <Button type="submit">{copy.ask.submitLabel}</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A squared tab, not a circular FAB: 6px radius and a 1px rule with no
          shadow, per the brief's card rules. */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rule bg-paper-raised px-4 font-sans text-sm font-semibold text-ink transition-colors outline-none hover:border-pen hover:text-pen focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        whileTap={reduceMotion ? undefined : { y: 1 }}
        transition={{ duration: durationHover, ease: easeHover }}
      >
        {copy.ask.launcherLabel}
      </motion.button>
    </div>
  );
}
