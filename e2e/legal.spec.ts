import { test, expect } from '@playwright/test';

test.describe('Legal compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('cookie banner appears on first visit', async ({ page }) => {
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await expect(page.getByTestId('cookie-banner-accept')).toBeVisible();
    await expect(page.getByTestId('cookie-banner-reject')).toBeVisible();
    await expect(page.getByTestId('cookie-banner-privacy-link')).toBeVisible();
  });

  test('Accept hides the banner and persists across reload', async ({ page }) => {
    await page.getByTestId('cookie-banner-accept').click();
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
  });

  test('Reject wipes app storage and hides the banner', async ({ page }) => {
    // Plant data the user might have produced (zustand persist writes are lazy on first paint)
    await page.evaluate(() => {
      localStorage.setItem('shit-inventory', '{"state":{"items":[{"id":"x"}]}}');
      localStorage.setItem('shit-messages', '{"state":{"read":{}}}');
    });

    await page.getByTestId('cookie-banner-reject').click();
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);

    const wiped = await page.evaluate(() => ({
      inventory: localStorage.getItem('shit-inventory'),
      messages: localStorage.getItem('shit-messages'),
    }));
    expect(wiped.inventory).toBeNull();
    expect(wiped.messages).toBeNull();

    // Consent record itself must survive so the banner does not re-appear
    const consent = await page.evaluate(() => localStorage.getItem('shit-cookie-consent'));
    expect(consent).not.toBeNull();
    expect(consent).toContain('rejected');
  });

  test('Privacy Policy link in banner navigates to the policy page', async ({ page }) => {
    await page.getByTestId('cookie-banner-privacy-link').click();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByTestId('privacy-storage-table')).toBeVisible();
  });

  test('Footer Privacy Policy link is reachable from any page', async ({ page }) => {
    await page.getByTestId('footer-privacy-link').click();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('Privacy page lists every documented storage key', async ({ page }) => {
    await page.getByTestId('footer-privacy-link').click();

    const expectedKeys = [
      'shit-inventory',
      'shit-messages',
      'shit-messages-settings',
      'shit-messages-history',
      'shit-theme',
      'shit-language',
      'i18nextLng',
    ];
    for (const key of expectedKeys) {
      await expect(page.getByTestId('privacy-storage-table')).toContainText(key);
    }
  });

  test('Privacy page consent controls reflect current decision', async ({ page }) => {
    await page.getByTestId('footer-privacy-link').click();

    await expect(page.getByTestId('consent-status')).toHaveAttribute('data-status', 'undecided');
    await page.getByTestId('privacy-accept').click();
    await expect(page.getByTestId('consent-status')).toHaveAttribute('data-status', 'accepted');

    await page.getByTestId('privacy-reset').click();
    await expect(page.getByTestId('consent-status')).toHaveAttribute('data-status', 'undecided');
  });
});
