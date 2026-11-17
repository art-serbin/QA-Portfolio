# QA Portfolio — Art Serbin

**Manual QA · Test Design · Functional Testing · Exploratory Testing · Bug Reporting**

A collection of independently documented software quality assurance practice projects. Results are evidence-based, and incomplete or unverified work is clearly labeled. These projects are **not paid client engagements**.

## Projects

| Project | Focus | Status |
|---|---|---|
| [QA-001 · SauceDemo](projects/QA-001-SauceDemo/README.md) | Login, cart, checkout, PDF receipts | Documented |
| QA-002 · Website audit | Functional, responsive, code review, smoke automation | Planned |

### QA-001 — SauceDemo

19 scenarios tracked: **15 Passed**, **1 Partial**, **1 Observed**, **2 Not Run**.

- Valid/invalid authentication, locked user, cart operations, checkout validation.
- Backpack $29.99 + tax $2.40 = $32.39, consistent with generated receipt.
- Empty-cart checkout completion documented as a **behavior requiring specification clarification**, not a confirmed defect.
- One mobile error-message clipping observation pending reproduction.

[Case study](projects/QA-001-SauceDemo/README.md) · [Test cases](projects/QA-001-SauceDemo/test-cases.md) · [Findings](projects/QA-001-SauceDemo/findings.md) · [Test summary](projects/QA-001-SauceDemo/test-summary.md)

## QA principles

- Distinguish observed behavior from confirmed defects.
- Record scope, evidence, assumptions and test limitations.
- Do not claim tests were performed without execution evidence.
- Keep public materials free of confidential information.

## Tools and roadmap

**Used in QA-001:** manual browser workflows, screenshot inspection, PDF receipt comparison.

**Planned:** API testing, Playwright automation, cross-browser checks and code review. These are not yet claimed as completed portfolio skills.

## About

Independent QA practice alongside software development projects. The portfolio is maintained for professional learning and freelance work.
