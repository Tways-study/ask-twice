import { test, expect } from "@playwright/test";

test("full contact form journey: fill, submit, see success", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Tell me about your project" }).click();

  await page.getByRole("combobox", { name: "Service type" }).click();
  await page.getByRole("option", { name: "Presentation" }).click();

  await page.getByRole("textbox", { name: "Your name" }).fill("Jamie Cruz");
  await page.getByRole("textbox", { name: "Email" }).fill("jamie@example.com");
  await page.getByRole("textbox", { name: "Subject or course" }).fill("Marketing 101");
  await page.getByRole("textbox", { name: "Deadline" }).fill("2026-12-25");

  await page.getByRole("combobox", { name: "Budget range" }).click();
  await page.getByRole("option", { name: "₱500–₱1,000" }).click();

  await page
    .getByRole("textbox", { name: "Tell me what you need" })
    .fill("I need a 10-slide presentation on marketing fundamentals for my class.");

  await page.getByRole("button", { name: "Send my request" }).click();

  await expect(page.getByText("Got it", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send another request" })).toBeVisible();
});

test("progressive disclosure reveals fields conditioned on service type", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Tell me about your project" }).click();

  // Only service type, name, and email are visible before a service is picked.
  await expect(page.getByRole("button", { name: "Send my request" })).not.toBeVisible();

  await page.getByRole("combobox", { name: "Service type" }).click();
  await page.getByRole("option", { name: "Capstone & thesis support" }).click();

  await expect(page.getByRole("button", { name: "Send my request" })).toBeVisible();
  await expect(page.getByLabel("What stage are you at?")).toBeVisible();
  await expect(page.getByLabel("How many slides?")).not.toBeVisible();
});

test("shows inline validation errors on empty submit", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Tell me about your project" }).click();
  await page.getByRole("combobox", { name: "Service type" }).click();
  await page.getByRole("option", { name: "Homework & assignments" }).click();

  await page.getByRole("button", { name: "Send my request" }).click();

  await expect(page.getByText("Name is required", { exact: true })).toBeVisible();
  await expect(page.getByText("Valid email is required", { exact: true })).toBeVisible();
  await expect(page.getByText("Deadline is required", { exact: true })).toBeVisible();
});
