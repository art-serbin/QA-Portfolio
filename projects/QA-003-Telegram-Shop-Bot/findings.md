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
**Reproducibility:** Reproduced in two distinct direct SQLite scenarios and an independent pytest regression test. Scenario A: stock 14, cart quantity 15, order created, stock -1. Scenario B: stock 0, cart quantity 1, order created, stock -1.  
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


## Confirmed data-layer defect — BUG-005: Nonexistent product creates hidden cart record

**Severity / priority:** Medium / P2 (provisional)  
**Environment:** Windows 11, Python 3.12.10, isolated SQLite in-memory database  
**Steps:** Initialize database; call `db.add_to_cart(conn, 999999, 999999999, 1)`; inspect raw `cart_items`, `db.get_cart(conn, 999999)`, and `PRAGMA foreign_keys`.  
**Expected:** A nonexistent product ID is rejected and no cart record is persisted.  
**Actual:** Raw `cart_items` contains `{'user_id': 999999, 'product_id': 999999999, 'qty': 1}`, but `get_cart` returns zero visible records; `PRAGMA foreign_keys` is `0`.  
**Source observation:** `add_to_cart` (db.py 97–103) inserts without checking product existence; `get_cart` (db.py 106–112) uses an inner join with products, hiding orphaned rows.  
**Status:** Confirmed at data-layer / Open. **Not verified** as exploitable through normal Telegram UI.  
**Evidence:** User-run isolated Python/SQLite command output on 17 November 2026.

### BUG-005 — Additional reproduction: mixed valid and orphaned cart items

With one real product and one nonexistent product ID in an isolated user's cart: raw `cart_items` count was **2**, visible `get_cart` count **1**; `create_order` created order #1 with **1** order item and cleared **both** cart records (raw cart count 0). This confirms that orphaned rows are silently excluded from the order and removed during checkout. It does **not** establish that normal Telegram UI can create the orphaned row, nor that a buyer paid for an omitted item.

### BUG-005 — Additional reproduction: deleting a product with an existing cart reference

In isolated in-memory SQLite, a real product was added to cart (visible count 1), then deleted directly with `DELETE FROM products WHERE id = ?`. Deletion succeeded; raw `cart_items` retained **1** record but `get_cart` returned **0** visible items. This confirms orphaned cart rows can also result from direct catalog deletion with foreign key enforcement disabled. **Scope limitation:** This was a direct SQL operation; whether the application offers product deletion or a supported admin workflow is not yet established. No separate bug ID assigned.

### BUG-005 — Foreign key configuration evidence (step 38)

SQLite `PRAGMA foreign_key_list(cart_items)` shows a declared `product_id → products.id` foreign key with `NO ACTION`; `PRAGMA foreign_key_list(order_items)` shows `order_id → orders.id` with `NO ACTION`. However, `PRAGMA foreign_keys` returned **0** on the initialized in-memory connection. Thus the relationships are declared but not enforced on that connection, explaining the orphaned cart rows. This evidence does not establish the foreign-key setting for every application connection; verify the connection initialization path separately. Enabling foreign-key enforcement alone does not address BUG-004 overselling.

### BUG-005 — CORRECTION / status changed to Not reproduced in normal application configuration (step 39)

Further source inspection showed that **`db.connect(db_path)` explicitly executes `PRAGMA foreign_keys = ON`** (db.py lines 62–66), and **`bot.get_conn` uses `db.connect(DB_PATH)`** (bot.py lines 56–61). Earlier orphaned-cart reproductions created test connections directly with `sqlite3.connect(':memory:')`, bypassing the application's connection initialization and leaving foreign key enforcement off. **Consequently BUG-005 must not be counted as a confirmed normal-application defect**; the earlier behavior is confirmed only for the nonrepresentative test connection. **Status: Pending retest with `db.connect(':memory:')`; withdrawn from confirmed defect count until reproduced.** Retain the earlier outputs as historical evidence of the testing mistake, not as proof of an application defect.

### BUG-005 — RETEST RESULT / CLOSED (Not reproduced under application connection)

Retested using `conn = db.connect(':memory:')` followed by `db.init_db(conn)`: `PRAGMA foreign_keys` returned **1**; attempting `db.add_to_cart(conn, 999999, 999999999, 1)` raised **`FOREIGN KEY constraint failed`**; raw `cart_items` count was **0**. **Final classification: CLOSED — Not Reproduced in normal application configuration; initial reports were false positives caused by bypassing `db.connect()` in tests.** Retain prior observations as a QA process learning, not an open product defect. BUG-004 remains confirmed and independent of FK enforcement.

