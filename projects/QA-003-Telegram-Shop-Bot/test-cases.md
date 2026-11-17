# QA-003 — Detailed Test Cases (initial P0/P1 set)

**All statuses: Not Run.** Expected results below are acceptance criteria proposed for QA; where upstream requirements are silent, confirm intended behavior before filing a defect.

## TC-001 — Standard checkout
**Priority:** P0. **Preconditions:** Fresh disposable database, test bot active, test user has empty cart.  
**Steps:** Open /catalog; select a product; add one; open cart; choose Checkout; enter fictional name, phone and address; inspect summary; press Place order; open /orders.  
**Expected:** One order is created for that user; correct total and line item; cart is empty; stock decreases by one; order appears in history.  
**Status:** Not Run.

## TC-002 — Oversell via repeated adds
**Priority:** P0. **Preconditions:** Disposable database with product stock set to 1; test user has empty cart.  
**Steps:** Add the product twice using available UI actions; open cart; attempt checkout with fictional details.  
**Expected:** No successful purchase of quantity greater than stock; stock never negative; clear user feedback.  
**Status:** Not Run.

## TC-003 — Two customers buy last unit
**Priority:** P0. **Preconditions:** Product stock 1; two authorized test users, separate carts, isolated test database.  
**Steps:** Both users add the product; both proceed to confirmation; confirm sequentially or with controlled overlap.  
**Expected:** At most one successful purchase; other customer receives a stock-availability message; stock nonnegative.  
**Status:** Not Run.

## TC-004 — Invalid customer data
**Priority:** P1. **Preconditions:** One item in cart.  
**Steps:** Enter whitespace-only name, malformed phone and whitespace-only address across separate reset runs.  
**Expected:** Invalid delivery details are not accepted silently; validation feedback is clear. Note: upstream README does not specify exact validation rules.  
**Status:** Not Run.

## TC-005 — Cancel at each checkout stage
**Priority:** P1. **Preconditions:** One item in cart.  
**Steps:** Start checkout; cancel with /cancel at name, phone and address stages in separate runs; also test Cancel button at confirmation.  
**Expected:** No order created; cart unchanged; normal menu remains available.  
**Status:** Not Run.

## TC-006 — Cart and history isolation
**Priority:** P0. **Preconditions:** Two authorized test users A and B, fresh database.  
**Steps:** A adds a product and places an order; B opens /cart and /orders.  
**Expected:** B sees neither A's cart contents nor A's order data.  
**Status:** Not Run.

## TC-007 — Repeat confirmation
**Priority:** P0. **Preconditions:** Checkout confirmation message displayed.  
**Steps:** Press Place order twice rapidly and, separately, retry a stale confirmation button.  
**Expected:** No duplicate order or duplicate stock decrement.  
**Status:** Not Run.

## TC-008 — Cart changed after confirmation summary
**Priority:** P0. **Preconditions:** User has two products in cart; checkout confirmation summary displayed.  
**Steps:** Use another bot interaction to change the cart before pressing the original Place order button.  
**Expected:** Confirmed order matches the displayed summary, or checkout requires a refreshed confirmation.  
**Status:** Not Run.

## TC-009 — Persistence across restart
**Priority:** P1. **Preconditions:** One cart and one previously completed order in the disposable database.  
**Steps:** Stop bot; restart against same database; open /cart and /orders.  
**Expected:** Previously committed data remains available to the correct user.  
**Status:** Not Run.

## TC-010 — No bot token
**Priority:** P1. **Preconditions:** Isolated local environment without BOT_TOKEN.  
**Steps:** Start bot process.  
**Expected:** Process exits with a clear configuration error, without printing credentials.  
**Status:** Not Run.

## TC-011 — Price and inventory integrity
**Priority:** P0. **Preconditions:** Known initial price, stock and quantity in test database.  
**Steps:** Place order; inspect order summary and saved order items with a controlled local database viewer.  
**Expected:** Item prices, total and stock changes agree; no negative stock.  
**Status:** Not Run.

## TC-012 — Unexpected input during conversation
**Priority:** P1. **Preconditions:** Checkout at each text-input stage.  
**Steps:** Send sticker/photo, unknown command, and old inline button in separate runs.  
**Expected:** No crash, unintended order, or loss of customer data; user can recover or cancel.  
**Status:** Not Run.
