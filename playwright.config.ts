import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    // Never reuse a server started outside this config: it would be running
    // with the real .env and would post test submissions to Formspree.
    reuseExistingServer: false,
    timeout: 120_000,
    // Surface the dev server's logs, so the "not set" line below is verifiable
    // and server-side errors during a run aren't swallowed.
    stdout: "pipe",
    env: {
      // The contact journey submits the real form. Blanking the form ID makes
      // submitContactForm take its documented log-instead-of-send path, so the
      // suite stops burning the 50/month Formspree quota (and stops emailing
      // Twice a fake "Jamie Cruz" on every run).
      FORMSPREE_FORM_ID: "",
    },
  },
});
