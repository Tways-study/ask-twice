"use server";

import { headers } from "next/headers";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas";

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

  const formId = process.env.FORMSPREE_FORM_ID;
  const payload = {
    ...parsed.data,
    _subject: `[AskTwice] New Request: ${parsed.data.serviceType} — ${parsed.data.subject}`,
    _replyto: parsed.data.email,
  };

  if (!formId) {
    console.log("[contact] FORMSPREE_FORM_ID not set — logging submission instead of sending.\n", payload);
    return { success: true };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[contact] Formspree error:", response.status, await response.text());
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("[contact] Unexpected error sending submission:", err);
    return { success: false };
  }
}
