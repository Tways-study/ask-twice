import { z } from "zod";

export const serviceTypes = [
  "presentation",
  "case_study",
  "capstone",
  "development",
  "homework",
  "research_paper",
  "other",
] as const;

export const budgetRanges = [
  "under_500", // ₱0–₱500
  "500_1000", // ₱500–₱1,000
  "1000_2000", // ₱1,000–₱2,000
  "2000_plus", // ₱2,000+
  "contact_quote", // Contact for custom quote
] as const;

export const contactMethods = ["email", "messenger", "telegram"] as const;

export const capstoneStages = ["outline", "drafting", "finalizing"] as const;

export const contactFormSchema = z.object({
  // Client info
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  contactMethod: z.enum(contactMethods),

  // Request details
  serviceType: z.enum(serviceTypes),
  subject: z.string().min(3, "Subject or course name is required").max(200),
  deadline: z.string().min(1, "Deadline is required"), // ISO date string
  details: z.string().min(20, "Please provide at least 20 characters of detail").max(5000),
  budgetRange: z.enum(budgetRanges),

  // Optional
  fileUrl: z.string().url().optional().or(z.literal("")),
  additionalNotes: z.string().max(1000).optional(),

  // Conditional on serviceType — shown only for capstone / presentation requests
  capstoneStage: z.enum(capstoneStages).optional(),
  slideCount: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.coerce.number().int().positive().max(500).optional()
  ),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
// The raw shape RHF holds before the resolver coerces slideCount etc.
export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ServiceType = (typeof serviceTypes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type ContactMethod = (typeof contactMethods)[number];
export type CapstoneStage = (typeof capstoneStages)[number];
