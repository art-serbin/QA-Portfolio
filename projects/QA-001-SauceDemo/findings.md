# QA-001 — Findings and bug candidates

These findings are **not confirmed product defects** without reproduction and/or documented acceptance criteria.

## BUG-001 — Long access error clipped on Android

- **Category:** UI / responsive
- **Status:** Visually observed once; reproduction pending
- **Tentative severity:** Minor
- **Scenario:** Unauthenticated navigation to checkout
- **Observed:** Long error message appears clipped or extends beyond its container on mobile.
- **Expected:** Error text remains fully visible and readable.
- **Next checks:** Repeat at several viewport widths; record browser/version; capture a new screenshot.

## BUG-002 — Empty cart can complete checkout

- **Category:** Business logic hypothesis
- **Status:** Behavior reproduced; requirement violation unconfirmed
- **Scenario:** Log in → open empty cart → Checkout → complete customer information → Continue → Finish → generate PDF.
- **Observed:** Checkout completed with item total $0.00, tax $0.00, total $0.00 and a zero-value PDF.
- **Expected (hypothesis only):** Empty checkout should be blocked **if** business requirements prohibit empty orders.
- **Next checks:** Clarify intended demo behavior and whether orders are persisted.

## Additional observations

- **OBS-003:** Large vertical gaps in mobile catalog cards; responsive requirements unknown.
- **OBS-004:** Generated PDFs lacked order ID and explicit item quantity; mandatory receipt fields not established.
- **OBS-005:** An initial checkout navigation redirected to login; after logging in again, checkout worked. Session state or expiry may explain this.

## Triage rule

A surprising behavior is not automatically a bug. Reproduction, requirements and user impact determine final classification and priority.
