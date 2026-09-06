# BUPA-Satsang Kitchen Delivery and Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the agreed Android and web kitchen workflows, beginning with a working authenticated, authorized offline bill flow.

**Architecture:** One Expo client, one modular Node API and PostgreSQL, with Google sign-in through Keycloak. SQLite on Android and IndexedDB on web hold durable records/outboxes; the API owns permissions, exact totals and replay-safe writes.

**Tech Stack:** TypeScript, pnpm, light Nx, Expo Router, NestJS, PostgreSQL/Drizzle, Keycloak, TanStack Query, SQLite, Dexie, Zod, React Hook Form; narrowly scoped Zustand if needed.

**Spec:** [Kitchen architecture](../specs/2026-09-06-kitchen-architecture.md), with [product decisions](../../planning/2026-09-05-kitchen-proposal.md) and [screens](../../planning/2026-09-06-kitchen-screens.md).

**Status:** Reviewable build plan, 2026-09-06. No listed implementation command has been run. The workspace currently contains planning documents and the supplied workbook, not a scaffolded application. The architecture's explicitly proposed defaults remain proposals. This document provides the whole delivery sequence and detailed tasks for the first vertical slice; subsequent slices get their own detailed plans after foundation findings are incorporated.

## Global constraints

- The first release serves at most 200 registered volunteers on Android and responsive web.
- An event may span one or multiple days and contains multiple dated meals.
- English is the default, with a persistent Gujarati switch.
- Expenses remain editable after the meal, with attributed history.
- There is no financial approval or finalise/reopen workflow.
- Purchases, bills, other expenses and leftovers work offline after an authenticated event download.
- Google handles volunteer sign-in and account recovery through Keycloak.
- Use maintained stable releases, pin the resolved versions and commit the lockfile.
- Do not combine independently newest Expo, React and React Native versions.
- Do not silently merge accounts based on email.
- No cascading deletion of financial history.
- Report both event and per-meal expenses; explicit allocations plus common event costs reconcile to the event total.

Implementation must also preserve the exclusions and complete role matrix in the spec. Do not add uploads, reimbursement, inventory, dish-cost allocation or future modules during these tasks. No production purchase, credential provisioning or public release is performed by writing this plan.

## Delivery sequence and dependencies

| Slice | Deliverable | Main files/directories | Exit evidence |
| --- | --- | --- | --- |
| A. Foundation | Authenticated event access, bilingual shell and offline bill create/correct/sync | Detailed tasks below | One bill survives restart and a lost sync acknowledgement on Android and web; no unauthorized read/write |
| B. Expenses | Complete shopping-list form, unplanned items, other expenses, void/history and reports | `apps/api/src/kitchen/{bills,other-expenses,reports}/`, `apps/client/src/features/{shopping,expenses}/` | INR 160 bill + INR 40 other expense = INR 200 in every complete breakup; shopper detail remains INR 160 |
| C. Kitchen planning | Dated meal schedule, per-meal menu/headcount, consolidated requirements, task assignment and offline leftovers | `apps/api/src/kitchen/{planning,leftovers}/`, `apps/client/src/features/{menu,requirements,leftovers}/` | All five roles complete a multi-day event; same-dish leftovers stay separate between meals |
| D. Migration and pilot | Maintainer import, operational deployment rehearsal, real-device trial | `tools/migration/`, `infra/`, `tests/load/`, `docs/operations/` | Known workbook event totals reconcile; duplicate import creates no extra expenses; backup restore and sync burst pass |
| E. Release | Signed Android artifact, web deployment and cutover | `.github/workflows/release.yml`, `docs/operations/release.md` | Distribution/install verified; no unsynced pilot bills missing; named operator can recover services |

Slice A establishes interfaces used by B and C. B and C both precede the operational pilot. Historical migration can be omitted from initial live cutover only by an explicit product decision; its expense-only mapping is already researched. Do not repeat review of the excluded third repository.

## File ownership and dependency boundaries

