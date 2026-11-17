const { test, expect } = require('@playwright/test');

test('keyboard focus stays inside project modal', async ({ page }) => {
  await page.goto('/index.html');

  const card = page.locator('.project-card').first();
  await card.focus();
  await page.keyboard.press('Enter');

  const modal = page.locator('#projectModal');
  await expect(modal).toBeVisible();

  const focusableCount = await modal.locator(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ).count();

  expect(focusableCount).toBeGreaterThan(0);

  for (let i = 0; i < focusableCount + 3; i++) {
    await page.keyboard.press('Tab');

    const focusInside = await modal.evaluate(element =>
      element.contains(document.activeElement)
    );

    expect(
      focusInside,
      `Focus escaped the modal after Tab press ${i + 1}`
    ).toBe(true);
  }
});
