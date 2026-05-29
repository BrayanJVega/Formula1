import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page and authenticate user', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1, h2').filter({ hasText: /sign in|login|welcome back/i }).first()).toBeVisible();

    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'test@example.com');
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', 'Password123');

    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in")');

    await page.waitForURL(/dashboard|home|\//, { timeout: 10000 });

    expect(page.url()).not.toContain('/login');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"], input[name="email"]', 'wrong@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpass');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/invalid|error|failed/i').first()).toBeVisible({ timeout: 5000 });
  });
});
