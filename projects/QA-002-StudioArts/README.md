# QA-002 — Studio Arts Website Audit

**Subject:** Studio Arts v10 public-release package (`StudioArts_V10_PUBLIC_RELEASE.zip`, 9 files).  
**Audit date:** 17 November 2026.  
**Type:** Independent QA practice on a real website project; not a paid client engagement.  
**Scope:** Local release-package audit; production website was not modified.

## Scope and methods

- Static inspection of four HTML pages, local references, IDs, image alt attributes, and metadata.
- Playwright browser checks in locally installed Yandex Browser (Chromium-based), desktop 1440×900 and emulated mobile 390×844.
- Functional navigation, project modal behavior, keyboard focus, legal-page loading, viewport overflow, JavaScript errors, resource requests, and link targets.

## Results

**Final local regression run: 34 executions — 30 passed, 4 intentionally skipped, 0 failed (24.4 seconds).**

Four skips were desktop executions of mobile-only scenarios. No defects were confirmed in the executed scenarios.

Static inspection previously passed for all four HTML pages (`index.html`, `privacy.html`, `terms.html`, `purchases.html`): nonempty titles, one H1 per page, viewport metadata, no duplicate IDs, no broken local asset/page references in the static inspection, and image alt attributes present. `robots.txt` and `sitemap.xml` were present.

Browser checks passed for:
- Homepage title, single H1, and expected sections.
- Legal pages and internal HTML document availability.
- No horizontal overflow at the two configured viewports.
- No uncaught homepage JavaScript errors during the tested interval.
- Project modal opening with Enter, closing with Escape, and focus restoration.
- Modal initial focus and forward/reverse Tab containment.
- Mobile navigation toggle, section navigation, Escape/focus restoration, and outside-click closing.
- No observed failed network requests during homepage load.
- No broken homepage anchor targets.

### Accessibility hypothesis

**A11Y-001 (focus escaping the modal)** was a source-review hypothesis, **not a confirmed defect**. Browser tests for initial focus, Tab, and Shift+Tab passed in both configured modes. The dialog's inner panel has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. The outer `#projectModal` container is not itself the dialog element. No full screen-reader audit was performed.

## Environment and reproduction

- Windows 11 Pro; Yandex Browser 26.11.0.0, using its installed executable.
- Playwright Test; local Python HTTP server at `http://127.0.0.1:8765`.
- The repository's `playwright.config.js` currently contains a machine-specific Yandex Browser executable path. Adjust it for another computer.
- Browser projects use reduced-motion emulation, but the site's own animation-toggle functionality has **not** been separately verified.

From the repository root, with the Studio Arts site files available locally:

```powershell
npm install
python -m http.server 8765 --bind 127.0.0.1 --directory "E:\QA_Studio\01_учебные_проекты\QA-002_StudioArts\site"
```

Keep the server running. In another terminal:

```powershell
npx playwright test tests/studio-arts.spec.js tests/studio-arts-focus.spec.js --reporter=list --workers=1
```

The example site directory is local to the original test machine; replace it with your extracted release path.

## Limitations

Results apply to the tested local release, browser version, viewports, and scenarios. Mobile testing used browser emulation, not a physical device. No Firefox/WebKit cross-browser execution, full assistive-technology audit, production HTTPS/header assessment, Core Web Vitals measurement, or security penetration test was performed. The HTTP resource check covered requests triggered by homepage loading, not every possible user interaction. Passing tests do not establish legal compliance or defect-free software.

## Project materials

- [Test plan](test-plan.md)
- [Test summary](test-summary.md)
- [Functional smoke suite](../../tests/studio-arts.spec.js)
- [Modal focus checks](../../tests/studio-arts-focus.spec.js)
