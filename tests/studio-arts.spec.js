const { test, expect } = require('@playwright/test');

const legalPages = ['privacy.html', 'terms.html', 'purchases.html'];

test('homepage has title, one H1 and main sections', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Studio Arts/);
  await expect(page.locator('h1')).toHaveCount(1);
  for (const id of ['experience', 'projects', 'documents', 'contact']) {
    await expect(page.locator('#' + id)).toHaveCount(1);
  }
});

for (const path of legalPages) {
  test('legal page loads: ' + path, async ({ page }) => {
    await page.goto('/' + path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a[href="index.html#documents"]').first()).toBeVisible();
  });
}

test('no horizontal document overflow', async ({ page }) => {
  await page.goto('/index.html');
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('no uncaught JavaScript errors on homepage', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/index.html');
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('project modal opens and closes by Escape', async ({ page }) => {
  await page.goto('/index.html');
  const card = page.locator('.project-card').first();
  await card.focus();
  await page.keyboard.press('Enter');
  const modal = page.locator('#projectModal');
  await expect(modal).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(card).toBeFocused();
});

test('mobile navigation details toggles', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only scenario');
  await page.goto('/index.html');
  const menu = page.locator('#mobileNav');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.locator('nav a').first().click();
  await expect(menu).not.toHaveAttribute('open', '');
});
