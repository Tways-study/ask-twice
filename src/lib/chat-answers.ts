import { copy, faqItems, services } from "@/lib/constants";
import type { ServiceType } from "@/lib/schemas";

// Every answer below is looked up from constants.ts rather than retyped, so the
// FAQ and this matcher can never drift apart on a number. The literal union
// types mean renaming a FAQ question or a service id fails the build here.
type FaqQuestion = (typeof faqItems)[number]["question"];

function faqAnswer(question: FaqQuestion): string {
  return faqItems.find((entry) => entry.question === question)?.answer ?? "";
}

function service(id: ServiceType) {
  return services.find((entry) => entry.id === id);
}

function servicePitch(id: ServiceType): string {
  const match = service(id);
  if (!match) return "";
  return match.priceRange === "Ask me"
    ? match.description
    : `${match.description} Usually ${match.priceRange}.`;
}

export type Intent = {
  id: string;
  /** Shown on a suggestion chip. Phrased as a visitor would ask it. */
  label: string;
  keywords: readonly string[];
  answer: string;
  /** Anything needing a real quote should route to the form. */
  offerContact?: boolean;
};

// Order matters: ties are broken by declaration order, so the service-specific
// intents sit above the generic pricing one. "how much for a case study" scores
// 2 on both, and the more specific answer should win.
export const intents: readonly Intent[] = [
  {
    id: "presentation",
    label: "What do presentations cost?",
    keywords: ["presentation", "presentations", "slide", "slides", "deck", "powerpoint", "ppt", "google slides", "canva"],
    answer: servicePitch("presentation"),
    offerContact: true,
  },
  {
    id: "case_study",
    label: "What about case studies?",
    keywords: ["case study", "case studies", "case analysis"],
    answer: servicePitch("case_study"),
    offerContact: true,
  },
  {
    id: "capstone",
    label: "Can you help with my capstone?",
    keywords: ["capstone", "thesis", "dissertation", "defense", "defence", "manuscript"],
    answer: servicePitch("capstone"),
    offerContact: true,
  },
  {
    id: "development",
    label: "Do you build websites?",
    keywords: ["website", "websites", "web site", "site", "sites", "app", "apps", "code", "coding", "landing page", "development", "programming", "software"],
    answer: servicePitch("development"),
    offerContact: true,
  },
  {
    id: "homework",
    label: "Can you do homework?",
    keywords: ["homework", "assignment", "assignments", "problem set", "essay", "essays", "report", "reports", "seatwork"],
    answer: servicePitch("homework"),
    offerContact: true,
  },
  {
    id: "research_paper",
    label: "What about research papers?",
    keywords: ["research paper", "research", "literature review", "methodology", "apa", "ieee", "citation", "citations", "references"],
    answer: servicePitch("research_paper"),
    offerContact: true,
  },
  {
    id: "pricing",
    label: "What do you charge?",
    keywords: ["price", "prices", "pricing", "cost", "costs", "how much", "rate", "rates", "charge", "charges", "fee", "fees", "magkano", "budget", "expensive", "cheap", "afford"],
    answer: [
      "Depends on the work. Rough ranges:",
      ...services
        .filter((entry) => entry.priceRange !== "Ask me")
        .map((entry) => `${entry.name}: ${entry.priceRange}`),
      "Send me the details and I'll quote yours exactly.",
    ].join("\n"),
    offerContact: true,
  },
  {
    id: "services",
    label: "What do you take on?",
    keywords: ["what do you do", "services", "service", "offer", "offers", "take on", "help with", "what can you"],
    answer: [
      "These, mostly:",
      ...services.map((entry) => entry.name),
      "Not on the list? Describe it and I'll tell you if it's a fit.",
    ].join("\n"),
    offerContact: true,
  },
  {
    id: "turnaround",
    label: "How fast can you deliver?",
    keywords: ["how fast", "how long", "turnaround", "deadline", "rush", "urgent", "quick", "quickly", "soon", "asap", "days", "tomorrow", "tonight", "when can you", "time"],
    answer: faqAnswer("How fast can you turn something around?"),
  },
  {
    id: "revisions",
    label: "What if I need changes?",
    keywords: ["revision", "revisions", "changes", "change", "edit", "edits", "revise", "fix", "rework", "redo", "feedback"],
    answer: faqAnswer("What if I need changes?"),
  },
  {
    id: "confidentiality",
    label: "Will anyone know?",
    keywords: ["anyone know", "confidential", "confidentiality", "private", "privacy", "secret", "anonymous", "share my", "tell anyone", "find out", "safe"],
    answer: faqAnswer("Will anyone know?"),
  },
  {
    id: "payment",
    label: "How do I pay?",
    keywords: ["pay", "payment", "gcash", "bank", "transfer", "cash", "downpayment", "down payment", "deposit", "installment", "paymaya", "maya"],
    answer: faqAnswer("How do I pay?"),
  },
  {
    id: "subjects",
    label: "What subjects do you cover?",
    keywords: ["subject", "subjects", "course", "courses", "major", "field", "topic", "topics", "math", "science", "accounting", "nursing", "engineering"],
    answer: faqAnswer("What subjects can you handle?"),
  },
  {
    id: "process",
    label: "How does this work?",
    keywords: ["how does this work", "how it works", "process", "steps", "start", "get started", "begin", "order", "request", "what happens"],
    answer: faqAnswer("How does this work?"),
  },
  {
    id: "about",
    label: "Who are you?",
    keywords: ["who are you", "who is twice", "about you", "your name", "student", "background", "experience", "yourself"],
    answer: copy.about.opener,
  },
];

/** Chips shown before the visitor has asked anything. */
export const starterIntentIds = ["pricing", "turnaround", "confidentiality", "process"] as const;

export const starterIntents = starterIntentIds
  .map((id) => intents.find((intent) => intent.id === id))
  .filter((intent): intent is Intent => intent !== undefined);

export type MatchResult = {
  intentId: string | null;
  answer: string;
  offerContact: boolean;
  /** Populated only on a miss, to turn a dead end into navigation. */
  suggestions: readonly Intent[];
};

// Strip punctuation and collapse whitespace so "HOW MUCH???" and "how much"
// score identically. Unicode-aware so accented input isn't mangled.
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Longer keywords score higher, so "case study" (2) outranks a bare "study" (1)
// and the more specific intent wins.
function scoreIntent(intent: Intent, paddedText: string): number {
  let score = 0;
  for (const keyword of intent.keywords) {
    if (paddedText.includes(` ${normalize(keyword)} `)) {
      score += normalize(keyword).split(" ").length;
    }
  }
  return score;
}

export function matchQuestion(input: string): MatchResult {
  const normalized = normalize(input);

  if (normalized.length === 0) {
    return { intentId: null, answer: copy.ask.emptyReply, offerContact: false, suggestions: starterIntents };
  }

  // Pad so `includes` matches on word boundaries rather than inside words —
  // otherwise "start" would match the "art" in a different keyword.
  const padded = ` ${normalized} `;

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    const score = scoreIntent(intent, padded);
    // Strictly greater keeps declaration order as the tie-break.
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }

  if (!best) {
    return { intentId: null, answer: copy.ask.missReply, offerContact: true, suggestions: starterIntents };
  }

  return {
    intentId: best.id,
    answer: best.answer,
    offerContact: best.offerContact ?? false,
    suggestions: [],
  };
}
