"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { copy } from "@/lib/constants";
import { matchQuestion, starterIntents, type Intent } from "@/lib/chat-answers";
import { durationReveal, easeReveal } from "@/lib/motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionGrid } from "@/components/layout/section-grid";
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
      <p className="text-sm text-ink-soft">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {intents.map((intent) => (
          <li key={intent.id}>
            {/* A real button, not a Badge: these are the primary interaction for
                anyone who doesn't want to type. Badge styling, button semantics. */}
            <button
              type="button"
              onClick={() => onPick(intent)}
              // min-h-11 not min-h-9: the spacing scale is remapped 1–10, so
              // `9` would be 6rem. 11 falls through to the default ramp = 44px,
              // which is also the brief's minimum tap target.
              className="inline-flex min-h-11 items-center rounded-full border border-rule px-4 text-sm font-medium text-ink-soft transition-colors outline-none hover:border-pen hover:text-pen focus-visible:ring-2 focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-paper-sunken"
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      className="border-b border-rule py-6 first:pt-0 last:border-b-0"
      initial={reduceMotion ? undefined : { y: 12 }}
      animate={{ y: 0 }}
      transition={{ duration: reduceMotion ? 0 : durationReveal, ease: easeReveal }}
    >
      {/* Deliberately the FAQ's own shape: question in display type, answer in
          soft body copy. The transcript reads as the FAQ list growing. */}
      <h3 className="font-sans text-lg font-semibold text-ink">{exchange.question}</h3>

      {exchange.answer.split("\n").map((line, index) => (
        <p
          key={index}
          className={
            index === 0
              ? "mt-1.5 max-w-[65ch] text-base leading-relaxed text-ink-soft"
              : "max-w-[65ch] text-base leading-relaxed text-ink-soft"
          }
        >
          {line}
        </p>
      ))}

      <SuggestionChips
        intents={exchange.suggestions}
        onPick={onPick}
        label={copy.ask.missPrompt}
      />

      {/* px-0: size="default" applies px-5, which wins over the link variant's p-0. */}
      {exchange.offerContact && (
        <Button asChild variant="link" className="mt-3 px-0">
          <a href="#contact">{copy.ask.contactCta}</a>
        </Button>
      )}
    </motion.li>
  );
}

export function Ask() {
  const [draft, setDraft] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

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
    // Keep the caret where the next question gets typed.
    inputRef.current?.focus();
  }

  return (
    <SectionWrapper id="ask" tone="sunken">
      <SectionGrid>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          {copy.ask.heading}
        </h2>
        <p className="mt-3 max-w-[65ch] text-lg text-ink-soft">{copy.ask.lead}</p>
        <p className="mt-2 max-w-[65ch] text-sm text-ink-soft">{copy.ask.disclosure}</p>

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            ask(draft);
          }}
        >
          <Label htmlFor={inputId} className="sr-only">
            {copy.ask.inputLabel}
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id={inputId}
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.ask.placeholder}
              autoComplete="off"
              className="sm:flex-1"
            />
            <Button type="submit">{copy.ask.submitLabel}</Button>
          </div>
        </form>

        {exchanges.length === 0 && (
          <SuggestionChips
            intents={starterIntents}
            onPick={(intent) => ask(intent.label)}
            label={copy.ask.starterPrompt}
          />
        )}

        {/* role="log" so a screen reader announces each new answer as it lands,
            without stealing focus from the input. */}
        <ul className="mt-8" role="log" aria-live="polite">
          {exchanges.map((exchange) => (
            <ExchangeRow
              key={exchange.id}
              exchange={exchange}
              onPick={(intent) => ask(intent.label)}
            />
          ))}
        </ul>
      </SectionGrid>
    </SectionWrapper>
  );
}
