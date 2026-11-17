# QA-002 — Test Summary Report

**System under test:** Studio Arts website, v10 public-release package  
**Date:** 17 November 2026  
**Test level:** Local static audit and browser functional regression  
**Execution evidence:** User-supplied Playwright terminal output for the final full run

## Execution results

| Metric | Result |
|---|---:|
| Total Playwright executions | 34 |
| Passed | 30 |
| Failed | 0 |
| Intentionally skipped | 4 |
| Duration | 24.4 s |
| Confirmed defects in tested scenarios | 0 |

The four skipped executions were mobile-only navigation tests excluded from the desktop browser project; they ran successfully in the mobile project.

**Browser configurations:** installed Yandex Browser 26.11.0.0 on Windows 11 Pro, desktop viewport 1440×900 and emulated mobile viewport 390×844. Local website served via Python HTTP server at `127.0.0.1:8765`. Playwright configured `reducedMotion: 'reduce'`.

## Covered checks and outcomes

| Area | Verified result |
|---|---|
| Homepage structure | Title, one H1, required sections: passed in both modes |
| Legal pages | `privacy.html`, `terms.html`, `purchases.html` load with one H1 and visible return link: passed |
| Layout | No horizontal document overflow at configured viewports: passed |
| JavaScript | No uncaught homepage errors in the observed test window: passed |
| Project modal | Enter opens; Escape closes and restores focus: passed |
| Modal keyboard focus | Initial focus, Tab containment, Shift+Tab containment: passed |
| Mobile navigation | Open/close, jump to Projects, close after navigation, Escape and focus restoration, outside click: passed |
| Resource loading | No failed homepage requests observed at load: passed |
| Anchor links | Homepage fragment links have existing targets: passed |
| HTML links | `privacy.html`, `terms.html`, `purchases.html` returned successful HTTP responses: passed |

## Findings and disposition

**A11Y-001 — Potential keyboard focus escape from project dialog:** Initial code-review hypothesis. **Not reproduced** in browser tests. Inner modal panel exposes `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. No defect filed. This does not substitute for testing with a screen reader.

**Confirmed defects:** None in the executed scope. This is not a claim that the site has no defects.

## Known gaps and follow-up work

- Real-device testing, additional viewport widths (including 320 px), and other browser engines.
- Screen-reader verification and deeper accessibility assessment.
- Website animation toggle and normal-motion behavior; Playwright currently emulates reduced motion.
- Live-domain HTTPS, response headers, performance/Core Web Vitals, and security review.
- Broader navigation and interaction coverage beyond the current tests.

## Evidence and repeatability

Automated tests are stored in [studio-arts.spec.js](../../tests/studio-arts.spec.js) and [studio-arts-focus.spec.js](../../tests/studio-arts-focus.spec.js). The final run output reported **30 passed, 4 skipped, 0 failed**. The repository configuration references a machine-specific Yandex Browser executable path, which must be adapted before reproducing on another computer.

This is an independently documented QA practice project, not a paid client assignment.
