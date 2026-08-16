import type { BudgetRange, CapstoneStage, ContactMethod, ServiceType } from "@/lib/schemas";

export const siteConfig = {
  name: "AskTwice",
  title: "AskTwice: schoolwork, handled",
  description:
    "Presentations, case studies, capstone documents, and the assignments piling up behind them. Tell me what you need and when. I'll tell you what it costs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://asktwice.dev", // [[TBD: domain]]
  email: "twicenavarro23@gmail.com",
} as const;

export const socialLinks = {
  facebook: "https://www.facebook.com/tways.varo/",
  portfolio: "https://webportfolio-two-phi.vercel.app/",
} as const;

// `summary`, `deliverable`, and `tools` are optional on purpose: the row renders
// without them rather than carrying invented detail about real work.
// [[TBD: write a summary + deliverable + tools for each sample]]
export type PortfolioSample =
  | {
      status: "filled";
      slug: string;
      title: string;
      serviceType: ServiceType;
      subjectArea: string;
      summary?: string;
      deliverable?: string;
      tools?: readonly string[];
      href: string;
      hrefKind: "site" | "pdf";
      // Overrides the generic "Open the live site" / "Read the PDF" link text —
      // a case study and a proposal deck are both PDFs but shouldn't share a label.
      ctaLabel?: string;
      thumbnail: string;
      alt: string;
    }
  | { status: "placeholder"; label: string; serviceType: ServiceType };

export const portfolioSamples: PortfolioSample[] = [
  {
    status: "filled",
    slug: "clauseguard",
    title: "ClauseGuard",
    serviceType: "presentation",
    subjectArea: "Capstone research proposal",
    summary:
      "The capstone proposal my panel approved. ClauseGuard reads a photo or scan of a contract, classifies its clauses, flags high-risk terms in plain language, and generates a risk report.",
    href: "https://clauseguard-proposal-presentation.vercel.app/",
    hrefKind: "site",
    thumbnail: "/portfolio/thumb-presentation.png",
    alt: "Title slide of the ClauseGuard capstone research proposal deck",
  },
  {
    status: "filled",
    slug: "wan-design",
    title: "WAN design for a two-office business",
    serviceType: "case_study",
    subjectArea: "Networking",
    href: "/portfolio/networking-case-study.pdf",
    hrefKind: "pdf",
    ctaLabel: "Read the case study (PDF)",
    thumbnail: "/portfolio/thumb-case-study.png",
    alt: "Network diagram linking a main office and a branch office over a wide area network",
  },
  {
    status: "filled",
    slug: "coffee-brewtherhood",
    title: "Coffee Brewtherhood",
    serviceType: "development",
    subjectArea: "Specialty cafe site",
    href: "https://coffee-brewtherhood.vercel.app/",
    hrefKind: "site",
    thumbnail: "/portfolio/thumb-website.jpg",
    alt: "Homepage of the Coffee Brewtherhood specialty cafe website",
  },
  {
    status: "filled",
    slug: "pasa",
    title: "PASA",
    serviceType: "capstone",
    subjectArea: "Capstone proposal defense",
    summary:
      "A proposal for a system that would screen permit application documents for missing fields and mismatches before the applicant makes the trip to file. Team capstone proposal — I was lead developer.",
    deliverable: "23-slide proposal deck",
    href: "/portfolio/pasa-proposal.pdf",
    hrefKind: "pdf",
    ctaLabel: "Read the proposal (PDF)",
    thumbnail: "/portfolio/thumb-pasa.jpg",
    alt: "Slide showing PASA's four-stage document verification pipeline: classify, extract, cross-validate, report",
  },
  {
    status: "filled",
    slug: "facilitrak",
    title: "FaciliTrak",
    serviceType: "capstone",
    subjectArea: "Capstone proposal defense",
    summary:
      "A proposal for a system that would turn a photo of a broken classroom fixture into a tracked, assigned maintenance ticket. Team capstone proposal — I was lead developer.",
    deliverable: "16-slide proposal deck",
    href: "/portfolio/facilitrak-proposal.pdf",
    hrefKind: "pdf",
    ctaLabel: "Read the proposal (PDF)",
    thumbnail: "/portfolio/thumb-facilitrak.jpg",
    alt: "Slide showing FaciliTrak's four-stage reporting pipeline: report, classify, ticket, resolve",
  },
];

export const processSteps = [
  {
    label: "You tell me what you need",
    detail: "The form below, or a message. The deadline and the details help most.",
  },
  {
    label: "I send a quote",
    detail: "Within a day. Price and timeline both, before anything starts.",
  },
  {
    label: "I build it",
    detail: "Usually 2–5 days. If it'll take longer than that, I tell you upfront.",
  },
  {
    label: "You get the files",
    detail: "Editable source, not just a PDF. Two revisions are included.",
  },
] as const;

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export type Service = {
  id: ServiceType;
  name: string;
  description: string;
  priceRange: string;
};