| Path | Responsibility |
| --- | --- |
| `packages/contracts/src/bill.ts` | Runtime schemas and DTOs for bill payloads |
| `packages/contracts/src/mutation.ts` | Mutation envelopes, base revisions and result codes |
| `packages/domain/src/money.ts` | Exact decimal-string/paise conversions and sums |
| `packages/domain/src/access.ts` | Pure event-role decisions shared as vocabulary; server enforcement is mandatory |
| `packages/database/src/schema/` | Application tables and constraints |
| `apps/api/src/auth/` | Keycloak verification and web sessions |
| `apps/api/src/access/` | Active membership lookup and scoped authorization |
| `apps/api/src/kitchen/bills/` | Bill writes, corrections and audit |
| `apps/api/src/sync/` | Receipt/idempotency orchestration and consistent authorized snapshots |
| `packages/local-store/src/` | Native/web adapters with one transactional contract |
| `packages/sync/src/` | Queue ordering, retry, conflict and snapshot application |
| `apps/client/src/features/` | Form/screen composition without direct SQL or HTTP in presentation components |
| `infra/keycloak/` | Environment-neutral realm/client configuration, never live credentials |

## Shared interfaces for Slice A

The following is the contract to implement in Task 2. Runtime schemas validate it; TypeScript alone is insufficient. UUID strings below are generated record IDs, not example production identities.

```ts
export type Id = string;
export type Money = string; // normalized nonnegative INR, exactly two decimals
export type Role = 'ravisabha_head' | 'kitchen_head' | 'shopper' | 'chef' | 'cashier';
export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'packet' | 'vessel';
export interface MealAllocation { mealId: Id; amount: Money }
export interface BillLine {
  id: Id;
  itemId: Id | null;
  requirementIds: Id[]; // zero or more source requirements in this event
  description: string;
  quantity: string;
  unit: Unit;
  amount: Money;
  category: string;
  allocations: MealAllocation[]; // remainder is common event cost
}
export interface BillPayload {
  purchaserId: Id;
  purchasedOn: string; // valid ISO calendar date YYYY-MM-DD
  vendor: string | null;
  reference: string | null;
  lines: BillLine[];
}
export type Base =
  | { kind: 'absent' }
  | { kind: 'version'; value: number }
  | { kind: 'mutation'; mutationId: Id };
export interface BillMutation {
  schemaVersion: 1;
  mutationId: Id;
  eventId: Id;
  entityId: Id;
  kind: 'bill.create' | 'bill.update';
  base: Base;
  payload: BillPayload;
}
export interface BillRecord {
  id: Id;
  eventId: Id;
  version: number;
  payload: BillPayload;
  total: Money;
  voided: boolean;
}
export type PushResult =
  | { status: 'accepted'; mutationId: Id; eventRevision: number; record: BillRecord }
  | { status: 'conflict'; mutationId: Id; current: BillRecord }
  | { status: 'rejected'; mutationId: Id;
      code: 'VALIDATION' | 'FORBIDDEN' | 'ID_REUSED' | 'DEPENDENCY_REQUIRED' };
export interface EventDetails {
  id: Id;
  startDate: string;
  endDate: string;
  timeZone: string;
}
export interface Meal {
  id: Id;
  eventId: Id;
  version: number;
  servesOn: string;
  servingTime: string | null;
  kind: string;
  label: string;
  plannedHeadcount: number | null;
  status: 'planned' | 'completed' | 'cancelled';
}
export interface MealMenuEntry {
  id: Id;
  mealId: Id;
  dishId: Id | null;
  name: string;
  retired: boolean;
}
export interface Requirement {
  id: Id;
  eventId: Id;
  mealId: Id | null; // null for common event supplies
  mealMenuEntryId: Id | null;
  itemId: Id;
  description: string;
  quantity: string;
  unit: Unit;
}
export interface EventSnapshot {
  eventId: Id;
  revision: number;
  accessVersion: number;
  generatedAt: string;
  event: EventDetails;
  meals: Meal[];
  menuEntries: MealMenuEntry[];
  requirements: Requirement[]; // filtered by applicable read permissions
  eventTotal: Money;
  mealTotals: Array<{ mealId: Id; total: Money }>;
  commonEventCost: Money;
  bills: BillRecord[]; // only bills the authenticated user may read
}
export interface Principal { userId: Id }
export interface EventAccess { active: boolean; roles: Role[] }
```

Protocol constraints: `bill.create` uses `base.kind=absent`; existing updates use an integer version or a previously accepted same-entity mutation. The API obtains the user from authentication, never from a trusted payload claim. Bill purchaser/event cannot change during correction. `requirementIds` are references, not allocations: a linked bulk line contributes once to totals. Explicit `allocations` attribute source amounts to meals; the unallocated remainder is common event cost. Meal costs are not inferred from requirement links. A mutation-dependent base resolves to the predecessor's accepted version and still conflicts if another writer has since advanced it. Authentication failure is HTTP 401 outside `PushResult`; never erase the pending operation on 401.

