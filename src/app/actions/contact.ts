"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { siteConfig } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// In-memory per-IP counter — resets on cold start, acceptable at this scale (docs/04-tdd.md §11).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function formatEmailBody(data: ContactFormData) {
  const conditionalLines = [
    data.capstoneStage ? `STAGE: ${data.capstoneStage}` : null,
    data.slideCount ? `SLIDES: ${data.slideCount}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `From: ${data.name} (${data.email})
Preferred contact: ${data.contactMethod}

SERVICE: ${data.serviceType}
SUBJECT: ${data.subject}
DEADLINE: ${data.deadline}
BUDGET: ${data.budgetRange}${conditionalLines ? `\n${conditionalLines}` : ""}

DETAILS:
${data.details}

ADDITIONAL NOTES:
${data.additionalNotes || "None"}

FILE: ${data.fileUrl || "No file attached"}`;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean }> {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return { success: false };
  }

  const subject = `[AskTwice] New Request: ${parsed.data.serviceType} — ${parsed.data.subject}`;
  const body = formatEmailBody(parsed.data);
  const receivingEmail = process.env.CONTACT_EMAIL ?? siteConfig.email;

  if (!resend) {
    console.log("[contact] RESEND_API_KEY not set — logging submission instead of sending.\n", subject, "\n", body);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: "AskTwice <onboarding@resend.dev>", // [[TBD: verified sending domain]]
      to: receivingEmail,
      replyTo: parsed.data.email,
      subject,
      text: body,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("[contact] Unexpected error sending email:", err);
    return { success: false };
  }
}
