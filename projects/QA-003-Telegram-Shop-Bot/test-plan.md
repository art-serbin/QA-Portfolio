# QA-003 — Test Plan

**SUT:** Telegram Shop Bot, upstream commit `d03d7a8c4a85c6ce9ac0bb500823511e92786b4e`.  
**Date prepared:** 17 November 2026.  
**Current status:** Planning; no runtime execution.

## Goals

Validate that customers can browse the catalog, manage carts, place orders, and view their own order history without incorrect totals, overselling, unexpected state transitions or cross-user disclosure.

## Test environment

- Windows 11 Pro; local Python process using upstream dependencies.
- Dedicated Telegram bot token issued through official BotFather.
- Separate disposable SQLite file, seeded with six demo products.
- Telegram Desktop and Android client where available; second test account for user isolation.
- Use only fictional customer information; no real payment integration exists in this codebase.

## Priority

- **P0:** Inventory integrity, checkout correctness, cross-user data separation.
- **P1:** Commands, cart totals, validation, cancellation, persistence and state handling.
- **P2:** Message presentation, navigation, client-specific usability.

## Scope

1. Bot startup, commands and menus.
2. Catalog, product details, out-of-stock behavior.
3. Cart quantity, totals, persistence, per-user isolation.
4. Checkout steps, cancellation, invalid inputs, confirmation.
5. Orders, stock changes, historical records.
6. Stale buttons, unexpected messages and repeated actions.
7. Telegram Desktop/Android usability.
8. Configuration and database recovery.

## Entry criteria

- Pinned source is available and dependency installation succeeds.
- Dedicated test token and local database are configured.
- No production data or real customer identities are used.
- A reproducible database reset procedure is available.

## Exit criteria

- All P0 scenarios executed or explicitly marked Blocked with reason.
- Results for every executed case recorded as Passed / Failed / Blocked / Not Run.
- Every Failed result has evidence and steps to reproduce.
- Critical defects are retested after fixes if a fix is supplied.
- Final report states scope, limitations, and remaining risks.

## Evidence

Record date, commit, client, test account label (not private identifier), database baseline, expected/actual outcome, screenshot or sanitized log, and defect reference. Avoid exposing bot tokens, chat IDs, actual phone numbers, and customer information.

## Out of scope for initial phase

Payment processing (not implemented), production deployment, mass-load tests, penetration testing, formal accessibility certification, and Postman/API/SQL training. Database integrity may be validated with controlled local checks as part of QA, but does not imply completed SQL coursework.

See [checklist](checklist.md), [test cases](test-cases.md), [findings](findings.md) and [test summary](test-summary.md).
