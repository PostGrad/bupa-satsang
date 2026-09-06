# BUPA-Satsang planning

Updated 2026-09-06. This workspace currently contains specifications and the source workbook; application implementation has not started.

## Read first

1. [Kitchen architecture](superpowers/specs/2026-09-06-kitchen-architecture.md): proposed stack, data model, permissions, offline behavior and hosting.
2. [Delivery and foundation plan](superpowers/plans/2026-09-06-kitchen-delivery.md): full release sequence and detailed first-slice tasks.
3. [Screen journeys](planning/2026-09-06-kitchen-screens.md): volunteer workflows and accepted screen choices.

The architecture distinguishes confirmed product choices from proposed implementation defaults. The plan is reviewable work, not a claim that any build, test, migration or deployment has run.

## Current decisions

- Multi-day events with multiple dated meals; separate menu, headcount and leftovers per meal.
- Android and web, English by default with a Gujarati switch; all five kitchen roles at launch.
- Current/upcoming assigned event opens first; an event chooser handles multiple matches.
- Shopping-list-led bill entry with actual quantities/amounts and unplanned items.
- Expense tracking only; category, item, bill and shopper breakups respect bill visibility. Per-meal allocations plus common event costs reconcile to the event total.
- All roles see event/meal totals and the common-cost aggregate; both heads/cashier see all bills; shoppers see their own bills.
- Shoppers edit their own bills; kitchen head/cashier can correct any bill. Changes retain history, also after the meal.
- Quantity/unit leftovers per dish occurrence in a specific meal; purchases, bills, other expenses and leftovers work offline and sync automatically.
- Community administrators grant access and event roles.
- Keycloak with Google sign-in is the working identity choice, on the proposed Netcup VPS subject to operational validation.

No inventory, files, advances, reimbursements, cashbook balances, payment tracking or dish-cost allocation is included.

## Supporting evidence

- [Product specification and roadmap](planning/2026-09-05-kitchen-proposal.md)
- [Workbook/process mapping](planning/2026-09-05-cashbook-workflow.md)
- [Repository and stack assessment](planning/2026-09-05-discovery.md)
- [Authentication and hosting comparison](planning/2026-09-05-auth-options.md), retaining its dated price checks

The supplied workbook remains unchanged. Historical cashbook fields describe past practice and do not reintroduce excluded features.
