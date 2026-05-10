import { test, expect } from '@playwright/test';

test.describe('Calendar page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('shit-inventory');
      localStorage.removeItem('shit-language');
    });
    await page.reload();
    await page.hover('nav');
    await page.getByRole('button', { name: /Calendar/i }).click();
  });

  test('navigates to calendar page from sidebar', async ({ page }) => {
    await expect(page.getByText('Calendar-level inventory movement')).toBeVisible();
    await expect(page.getByText('Inventory movement details')).toBeVisible();
    await expect(page.getByText('Inbound vs outbound')).toBeVisible();
    await expect(page.getByTestId('calendar-grid')).toBeVisible();
  });

  test('future dates are disabled', async ({ page }) => {
    const disabledFutureDays = page
      .getByTestId('calendar-grid')
      .locator('button[disabled][data-in-month="true"]');

    await expect(disabledFutureDays.first()).toBeVisible();
    expect(await disabledFutureDays.count()).toBeGreaterThan(0);
  });

  test('clicking a previous-month day switches to that month and shows that day details', async ({
    page,
  }) => {
    const overflowDay = page
      .getByTestId('calendar-grid')
      .locator('button[data-in-month="false"]:not([disabled])')
      .first();

    const dateKey = await overflowDay.getAttribute('data-date-key');
    const previousMonthTitle = await overflowDay.evaluate((node) => {
      const dateKeyValue = node.getAttribute('data-date-key');
      if (!dateKeyValue) return '';
      const [year, month] = dateKeyValue.split('-').map(Number);
      return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(
        new Date(year, month - 1, 1)
      );
    });

    expect(dateKey).not.toBeNull();
    await overflowDay.click();

    await expect(page.getByTestId('calendar-month-title')).toHaveText(previousMonthTitle);
    await expect(page.getByTestId(`calendar-day-${dateKey}`)).toHaveAttribute(
      'class',
      /dayButtonSelected/
    );
    await expect(page.getByText('Inventory movement details')).toBeVisible();
  });

  test('clicking a zero-activity past day shows the empty detail state', async ({ page }) => {
    const quietPastDay = page
      .getByTestId('calendar-grid')
      .locator('button[data-in-month="true"]:not([disabled])')
      .filter({ hasText: /\b0\b/ })
      .nth(1);

    await quietPastDay.click();

    await expect(page.getByTestId('calendar-empty-state')).toBeVisible();
    await expect(page.getByText('No inventory activity recorded for this date.')).toBeVisible();
  });

  test('detail table keeps 10 visible slots and quiet-day selection resets to a single page', async ({
    page,
  }) => {
    await expect(page.getByTestId('calendar-page-indicator')).toHaveText(/Page 1 \/ \d+/);
    const filledRows = await page.getByTestId('calendar-detail-row').count();
    const blankRows = await page.getByTestId('calendar-detail-row-blank').count();
    expect(filledRows + blankRows).toBe(10);

    const quietPastDay = page
      .getByTestId('calendar-grid')
      .locator('button[data-in-month="true"]:not([disabled])')
      .filter({ hasText: /\b0\b/ })
      .nth(1);

    await quietPastDay.click();

    await expect(page.getByTestId('calendar-page-indicator')).toHaveText('Page 1 / 1');
    await expect(page.getByTestId('calendar-detail-row')).toHaveCount(0);
    await expect(page.getByTestId('calendar-detail-row-blank')).toHaveCount(10);
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });
});