## Task 1: Compatible workspace and both platform shells

**Create:** `package.json`, `pnpm-workspace.yaml`, `nx.json`, `tsconfig.base.json`, `.gitignore`, `.github/workflows/ci.yml`, `apps/client/app/_layout.tsx`, `apps/client/app/index.tsx`, `apps/client/app.config.ts`, `apps/client/project.json`, `apps/api/src/main.ts`, `apps/api/src/health.controller.ts`, `apps/api/project.json`, `packages/ui/src/i18n/{en,gu}.json`, `docs/development/version-matrix.md`.

**Consumes:** Existing planning documents only. **Produces:** `GET /health/live`, an Android/web shell, and build/test commands used by later tasks.

- [ ] Read the architecture and inspect local tool availability. Initialize source control only at implementation time if the workspace still has no repository. Ignore `.env*` except templates, generated builds, local DB volumes and the source workbook `Ravisabha Cashbook 2026.xlsx`; do not remove the workbook.
- [ ] Resolve maintained Expo/React/React Native and Node/pnpm/Nx combinations against official compatibility guidance. Record exact versions and commands in the version matrix, generate apps with pinned tools, then commit the lockfile. Preserve existing docs and workbook during generation; scaffold in a temporary sibling directory if the generator requires an empty folder.
- [ ] Add Nx run-command targets, rooted in each app, for the selected Expo CLI. The client target shape is:

```json
{
  "name": "client",
  "targets": {
    "web-build": {
      "executor": "nx:run-commands",
      "options": { "cwd": "apps/client", "command": "pnpm exec expo export --platform web" }
    },
    "android-build": {
      "executor": "nx:run-commands",
      "options": { "cwd": "apps/client", "command": "pnpm exec expo run:android --variant release" }
    }
  }
}
```

- [ ] Build a small shell with English/Gujarati selection and a health endpoint; these are scaffolding checks, not business-rule unit tests. Define root scripts `test:unit` (Vitest), `test:api` (Vitest integration config), `test:web` (Playwright), `typecheck`, and `lint`. Android scenarios use the Maestro CLI installed in the test environment.
- [ ] Run `pnpm --dir apps/client exec expo install --check`, `pnpm --dir apps/client exec expo-doctor`, `pnpm exec nx run client:web-build`, `pnpm exec nx run client:android-build` and an HTTP request to `/health/live`. The Android check requires an SDK/JDK and a device/emulator. Record actual results; a missing SDK is not a passing build.
- [ ] Review and commit the compatible shell/configuration. Expected deliverable: both clients render BUPA-Satsang, switch language and build from a clean checkout.

## Task 2: Runtime contracts, exact amounts and permission vocabulary

**Create:** the four contract/domain files in the ownership table; `packages/domain/src/money.test.ts`, `packages/domain/src/access.test.ts`, `packages/contracts/src/bill.test.ts`, package manifests and test/build configuration.

**Consumes:** TypeScript workspace. **Produces:** the shared interfaces above plus `toPaise(value: Money): bigint`, `sumMoney(values: Money[]): Money`, `canReadBill(access: EventAccess, userId: Id, purchaserId: Id): boolean` and `canEditBill(...)` with the same parameters.

- [ ] Add the exact-amount regression test and run `pnpm test:unit packages/domain/src/money.test.ts`; it must fail before implementation:

```ts
import { expect, it } from 'vitest';
import { sumMoney, toPaise } from './money';

it('preserves paise and rejects invalid input', () => {
  expect(sumMoney(['0.10', '0.20', '160.00'])).toBe('160.30');
  expect(toPaise('160.30')).toBe(16030n);
  expect(() => toPaise('-1.00')).toThrow();
  expect(() => toPaise('1.001')).toThrow();
});
```

