import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactFormData } from "@/lib/schemas";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function MockResend() {
    return { emails: { send: sendMock } };
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Map([["x-forwarded-for", "203.0.113.1"]])),
}));

const validData: ContactFormData = {
  name: "Jamie Cruz",
  email: "jamie@example.com",
  contactMethod: "email",
  serviceType: "presentation",
  subject: "Marketing 101",
  deadline: "2026-12-25",
  details: "I need a 10-slide presentation on marketing fundamentals.",
  budgetRange: "500_1000",
};

describe("submitContactForm", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    process.env.CONTACT_EMAIL = "twice@example.com";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("logs instead of sending when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("sends via Resend and reports success", async () => {
    process.env.RESEND_API_KEY = "test-key";
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(true);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: "twice@example.com", replyTo: validData.email })
    );
  });

  it("reports failure when Resend returns an error", async () => {
    process.env.RESEND_API_KEY = "test-key";
    sendMock.mockResolvedValue({ data: null, error: { message: "bad request" } });

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(false);
  });

  it("re-validates on the server and rejects malformed data", async () => {
    delete process.env.RESEND_API_KEY;
    const { submitContactForm } = await import("./contact");

    const result = await submitContactForm({
      ...validData,
      email: "not-an-email",
    } as ContactFormData);

    expect(result.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
