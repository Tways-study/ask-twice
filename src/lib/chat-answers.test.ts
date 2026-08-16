import { describe, expect, it } from "vitest";

import { intents, matchQuestion, normalize, starterIntents } from "@/lib/chat-answers";
import { copy, faqItems, services } from "@/lib/constants";

function faqAnswer(question: string) {
  return faqItems.find((entry) => entry.question === question)?.answer;
}

describe("normalize", () => {
  it("lowercases, strips punctuation, and collapses whitespace", () => {
    expect(normalize("  HOW   MUCH???  ")).toBe("how much");
  });

  it("keeps letters and numbers", () => {
    expect(normalize("APA 7th edition!")).toBe("apa 7th edition");
  });
});

describe("intent table integrity", () => {
  it("has no empty answers", () => {
    // Guards the constants.ts lookups: a renamed FAQ question would silently
    // produce an empty string without this.
    for (const intent of intents) {
      expect(intent.answer.length, `intent "${intent.id}" resolved to an empty answer`).toBeGreaterThan(0);
    }
  });

  it("has unique ids", () => {
    const ids = intents.map((intent) => intent.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every starter chip to an intent", () => {
    expect(starterIntents.length).toBeGreaterThan(0);
    for (const intent of starterIntents) {
      expect(matchQuestion(intent.label).intentId).not.toBeNull();
    }
  });

  it("resolves every intent label back to an intent", () => {
    for (const intent of intents) {
      expect(matchQuestion(intent.label).intentId, `label "${intent.label}" fell through`).not.toBeNull();
    }
  });
});

describe("matchQuestion — known questions", () => {
  it("answers turnaround with the FAQ's exact wording", () => {
    const result = matchQuestion("how fast can you turn something around?");
    expect(result.intentId).toBe("turnaround");
    expect(result.answer).toBe(faqAnswer("How fast can you turn something around?"));
  });

  it("answers revisions with the FAQ's exact wording", () => {
    const result = matchQuestion("what if I need changes?");
    expect(result.intentId).toBe("revisions");
    expect(result.answer).toBe(faqAnswer("What if I need changes?"));
  });

  it("answers confidentiality with the FAQ's exact wording", () => {
    const result = matchQuestion("will anyone know?");
    expect(result.intentId).toBe("confidentiality");
    expect(result.answer).toBe(faqAnswer("Will anyone know?"));
  });

  it("answers payment with the FAQ's exact wording", () => {
    const result = matchQuestion("how do I pay?");
    expect(result.intentId).toBe("payment");
    expect(result.answer).toBe(faqAnswer("How do I pay?"));
  });

  it("quotes the real case study price", () => {
    const result = matchQuestion("how much for a case study");
    expect(result.intentId).toBe("case_study");
    const priceRange = services.find((entry) => entry.id === "case_study")?.priceRange;
    expect(priceRange).toBeDefined();
    expect(result.answer).toContain(priceRange as string);
  });

  it("prefers the specific service over generic pricing", () => {
    // Both score 2 ("case study" vs "how much"); declaration order breaks the tie.
    expect(matchQuestion("how much for a case study").intentId).toBe("case_study");
    // With no service named, generic pricing should win.
    expect(matchQuestion("how much do you charge").intentId).toBe("pricing");
  });

  it("lists every real price range in the generic pricing answer", () => {
    const result = matchQuestion("what are your rates");
    expect(result.intentId).toBe("pricing");
    for (const entry of services) {
      if (entry.priceRange === "Ask me") continue;
      expect(result.answer).toContain(entry.priceRange);
    }
  });

  it("offers the contact form on anything needing a quote", () => {
    expect(matchQuestion("how much do you charge").offerContact).toBe(true);
    expect(matchQuestion("can you build a website").offerContact).toBe(true);
  });
});

describe("matchQuestion — robustness", () => {
  it("is case and punctuation insensitive", () => {
    const shouty = matchQuestion("HOW MUCH FOR A CASE STUDY???");
    const calm = matchQuestion("how much for a case study");
    expect(shouty.intentId).toBe(calm.intentId);
    expect(shouty.answer).toBe(calm.answer);
  });

  it("matches paraphrases onto the same intent", () => {
    expect(matchQuestion("is this confidential").intentId).toBe("confidentiality");
    expect(matchQuestion("will anyone find out").intentId).toBe("confidentiality");
  });

  it("matches on word boundaries, not substrings", () => {
    // "art" appears inside "start" — a naive includes() would mis-hit.
    expect(matchQuestion("art").intentId).toBeNull();
  });

  it("handles Filipino phrasing for price", () => {
    expect(matchQuestion("magkano po").intentId).toBe("pricing");
  });
});

describe("matchQuestion — misses", () => {
  it("returns the handoff for an unrelated question", () => {
    const result = matchQuestion("what is the capital of France");
    expect(result.intentId).toBeNull();
    expect(result.answer).toBe(copy.ask.missReply);
    expect(result.offerContact).toBe(true);
  });

  it("offers navigation instead of a dead end", () => {
    const result = matchQuestion("what is the capital of France");
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("handles empty and whitespace-only input", () => {
    for (const input of ["", "   ", "!!!"]) {
      const result = matchQuestion(input);
      expect(result.intentId).toBeNull();
      expect(result.answer).toBe(copy.ask.emptyReply);
    }
  });
});