- [ ] Implement conversion by validating decimal strings, splitting whole/fraction parts and using BigInt arithmetic. Format sums with exactly two fractional digits. The bill-line input limit follows `numeric(14,2)`; totals may exceed a single line's bound and must not be converted to Number.
- [ ] Implement Zod schemas: UUID IDs; real calendar dates; 1–100 bill lines; nonempty trimmed descriptions/categories; positive quantity with at most three decimals; supported units; nonnegative money; nullable optional vendor/reference. Reject duplicate line IDs, duplicate requirement links and invalid mutation-base/kind combinations. Each allocation has a positive exact amount and distinct meal ID; its source sum cannot exceed the line amount. Empty allocations leave the full cost common. Validate meal local dates against the event range and optional serving times as local clock times in the event timezone. Planned headcounts are nonnegative integers or null when not yet known. Normalize user-entered money before storing the immutable queued payload.
- [ ] Write permission tests for inactive membership, chef-only access, own/other shopper bill, both heads' read access and kitchen-head/cashier corrections. Implement the exact role matrix. Ravisabha-head-only access cannot correct a bill.
- [ ] Run `pnpm test:unit` and `pnpm typecheck`, then review and commit. Expected deliverable: no float-based amount path and no ambiguous global-role assumption.

## Task 3: Application schema and authorized event access

**Create:** `packages/database/src/schema/{identity,events,meals,planning,bills,audit}.ts`, `packages/database/migrations/0001_foundation.sql`, `apps/api/src/access/{access.service,access.guard}.ts`, `apps/api/src/events/events.controller.ts`, `apps/api/test/{database,fixtures}.ts`, `apps/api/test/access.integration.test.ts`, `infra/compose.dev.yml`.

**Consumes:** `Principal`, `Role`, `EventAccess` and permission functions. **Produces:** `AccessService.forEvent(principal: Principal, eventId: Id): Promise<EventAccess>` and authenticated `GET /api/v1/events` returning only assigned events.

- [ ] Start a disposable PostgreSQL test database and define fixtures with two shoppers, one chef, one kitchen head, one cashier and one Ravisabha head across two events. Make one event span two days, with lunch/dinner on both days, distinct meal counts and the same dish in multiple meals. Use synthetic identities; fixtures are test-only and must not create production users.
- [ ] Write integration assertions for unauthorized event access, role combinations and cross-event foreign keys. Run `pnpm test:api apps/api/test/access.integration.test.ts` to observe failure before implementing those constraints.
- [ ] Create the schema with unique external identity and role grants, event date ranges, meals, meal-menu entries, requirements, bill ownership, line precision, audit and mutation receipts. A bill-line-to-requirement link table allows bulk purchases to reference multiple same-event requirements without copying amount/quantity. Add bill-line meal-allocation rows with unique source/meal keys and same-event foreign keys. The source amount, allocation sum and derived common remainder are validated within the same transaction on all write paths. Key constraints include:

```sql
-- Use these constraints in the corresponding generated tables.
UNIQUE (issuer, subject)
UNIQUE (event_id, user_id, role)
UNIQUE (actor_id, mutation_id)
UNIQUE (bill_line_id, meal_id)
CHECK (amount >= 0)
CHECK (quantity > 0)
```

- [ ] Implement event/meal/menu-entry foreign keys and access lookup against the application database for every protected operation. Ensure inactive membership overrides role grants. Meal selection does not create a new authorization scope. Serialize schedule/date-range validation with event edits, preserve stable meal IDs and prevent silent removal of referenced meals. Audit is append-only through application write paths; expense deletion must not cascade from event cleanup.
- [ ] Apply migrations to an empty database, run the integration suite, then review and commit. Expected deliverable: fixtures cannot cross event boundaries even through direct service/API calls.

## Task 4: Keycloak/Google login and application administration

**Create:** `infra/keycloak/realm.template.json`, `apps/api/src/auth/{oidc-verifier,web-session,auth.controller}.ts`, `apps/api/src/admin/{membership,roles}.controller.ts`, `tools/admin/bootstrap-community-admin.ts`, `apps/client/src/auth/{session.native,session.web}.ts`, `apps/client/app/sign-in.tsx`, `apps/client/src/features/admin/{VolunteersScreen,EventTeamScreen}.tsx`, `apps/api/test/auth.integration.test.ts`, `docs/operations/identity.md`.

**Consumes:** schema/access from Task 3. **Produces:** authenticated `Principal`, `GET /api/v1/me`, `GET /auth/login`, `GET /auth/callback`, `POST /auth/logout`, and administrator membership/role endpoints.

