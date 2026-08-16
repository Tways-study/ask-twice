import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactFormData } from "@/lib/schemas";

const fetchMock = vi.fn();

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
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("logs instead of posting when FORMSPREE_FORM_ID is not set", async () => {
    delete process.env.FORMSPREE_FORM_ID;
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("posts to Formspree and reports success", async () => {
    process.env.FORMSPREE_FORM_ID = "test-form-id";
    fetchMock.mockResolvedValue({ ok: true });

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formspree.io/f/test-form-id",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Accept: "application/json" }),
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body._replyto).toBe(validData.email);
    expect(body._subject).toContain(validData.subject);
  });

  it("reports failure when Formspree returns a non-ok response", async () => {
    process.env.FORMSPREE_FORM_ID = "test-form-id";
    fetchMock.mockResolvedValue({ ok: false, status: 422, text: async () => "bad request" });

    const { submitContactForm } = await import("./contact");
    const result = await submitContactForm(validData);

    expect(result.success).toBe(false);
  });

  it("re-validates on the server and rejects malformed data", async () => {
    delete process.env.FORMSPREE_FORM_ID;
    const { submitContactForm } = await import("./contact");

    const result = await submitContactForm({
      ...validData,
      email: "not-an-email",
    } as ContactFormData);

    expect(result.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