// Pricing ranges are brief placeholders — [[TBD: replace with real figures before launch]]
export const services: Service[] = [
  {
    id: "presentation",
    name: "Presentations",
    description:
      "Slide decks that don't look like a template. PowerPoint, Google Slides, or Canva. Your call.",
    priceRange: "₱300–₱1,500",
  },
  {
    id: "case_study",
    name: "Case studies",
    description:
      "Proper structure, real analysis, citations formatted the way your instructor wants them.",
    priceRange: "₱500–₱2,000",
  },
  {
    id: "capstone",
    name: "Capstone & thesis support",
    description:
      "Documentation, technical writing, and the deliverables around your build. I'm doing my own capstone, so I know exactly where this gets painful.",
    priceRange: "₱1,000–₱3,000+",
  },
  {
    id: "development",
    name: "Websites & apps",
    description:
      "Landing pages, small web apps, or straight-up code: building from scratch, fixing what's broken, or picking up where you left off.",
    priceRange: "₱1,500–₱5,000+",
  },
  {
    id: "homework",
    name: "Homework & assignments",
    description: "Problem sets, essays, reports, weekly submissions. The steady stuff.",
    priceRange: "₱200–₱800",
  },
  {
    id: "research_paper",
    name: "Research papers",
    description:
      "Literature review through methodology, formatted to APA, IEEE, or whatever your department uses.",
    priceRange: "₱800–₱2,500",
  },
  {
    id: "other",
    name: "Something else",
    description: "Not on the list? Describe it and I'll quote it.",
    priceRange: "Ask me",
  },
];

export const serviceTypeLabels: Record<ServiceType, string> = {
  presentation: "Presentation",
  case_study: "Case study",
  capstone: "Capstone & thesis support",
  development: "Websites & apps",
  homework: "Homework & assignments",
  research_paper: "Research paper",
  other: "Something else",
};

export const budgetRangeLabels: Record<BudgetRange, string> = {
  under_500: "Under ₱500",
  "500_1000": "₱500–₱1,000",
  "1000_2000": "₱1,000–₱2,000",
  "2000_plus": "₱2,000+",
  contact_quote: "Contact for custom quote",
};

export const contactMethodLabels: Record<ContactMethod, string> = {
  email: "Email",
  messenger: "Messenger",
  telegram: "Telegram",
};

export const capstoneStageLabels: Record<CapstoneStage, string> = {
  outline: "Still outlining",
  drafting: "Drafting",
  finalizing: "Finalizing",
};

export const faqItems = [
  {
    question: "How does this work?",
    answer:
      "You fill out the form below → I send you a quote within a day → you approve it → I build → I deliver.",
  },
  {
    question: "How fast can you turn something around?",
    answer:
      "Standard jobs usually take 2–5 days depending on scope. Rush jobs are possible but cost more. I'll always tell you the rush fee before you commit, never after.",
  },
  {
    question: "What if I need changes?",
    answer:
      "Two revisions are included with every request. [[TBD: confirm final revision count]] After that, revisions are billed at a small hourly rate, and I'll quote it before starting.",
  },
  {
    question: "Will anyone know?",
    answer: "No. I don't share client work, names, or files. Ever.",
  },
  {
    question: "How do I pay?",
    answer:
      "GCash, bank transfer, or cash. Payment is due once you approve the quote, before I start the work.",
  },
  {
    question: "What subjects can you handle?",
    answer:
      "Strongest in IT, business, and general education subjects: presentations, case studies, and technical writing especially. Not the right fit for advanced math or lab-specific science reports; I'll tell you upfront if something's outside my range.",
  },
] as const;

export const copy = {
  hero: {
    headline: "Schoolwork,",
    highlightedWord: "handled.",
    lead: "Presentations, case studies, capstone documents, and the assignments piling up behind them. Tell me what you need and when. I'll tell you what it costs.",
    primaryCta: "Tell me about your project",
    secondaryCta: "See what I charge",
    marginNote: "no commitment: ask first, decide after",
  },
  services: {
    marginNote: "rush jobs cost more, but I'll always tell you first",
  },
  portfolio: {
    heading: "Portfolio",
    body: "A few samples below.",
    subBody:
      "More going up soon. Most of what I build for clients stays private, but here's a look at how I work.",
    processHeading: "How a project actually goes",
    placeholderBody:
      "Going up once it's finished. Ask and I'll walk you through it in the meantime.",
  },
  about: {
    heading: "About",
    opener:
      "I'm Twice. I'm a third-year IT student now (I started out in Medical Laboratory Science before shifting), and I've spent the last two years building software and writing documentation since.",
    body: "Right now that means classes, my own capstone project, and a steady stream of requests just like the one you're about to send. I know what a deadline looks like from your side of the screen, because I'm usually staring down one of my own.",
    highlightedPhrase: "I'm a student too",
    marginNote: "same deadlines as you, honestly",
  },
  faq: {
    heading: "Frequently asked",
  },
  contact: {
    heading: "Tell me what you need.",
    lead: "The more detail you give me, the faster I can quote it. Nothing here is a commitment.",
    submitIdle: "Send my request",
    submitLoading: "Sending…",
    submitDone: "Sent",
    successTitle: "Got it",
    successBody: (email: string) => `I'll reply to ${email} within a day.`,
    failureBody: `That didn't send. Email me directly at ${siteConfig.email} and I'll pick it up there.`,
    marginNote: "I read every one of these myself",
  },
} as const;