- [ ] Add tests using a local test issuer/Keycloak realm: reject wrong issuer/audience, expired tokens and ID tokens; valid identity without membership has no event access. Keep any test login mechanism restricted to test configuration; production accepts the configured Keycloak issuer only.
- [ ] Configure production-template realm/client settings without secrets: Google broker, Android public PKCE client, separate web confidential client and API audience. Use deployment environment values for actual client IDs, redirects and secrets. Google credential setup is an external prerequisite for the real sign-in acceptance check, not a reason to hardcode test credentials.
- [ ] Implement established OIDC-library verification and backend web sessions. Store opaque cookie-token hashes and encrypted provider refresh tokens in PostgreSQL. Validate state/nonce and CSRF. Use the system browser/native SecureStore on Android, and cookies on web. No identity token is persisted in Zustand, browser local storage or service-worker cache.
- [ ] Implement pending membership and admin-only grants. Bootstrap the first administrator against a verified existing internal user using the operator CLI; log that action. Kitchen heads may assign shopping work later, but cannot grant roles through these endpoints.
- [ ] Run `pnpm test:api apps/api/test/auth.integration.test.ts`, then manually complete Google sign-in, cancellation, session restoration and logout on web and a signed Android build. Record the real-provider result separately from CI test-realm results.
- [ ] Review and commit. Expected deliverable: both platforms reach their assigned event; a new unapproved Google identity receives no kitchen data.

## Task 5: Atomic bill mutation and authorized snapshot endpoints

**Create:** `apps/api/src/kitchen/bills/{bill.service,bill.repository}.ts`, `apps/api/src/sync/{mutation.service,snapshot.service,sync.controller}.ts`, `apps/api/test/{mutation,snapshot}.integration.test.ts`.

**Consumes:** contracts, authenticated `Principal`, `AccessService`. **Produces:** `MutationService.apply(principal: Principal, mutation: BillMutation): Promise<PushResult>`, `SnapshotService.read(principal: Principal, eventId: Id): Promise<EventSnapshot>`, `POST /api/v1/events/:eventId/mutations` and `GET /api/v1/events/:eventId/snapshot`.

- [ ] Write a real-PostgreSQL lost-acknowledgement test. Build `mutation` from a valid contract fixture, and exercise the service twice:

```ts
const first = await mutationService.apply(shopperPrincipal, mutation);
const retried = await mutationService.apply(shopperPrincipal, mutation);
expect(first.status).toBe('accepted');
expect(retried).toEqual(first);
const snapshot = await snapshotService.read(shopperPrincipal, mutation.eventId);
expect(snapshot.bills).toHaveLength(1);
expect(snapshot.eventTotal).toBe('160.00');
```

- [ ] Run `pnpm test:api apps/api/test/mutation.integration.test.ts` to see the missing behavior fail. The fixture/test setup instantiates the two services with the disposable database and creates an active shopper principal; no production auth bypass is involved.
- [ ] Implement per-operation transactions: validate current access, resolve absent/version/dependency base, enforce ownership and immutable purchaser/event, validate every requirement link belongs to that event and references a readable requirement, lock the event row and increment its data revision, update bill plus all lines and their meal allocations, reject over-allocation and source amount reductions below allocations, append audit, persist payload fingerprint/result receipt including the event revision, then commit. An identical replay returns its existing receipt without incrementing the event revision. Concurrent identical requests must converge through the receipt uniqueness constraint and return the same committed result. Changed payload with the same mutation ID returns `ID_REUSED`.
- [ ] Add tests for stale update (including competing meal allocations), over-allocation, duplicate meal allocation, foreign-event meal, reduced source amount, revoked membership before retry, shopper trying to change purchaser, interrupted transaction, concurrent duplicate requests and different mutation IDs for separate bills. A receipt must not expose a bill after the caller loses access.
- [ ] Implement consistent authorized snapshots. Return the event revision and the user/event access version. Server total is calculated server-side across active event expenses, while returned bill rows obey per-record access. Snapshot construction must not mix records read before and after a concurrent commit. Return event date range/timezone and all authorized meal/menu/requirement context from the same consistent snapshot. Test two shoppers see the same total but different bill collections. Snapshot meal totals include allocated source amounts, with the derived remainder reported as `commonEventCost`; their sum equals `eventTotal`. A meal/date filter must not cause the same bulk bill to be added twice. For an INR 160 line allocated INR 100 to lunch and INR 40 to dinner, assert INR 20 common and INR 160 total. Verify that joining two allocations cannot multiply the original line amount.
- [ ] Run both integration files and review/commit. Expected deliverable: retries neither duplicate an expense nor bypass current permissions.

