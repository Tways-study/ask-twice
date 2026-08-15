import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/schemas";

const validData = {
  name: "Jamie Cruz",
  email: "jamie@example.com",
  contactMethod: "email" as const,
  serviceType: "presentation" as const,
  subject: "Marketing 101",
  deadline: "2026-12-25",
  details: "I need a 10-slide presentation on marketing fundamentals.",
  budgetRange: "500_1000" as const,
};

describe("contactFormSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts a valid submission with optional fields omitted", () => {
    const result = contactFormSchema.safeParse({ ...validData, fileUrl: "", additionalNotes: undefined });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactFormSchema.safeParse({ ...validData, name: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown service type", () => {
    const result = contactFormSchema.safeParse({ ...validData, serviceType: "tutoring" });
    expect(result.success).toBe(false);
  });

  it("rejects details shorter than 20 characters", () => {
    const result = contactFormSchema.safeParse({ ...validData, details: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing deadline", () => {
    const result = contactFormSchema.safeParse({ ...validData, deadline: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid fileUrl", () => {
    const result = contactFormSchema.safeParse({ ...validData, fileUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid fileUrl", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      fileUrl: "https://drive.google.com/some-file",
    });
    expect(result.success).toBe(true);
  });

  it("treats an empty slideCount input as absent, not zero", () => {
    const result = contactFormSchema.safeParse({ ...validData, slideCount: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slideCount).toBeUndefined();
    }
  });

  it("accepts a valid slideCount", () => {
    const result = contactFormSchema.safeParse({ ...validData, slideCount: "12" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slideCount).toBe(12);
    }
  });

  it("rejects a negative slideCount", () => {
    const result = contactFormSchema.safeParse({ ...validData, slideCount: "-5" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid capstoneStage", () => {
    const result = contactFormSchema.safeParse({ ...validData, capstoneStage: "drafting" });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown capstoneStage", () => {
    const result = contactFormSchema.safeParse({ ...validData, capstoneStage: "done" });
    expect(result.success).toBe(false);
  });
});
