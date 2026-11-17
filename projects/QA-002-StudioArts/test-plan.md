# QA-002 — Test plan

**Build:** Studio Arts v10 PUBLIC_RELEASE, supplied 17 Nov 2026.  
**Priority:** P0 navigation and document accessibility; P1 mobile behavior, project dialogs, reduced-motion; P2 polish and performance.

| ID | Check | Type | Current result |
|---|---|---|---|
| ST-001 | Four HTML pages have titles and one H1 | Static | Passed |
| ST-002 | Local links/assets resolve | Static | Passed |
| ST-003 | No duplicate IDs or missing image alt | Static | Passed |
| ST-004 | Homepage sections and document links navigate | Browser | Blocked |
| ST-005 | Mobile menu opens and closes | Browser | Blocked |
| ST-006 | Project dialog opens, closes, restores focus | Browser | Blocked |
| ST-007 | Modal traps keyboard focus | Accessibility | Needs reproduction |
| ST-008 | No horizontal overflow at 320/390/1440 px | Browser | Blocked |
| ST-009 | No uncaught JavaScript errors | Browser | Blocked |
| ST-010 | Reduced-motion mode works | Browser | Blocked |
| ST-011 | HTTPS and headers on deployed domain | Live security | Not run |
| ST-012 | Core Web Vitals | Performance | Not run |

**Test environment:** Static Python/BeautifulSoup inspection completed. Chromium browser launch attempted; navigation blocked by execution environment administrator. Browser, performance, and security results must not be inferred from source inspection.

**Acceptance:** Record actual pass/fail per browser and attach screenshots or traces for failures; confirm intended behavior before filing defects.
