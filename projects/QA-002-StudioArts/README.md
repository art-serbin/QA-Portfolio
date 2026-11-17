# QA-002 — Studio Arts Website Audit

**Subject:** Studio Arts v10 public release, supplied ZIP `StudioArts_V10_PUBLIC_RELEASE.zip` (9 files).  
**Audit started:** 17 November 2026.  
**Type:** Independent practice audit of a real website. The audit does **not** modify the production site.

## Scope

- Static analysis: HTML structure, links, IDs, images and page metadata.
- Planned browser smoke checks: navigation, mobile menu, project modal, legal pages, overflow, JavaScript errors.
- Planned accessibility, performance and cross-browser extensions.

## Verified static checks

All **four** HTML pages (`index.html`, `privacy.html`, `terms.html`, `purchases.html`) have:
- a non-empty `<title>`;
- exactly one `<h1>`;
- a viewport meta tag;
- no duplicate HTML IDs;
- no broken **local** asset/page links found by the static script;
- no `<img>` elements missing an `alt` attribute.

`robots.txt` and `sitemap.xml` are present. These checks do not establish whether remote URLs or the deployed website work.

## Finding candidate

**A11Y-001 — Modal focus containment:** Source code moves focus to the modal close button and implements a Tab wrap, but does not make background content inert. Depending on DOM order and focus sequence, keyboard users may be able to tab into page controls behind the open dialog. **Status: code-review hypothesis; browser reproduction required.**

## Browser execution status

**BLOCKED — not executed.** Chromium is installed in the audit environment, but local HTTP and `file://` navigation returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. No browser assertions are marked passed. The Playwright suite is prepared for execution on a local machine or CI runner.

## Reproduce

1. Extract the supplied public-release ZIP into a folder, e.g. `site/`.
2. From the repository root, run `npm install` and `npx playwright install chromium`.
3. Start the site with `python -m http.server 8765 --directory site`.
4. In a second terminal, run `npm test`.

See [test plan](test-plan.md) and [Playwright smoke suite](../../tests/studio-arts.spec.js).

**Limitations:** This is a source-package audit. It does not prove live production behavior, legal compliance, security posture, or visual correctness.
