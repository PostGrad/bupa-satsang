# BUPA-Satsang: discovery and stack assessment

Date: 2026-09-05. Status: initial assessment for discussion.

Follow-up: the actual workbook and the user's Ravisabha process have now been reviewed. See [cashbook workflow and mapping](2026-09-05-cashbook-workflow.md) for the current evidence and expense-only scope. The repository findings below are unchanged; the original open questions are narrowed at the end.

## Scope and evidence

BUPA means Baal-Yuva Pravrutti Anand. The requested product is an Android and web app for Anand Satsang Community. An event belongs to the shared platform; Kitchen is its first functional module. Future modules are outside the first release.

The BUPA-Satsang workspace was empty and was not a Git repository at review time. Two source repositories were fetched into temporary review directories. No repository contained a `.codegraph` directory. No application code was changed or executed.

| Source | Reviewed revision / access | Findings |
| --- | --- | --- |
| [ravisabha-menu](https://github.com/PostGrad/ravisabha-menu/tree/ccedc60221ae07e2e8bc15179e694fdc421518bb) | `ccedc60221ae07e2e8bc15179e694fdc421518bb`, 2025-12-25 | React 18, Vite 4, JavaScript, DaisyUI, Zustand. Event list/form/detail screens and categorized expenses. |
| [bupa-kitchen](https://github.com/PostGrad/bupa-kitchen/tree/1a471b82f50ff60bec5af3588bc8f0b48ebee7fa) | `1a471b82f50ff60bec5af3588bc8f0b48ebee7fa`, 2025-12-28 | README, architecture decisions, initial SQL migration. Describes Go backend, PostgreSQL, recipes per 100 people, expense tracking and legacy imports. No executable backend or frontend implementation in this snapshot. |
| [satsang-event-backend](https://github.com/priyank-vithani/satsang-event-backend) | Review skipped at user request | Initial retrieval required authentication. The user describes it as a simple backend API repository and has explicitly excluded it from further review. |
| [Deployed prototype](https://ravisabha-menu.vercel.app/) | Read-only browser inspection | Event list and event detail screen opened. Displays menu, attendance, host, received amount and vegetable expense entry. Visible deployed fields differ from the fetched source; deployment commit is unverified. No records submitted or changed. |

## What to preserve

- Event context: date, location, menu, expected/actual attendance and responsible people.
- Familiar ingredient names and categories, including Gujarati transliterations. Validate these against current Sheets before importing.
- Fast item/quantity/unit/amount entry and categorised expense totals.
- The bupa-kitchen principles: server-owned decisions, exact decimal calculations, transaction safety and auditable history.
- Deterministic recipes and headcount-based estimation, if this is needed for the first pilot.

## What requires replacement or redesign

In [AppStore.js](https://github.com/PostGrad/ravisabha-menu/blob/ccedc60221ae07e2e8bc15179e694fdc421518bb/src/data/AppStore.js), the store starts with imported data, hardcodes a logged-in user and persists the store in browser storage. The API fetch helpers have definitions but no call sites in the reviewed source. This is a workflow prototype, not demonstrated multiuser persistence or IAM. Monetary totals use `parseFloat`; replace these with exact server calculations.

In [init.sql](https://github.com/PostGrad/bupa-kitchen/blob/1a471b82f50ff60bec5af3588bc8f0b48ebee7fa/migrations/init.sql), each user has one global role. This cannot represent a volunteer who manages Kitchen for one event and only views another. Deleting an event cascades to expenses, and the migration includes a development administrator seed with a placeholder password hash. Do not carry either behaviour into production. The schema has useful numeric constraints, but no implemented correction history, recipe versions or event memberships. File attachments are excluded by the user's requirements and are not a gap to implement.

Recommendation: reuse domain vocabulary and validated behaviour from the reviewed projects; build the shared platform deliberately. The third repository is excluded by user decision and is not a dependency for planning or implementation.

## Stack assessment

These are recommendations, not approved decisions. “TX” in the brief is interpreted as TypeScript/TSX.

| Choice | Benefits for this product | Costs / limits | Recommendation |
| --- | --- | --- | --- |
| React Native + Expo + TypeScript | Android support; shared language and code with web; platform routing and build tooling | Native dependency compatibility, device QA and release management remain necessary; shared code does not guarantee good desktop UX | Keep. Prove the hardest item-entry forms, tables and offline bill synchronisation on Android and web early. [Expo Router](https://docs.expo.dev/router/introduction/) |
| One Expo application for Android and web | Fewer screens to maintain; appropriate for a small volunteer team | Complex keyboard-driven tables, printing and bulk editing may require web-specific components | Provisional default when mobile tasks dominate. Expo supports [platform-specific files](https://docs.expo.dev/router/advanced/platform-specific-modules/). |
| Separate React web application | DOM components, shadcn/ui and desktop workflows fit naturally | Two UI implementations and more regression work | Prefer if replacing Sheets requires extensive desktop editing. Share contracts, query hooks and domain helpers, not every screen. |
| TanStack Query | Server fetching, caching and invalidation across clients | Native focus/network signals need wiring; persistence is not a complete offline synchronisation design | Keep for server state. [Native integration](https://tanstack.com/query/latest/docs/framework/react/react-native) |
| Zustand | Small, simple shared client state | Can accidentally become a second database or hold stale copies of Query data | Optional; use for filters, selected event and client preferences only. [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction) |
| shadcn/ui | Customisable source-owned web components | Standard components use web primitives; copying them does not create native Android UI. Owning copied code also means maintaining it | Use in a separate web app or web-specific components. Select native UI separately. [Button source and usage](https://ui.shadcn.com/docs/components/base/button) |
| Node.js + TypeScript | One language across clients/API; suitable for this transactional application | TypeScript types disappear at runtime; CPU-heavy imports should leave the request path | Keep; runtime validation and exact decimals are mandatory. Pin a supported [Node LTS](https://nodejs.org/en/about/previous-releases). |
| NestJS | Modules, dependency injection and guards give future contributors structure | More conventions and boilerplate than a small Fastify service | Provisional API choice. A small Fastify service is viable if the maintainer prefers less framework. [NestJS](https://docs.nestjs.com/) |
| PostgreSQL | Relationships, constraints, transactions and exact numeric values match events and expenses | Requires migration discipline, backups and operational ownership | Keep. [Numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html) |
| Drizzle | TypeScript schema and SQL-like access fit explicit domain rules | SQL knowledge and migration review remain necessary | Provisional data-access choice; validate numeric mapping and transactions. [Drizzle](https://orm.drizzle.team/docs/overview) |
| Nx monorepo | Shared packages, task orchestration and enforceable module boundaries | Tooling overhead and Expo plugin version constraints | Keep Nx light with pnpm workspaces. Do not add packages solely to make a large-looking architecture. [Nx Expo compatibility](https://nx.dev/docs/technologies/react/expo/introduction), [Expo monorepos](https://docs.expo.dev/guides/monorepos/) |

Do not assume the newest independent versions of Expo, React Native, React and Nx are compatible. At implementation time, select a supported combination and prove Android and web builds in CI before building features. Exact package versions are intentionally not selected by this discovery document.

## Three delivery approaches

1. **Provisional recommendation: universal Expo client + Node API + PostgreSQL.** Best initial maintenance budget when volunteer workflows are mostly forms, lists and a few reports. Start with shared screens and use platform-specific components where justified.
2. **Expo Android + React/Vite web + shared Node API.** Best when coordinators need dense tables, keyboard workflows, print layouts and bulk editing. More frontend work, but clearer platform fit. No demonstrated need for web server rendering in this internal application.
3. **Responsive web/PWA first, Android second.** Fastest way to validate replacement of Sheets. It delays the explicitly requested native Android deliverable, so adopt only if the user prioritises an earlier web pilot.

Backend recommendation across the first two approaches: one modular application and one database. Future modules can have clear service boundaries without separate deployments. Avoid microservices, a generic plugin engine and a general-purpose workflow builder in v1.

## Decisions to resolve through brainstorming

Updated 2026-09-06. Confirmed requirements:

1. All five roles use the app at launch. Ravisabha head supplies menu/count; kitchen head prepares requirements; purchasers record itemwise bills; kitchen head or cashier adds other expenses; chef or kitchen head records leftover prepared dishes.
2. Expense tracking only, with a final total and breakups. No fund accounts, carry-over, advances, reimbursements or payment tracking.
3. No inventory. Leftovers belong to a specific menu entry in a dated meal, and do not become stock for another meal/event.
4. Purchases, bills, other expenses and dish leftovers must work offline and automatically sync when connectivity returns. See the proposal for app lifecycle and conflict handling.
5. Gmail-based login is interpreted as Sign in with Google and Google account recovery. Keycloak is the working identity choice; see [authentication options](2026-09-05-auth-options.md).
6. English is the default UI language, with a Gujarati switch.
7. Home opens the current or upcoming assigned event with role-specific shortcuts; if several events fit, show an event chooser.

Bill entry starts from the shopping list with actual quantities/amounts and extra items allowed. See [screen journeys](2026-09-06-kitchen-screens.md).

Leftovers use quantity and a suitable dish unit, such as kg, litres, pieces or vessels.

Expense visibility: all five roles see event totals; both heads and cashier see all bills; shoppers see their own bills.

Including after the meal, shoppers edit their own bills and kitchen head/cashier can correct any bill, with change history. There is no expense finalise/reopen workflow.

Designated community administrators manage volunteer access and all event roles at launch. An existing volunteer can hold this additional permission.

Confirmed expense breakups: category, item, bill and shopping volunteer, respecting bill visibility. Dish-cost allocation is outside launch scope.

Keycloak is the working identity choice. The [architecture](../superpowers/specs/2026-09-06-kitchen-architecture.md) and [delivery plan](../superpowers/plans/2026-09-06-kitchen-delivery.md) propose native/web storage, sync and task boundaries; operator, distribution and delivery availability remain execution inputs. Multi-day, multi-meal events are confirmed for launch, with separate dated meals, menus/headcounts and leftovers. Per-meal costs use explicit allocations with unallocated common event costs; bulk purchases are recorded once. Automatic recipe estimation remains outside launch scope. Home behaviour, UI languages, expense-only scope and offline purchases/bills/other expenses/leftovers are no longer open questions.

The workbook's 37 sheets have now been inventoried and representative structures/formula relationships inspected. This establishes a migration map, not a completed financial audit or data import. The third repository has been excluded at the user's request; no further access is required.
