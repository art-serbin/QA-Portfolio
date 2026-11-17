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

test('mobile navigation opens project section and closes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'yandex-mobile',
    'Mobile navigation is tested only in mobile mode');

  await page.goto('/index.html');

  const menu = page.locator('#mobileNav');
  const toggle = menu.locator('summary');
  const projectsLink = menu.locator('a[href="#projects"]');

  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');

  await projectsLink.click();

  await expect(page).toHaveURL(/#projects$/);
  await expect(menu).not.toHaveAttribute('open');

  await expect(page.locator('#projects')).toBeInViewport({
    ratio: 0.1
  });

  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
});

test('mobile menu closes by Escape and restores focus', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'yandex-mobile',
    'Mobile-only test');

  await page.goto('/index.html');

  const menu = page.locator('#mobileNav');
  const toggle = menu.locator('summary');

  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');

  await page.keyboard.press('Escape');

  await expect(menu).not.toHaveAttribute('open');
  await expect(toggle).toBeFocused();
});

test('mobile menu closes when clicking outside', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'yandex-mobile',
    'Mobile-only test');

  await page.goto('/index.html');

  const menu = page.locator('#mobileNav');
  const toggle = menu.locator('summary');

  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');

  await page.locator('#heroTitle').click();

  await expect(menu).not.toHaveAttribute('open');

  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
});

test('homepage loads without failed local resources', async ({ page }) => {
  const failures = [];

  page.on('response', response => {
    if (response.status() >= 400) {
      failures.push({
        status: response.status(),
        url: response.url()
      });
    }
  });

  page.on('requestfailed', request => {
    failures.push({
      error: request.failure()?.errorText,
      url: request.url()
    });
  });

  await page.goto('/index.html', {
    waitUntil: 'networkidle'
  });

  console.log('RESOURCE FAILURES:', failures);

  expect(failures).toEqual([]);
});

test('all homepage anchor links have valid targets', async ({ page }) => {
  await page.goto('/index.html');

  const brokenLinks = await page.locator('a[href^="#"]').evaluateAll(links => {
    return links
      .filter(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return false;

        const id = decodeURIComponent(href.slice(1));
        return !document.getElementById(id);
      })
      .map(link => ({
        text: link.textContent.trim(),
        href: link.getAttribute('href')
      }));
  });

  console.log('BROKEN ANCHOR LINKS:', brokenLinks);

  expect(brokenLinks).toEqual([]);
});

test('internal HTML links open successfully', async ({ page }) => {
  await page.goto('/index.html');

  const links = await page.locator('a[href]').evaluateAll(elements =>
    [...new Set(elements
      .map(a => a.getAttribute('href'))
      .filter(href =>
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !/^(https?:)?\/\//i.test(href) &&
        /\.html(?:[?#]|$)/i.test(href)
      ))]
  );

  const failures = [];

  for (const href of links) {
    const url = new URL(href, page.url()).href;
    const response = await page.request.get(url);

    if (!response.ok()) {
      failures.push({
        href,
        status: response.status()
      });
    }
  }

  console.log('HTML LINKS CHECKED:', links);
  console.log('FAILED HTML LINKS:', failures);

  expect(failures).toEqual([]);
});
