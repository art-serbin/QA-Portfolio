# QA-003 — Telegram Shop Bot: Checkout and Data Integrity QA

**Status:** Testing cycle complete; defects documented, not fixed.  
**Project type:** Independent QA practice, not a paid client engagement.  
**System under test:** [takeyowei/telegram-shop-bot](https://github.com/takeyowei/telegram-shop-bot) at pinned [commit d03d7a8](https://github.com/takeyowei/telegram-shop-bot/commit/d03d7a8c4a85c6ce9ac0bb500823511e92786b4e).  
**Environment:** Windows 11, Python 3.12.10, SQLite, pytest, Telegram Web, mocked Python handlers.

## Objective

Assess the reliability of a Telegram storefront's product catalog, cart, checkout, stock accounting, order history, input validation and error recovery. Focus on business-impacting defects and distinguish actual Telegram behavior from isolated database and mocked-handler reproductions.

## Results at a glance

| Metric | Result |
|---|---|
| Upstream pytest tests | 5 passed / 0 failed |
| Local stock-limit regression | 1 expected failure (overselling reproduced) |
| Numbered QA workflow steps | 108 (not 108 independent test cases) |
| Confirmed defects | 9 (with evidence scope noted in each report) |
| Additional tracked issues | Requirements-dependent, candidate or closed; see findings |
| Production readiness | Not recommended without remediation and regression testing |

## Three representative findings

1. **[BUG-007 — Partial order after failed stock update](findings.md):** A simulated stock-update failure leaves an uncommitted order. A second user's ordinary cart operation commits that partial order through the shared SQLite connection. Verified again after reopening an on-disk database. **High/P1 provisional; injected failure, not a live Telegram incident.**
2. **[BUG-004 — Overselling and negative inventory](findings.md):** Order creation allows quantity greater than available stock (14 available, 15 ordered, stock becomes -1). Reproduced using the real data layer. **High/P1 provisional.**
3. **[BUG-008 — Changed price after customer confirmation](findings.md):** Displayed checkout total of $99.99 can become a recorded order total of $199.99 after a catalog price update, without reconfirmation in the inspected flow. **High/P1 provisional; database/source-level verification.**

## Test approach

- **Manual Telegram Web smoke:** /start, catalog, cart, checkout, order history.
- **SQLite data-layer checks:** stock, cart isolation, quantity constraints, order totals and persistence.
- **Mocked Telegram handlers:** empty checkout fields, state transitions, personal-data reuse and error responses.
- **Fault injection:** forced database failures to examine transaction consistency and recovery.
- **Source inspection:** pinned `bot.py` and `db.py` to verify whether reproduced SQL behaviors are reachable in the application.

## Deliverables

- [Test plan](test-plan.md)
- [Checklist](checklist.md)
- [Detailed test cases](test-cases.md)
- [Findings and reproduction evidence](findings.md)
- [Final test summary and defect disposition](test-summary.md)

## Key recommendations

Prioritize stock validation and atomic rollback-safe order transactions, then preserve or reconfirm checkout price/quantity before order creation. Add customer-input validation and graceful database error handling. Decide on historical product-name retention and checkout personal-data lifecycle based on requirements.

## Boundaries and ethics

The test environment used demo data and a dedicated test bot; no production systems, real customer information or payments were involved. Most negative tests were **not** performed against the Telegram API. Some scenarios intentionally injected faults, and the historical-product-name issue is a schema limitation rather than a demonstrated /orders UI failure. The original 54-check plan and 12 detailed test cases were not fully executed as a formal suite. No fixes to upstream source are claimed.
