# QA-001 — Test summary report

**Application:** SauceDemo  
**Date:** 16 November 2026  
**Type:** Independent educational manual QA exercise; not a commissioned audit.

## Execution results

| Status | Count |
|---|---:|
| Passed | 15 |
| Partial | 1 |
| Observed, no verified acceptance rule | 1 |
| Not Run | 2 |
| **Total** | **19** |

## Covered

Authentication (valid, invalid, locked account, missing fields); catalog spot-check; cart add/view/remove; checkout required-field validation; empty checkout behavior; nonempty checkout totals; generated PDF review.

## Results

- Authentication and cart flows behaved as expected in tested cases.
- Required-field validation blocked incomplete checkout information.
- Backpack: $29.99 subtotal + $2.40 tax = $32.39; the generated receipt matched.
- Empty checkout generated a $0.00 completion and PDF. Whether this is a defect is unknown.
- A long mobile error message appeared clipped in one screenshot.

## Open findings

Two **candidates**, not confirmed requirement violations: mobile error rendering; empty-cart order completion.

## Coverage limitations

No backend or API access; no automation; no complete browser/device matrix; no accessibility, performance or security assessment; no full product requirements; original binary evidence not yet published.

## Recommendation

Do not infer general release readiness from this limited exercise. Reproduce the UI issue, clarify empty-cart acceptance criteria, and expand regression coverage.
