import { test, expect } from '@playwright/test';

test.describe('Inventory System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with title and inventory table', async ({ page }) => {
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('theme toggle switches dark mode', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html[data-theme="dark"]')).toBeAttached();
  });

  test('language switch changes text', async ({ page }) => {
    const langTrigger = page.getByRole('button', { name: /select language/i });
    await langTrigger.click();

    const zhOption = page.getByRole('menuitem', { name: /中文/i });
    await zhOption.click();
    await expect(page.locator('text=总库存量')).toBeVisible();

    await langTrigger.click();
    const jaOption = page.getByRole('menuitem', { name: /日本語/i });
    await jaOption.click();
    await expect(page.locator('text=総数量')).toBeVisible();
  });

  test('add new item flow', async ({ page }) => {
    await page.getByRole('button', { name: /add new item/i }).click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/item name/i).fill('item.test');
    await dialog.getByLabel(/quantity/i).fill('10');
    await dialog.getByLabel(/category/i).fill('category.test');
    await dialog.getByLabel(/unit price/i).fill('99.99');
    await dialog.getByRole('button', { name: /save/i }).click();

    await expect(page.locator('text=item.test')).toBeVisible();
    await expect(page.locator('text=Item added successfully')).toBeVisible();
  });

  test('delete item flow', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await firstRow.getByRole('button', { name: /delete item/i }).click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /delete item/i }).click();

    await expect(page.locator('text=Item deleted successfully')).toBeVisible();
  });
});
