import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to Drivers page', async ({ page }) => {
    await page.click('a:has-text("Drivers"), button:has-text("Drivers"), nav a:has-text("Drivers")');
    await expect(page).toHaveURL(/drivers/i);
    await expect(page.locator('h1, h2').filter({ hasText: /drivers?/i }).first()).toBeVisible();
  });

  test('should navigate to Teams page', async ({ page }) => {
    await page.click('a:has-text("Teams"), button:has-text("Teams"), nav a:has-text("Teams")');
    await expect(page).toHaveURL(/teams/i);
    await expect(page.locator('h1, h2').filter({ hasText: /teams?/i }).first()).toBeVisible();
  });

  test('should navigate to Rankings page', async ({ page }) => {
    await page.click('a:has-text("Rankings"), button:has-text("Rankings"), nav a:has-text("Rankings")');
    await expect(page).toHaveURL(/rankings?/i);
    await expect(page.locator('h1, h2').filter({ hasText: /rankings?/i }).first()).toBeVisible();
  });

  test('should navigate to Predictions page', async ({ page }) => {
    await page.click('a:has-text("Predictions"), button:has-text("Predictions"), nav a:has-text("Predictions")');
    await expect(page).toHaveURL(/predictions?/i);
  });

  test('should navigate to Circuits page', async ({ page }) => {
    await page.click('a:has-text("Circuits"), button:has-text("Circuits"), nav a:has-text("Circuits")');
    await expect(page).toHaveURL(/circuits?/i);
  });
});
