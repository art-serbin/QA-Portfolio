# QA-003 — Test Checklist

**Execution status: all items Not Run.** Check boxes only after actual verification. The checklist has **54 planned checks**.

## Startup and commands (6)
- [ ] CL-001 — /start displays welcome and menu
- [ ] CL-002 — /help lists supported commands
- [ ] CL-003 — /catalog opens catalog
- [ ] CL-004 — /cart reports empty cart for new user
- [ ] CL-005 — /orders reports no orders for new user
- [ ] CL-006 — Unknown command or arbitrary text is handled appropriately

## Catalog (6)
- [ ] CL-007 — Six demo products are listed
- [ ] CL-008 — Product details show name, description, price, stock
- [ ] CL-009 — Catalog/product/back navigation works
- [ ] CL-010 — Out-of-stock product cannot be added from current product view
- [ ] CL-011 — Missing product ID is handled without crashing
- [ ] CL-012 — Long product text renders acceptably

## Cart (8)
- [ ] CL-013 — Add one item
- [ ] CL-014 — Repeated add increases quantity
- [ ] CL-015 — Add multiple distinct items
- [ ] CL-016 — Cart total matches unit prices and quantities
- [ ] CL-017 — Cart survives restart
- [ ] CL-018 — Two users' carts remain isolated
- [ ] CL-019 — Cart quantity exceeding stock is rejected or handled
- [ ] CL-020 — Cart works via command and inline button

## Checkout (10)
- [ ] CL-021 — Valid checkout completes
- [ ] CL-022 — Empty-cart checkout cannot create an order
- [ ] CL-023 — Whitespace-only name is rejected or flagged
- [ ] CL-024 — Invalid phone is rejected or flagged
- [ ] CL-025 — Empty/very long address is handled
- [ ] CL-026 — /cancel during name step
- [ ] CL-027 — /cancel during phone step
- [ ] CL-028 — /cancel during address step
- [ ] CL-029 — Cancel button at confirmation
- [ ] CL-030 — Confirmation summary matches intended order

## Orders and data (6)
- [ ] CL-031 — New order appears in history
- [ ] CL-032 — Cart clears after successful order
- [ ] CL-033 — Stock decrements by purchased quantity
- [ ] CL-034 — Order line-item prices and total agree
- [ ] CL-035 — Other users cannot access the first user's order history through normal bot flows
- [ ] CL-036 — Order history survives restart

## Negative and state transitions (7)
- [ ] CL-037 — Repeated Place order does not create duplicates
- [ ] CL-038 — Old inline buttons behave safely
- [ ] CL-039 — New commands during checkout are handled predictably
- [ ] CL-040 — Cart change after summary cannot silently change confirmed order
- [ ] CL-041 — Two users buying the last unit do not oversell
- [ ] CL-042 — Non-text message during checkout is handled
- [ ] CL-043 — Rapid repeated button presses are handled

## UX and clients (5)
- [ ] CL-044 — Errors are understandable and actionable
- [ ] CL-045 — Telegram Desktop flow
- [ ] CL-046 — Telegram Android flow
- [ ] CL-047 — Long messages/buttons are usable
- [ ] CL-048 — Return to main menu works

## Reliability and configuration (4)
- [ ] CL-049 — Missing BOT_TOKEN fails safely
- [ ] CL-050 — Repeated database initialization does not duplicate products
- [ ] CL-051 — Bot restarts without losing committed cart/order data
- [ ] CL-052 — Database error is handled and reported safely

## Additional boundaries (2)
- [ ] CL-053 — Invalid product callback does not corrupt cart or crash handler
- [ ] CL-054 — Customer data is not disclosed in logs or shared to another chat

**Reporting:** Failed results require a defect reference and evidence. Do not mark a test Passed based only on code inspection.
