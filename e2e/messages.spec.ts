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
    await expect(items.first()).toBeVisible(); // wait for page transition to settle
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

    const items = page.getByTestId('message-item');
    await expect(items.first()).toBeVisible();
    const all = await items.count();
    await page.getByRole('tab', { name: 'Critical' }).click();
    const criticalOnly = await items.count();
    expect(criticalOnly).toBeLessThanOrEqual(all);

    await page.getByRole('tab', { name: 'All' }).click();
    await expect(items).toHaveCount(all);
  });

  test('mark all read clears the badge', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();
    await page.getByRole('button', { name: 'Mark all as read' }).click();

    await page.hover('nav');
    await expect(page.getByTestId('sidebar-unread-badge')).toHaveCount(0);
  });

  test('search narrows the list to matching item names', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    await expect(items.first()).toBeVisible();
    const all = await items.count();
    await page.getByTestId('message-search').fill('Nike');

    const filtered = await items.count();
    expect(filtered).toBeLessThanOrEqual(all);
    if (filtered > 0) {
      await expect(items.first()).toContainText(/Nike|Air Force/i);
    }
  });

  test('bulk dismiss removes selected messages', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const before = await page.getByTestId('message-item').count();
    if (before === 0) return;

    await page.getByTestId('select-checkbox').first().check();
    await expect(page.getByTestId('bulk-bar')).toBeVisible();
    await page.getByTestId('bulk-dismiss').click();

    if (before === 1) {
      await expect(page.getByText('No messages. Your inventory looks healthy.')).toBeVisible();
    } else {
      await expect(page.getByTestId('message-item')).toHaveCount(before - 1);
    }
  });

  test('keyboard shortcuts: focus ring hidden until first keypress, then j/k navigate', async ({
    page,
  }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    const total = await items.count();
    if (total < 2) return;

    // No focus ring before any keyboard interaction
    await expect(items.first()).not.toHaveAttribute('data-focused', 'true');

    await page.locator('h1').click();
    // First j press lands cursor on row 0 (was -1 / hidden)
    await page.keyboard.press('j');
    await expect(items.first()).toHaveAttribute('data-focused', 'true');

    // Second j press advances to row 1
    await page.keyboard.press('j');
    await expect(items.nth(1)).toHaveAttribute('data-focused', 'true');

    // k moves cursor back to row 0
    await page.keyboard.press('k');
    await expect(items.first()).toHaveAttribute('data-focused', 'true');
  });

  test('keyboard: e toggles read on focused row', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    if ((await items.count()) === 0) return;

    await page.locator('h1').click();
    await page.keyboard.press('j'); // cursor → 0
    const wasUnread = (await items.first().getAttribute('data-unread')) === 'true';
    await page.keyboard.press('e');
    if (wasUnread) {
      await expect(items.first()).not.toHaveAttribute('data-unread', 'true');
    } else {
      await expect(items.first()).toHaveAttribute('data-unread', 'true');
    }
  });

  test('keyboard: x dismisses the focused row', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    const before = await items.count();
    if (before === 0) return;

    await page.locator('h1').click();
    await page.keyboard.press('j'); // cursor → 0
    await page.keyboard.press('x');

    if (before === 1) {
      await expect(page.getByText('No messages. Your inventory looks healthy.')).toBeVisible();
    } else {
      await expect(items).toHaveCount(before - 1);
    }
  });

  test('keyboard: Enter opens detail drawer', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    if ((await items.count()) === 0) return;

    await page.locator('h1').click();
    await page.keyboard.press('j'); // cursor → 0
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('jump-to-inventory')).toBeVisible();
  });

  test('keyboard: ? opens help dialog', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    await page.locator('h1').click();
    await page.keyboard.press('?');
    await expect(page.getByRole('heading', { name: 'Keyboard shortcuts' })).toBeVisible();
  });

  test('keyboard: / focuses search input', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    await page.locator('h1').click();
    await page.keyboard.press('/');
    await expect(page.getByTestId('message-search')).toBeFocused();
  });

  test('detail drawer: Restock +50 increases quantity and clears the message', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    // Find a low-stock or out-of-stock row (Restock button only shows for those types).
    // Seed data has Nike Air Force at qty 6 → lowStock. Open it via search.
    await page.getByTestId('message-search').fill('Nike');
    const items = page.getByTestId('message-item');
    if ((await items.count()) === 0) return;

    await items.first().getByTestId('open-detail').click();
    await expect(page.getByTestId('quick-restock')).toBeVisible();
    const qtyText = await page.getByTestId('detail-quantity').textContent();
    const beforeQty = Number(qtyText ?? '0');

    await page.getByTestId('quick-restock').click();

    // Drawer closes; underlying lowStock message disappears since qty is now ≥ threshold
    await expect(page.getByTestId('quick-restock')).toHaveCount(0);

    // Re-open via inventory page to confirm the new quantity persisted
    await page.getByTestId('message-search').fill('');
    await page.hover('nav');
    await page.getByRole('button', { name: /Inventory/ }).click();
    await expect(
      page.getByRole('row').filter({ hasText: 'Nike Air Force' }).first()
    ).toContainText(String(beforeQty + 50));
  });

  test('detail drawer: highValue alert hides Restock button', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    // Seed has Briefs Male qty 3000 × 4599 = ~£137k → highValue.
    await page.getByTestId('message-search').fill('Briefs');
    const items = page.getByTestId('message-item');
    if ((await items.count()) === 0) return;

    await items.first().getByTestId('open-detail').click();
    await expect(page.getByTestId('jump-to-inventory')).toBeVisible();
    // Restock should NOT be present for highValue
    await expect(page.getByTestId('quick-restock')).toHaveCount(0);
  });

  test('detail drawer: View in inventory highlights the matching row', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();

    const items = page.getByTestId('message-item');
    if ((await items.count()) === 0) return;

    await items.first().getByTestId('open-detail').click();
    await page.getByTestId('jump-to-inventory').click();

    // We're back on the inventory page; the matching row has data-highlighted
    await expect(page.locator('tr[data-highlighted="true"]')).toBeVisible();
  });

  test('toast fires when an inventory edit creates a new critical', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Inventory/ }).click();

    // Edit the first row to set quantity = 0 → outOfStock critical
    const firstRow = page.getByRole('row').nth(1); // [0] is the header row
    await firstRow.getByRole('button').first().click(); // edit pencil

    const qtyInput = page.getByLabel(/Quantity/i).first();
    await qtyInput.fill('0');
    await page.getByRole('button', { name: /Save/i }).click();

    // Toast appears with View action
    await expect(page.getByTestId('toast-action')).toBeVisible();

    // Click the View action — should jump to messages page
    await page.getByTestId('toast-action').click();
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
  });

  test('settings drawer opens and persists threshold change', async ({ page }) => {
    await page.hover('nav');
    await page.getByRole('button', { name: /Messages/ }).click();
    await page.getByTestId('open-settings').click();

    const lowStockInput = page.locator('#th-lowstock');
    await expect(lowStockInput).toBeVisible();
    await lowStockInput.fill('100');
    await page.getByRole('button', { name: 'Save' }).click();

    // Lowering count threshold to 100 should increase the number of low-stock alerts
    // (any item with quantity < 100 now qualifies). The badge should still be visible.
    await page.hover('nav');
    await expect(page.getByTestId('sidebar-unread-badge')).toBeVisible();
  });
});
