import { expect, test } from '@playwright/test';

test('renders the English shell and persists the Gujarati selection', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole('heading', { name: 'BUPA-Satsang' })).toBeVisible();
  await expect(page.getByText('Welcome to the kitchen workspace')).toBeVisible();

  await page.getByRole('radio', { name: 'Gujarati' }).click();
  await expect(page.getByRole('radio', { name: 'ગુજરાતી' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'ગુજરાતી' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('heading', { name: 'બુપા સત્સંગ' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'બુપા સત્સંગ' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'ગુજરાતી' })).toBeChecked();

  await page.setViewportSize({ width: 325, height: 700 });
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.body.scrollWidth
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);
});
