import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('main page has no critical violations', async ({ page }) => {
    await page.goto('/');

    interface AxeResults {
      violations: Array<{
        impact: 'critical' | 'serious' | 'moderate' | 'minor';
      }>;
    }

    const results = await page.evaluate<AxeResults>(() => {
      return new Promise<AxeResults>((resolve) => {
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
        script.onload = () => {
          void (window as typeof window & { axe: { run: () => Promise<AxeResults> } }).axe
            .run()
            .then(resolve);
        };
        document.head.appendChild(script);
      });
    });

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    expect(violations).toEqual([]);
  });
});