## Task 6: Durable native/web stores and queue processing

**Create:** `packages/local-store/src/{types,store.native,store.web}.ts`, `packages/local-store/src/migrations/{native,web}.ts`, `packages/sync/src/{enqueue,runner,reconcile}.ts`, `packages/sync/src/runner.test.ts`, `tests/web/storage.spec.ts`, `tests/android/offline-storage.yaml`.

**Consumes:** mutation/snapshot contracts and endpoints. **Produces:** `enqueueBill`, `syncOnce` and the storage/transport interfaces below. `QueuedBill` retains the acting internal user separately from its mutation.

```ts
export interface QueuedBill { userId: Id; mutation: BillMutation }
export interface LocalStore {
  saveWithOutbox(value: QueuedBill): Promise<void>;
  pending(userId: Id, eventId: Id): Promise<QueuedBill[]>;
  settle(value: QueuedBill, result: PushResult): Promise<void>;
  applySnapshot(userId: Id, snapshot: EventSnapshot): Promise<void>;
}
export interface Transport {
  push(mutation: BillMutation): Promise<PushResult>;
  snapshot(eventId: Id): Promise<EventSnapshot>;
}
export declare function enqueueBill(store: LocalStore, value: QueuedBill): Promise<void>;
export declare function syncOnce(
  store: LocalStore, transport: Transport, userId: Id, eventId: Id
): Promise<void>;
```

- [ ] Write adapter contract tests: simulate a local transaction failing between record/outbox writes and assert neither commits; close/reopen a store and assert an accepted local save survives. Execute the browser implementation in actual IndexedDB, not only a mock; execute SQLite checks in the Android runtime.
- [ ] Implement both adapters with user-partitioned records, confirmed state, pending overlays and schema migrations. `saveWithOutbox` is one transaction. Serialize native writes so unrelated operations cannot accidentally join an async transaction. Track pending, in-flight and needs-attention states inside the adapters; `pending` returns only retry-eligible operations and their required predecessors in order.
- [ ] Implement one queue runner per active account. Freeze sent payloads; dependency order is preserved; lost acknowledgements retry unchanged IDs/content. Retry transient network/5xx failures with bounded backoff. Retain operations on 401 for the same account's reauthentication; conflict and permanent rejection become needs-attention, not infinite retries.
- [ ] Reconcile snapshots atomically without erasing pending overlays. Track the highest acknowledged event revision and current access version; discard older snapshots so neither records nor totals regress when an older fetch completes later. On permission change, remove inaccessible confirmed records and isolate pending data for recovery. A replayed acknowledgement of an older record version removes its matching queued operation but cannot overwrite a newer confirmed record. Switching accounts must not run the old account's queue. Same-user multiple web tabs require runner coordination; server idempotency remains the last defense.
- [ ] Run `pnpm test:unit packages/sync/src/runner.test.ts`, `pnpm test:web tests/web/storage.spec.ts` and `maestro test tests/android/offline-storage.yaml`. Include app restart, storage failure, schema migration with pending records, multi-day snapshot size and a competing edit while a snapshot is in flight. Later leftover adapters retain meal-menu-entry IDs even when schedule labels/dates change.
- [ ] Review and commit. Expected deliverable: neither adapter reports Saved on this device before local commit; a retry produces one server expense.

## Task 7: Usable offline bill flow and foundation acceptance

**Create:** `apps/client/app/events/[eventId]/index.tsx`, `apps/client/app/events/[eventId]/bills/new.tsx`, `apps/client/src/features/bills/{BillForm,BillList,SyncStatus,ConflictScreen}.tsx`, `apps/client/src/features/events/EventChooser.tsx`, `apps/client/src/data/event-repository.ts`, `apps/client/public/service-worker.js`, `tests/web/offline-bill.spec.ts`, `tests/android/offline-bill.yaml`, `docs/acceptance/foundation.md`.

**Consumes:** Tasks 2–6 interfaces. **Produces:** a signed-in volunteer can enter, retain, sync, read and correct their own bill on both platforms. Full shopping-list selection follows in Slice B; this foundation screen is explicitly a vertical-slice form, not the completed product.

