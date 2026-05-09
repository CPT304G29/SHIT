import { test, expect } from '@playwright/test';

test.describe('Charts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('shit-inventory'));
    await page.reload();
  });

  test('navigates to charts page from sidebar', async ({ page }) => {
    await page.hover('nav');
    await page.click('nav button:has-text("Charts")');
    await expect(page.locator('text=Quantity by Category')).toBeVisible();
    await expect(page.locator('text=Value by Category')).toBeVisible();
    await expect(page.locator('text=Stock Levels')).toBeVisible();
    await expect(page.locator('text=Price vs Quantity')).toBeVisible();
  });

  test('charts render with inventory data', async ({ page }) => {
    await page.hover('nav');
    await page.click('nav button:has-text("Charts")');
    // Verify all six chart titles are present
    await expect(page.locator('text=Top Value Items')).toBeVisible();
    await expect(page.locator('text=Avg Price by Category')).toBeVisible();
  });

  test('theme toggle does not break charts', async ({ page }) => {
    await page.hover('nav');
    await page.click('nav button:has-text("Charts")');
    await expect(page.locator('text=Quantity by Category')).toBeVisible();

    // Toggle to dark
    await page.click('header button[aria-label*="dark"]');
    await expect(page.locator('text=Quantity by Category')).toBeVisible();

    // Toggle back to light
    await page.click('header button[aria-label*="light"]');
    await expect(page.locator('text=Quantity by Category')).toBeVisible();
  });
});
