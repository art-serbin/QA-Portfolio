# QA-003 — Source Review Risks and Finding Register

**Evidence type:** Static source inspection plus manual Telegram Web and isolated SQLite/pytest execution on 17 November 2026. Confirmed behavior is distinguished from requirement-dependent findings. Priorities for remaining risks are proposed.

| ID | Priority candidate | Source observation | Potential impact | Verification |
|---|---|---|---|---|
| RISK-001 | P0 | `db.create_order` subtracts stock without checking available quantity; schema has no nonnegative stock constraint | Negative inventory / overselling | TC-002, TC-003, TC-011 |
| RISK-002 | P1 | `checkout_name`, `checkout_phone`, `checkout_address` strip text but do not validate its meaning | Undeliverable orders / unusable contact details | TC-004 |
| RISK-003 | P0 | Checkout summary reads cart, then `create_order` reads cart again at confirmation | Order could differ from the summary if cart changes | TC-008 |
| RISK-004 | P0 | Stock update has no conditional `stock >= qty` guard | Concurrent/competing buyers may oversell | TC-003 |
| RISK-005 | P1 | No explicit idempotency key for Place order | Retry behavior must be tested; Telegram conversation handling may mitigate | TC-007 |
| RISK-006 | P1 | `add_to_cart` does not validate stock or product existence in its data-layer function | Excess quantities / integrity exceptions under stale or crafted callbacks | TC-002, CL-053 |
| RISK-007 | P2 | Single SQLite connection cached in application bot_data | Assess lifecycle and error recovery; not proof of a concurrency defect | CL-052 |
| RISK-008 | P1 | Customer name, phone and address stored in SQLite | Data-handling and log exposure require review | CL-054 |

## Defect classification

- **Hypothesis:** A concern derived from code, not reproduced.
- **Confirmed:** Reproduced in the controlled environment with steps and evidence.
- **Needs clarification:** Expected behavior is not specified by upstream documentation.
- **Not reproduced:** Tested scenario did not demonstrate the proposed issue.

## Bug report template

**ID:** BUG-XXX  
**Title:**  
**Severity / priority:**  
**Build / upstream commit:**  
**Environment / Telegram client:**  
**Preconditions / database baseline:**  
**Steps to reproduce:**  
**Expected result:**  
**Actual result:**  
**Reproducibility:**  
**Evidence:** Sanitized screenshots, logs or database snapshot reference  
**Status:** New / Needs clarification / Retest / Closed

## Confirmed defect — BUG-004: Overselling creates negative inventory

**Severity / priority:** High (business-impacting; final classification depends on product context) / P1  
**Build:** Tested local clone of `takeyowei/telegram-shop-bot`; original reviewed upstream commit `d03d7a8c4a85c6ce9ac0bb500823511e92786b4e`  
**Environment:** Windows 11, Python 3.12.10, pytest 9.2.0, SQLite in-memory database  
**Preconditions:** Seeded catalog, Aurora Wireless Headphones with stock 14; isolated database, not live shop.db  
**Steps:** (1) Initialize in-memory SQLite using `db.init_db(conn)`. (2) Add quantity `stock + 1` (15) to a test user's cart via `db.add_to_cart`. (3) Call `db.create_order`. (4) Query `products.stock`.  
**Expected:** Insufficient-stock order is rejected and stock remains 14.  
**Actual:** `Order created: 1`; `Stock after: -1`.  
**Reproducibility:** Reproduced in one direct execution and an independent pytest regression test.  
**Automated evidence:** Local `tests/test_stock_limit.py::test_order_cannot_exceed_available_stock` fails as expected: `Failed: DID NOT RAISE ValueError` (0.13 s). The test expects `ValueError` and unchanged inventory. Test currently exists in local third-party clone; not yet committed to this portfolio.  
**Root-cause observation:** `db.py` `create_order` subtracts stock without checking availability (around lines 132–149).  
**Status:** Confirmed / Open.  
**Note:** RISK-001 and RISK-004 overlap this confirmed scenario; concurrency itself remains untested.

## Manual Telegram Web findings — validation (requirement clarification)

On 17 November 2026, using a locally operated test bot, checkout accepted customer name `123456789`, phone `abcdef`, and delivery address `.`; the user then placed order #1 successfully. These are **reproduced behaviors** but their classification as defects and severity require upstream input-validation requirements. Track as BUG-001 (numeric-only name), BUG-002 (non-phone text accepted), BUG-003 (one-character address accepted), **Needs clarification**. Do not imply that upstream explicitly promised specific validation rules.

## Executed test evidence

- Original `python -m pytest -v`: **5 passed in 0.15 s** (catalog seed, idempotent init, cart/total, normal order/stock decrement, empty-cart rejection).
- Telegram Web: `/start`, catalog, item detail, add to cart, checkout, place order, and order history exercised successfully; order #1 total $299.97 for three $99.99 headphones, status `new`.
- Telegram API connectivity was interrupted when VPN failed; network error is not a confirmed application defect.