### BUG-004 — Representative connection retest (step 41, confirmed)

Retested with the application's own `db.connect(':memory:')` and `db.init_db(conn)`. SQLite foreign keys were **enabled (1)**. Seeded stock was **14**; adding **15** units and calling `db.create_order` created **order #1**, leaving stock **-1**. **FAIL; BUG-004 confirmed under application-equivalent database initialization.** This rules out the earlier foreign-key-disabled test connection as the cause of overselling. Test remained isolated from `shop.db`.

## Confirmed data-layer defect — BUG-006: Fractional quantity accepted and ordered

**Severity / priority:** High / P1 provisional (scope limited to data-layer call; Telegram UI reachability unverified)  
**Environment:** Windows 11, Python 3.12.10, SQLite in-memory via application `db.connect(':memory:')`, `db.init_db(conn)`  
**Steps:** (1) Seed catalog; Aurora Wireless Headphones stock 14. (2) Call `db.add_to_cart(conn, 999999, product_id, 1.5)`. (3) Call `db.create_order(conn, 999999, 'Test User', '1234567890', 'Test Address')`. (4) Query `order_items.qty` and `products.stock`.  
**Expected:** Reject non-integer quantity for a unit-counted product; no fractional order or stock movement.  
**Actual:** Order #1 created with `order_items.qty = 1.5`; stock changed from 14 to 12.5.  
**Evidence:** User-run PowerShell/Python execution, 17 November 2026; reproduced using application connection initializer with FK checks on.  
**Status:** Confirmed at data-layer / Open. **Not demonstrated through Telegram UI**; direct Python API calls may bypass bot-side constraints.  
**Note:** Separate from BUG-004 (overselling): fractional quantities are accepted even with sufficient stock.

### BUG-006 — Schema investigation (step 44)

`PRAGMA table_info` reported `INTEGER NOT NULL` for `cart_items.qty`, `order_items.qty`, and `products.stock`. Ordinary SQLite column affinity does not guarantee rejection of fractional REAL values; the previously observed `1.5` order and `12.5` stock are consistent with this behavior. Storage classes (`typeof(...)`) and any stricter schema constraints still warrant explicit inspection. No source-code fix applied.

### BUG-006 — SQLite storage class verification (step 45)

Using `db.connect(':memory:')`, adding `qty=1.5` and placing an order produced these verified `typeof()` values:

| Column | Declared affinity | Stored value | SQLite typeof |
|---|---|---:|---|
| `cart_items.qty` | INTEGER | 1.5 | real |
| `order_items.qty` | INTEGER | 1.5 | real |
| `products.stock` | INTEGER | 12.5 | real |

This directly confirms that ordinary SQLite INTEGER affinity did not prevent fractional inventory values in this schema. UI exploitability remains untested. No fix applied.

### Monetary precision observation — steps 47–48 (risk, not confirmed user-facing bug)

Using the app's `db.connect(':memory:')`, six units at $99.99 produced `orders.total = 599.9399999999999` with SQLite `typeof(total) = 'real'`. Formatting to two decimals yields `$599.94`; direct equality to `599.94` is false, equality after rounding is true. Inventory decreased from 14 to 8, order quantity was 6, and cart cleared correctly (PASS). **Classification:** floating-point monetary precision risk / observation only; no demonstrated display or payment defect. Recommend integer cents or Decimal for money handling if maintaining the app.

### BUG-004 — Two-user sequential last-item purchase (step 50)

