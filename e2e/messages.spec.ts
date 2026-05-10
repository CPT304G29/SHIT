import { test, expect } from '@playwright/test';

test.describe('Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('shit-inventory');
      localStorage.removeItem('shit-messages');
    });
    await page.reload();
  });

  test('navigates to Messages page from sidebar', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
    await expect(page.getByText('Smart alerts derived from your inventory')).toBeVisible();
  });

  test('seeded inventory produces at least one alert with an unread badge', async ({ page }) => {
    await page.hover('nav');
    // Sidebar badge appears for unread messages
    await expect(page.getByTestId('sidebar-unread-badge')).toBeVisible();

    await page.getByRole('button', { name: /Messages/ }).click();
    const items = page.getByTestId('message-item');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('mark-as-read decreases unread count', async ({ page }) => {
    await page.hover('nav');
    const badge = page.getByTestId('sidebar-unread-badge');
    const beforeText = (await badge.textContent()) ?? '0';
    const before = parseInt(beforeText, 10);

    await page.getByRole('button', { name: /Messages/ }).click();
    await page
      .getByTestId('message-item')
      .first()
      .getByTestId('toggle-read')
      .click();

    if (before <= 1) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(before - 1));
    }
  });

  test('dismiss removes the message from the list', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    const before = await items.count();
    await items.first().getByTestId('dismiss').click();

    if (before <= 1) {
      await expect(page.getByText('No messages. Your inventory looks healthy.')).toBeVisible();
    } else {
      await expect(items).toHaveCount(before - 1);
    }
  });

  test('filter tabs narrow the list', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const all = await page.getByTestId('message-item').count();
    await page.getByRole('tab', { name: 'Critical' }).click();
    const criticalOnly = await page.getByTestId('message-item').count();
    expect(criticalOnly).toBeLessThanOrEqual(all);

    await page.getByRole('tab', { name: 'All' }).click();
    expect(await page.getByTestId('message-item').count()).toBe(all);
  });

  test('mark all read clears the badge', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();
    await page.getByRole('button', { name: 'Mark all as read' }).click();

    await page.hover('nav');
    await expect(page.getByTestId('sidebar-unread-badge')).toHaveCount(0);
  });
});
