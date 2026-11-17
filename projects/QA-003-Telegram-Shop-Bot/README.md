# QA-003 — Telegram Shop Bot QA Audit

**Status:** Planned; source-code review completed, runtime testing not started.  
**Project type:** Independent QA practice, not a paid client engagement.  
**System under test:** [takeyowei/telegram-shop-bot](https://github.com/takeyowei/telegram-shop-bot), pinned upstream commit [d03d7a8c4a85c6ce9ac0bb500823511e92786b4e](https://github.com/takeyowei/telegram-shop-bot/commit/d03d7a8c4a85c6ce9ac0bb500823511e92786b4e) (23 October 2026).

## Objective

Evaluate a Telegram storefront's functional behavior, data integrity, negative scenarios, privacy boundaries and usability. Keep source-review hypotheses separate from reproduced defects.

## Source inspection

Inspected upstream `README.md`, `bot.py`, `db.py`, `tests/test_shop.py`, `.env.example`, and `requirements.txt`.

The application uses Python, python-telegram-bot and SQLite. It provides six seeded demo products, a persistent per-user cart, a name/phone/address checkout flow, order creation, stock decrement, and order history. The source contains five pytest data-layer tests; they have **not** been executed as part of QA-003 yet.

## Planned deliverables

- [Test plan](test-plan.md)
- [Checklist](checklist.md)
- [Detailed test cases](test-cases.md)
- [Source-review risks and finding register](findings.md)
- [Execution report template](test-summary.md)

## Execution status

No live Telegram interaction, database test run or defect reproduction has been performed for QA-003. All test cases are **Not Run** until execution evidence is recorded.

## Safe testing

Use an independently created BotFather test bot and local SQLite database; never reuse a production token or database. Keep `.env` and `*.db` out of version control. Use fictitious customer details and demo stock only. Do not send bulk traffic, probe third-party bot instances, or process real payments. Obtain consent before any test involving external systems.

## Reproduction approach

1. Clone the upstream source at the pinned commit into a separate local folder (do not copy it into this QA portfolio).
2. Create a Python virtual environment and install the upstream `requirements.txt`.
3. Create a dedicated bot using official `@BotFather`; store its token in local `.env` only.
4. Set `DATABASE_PATH` to a local disposable database path **before starting the Python process**.
5. Run the bot locally and execute the checklist, recording actual and expected results.
6. Reset the disposable database between destructive scenarios. Use a second authorized test account only for isolation scenarios.

The source repository's README claims MIT licensing, but no standalone LICENSE file was visible at the inspected revision. Do not assume redistribution rights for the upstream source based solely on that claim.

## Scope limitations

Source-review findings are hypotheses, not confirmed defects. No API, Postman, SQL query training, performance, security penetration, or live-production assessment is claimed here. Those can follow this manual bot QA phase.
