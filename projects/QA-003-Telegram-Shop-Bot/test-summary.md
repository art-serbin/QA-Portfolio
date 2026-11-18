# QA-003 — Final Test Summary

**System:** Telegram Shop Bot (TechNest); upstream `takeyowei/telegram-shop-bot`, pinned commit `d03d7a8c4a85c6ce9ac0bb500823511e92786b4e`.  
**Testing period:** November 2026; final review 18 November 2026.  
**Environment:** Windows 11, Python 3.12.10, SQLite, mocked Telegram handlers, Telegram Web smoke testing.  
**Status:** **Testing cycle closed — NOT accepted for production without remediation**. The numbered workflow reached **step 108**, which is a workflow step count, **not 108 independently executed test cases**.

## Scope and execution

- Original upstream pytest suite: **5 passed, 0 failed**; limited coverage and not evidence of production readiness.
- Local overselling regression: **1 expected failure** (no stock exception), reproducing BUG-004.
- Telegram Web smoke: /start, catalog, product details, cart, checkout and order history worked in a manual test. Subsequent Telegram API connectivity was unavailable; most negative tests used SQLite directly or mocked handlers, **not live Telegram**.
- Additional isolated tests covered stock limits, invalid inputs, checkout state, price changes, duplicate sequential requests, database error injection, and historical order retention. Not all originally planned 54 checklist checks / 12 detailed cases were executed as a complete formal suite.

## Findings and disposition

| ID | Finding | Final classification | Priority |
|---|---|---|---|
| BUG-001 | Numeric-only customer name accepted | Observed; requirements-dependent | To clarify |
| BUG-002 | Alphabetic phone number accepted | Observed; requirements-dependent | To clarify |
| BUG-003 | Single-dot address accepted | Observed; requirements-dependent | To clarify |
| BUG-004 | Overselling and negative stock | **Confirmed data-layer defect** | High / P1 provisional |
| BUG-005 | Nonexistent product without FK enforcement | **Closed — test setup false positive** | — |
| BUG-006 | Fractional quantity accepted and deducted from stock | **Confirmed data-layer defect** | Medium / P2 provisional |
| BUG-007 | Partial order persisted after injected stock-update failure and subsequent shared-connection commit | **Confirmed under injected failure** | High / P1 provisional |
| BUG-008 | Order price can change after user sees confirmation | **Confirmed code/data-layer discrepancy** | High / P1 provisional |
| BUG-009 | Cart quantity changes between confirmation and order | Candidate; UI reachability unverified | To clarify |
| BUG-010 | Negative catalog price produces negative order total | Candidate; requires direct SQL mutation | To clarify |
| BUG-011 | Text catalog price raises TypeError | Candidate; requires direct SQL mutation | To clarify |
| BUG-012 | Oversized checkout confirmation exceeds Telegram 4096-character text limit | **Confirmed constructed-message limit violation** | Medium / P2 provisional |
| BUG-013 | Whitespace-only customer name accepted | **Confirmed handler/data-layer defect** | Low / P3 |
| BUG-014 | Whitespace-only phone accepted | **Confirmed handler/data-layer defect** | Medium / P2 provisional |
| BUG-015 | Whitespace-only address accepted | **Confirmed handler/data-layer defect** | Medium / P2 provisional |
| BUG-016 | Sequential double confirmation creates duplicate order | **Closed — not reproduced** | — |
| BUG-017 | Personal data retained after cancel/order/start | Observed retention; **no reuse/leak demonstrated** | Low / P3 candidate |
| BUG-018 | Unhandled SQLite OperationalError during checkout | **Confirmed under injected failure** | Medium / P2 provisional |
| BUG-019 | Product name lost from detailed historical records after product deletion | **Confirmed schema limitation; not a visible /orders defect** | Low / P3 provisional |

**Confirmed findings:** BUG-004, 006, 007, 008, 012, 013, 014, 015, 018 (9), with the explicit evidence boundaries above. BUG-019 is a verified historical-data limitation but not counted as a confirmed defect of the current /orders UI. Other IDs remain candidates, requirements-dependent, or closed. **Do not equate 19 tracked IDs with 19 confirmed bugs.**

## Final checks (steps 95–108)

- **95–96:** Sequential confirmation creates only one order; second attempt reports empty cart; stock remains correct. BUG-016 closed.
- **97–102:** Cancel and successful checkout retain name/phone/address in `context.user_data`; subsequent checkout starts with old data still present, but entering new details overwrites all fields and confirmation contains no old values. BUG-017 remains a retention concern, not demonstrated data leakage.
- **103–104:** Injected `sqlite3.OperationalError('database is locked')` escapes `checkout_confirm()` without user-facing failure message. In a separate pre-write failure test, cart and stock remain intact and a manual retry succeeds (one order, final stock 12 from 14). BUG-018 confirmed as handler error-handling gap, not an observed live database lock.
- **105:** Historical order total and line-item price remain 99.99 after catalog price changes to 999.99. PASS.
- **106–108:** After deleting a catalog product, order and line item persist, but product name cannot be recovered from `order_items`; INNER JOIN with `products` drops that line. Pinned `bot.py` `show_orders()` shows only ID/total/status/date, so the current Telegram order summary is **not proven broken**. BUG-019 classified as historical-data design limitation.

## Recommended remediation order

1. **P1:** Prevent negative inventory and overselling (BUG-004); implement atomic transactions with rollback on all failures (BUG-007); lock/reconfirm checkout prices and quantities (BUG-008, evaluate BUG-009).
2. **P2:** Validate customer fields and lengths (BUG-012, 014, 015, with 013); handle database failures gracefully (BUG-018); enforce integral positive quantities (BUG-006).
3. **Design / requirements:** Decide whether to snapshot historical product names (BUG-019), how long to retain checkout PII (BUG-017), and acceptable name/phone/address formats (BUG-001–003). Investigate negative/text price mutations (BUG-010–011) only if catalog editing permits them.
4. **Regression:** Re-run full tests after fixes; add integration coverage for checkout transactions, catalog mutations, and Telegram error responses. Live Telegram behavior remains a verification gap.

## Outcome

**QA cycle complete; defects documented, not fixed.** This is a test report for a third-party open-source project. No claims of production deployment, live payments, or end-to-end reproduction of injected failures. Full reproducible details are in [findings.md](findings.md).
