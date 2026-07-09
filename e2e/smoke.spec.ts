import { test, expect } from "@playwright/test";

test("home page loads with the brand title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Plansio/);
});

test("products index lists product cards", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator(".pcard").first()).toBeVisible();
});

test("a product detail page renders", async ({ page }) => {
  await page.goto("/products/inkril");
  await expect(page.locator(".pd-title")).toBeVisible();
});

test("studio requires login", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByText("Enter Studio")).toBeVisible();
});

test("faq page renders questions", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("h1")).toBeVisible();
});