- [ ] Build bill entry around `enqueueBill`, including item description, actual quantity/unit, category and line amount. The foundation form can keep cost assignment visibly at Common event cost with empty allocations; the full single-meal/split editor follows in Slice B. The foundation API already validates/returns allocation fields and meal totals. Show the derived total, optional vendor/reference and a save action. Wire labels/validation/sync states to English/Gujarati messages. Preserve drafts during navigation; reserve Synced for server acknowledgement.
- [ ] Add event auto-open/chooser behavior, date-grouped meal selection and downloaded-event readiness. Event dates identify the overall occasion; meal cards carry menu/headcount context. A bill remains event-scoped when opened from a meal shopping view. Event total is the server value; own bill detail and local pending contribution are separate. Subscribe screens to the local repository; Query revalidation must not create a competing editable copy.
- [ ] Cache versioned web assets for offline reload, excluding auth endpoints and authenticated API responses. Updates must preserve IndexedDB/queued operations and prompt before activating a version that would interrupt an edited form. Display storage failures without claiming durable success.
- [ ] Write browser acceptance against an authenticated test event. The example uses Playwright's context-level offline mode after login/event download:

```ts
await context.setOffline(true);
await page.getByRole('button', { name: 'Add bill', exact: true }).click();
await page.getByLabel('Item name', { exact: true }).fill('Tomatoes');
await page.getByLabel('Quantity', { exact: true }).fill('4');
await page.getByLabel('Line amount', { exact: true }).fill('160.00');
// The test fixture/form selects kg and the Vegetables category explicitly.
await page.getByRole('button', { name: 'Save bill', exact: true }).click();
await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
await page.reload();
await expect(page.getByText('Tomatoes', { exact: true })).toBeVisible();
await context.setOffline(false);
await expect(page.getByText('Synced', { exact: true })).toBeVisible();
```

- [ ] Mirror the scenario on Android with airplane mode and process restart. Test a network fault after server commit but before acknowledgement, shopper/head conflicting correction, expired login and account switch. Inspect the resulting server bill count/total, not only the UI status. Verify Gujarati font scaling and numeric keypad behavior on a real volunteer device.
- [ ] Run unit/API suites, web acceptance and Android scenarios, then record measured outcomes in `foundation.md` and commit. Foundation passes only with evidence from both platforms; successful web tests do not substitute for Android persistence.

## Follow-on slice planning and acceptance contracts

Prepare focused detailed plans for these slices using the same reviewed architecture and the interfaces proven in A. Each slice below is bounded by concrete outputs and rejection criteria; do not treat the whole app as implemented when A passes.

### Slice B: Purchasing and expense reports

- [ ] Add shopping-list selection with multiple requirement references per bulk line, partial purchases, multiple bills against one requirement and unplanned items. Support consolidating requirements across selected meals, a day or the event, retaining source links and compatible units. Do not infer per-meal purchased quantities from unallocated multi-requirement links. Planned quantity remains unchanged when actual quantity differs. Kitchen-head task assignment does not change permissions.
- [ ] Extend the mutation union with other-expense create/update (including `allocations: MealAllocation[]`) and bill/expense void. Add `other_expense_meal_allocations` with the same source/meal uniqueness and exact-sum validation as bill lines. Use the established storage and receipt path; void retains audit and removes the amount from totals without deleting history.
- [ ] Add single-meal/split/common cost controls to bill lines and other expenses; saving with no split retains common cost. Apply source-record permissions to allocation editing, including offline. Add event/meal/common-cost summaries and category/item/bill/shopper report endpoints and screens with scoped detail. Fixture: shopper A bill INR 160, shopper B bill INR 100 and other expense INR 40 gives event total INR 300. Both heads/cashier receive full breakups; A's My expenses subtotal is INR 160; chef receives the total and no bill records. An Other expenses bucket reconciles groupings without an item/bill/shopper. Extend the fixture: A allocates INR 100 to lunch and INR 40 to dinner (INR 20 common); B allocates INR 100 to lunch; the other expense allocates INR 20 to dinner (INR 20 common). Expected event reconciliation: INR 200 lunch + INR 60 dinner + INR 40 common = INR 300. A's visible detail remains INR 100 lunch + INR 40 dinner + INR 20 common = INR 160. Other expenses in the dinner-filtered view contributes INR 20, not its full INR 40.
- [ ] Verify edits after meal completion, filters/export scope if exports are included, no double counting after sync, allocation conflicts and reduced-source-amount validation, and no invented paid/reimbursed status. Deliver all expense workflows and reports before pilot use.

