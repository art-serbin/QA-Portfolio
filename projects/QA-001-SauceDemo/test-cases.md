# QA-001 — Test cases and execution log

**Application:** https://www.saucedemo.com/  
**Execution date:** 16 November 2026  
**Method:** Manual, user-executed scenarios; screenshot and PDF review.

**Statuses:** Passed = expected result observed in the tested scenario; Partial = incomplete coverage; Observed = behavior recorded without verified requirement; Not Run = not executed.

| ID | Scenario | Status |
|---|---|---|
| TC-001 | Valid user login | Passed |
| TC-002 | Invalid password rejected | Passed |
| TC-003A | Both login fields empty | Passed |
| TC-003B | Password empty | Passed |
| TC-004 | Locked-out user rejected | Passed |
| TC-005 | Inspect catalog contents and layout | Partial |
| TC-005A | Back-to-top navigation | Passed |
| TC-006 | Add Sauce Labs Backpack to cart | Passed |
| TC-007 | View item in cart, quantity 1, price $29.99 | Passed |
| TC-008 | Remove item from cart | Passed |
| TC-009 | Complete checkout with empty cart | Observed |
| TC-010A | Checkout missing first name | Passed |
| TC-010B | Checkout missing last name | Passed |
| TC-010C | Checkout missing postal code | Passed |
| TC-011 | Generate empty-order PDF receipt | Passed |
| TC-012 | Verify nonempty checkout totals | Passed |
| TC-013 | Generate Backpack order PDF receipt | Passed |
| TC-014 | Price sorting | Not Run |
| TC-015 | Verify Add to cart after removing item | Not Run |

## Reproducible scenarios

### TC-002 — Invalid password
**Precondition:** Signed out on login page.  
**Steps:** Enter `standard_user` with an invalid password, click Login.  
**Expected:** Login blocked and informative error.  
**Observed:** `Epic sadface: Username and password do not match any user in this service`. **Passed.**

### TC-004 — Locked account
**Steps:** Enter `locked_out_user` / `secret_sauce`, click Login.  
**Expected:** Login blocked with locked-out notice.  
**Observed:** `Epic sadface: Sorry, this user has been locked out.` **Passed.**

### TC-010A/B/C — Required checkout fields
**Precondition:** Checkout: Your Information.  
**Steps:** Submit with one required field missing (first name, last name, or postal code).  
**Expected:** Corresponding validation message and no progression.  
**Observed:** Matching required-field error for each case. **Passed.**

### TC-012 — Price arithmetic
**Precondition:** Backpack in cart, quantity 1.  
**Steps:** Proceed to checkout overview; compare receipt PDF.  
**Expected:** Consistent displayed values.  
**Observed:** $29.99 item + $2.40 tax = $32.39 total, matching PDF. **Passed.**

## Evidence

Original screenshots and two PDFs were reviewed during the exercise but are **not yet uploaded** here. Environment metadata (browser build, exact viewport) and backend outcomes were not independently verified.
