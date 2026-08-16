import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// siteConfig.url is resolved once at module load, so each case needs a fresh
// module registry — same pattern as the contact action's tests.
async function loadSiteUrl() {
  const { siteConfig } = await import("@/lib/constants");
  return siteConfig.url;
}

describe("siteConfig.url", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses the configured URL when it is a real host", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://asktwice.example";
    expect(await loadSiteUrl()).toBe("https://asktwice.example");
  });

  it("strips a trailing slash", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://asktwice.example/";
    expect(await loadSiteUrl()).toBe("https://asktwice.example");
  });

  it("keeps localhost during local development", async () => {
    // No VERCEL flag: this is a dev machine and localhost is the right answer.
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    expect(await loadSiteUrl()).toBe("http://localhost:3000");
  });

  it("ignores a localhost value in a deployed build", async () => {
    // The live bug: a dev value copied into the Vercel dashboard made every
    // absolute URL and the link preview point at an unreachable machine.
    process.env.VERCEL = "1";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ask-twice.vercel.app";
    expect(await loadSiteUrl()).toBe("https://ask-twice.vercel.app");
  });

  it("ignores 127.0.0.1 in a deployed build too", async () => {
    process.env.VERCEL = "1";
    process.env.NEXT_PUBLIC_SITE_URL = "http://127.0.0.1:3000";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ask-twice.vercel.app";
    expect(await loadSiteUrl()).toBe("https://ask-twice.vercel.app");
  });

  it("falls back to the Vercel host when nothing is configured", async () => {
    process.env.VERCEL = "1";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ask-twice.vercel.app";
    expect(await loadSiteUrl()).toBe("https://ask-twice.vercel.app");
  });

  it("never returns an empty or relative URL", async () => {
    const url = await loadSiteUrl();
    expect(url).toMatch(/^https?:\/\/.+/);
  });
});
