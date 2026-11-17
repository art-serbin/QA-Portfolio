# QA Portfolio — Art Serbin

**Manual QA · Test Design · Functional Testing · Exploratory Testing · Browser Automation · Bug Reporting**

A collection of independently documented software quality assurance practice projects. Results are evidence-based, and incomplete or unverified work is clearly labeled. These projects are **not paid client engagements**.

## Projects

| Project | Focus | Status |
|---|---|---|
| [QA-001 · SauceDemo](projects/QA-001-SauceDemo/README.md) | Login, cart, checkout, PDF receipts | Documented |
| [QA-002 · Studio Arts](projects/QA-002-StudioArts/README.md) | Static HTML audit and Playwright browser regression | Executed: 30 passed, 4 intentionally skipped, 0 failed |
| [QA-003 · Telegram Shop Bot](projects/QA-003-Telegram-Shop-Bot/README.md) | Telegram bot source review and planned functional QA | Planning: 54 checks, 12 test cases; not executed |

### QA-001 — SauceDemo

19 scenarios tracked: **15 Passed**, **1 Partial**, **1 Observed**, **2 Not Run**.

- Valid/invalid authentication, locked user, cart operations, checkout validation.
- Backpack $29.99 + tax $2.40 = $32.39, consistent with generated receipt.
- Empty-cart checkout completion documented as a **behavior requiring specification clarification**, not a confirmed defect.
- One mobile error-message clipping observation pending reproduction.

[Case study](projects/QA-001-SauceDemo/README.md) · [Test cases](projects/QA-001-SauceDemo/test-cases.md) · [Findings](projects/QA-001-SauceDemo/findings.md) · [Test summary](projects/QA-001-SauceDemo/test-summary.md)

### QA-002 — Studio Arts

Local audit of the Studio Arts v10 release package, followed by Playwright checks in installed Yandex Browser (desktop 1440×900 and emulated mobile 390×844).

**Final run: 34 executions — 30 passed, 4 intentionally skipped, 0 failed.** Checked navigation, legal pages, project dialogs, keyboard focus, links, resource loading, JavaScript errors and layout overflow at the configured viewports. No defects were confirmed in the tested scenarios. Cross-browser, real-device, full screen-reader, live security and performance checks remain outside the executed scope.

[Case study](projects/QA-002-StudioArts/README.md) · [Test plan](projects/QA-002-StudioArts/test-plan.md) · [Test summary](projects/QA-002-StudioArts/test-summary.md) · [Browser tests](tests/studio-arts.spec.js) · [Focus tests](tests/studio-arts-focus.spec.js)

### QA-003 — Telegram Shop Bot

QA plan for a local, isolated Telegram storefront test bot. Source review identified eight **unconfirmed risk hypotheses**. [Case study](projects/QA-003-Telegram-Shop-Bot/README.md) · [Test plan](projects/QA-003-Telegram-Shop-Bot/test-plan.md) · [Checklist](projects/QA-003-Telegram-Shop-Bot/checklist.md) · [Test cases](projects/QA-003-Telegram-Shop-Bot/test-cases.md) · [Findings](projects/QA-003-Telegram-Shop-Bot/findings.md)

## QA principles

- Distinguish observed behavior from confirmed defects.
- Record scope, evidence, assumptions and test limitations.
- Do not claim tests were performed without execution evidence.
- Keep public materials free of confidential information.

## Tools and roadmap

**QA-001:** Manual browser workflows, screenshot inspection, PDF receipt comparison.

**QA-002:** Static source audit; Playwright Test with installed Yandex Browser on Windows 11 Pro. The current Playwright configuration includes a machine-specific browser executable path and should be adapted for other machines. **Planned:** API testing, cross-browser coverage, deeper accessibility and performance checks.

## About

Independent QA practice alongside software development projects. The portfolio is maintained for professional learning and freelance work.
