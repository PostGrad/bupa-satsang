# BUPA-Satsang detailed development plan

> Planning deliverable only. Application development and Android/iOS compilation were stopped at the user's request. Do not start any task merely because this document exists.

**Goal:** Give a model with a small context window one bounded task at a time to deliver the complete Android and responsive-web Kitchen module.

**Architecture:** One Expo Router app and one NestJS modular API. PostgreSQL owns authorization, exact expenses, history and idempotency. Native SQLite and browser IndexedDB share an offline protocol. Keycloak brokers Google sign-in.

**Tech stack:** TypeScript, pnpm, light Nx, Expo Router, React Native, NestJS, PostgreSQL, Drizzle, Zod, TanStack Query, React Hook Form, expo-sqlite, Dexie, Keycloak. Use Zustand only if a concrete transient UI state needs it. Standard shadcn/ui is not part of the universal native component layer.

**Spec:** [Architecture](../../specs/2026-09-06-kitchen-architecture.md), [product requirements](../../../planning/2026-09-05-kitchen-proposal.md), [screen journeys](../../../planning/2026-09-06-kitchen-screens.md).

## Start here

1. Read [Execution guide](execution-guide.md), including the partial-checkout baseline.
2. Read [Binding decisions](decisions.md). These settle defaults for this plan without changing confirmed product scope.
3. Keep [Contracts](contracts.md), [Data and API map](data-api.md), and [Test fixtures](test-fixtures.md) available as references. A task names the relevant sections; do not paste the entire pack into each model conversation.
4. Select the first unfinished task whose dependencies are accepted in [Task index](task-index.md). Use the copyable prompt in the execution guide.
5. Implement one card, run its focused checks, review its changes and update [Progress](progress.md). Stop after that card. Batch execution needs a separate explicit instruction.
6. Follow [Acceptance and release gates](acceptance.md). A completed coding task and a production release are different milestones.

This pack replaces the coarse execution tasks in [the earlier delivery plan](../2026-09-06-kitchen-delivery.md). The older document remains design history; do not execute both schedules. All new task IDs belong to this pack. None is marked accepted at planning handoff.

## Product invariants every task inherits

- Kitchen belongs to an event in a community; an event can span multiple days and contain multiple dated meals each day.
- Launch supports Android and responsive web, all five operational roles, up to 200 registered volunteers, English by default and a persistent Gujarati switch.
- Identity is `(issuer, subject)`. Google sign-in does not approve membership. Community administrators grant event roles; operational heads alone cannot grant access.
- All event roles read event/meal/common totals. Both heads and cashier read all bills; shoppers read their own; chef-only access reads no bill details.
- Shopper creates own bills. Shopper edits own bills; kitchen head/cashier correct any bill. Expenses remain editable after meals end, with attributed history.
- Purchases, bills, other expenses and leftovers survive offline saves and later sync. Initial login and event download require internet.
- Money is exact INR decimal strings and integer paise arithmetic. Event total = allocated meal totals + derived common event cost. Bill header totals and allocation rows are not extra expenses.
- Bulk requirement links do not allocate purchased quantity or money. A purchase line contributes once.
- A leftover belongs to a meal-menu-entry ID. Zero differs from no observation; observations are neither inventory nor additive deliveries.
- No uploads, files, payment methods, advances, reimbursements, balances, income, inventory, dish-cost allocation, automatic recipes or WhatsApp integration.
- The source workbook stays unchanged and excluded from Git. Historical import is maintainer-only.
- No Android emulator images or emulator setup. The user will test a physical Android device. No Android/iOS compilation until separately requested. iOS is outside launch scope.
- Google credentials, production domains, release signing and hosting purchases are external inputs. Use local test fixtures, never invented production credentials or fake acceptance.