Using `db.connect(':memory:')`, set first product stock to **1**. User IDs `111111` and `222222` each added one unit to their own cart. Sequential calls to `db.create_order` both succeeded (order #1 and #2), resulting in **two orders** and **stock = -1**. **FAIL; confirmed overselling in a multi-customer scenario without concurrency.** This strengthens existing BUG-004, not a separate defect. Test uses direct database API; Telegram UI reachability for this exact sequence is not yet verified.

## BUG-007 — Partial order can be committed after stock-update failure

**Status:** Confirmed at data-layer under fault injection; real Telegram runtime impact not established.  
**Severity / priority:** High / P1 provisional, conditional on reuse/commit of failed connection.  
**Environment:** SQLite in-memory using application `db.connect(':memory:')`, initialized via `db.init_db(conn)`.  
**Reproduction (steps 52–53):** Add 2 units to user cart, create a SQLite `BEFORE UPDATE OF stock ON products` trigger raising `ABORT`, commit setup, then call `db.create_order`. Function raises `IntegrityError` during stock update. Immediately after exception, query returns 1 uncommitted order. Explicit `conn.rollback()` correctly restores 0 orders, cart 2, stock 14 (step 52). In a fresh run, instead call `conn.commit()` after catching exception: **orders=1, order_items=1, cart=2, stock=14** (step 53).

**Expected:** Order creation should be atomic: failed checkout must not leave partially created order records available for later commit.  
**Actual:** Function does not roll back its pending inserts when stock update fails; subsequent caller commit persists incomplete order and item while cart and stock are unchanged.  
**Scope:** Artificial database trigger plus caller commit; not yet shown that Telegram bot's production connection lifecycle commits after such an error. Do not claim user-facing exploitability without that verification.  
**Recommendation:** Enclose order creation in an explicit transaction boundary with rollback on exceptions and stock availability checks; consider SQLite savepoints if callers may already have transactions.

### BUG-007 — Connection close after failure (step 54)

With a temporary on-disk SQLite database and injected stock-update trigger failure, `db.create_order` raised `IntegrityError`. The connection was then **closed without commit or rollback** and reopened via `db.connect(path)`. Observed **orders=0, order_items=0, cart quantity=2**. Closing the connection rolls back uncommitted partial changes; practical severity of BUG-007 depends on whether production code ever commits a failed connection. Contrast with step 53, where an explicit later commit preserved an inconsistent order.

### BUG-007 — Source review of production connection lifecycle

Pinned upstream `bot.py`: `get_conn()` caches **one shared SQLite connection** in `context.application.bot_data['db']` (lines 56–62). `checkout_confirm()` catches only `ValueError` (lines 240–253), not `sqlite3.IntegrityError`. Pinned `db.py` `add_to_cart()` performs `conn.commit()` (lines 97–103). Consequently, a subsequent successful cart operation **could commit** partial changes left by a failed order on the shared connection. This is source-supported risk; end-to-end sequence to be tested, not yet reported as observed.

### BUG-007 — Cross-user follow-on commit (step 55)

In application-style shared in-memory connection, user A (111111) had two units in cart and checkout failed with `IntegrityError` due to injected stock-update trigger. `SELECT COUNT(*) FROM orders` immediately afterward returned **1** (uncommitted partial order). User B (222222) then successfully invoked `db.add_to_cart`, whose implementation commits the shared connection. This demonstrates the follow-on-commit path, but the script closed an **in-memory** database without reopening, so persistence after reconnect is not yet separately demonstrated. Follow up using temporary on-disk DB and reconnect.

### BUG-007 — Persistent cross-user partial order, step 56 (confirmed)

**Environment:** temporary on-disk SQLite database opened with application `db.connect(path)` and `db.init_db(conn)`. User A (`111111`) added two units; a test trigger `BEFORE UPDATE OF stock` raised `ABORT` to simulate stock-update failure during `db.create_order`. After A's `IntegrityError`, user B (`222222`) added one unit using `db.add_to_cart`, which invokes `conn.commit()` on the shared connection. The connection was closed and the file reopened. **Persisted results: orders=1, order_items=1, user A cart=2, user B cart=1, stock=14.** This confirms durable inconsistent order data after a second user's ordinary cart operation commits a failed first user's transaction. **FAIL.** Production bot shares a connection via `get_conn` (bot.py lines 56–62); real failure is injected, not observed in Telegram. **BUG-007: Confirmed at application data-layer; High/P1 provisional** pending end-to-end Telegram reproduction.

### BUG-007 — Persistence after reinitialization (step 57)

After repeating the injected stock-update failure for user A, having user B add an item (committing the shared connection), closing and reopening the temporary on-disk SQLite database, and calling `db.init_db(conn)`, the results remained: **orders=1, order_items=1, user A cart quantity=2**. Thus reinitialization does not repair the inconsistent partial order. This strengthens the persistence evidence for BUG-007; absence of automatic recovery in `init_db` is **not** separately classified as a defect. Testing of this fault-injection scenario is complete.
