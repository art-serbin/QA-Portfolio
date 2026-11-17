# QA-001 — SauceDemo

Independent manual QA practice project (16 November 2026). This is not a client engagement.

## Scope
Authentication, shopping cart, checkout validation, PDF receipt review.

## Execution summary
19 scenarios tracked: 15 passed, 1 partially inspected, 1 observed without an acceptance rule, 2 not run.

## Key observations
- Valid/invalid authentication and cart interactions behaved as expected in the observed runs.
- Backpack checkout: item $29.99, tax $2.40, total $32.39, matching the generated PDF.
- Empty-cart checkout completed with $0.00 total and generated a PDF. This is **not** a confirmed defect without requirements.
- A long access-error message appeared clipped in one Android screenshot; reproducibility remains unverified.

## Limitations
User-executed browser testing, screenshots and PDF review. No backend verification, API tests, browser matrix, automated tests, or formal product requirements. Original screenshot/PDF evidence has not yet been published to this repository.

See [test cases](test-cases.md), [findings](findings.md), and [test summary](test-summary.md).
