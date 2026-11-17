# QA-002 — Test Plan

**Build:** Studio Arts v10 PUBLIC_RELEASE, supplied 17 Nov 2026.  
**Priority:** P0 navigation and legal-page access; P1 mobile behavior, dialogs and keyboard access; P2 motion, performance and visual polish.  
**Environment:** Windows 11 Pro, locally installed Yandex Browser 26.11.0.0; Playwright desktop 1440×900 and emulated mobile 390×844; Python local HTTP server.

| ID | Check | Type | Result / scope |
|---|---|---|---|
| ST-001 | Four HTML pages: title and one H1 | Static | Passed |
| ST-002 | Local links and assets in static audit | Static | Passed |
| ST-003 | Duplicate IDs and missing image alt | Static | Passed |
| ST-004 | Homepage sections and HTML document availability | Browser | Passed at configured viewports |
| ST-005 | Mobile menu opens, navigates and closes (link, Escape, outside click) | Browser | Passed in mobile emulation; desktop skipped as intended |
| ST-006 | Project dialog opens, closes and restores focus | Browser | Passed in both modes |
| ST-007 | Initial focus, Tab and Shift+Tab containment | Accessibility / browser | Passed in both modes; screen reader not tested |
| ST-008 | No horizontal overflow | Browser | Passed at 390 and 1440 px; 320 px not tested |
| ST-009 | No uncaught homepage JavaScript errors | Browser | Passed in observed window |
| ST-010 | Site animation toggle / normal-motion behavior | Browser | Not run; reduced-motion emulation configured |
| ST-011 | HTTPS and headers on deployed domain | Live security | Not run |
| ST-012 | Core Web Vitals | Performance | Not run |
| ST-013 | Homepage resource request failures | Browser | Passed at load in both modes |
| ST-014 | Homepage anchor targets | Browser | Passed in both modes |
| ST-015 | Internal HTML links return successful responses | Browser | Passed in both modes |

## Final execution

**34 executions: 30 passed, 4 intentionally skipped, 0 failed (24.4 s).** The four skips were mobile-only scenarios in the desktop project.

The earlier A11Y-001 focus-escape hypothesis was not reproduced; do not report it as a confirmed defect.

## Acceptance and reporting

Only executed scenarios receive pass/fail results. Record failures with reproduction steps, expected and actual behavior, environment, and evidence before filing a defect. Source inspection and browser emulation do not establish live-site, physical-device, security, legal-compliance, or complete accessibility outcomes.

See [test summary](test-summary.md).
