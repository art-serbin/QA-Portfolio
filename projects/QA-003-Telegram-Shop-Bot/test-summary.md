# QA-003 — Test Summary (in progress)

**System:** Telegram Shop Bot; source review pinned to upstream commit `d03d7a8c4a85c6ce9ac0bb500823511e92786b4e`  
**Execution date:** 17 November 2026  
**Status:** IN PROGRESS; not a final acceptance assessment

| Metric | Observed |
|---|---:|
| Planned checklist checks | 54 |
| Initial detailed test cases | 12 |
| Existing upstream pytest tests | 5 passed / 0 failed (0.15 s) |
| New local overselling regression test | 0 passed / 1 failed as expected (0.13 s) |
| Confirmed business-logic defects | 1 (BUG-004) |
| Checkout validation behaviors pending requirements | 3 (BUG-001 to BUG-003, Needs clarification) |

## Execution evidence

- **Windows 11 / Python 3.12.10 / pytest 9.2.0:** Original `python -m pytest -v` ran five upstream tests, all passed.
- **Isolated SQLite in-memory test:** Seeded 14 Aurora Wireless Headphones, added 15 to cart, `create_order` succeeded and stock became -1. Independent local `tests/test_stock_limit.py` failed with `Failed: DID NOT RAISE ValueError`. The regression test is local to the third-party clone and not yet published in this portfolio.
- **Telegram Web manual smoke and checkout:** `/start`, catalog (6 products), Aurora item details ($99.99, stock 14), cart, checkout, order placement and order history worked. Order #1 showed $299.97 and status `new`.
- **Input validation:** Checkout accepted `123456789` as name, `abcdef` as phone and `.` as address, and allowed final order creation. Whether these violate documented requirements remains to be established.
- **Sequential duplicate-order check (PASS):** In a separate in-memory SQLite database, first `create_order` created order #1; immediate second call raised `ValueError: cart is empty`; one order persisted, stock fell from 14 to 13. This does not establish concurrent-request safety.
- **Zero-stock overselling check (FAIL):** In-memory database with stock set to 0; adding one item and placing order succeeded, leaving stock -1. This is a second reproduction of BUG-004, not a separate bug.
- **Repeat purchase after completed order (PASS):** In-memory database, same user added and purchased one unit twice in sequence; two distinct orders (#1, #2) created and stock fell from 14 to 12. This is a permitted new purchase, not a duplicate retry.
- **Negative cart quantity (PASS at data-integrity layer):** `db.add_to_cart(..., qty=-1)` raised SQLite `IntegrityError: CHECK constraint failed: qty > 0`; cart stayed empty and stock remained 14. Graceful application-level error handling has not been verified.
- **Zero cart quantity (PASS at data-integrity layer):** `db.add_to_cart(..., qty=0)` raised SQLite `IntegrityError: CHECK constraint failed: qty > 0`; cart remained empty and stock stayed 14. Application-level error messaging not tested.
- **Nonexistent product ID (Needs investigation):** `db.add_to_cart(conn, 999999, 999999999, 1)` returned without an exception, but `get_cart` remained empty and product count remained 6. No phantom cart item observed; whether silent handling is intended requires code review.
- **Connectivity:** Telegram API became inaccessible after VPN failure. This is an environmental interruption, not an application bug.

## Current assessment

**BUG-004 (confirmed, open):** Order creation does not enforce available stock and can produce negative inventory. Business impact is high; provisional P1. Existing passing upstream tests do not cover this negative scenario.

Other source-review risks remain unverified. The full 54-item checklist and 12 detailed cases have **not** been completed; do not interpret the five passing upstream tests as an overall pass.

## Next actions

Preserve the regression test and output as evidence, review additional negative order scenarios, update checklist/case execution status, and verify validation requirements before final severity classification. No production or third-party service was modified during the isolated stock test.
