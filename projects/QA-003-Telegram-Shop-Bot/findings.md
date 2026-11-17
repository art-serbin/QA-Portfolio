# QA-003 — Source Review Risks and Finding Register

**Evidence type:** Static source inspection only. **No confirmed runtime defects.** Priorities below are *proposed* pending reproduction and product requirements.

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

No BUG-XXX records exist yet. Do not convert RISK entries into confirmed bugs without execution evidence.