### Slice C: Menu, requirements and leftovers

- [ ] Implement administrator event creation with start/end dates/timezone and Ravisabha-head meal scheduling/menu/count entry using the reviewed defaults; menu and ingredient catalogs preserve original names/aliases. Kitchen head creates manual requirements and assigns existing event shoppers.
- [ ] Add leftover schema with unique meal-menu-entry identity, nonnegative quantity/unit and history. Extend contracts and queue adapters without duplicating sync behavior. Chef and kitchen head can both write; shopper cannot.
- [ ] Verify zero versus unrecorded, pieces versus vessels without inferred conversion, two offline first entries for the same dish in one meal, independent records for that dish in another meal/day, stale correction, and a menu edit that would orphan an existing leftover. Preserve historical dish/expense references rather than cascading deletion.
- [ ] Run a complete five-role, two-day scenario from dated meal schedules and per-meal menu/count through bulk purchasing, expense reporting and leftovers on Android and web, including mixed roles and Gujarati UI.

### Slice D: Import, hosting and pilot

- [ ] Build a read-only workbook extraction manifest using the existing mapping. Preserve sheet/row provenance, aliases and date context. Require a preview before database import; use deterministic source identifiers and a repeat-run key. Import expense detail once, excluding summary totals, cashbook disbursements, advances, balances and reimbursements.
- [ ] Verify known event totals, blank headcounts and same-date distinct events. Review historical row grouping into events/meals explicitly: do not merge events just because dates match or invent a meal type from a sheet name; preserve uncertain labels and source provenance. Repeated dish sections do not establish separate meals. Import historical expenses as common event cost unless reviewed evidence identifies a meal allocation; never infer allocation from dish headings alone. Run the import twice against a disposable database and assert the second run adds no duplicate expenses. The original workbook remains unchanged.
- [ ] Define Compose/Caddy/Keycloak deployment, persistent volumes, private DB networking, pinned images and redacted logs. Separate dev/staging/prod secrets and databases. Run builds in CI, not on the production VPS.
- [ ] Exercise 20-active-user and 50-device reconnect test scenarios, alongside a backup. Record errors, latency, memory/swap and PostgreSQL connections. Increase capacity or fix bottlenecks if the 4 GB host lacks headroom; do not claim 200-concurrent-user capacity from a 200-account requirement.
- [ ] Restore both app and identity databases on an isolated host/environment and measure the proposed 24-hour recovery-point/four-hour restore targets. Name the operator and off-host backup destination before launch. Rehearse API/app upgrades with queued old-client mutations.
- [ ] Pilot with all five roles, including a multi-meal event or a full multi-day rehearsal, retaining a reconciliation record against current manual tracking. Pilot acceptance requires no lost/duplicate expenses, correct role restrictions, completed sync and usable entry on actual devices.

### Slice E: Release and cutover

- [ ] Choose the Android distribution route and secure the signing key; build/install the release artifact and test upgrades without losing queued records. A managed Play release and direct APK distribution have different operational steps and must not be treated as interchangeable.
- [ ] Configure production domains, Google OAuth redirects and TLS using the chosen hosting environment. Verify Google sign-in and recovery, app access administration, backup alerts and service restart recovery in the deployed configuration.
- [ ] Reconcile the pilot event, document the cutover date and communicate the agreed volunteer workflow through an authorized human channel. This plan does not authorize sending messages on the user's behalf.
- [ ] Release only after the evidence above passes and a real operator can follow the recovery runbook. Public deployment and any paid purchases require concrete target/configuration review; they have not occurred during planning.

## Review outcome and remaining inputs

The plan covers all five launch roles, multi-day/multi-meal events, both languages/platforms, offline writes, meal/common-cost allocation and report scope, ongoing corrections, administration, historical migration and operation. Proposed product defaults are grouped in the architecture for review rather than turned into an endless questionnaire. The exact version lockfile is an output of Task 1, not a guessed compatible set.

Before execution, review the architecture defaults and foundation tasks. Before real-provider acceptance/deployment, supply deployment domains/Google configuration, choose Android distribution, identify the maintainer/operator and agree a launch date based on actual availability. These are execution inputs; their absence does not prevent the specification and plan from being reviewed now.
