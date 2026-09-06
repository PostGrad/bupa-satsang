# Shared contracts: implement once, consume by name

These are the intended launch contracts, not claims that the files exist. Task cards identify each producer. This pack expands the earlier bill-only foundation contract before there is a shipped API. Do not maintain two competing versions. Keep API `schemaVersion: 1` and Zod/runtime schemas aligned with these types.

## C1. Identifiers, money, quantities and dates

Owner: tasks 02–04, `packages/contracts/src/common.ts`, `packages/domain/src/{money,quantity,dates,access}.ts`.

```ts
export type Id = string; // UUID, validated at every input boundary
export type Money = string; // canonical nonnegative INR: 0.00, 160.30
export type Quantity = string; // exact decimal, <=3 fraction digits
export type LocalDate = string; // real YYYY-MM-DD calendar date
export type Unit = 'g'|'kg'|'ml'|'l'|'piece'|'packet'|'vessel';
export type Role = 'ravisabha_head'|'kitchen_head'|'shopper'|'chef'|'cashier';
export interface Principal { userId: Id }
export interface EventAccess { active: boolean; roles: Role[]; accessVersion: number }
export type Capability = 'totals.read'|'bill.create'|'bill.read'|'bill.edit'
 |'expense.read'|'expense.write'|'meal.write'|'requirements.write'
 |'leftovers.write'|'requirements.readAll';
export interface MealAllocation { mealId: Id; amount: Money }
export declare function normalizeMoney(input: string): Money;
export declare function toPaise(value: Money): bigint;
export declare function fromPaise(value: bigint): Money;
export declare function sumMoney(values: readonly Money[]): Money;
export declare function commonAmount(amount: Money, allocations: readonly MealAllocation[]): Money;
export declare function quantityMillis(value: Quantity): bigint;
export declare function can(access: EventAccess, capability: Capability,
  actorId: Id, ownerId?: Id): boolean;
export declare function canReadBill(access: EventAccess, actorId: Id, purchaserId: Id): boolean;
export declare function canEditBill(access: EventAccess, actorId: Id, purchaserId: Id): boolean;
```

Input money accepts trimmed digits with zero, one or two decimal places, e.g. `00160.3`→`160.30`. Reject signs, exponent notation, separators, empty strings, NaN and more than two decimals. Source money is at most `999999999999.99` (`numeric(14,2)`); computed totals have no single-source bound and never use Number. `fromPaise` rejects negative inputs. Pending delta labels may be signed, formatted separately from Money.

Source quantity is at most `99999999999.999` (`numeric(14,3)`), positive for purchases/requirements and nonnegative for leftovers. Normalize trailing zeros without losing value; never round extra precision. `quantityMillis` validates and returns units×1000 as BigInt. Consolidation groups by exact item ID and unit; no inferred packet/vessel size.

Date parsing validates actual Gregorian dates rather than Date's rollover. Event timezone must be an IANA zone accepted by Intl. Serving time is null or valid 00:00–23:59; no UTC conversion of a date-only field. Version and revision integers are safe positive integers (revision may start at zero); fail visibly before exceeding JS safe range rather than silently rounding.

## C2. Event/planning records

Owners: tasks 03, 06–07, 16–19. Stored records have server timestamps in addition to these client DTOs.

```ts
export interface EventDetails {
 id: Id; communityId: Id; name: string; venue: string|null;
 startDate: LocalDate; endDate: LocalDate; timeZone: string; version: number;
}
export interface EventSummary extends EventDetails { roles: Role[] }
export interface Meal {
 id: Id; eventId: Id; version: number; servesOn: LocalDate;
 servingTime: string|null; kind: string; label: string;
 plannedHeadcount: number|null; status: 'planned'|'completed'|'cancelled';
}
export interface CatalogItem { id: Id; communityId: Id; name: string; aliases: string[]; retired: boolean; version: number }
export interface MealMenuEntry { id: Id; mealId: Id; dishId: Id|null; name: string; retired: boolean; version: number }
export interface Requirement {
 id: Id; eventId: Id; mealId: Id|null; mealMenuEntryId: Id|null;
 itemId: Id; description: string; quantity: Quantity; unit: Unit;
 version: number; retired: boolean;
}
export interface ShoppingAssignment { requirementId: Id; shopperId: Id }
export interface PurchaseProgress {
 itemId: Id|null; description: string; unit: Unit;
 requirementIds: Id[]; purchasedQuantity: Quantity;
 attribution: 'complete_group'|'shared_group'|'unplanned';
}
```

Names/descriptions: trim, require 1–200 characters; notes/reasons at most 500; category 1–80, reference at most 120. Empty optional strings become null. Max 100 lines per bill, 100 links per line, 100 meal allocations per source, 50 aliases per catalog item. These bounds are implementation limits with visible validation, never silent truncation. Event snapshots do not cap away data: reject an oversized event download visibly if necessary and measure before release.

A requirement menu-entry reference requires a matching non-null meal in the same event. A mealMenuEntryId is not a catalog dish ID. Retire referenced planning records; do not hard-delete them. Meal rescheduling retains IDs and existing expense attribution.

## C3. Expense/leftover payloads and mutations

Owners: tasks05 and20–23. Runtime exports: `billPayloadSchema`, `otherExpensePayloadSchema`, `leftoverPayloadSchema`, `entityMutationSchema`, `pushResultSchema`, `eventSnapshotSchema`.

```ts
export interface BillLine {
 id: Id; itemId: Id|null; requirementIds: Id[]; description: string;
 quantity: Quantity; unit: Unit; amount: Money; category: string;
 allocations: MealAllocation[];
}
export interface BillPayload {
 purchaserId: Id; purchasedOn: LocalDate; vendor: string|null;
 reference: string|null; lines: BillLine[];
}
export interface OtherExpensePayload {
 incurredOn: LocalDate; description: string; category: string;
 amount: Money; allocations: MealAllocation[];
}
export interface LeftoverPayload { mealMenuEntryId: Id; quantity: Quantity; unit: Unit }
export type Base = {kind:'absent'} | {kind:'version'; value:number}
 | {kind:'mutation'; mutationId:Id};
export interface Envelope<K extends string,P> {
 schemaVersion:1; mutationId:Id; eventId:Id; entityId:Id; kind:K; base:Base; payload:P;
}
export type BillMutation = Envelope<'bill.create'|'bill.update',BillPayload>;
export type ExpenseMutation = Envelope<'expense.create'|'expense.update',OtherExpensePayload>;
export type LeftoverMutation = Envelope<'leftover.create'|'leftover.update',LeftoverPayload>;
export type VoidMutation = Envelope<'bill.void'|'expense.void',{reason:string}>;
export type EntityMutation = BillMutation|ExpenseMutation|LeftoverMutation|VoidMutation;
export interface RecordMeta { id:Id; eventId:Id; version:number }
export interface BillRecord extends RecordMeta {
 recordType:'bill'; payload:BillPayload; total:Money; voided:boolean;
}
export interface ExpenseRecord extends RecordMeta {
 recordType:'expense'; payload:OtherExpensePayload; recorderId:Id; voided:boolean;
}
export interface LeftoverRecord extends RecordMeta {
 recordType:'leftover'; payload:LeftoverPayload; recorderId:Id;
}
export type EntityRecord = BillRecord|ExpenseRecord|LeftoverRecord;
export type PushResult =
 | {status:'accepted'; mutationId:Id; eventRevision:number; record:EntityRecord}
 | {status:'conflict'; mutationId:Id; current:EntityRecord}
 | {status:'rejected'; mutationId:Id;
 code:'VALIDATION'|'FORBIDDEN'|'ID_REUSED'|'DEPENDENCY_REQUIRED'};
```

Create requires absent base. Update/void requires version≥1 or an accepted predecessor for the same actor/event/entity/type family. Leftover entityId equals mealMenuEntryId: competing first entries address the same entity, producing a conflict. Separate ordinary bills use separate UUIDs even when contents match. Purchaser and event are immutable. Recorder comes from Principal, not payload. Version increments once per accepted change. Update of a voided source is rejected; void is not hard deletion.

Allocation meal IDs are unique and belong to the source event. Amounts are positive, canonical and total≤source amount. All bill-line IDs and requirement links are unique in their respective scopes. Validate unknown object fields strictly to avoid silent payload changes. Normalize input before it becomes an immutable queued envelope; fingerprint canonical normalized JSON with SHA-256.

## C4. Server APIs and snapshots

Owners: tasks10,20–25. EventSnapshot/ExpenseReport DTOs live in packages/contracts. AccessService/MutationService/SnapshotService interfaces live in their owning apps/api modules, not in the client-shared contracts package. Transaction type `AppTx` is exported from database package; it exposes the Drizzle transaction plus the same underlying PostgreSQL connection for explicit SQL locks. No repository opens an independent connection inside a mutation.

```ts
export interface EventSnapshot {
 schemaVersion:1; eventId:Id; revision:number; accessVersion:number; roles:Role[]; generatedAt:string;
 event:EventDetails; meals:Meal[]; menuEntries:MealMenuEntry[];
 requirements:Requirement[]; assignments:ShoppingAssignment[];
 catalog:{dishes:CatalogItem[];ingredients:CatalogItem[]};
 eventTotal:Money; mealTotals:Array<{mealId:Id;total:Money}>; commonEventCost:Money;
 bills:BillRecord[]; otherExpenses:ExpenseRecord[]; leftovers:LeftoverRecord[];
 purchaseProgress:PurchaseProgress[];
}
export interface AccessService {
 forEvent(principal:Principal,eventId:Id,tx?:AppTx):Promise<EventAccess>;
 requireCommunityAdmin(principal:Principal,communityId:Id,tx?:AppTx):Promise<void>;
}
export interface MutationService {
 apply(principal:Principal,mutation:EntityMutation):Promise<PushResult>;
}
export interface SnapshotService { read(principal:Principal,eventId:Id):Promise<EventSnapshot> }
export type CostFilter = {kind:'event'}|{kind:'common'}|{kind:'meal';mealId:Id};
export type GroupBy = 'category'|'item'|'bill'|'shopper';
export interface ExpenseReport {
 scope:'all_expenses'|'my_expenses'|'totals_only';
 eventTotal:Money; filter:CostFilter; visibleSubtotal:Money;
 groups:Array<{key:string;label:string;total:Money}>;
}
```

Snapshot includes authorized catalog context for offline forms; bill/expense arrays retain readable voided records for current state/history, but totals exclude them. Snapshot arrays are server-filtered; never calculate all-role totals by downloading hidden rows. Meal totals include cancelled/rescheduled meal allocations, because stable IDs retain history. Retired requirements/menu remain where needed to interpret history and queued work. Price-free progress is distinct from private bill detail.

`revision` lives on event and serializes kitchen writes. `accessVersion` is the community's monotonically increasing authorization revision, incremented with every membership/admin/role change. A coarser community version is deliberate: it avoids missing cached access changes. AppTx access checks and writes use current membership, not cached claims.

## C5. Local store and runner

Owners: tasks26–30. Public exports below belong to `packages/local-store/src/types.ts` and `packages/sync/src/{enqueue,runner}.ts`.

```ts
export interface QueuedMutation { userId:Id; mutation:EntityMutation }
export interface QueueEntry extends QueuedMutation {
 state:'pending'|'in_flight'|'needs_attention'; attempts:number;
 nextAttemptAt:number; lastError:string|null; result:PushResult|null;
}
export interface EventView {
 snapshot:EventSnapshot|null; proposals:QueueEntry[];
 effectiveRecords:EntityRecord[]; status:'not_downloaded'|'ready'|'revoked'|'update_required';
}
export type JsonValue = null|boolean|number|string|JsonValue[]|{[key:string]:JsonValue};
export interface DraftRecord {userId:Id;eventId:Id;key:string;value:JsonValue;updatedAt:number}
export interface LocalStore {
 saveDraft(value:DraftRecord):Promise<void>;
 loadDraft(userId:Id,eventId:Id,key:string):Promise<DraftRecord|null>;
 discardDraft(userId:Id,eventId:Id,key:string):Promise<void>;
 requireUpdate(userId:Id,eventId:Id):Promise<void>;
 saveWithOutbox(value:QueuedMutation):Promise<void>;
 pending(userId:Id,eventId:Id,now:number,limit:number):Promise<QueueEntry[]>;
 markAttempt(value:QueuedMutation,now:number):Promise<void>;
 settle(value:QueuedMutation,result:PushResult):Promise<void>;
 defer(value:QueuedMutation,nextAttemptAt:number,reason:string):Promise<void>;
 applySnapshot(userId:Id,snapshot:EventSnapshot):Promise<void>;
 revoke(userId:Id,eventId:Id):Promise<void>;
 attention(value:QueuedMutation,reason:string):Promise<void>;
 read(userId:Id,eventId:Id):Promise<EventView>;
 subscribe(userId:Id,eventId:Id,listener:()=>void):()=>void;
 close():Promise<void>;
}
export interface Transport {
 push(mutation:EntityMutation,signal?:AbortSignal):Promise<PushResult>;
 snapshot(eventId:Id,signal?:AbortSignal):Promise<EventSnapshot>;
}
export class HttpError extends Error { status!:number; retryAfterSeconds?:number }
export interface SyncContext {
 userId:Id; eventId:Id; signal:AbortSignal;
 isCurrentAccount:()=>boolean; now:()=>number; random:()=>number;
}
export declare function enqueueMutation(store:LocalStore,value:QueuedMutation):Promise<void>;
export declare function syncOnce(store:LocalStore,transport:Transport,context:SyncContext):Promise<void>;
```

Lease acquisition wraps `syncOnce`; it must run before any queue read. Account changes abort in-flight work and check `isCurrentAccount` before every state publication. Transactional store methods still write only the original user's partition; an old callback must never publish into the new user's UI.

`applySnapshot` ignores revision below the acknowledged watermark or accessVersion below the highest known accessVersion. It replaces only confirmed state, retaining proposals and removing no-longer-authorized confirmed rows. Use snapshot.roles and pure permission functions to mark newly unauthorized proposals needs-attention and remove them from the active editable list; they remain only in the original account recovery view. Accepted stale acknowledgements clear the matching queue entry but cannot replace a newer confirmed record. Derive effective display from confirmed state plus per-entity pending chain; do not sum successive versions as separate expenses.

## C6. Test construction interfaces

Owner task01 supplies pure fixture IDs and bill builders. Task06 supplies PostgreSQL test isolation; task10 supplies service fixture composition; task11 supplies test OIDC signing keys and HTTP test server. Task31 supplies real test-realm browser login. Tasks03/19/22/23/26/29 extend builders only when their contracts exist.

```ts
// packages/test-support/src/fixtures.ts (never imported by production bundles)
export declare const ids: {community:Id;event:Id;otherEvent:Id;shopperA:Id;shopperB:Id;
 chef:Id;kitchenHead:Id;cashier:Id;ravisabhaHead:Id;admin:Id;lunch:Id;dinner:Id;
 nextLunch:Id;nextDinner:Id;rotliLunch:Id;rotliDinner:Id;rice:Id;tomato:Id;reqLunch:Id;reqDinner:Id};
export declare function bill160(overrides?:Partial<BillPayload>):BillPayload;
export declare function createBill(overrides?:Partial<BillMutation>):BillMutation;
export declare function eventFixture():EventDetails; // task03
export declare function mealFixture():Meal; // task03, ids.lunch
export declare function requirementFixture():Requirement; // task19, ids.reqLunch
export declare function expense40Mutation():ExpenseMutation; // task22
export declare function leftoverMutation(entryId:Id,quantity:Quantity,unit:Unit):LeftoverMutation; // task23
// apps/api/test/database.ts
export declare function withTestDb<T>(run:(db:AppDatabase)=>Promise<T>):Promise<T>;
export declare function seedKitchen(db:AppDatabase):Promise<void>;
// apps/api/test/services.ts, extended only by the owning service task
export declare function createServices(db:AppDatabase):{
 access:AccessService; mutations:MutationService; snapshots:SnapshotService;
};
```

`createServices` starts with access only in task 10; mutation and snapshot fields become required only when tasks20/24 produce them. Early tests must not import unimplemented service modules. The final signature above is the target, not permission to stub later behavior with passing canned values. HTTP and browser fixtures are detailed in [Test fixtures](test-fixtures.md).

## C7. Client session composition

Task13 owns `apps/client/src/auth/types.ts`; task31 consumes it without renaming.

```ts
export type SessionState =
 | {status:'restoring'}
 | {status:'signed_out'}
 | {status:'signed_in';userId:Id;onlineVerified:boolean};
export interface AuthSession {
 restore():Promise<SessionState>;
 signIn():Promise<SessionState>;
 signOut():Promise<void>;
 getAccessToken():Promise<string|null>; // native only; web returns null and uses cookie
 subscribe(listener:(state:SessionState)=>void):()=>void;
}
export interface NativeTokenStore {
 read():Promise<{accessToken:string;refreshToken:string;expiresAt:number;userId:Id}|null>;
 write(value:{accessToken:string;refreshToken:string;expiresAt:number;userId:Id}):Promise<void>;
 clear():Promise<void>;
}
```

`onlineVerified:false` allows the same previously authenticated user's downloaded partition to reopen offline; it cannot authorize a server request. Account changes cancel the previous sync context before publishing the new SessionState. Pending membership is a `/me` application state, not a distinct source of authentication credentials.

## Producer locations and fixture extensions

- C1/C2/C3 DTOs and schemas: `packages/contracts`; pure arithmetic and capability checks: `packages/domain`. Do not import a database type into these client-safe packages.
- C4 server services: `apps/api/src/access`, `apps/api/src/sync`, `apps/api/src/kitchen`; AppTx/AppDatabase: `packages/database`.
- C5 storage types/adapters/reducers: `packages/local-store`; HttpError/Transport/SyncContext/enqueue/runner: `packages/sync`.
- C7 UI session types: `apps/client/src/auth/types.ts`; server session records are separate and never serialized into SessionState.
- `snapshotFixture(overrides?:Partial<EventSnapshot>)` defaults to F1 event with shopper role, empty expense arrays, zero totals and revision0/accessVersion0. `queuedBillFixture()` wraps createBill with shopperA. `contextFixture()` uses the F1 fake clock, random()=>0, a fresh AbortController and isCurrentAccount()=>true.
- `AppDatabase.query(sql:string,parameters?:readonly unknown[])` and AppTx.query return pg QueryResult; AppDatabase.close closes its own pool. `withTransaction<T>(db,fn,isolation='read committed')` passes the same AppTx to every nested service.

Task28 can pass implementation review with TypeScript and shared reducer checks while native runtime evidence remains pending task43. This distinction never means SQLite restart/transaction behavior has been proved on Android.

## C8. Runner order and failure transitions

The platform coordinator owns `RunnerLease.tryAcquire(userId,eventId,ownerId,now)`, `renew(...)` with the same arguments and `release(userId,eventId,ownerId)`. Both acquisition/renewal return Promise<boolean>; release returns Promise<void>. Lease success wraps the entire syncOnce call and periodic renewal; release runs in finally. An expired lease permits retrying abandoned in-flight operations.

One pass: confirm account→acquire lease→fetch/apply authorized snapshot→read up to20 eligible operations→mark/send/settle serially with immutable envelopes→fetch/apply one final snapshot→release lease. Do not download a full snapshot after each of20 acknowledgements. If the initial snapshot fails transiently, schedule a bounded retry and preserve the queue. A successful acknowledgement advances the watermark immediately even if the final snapshot fails.

| Result | Store/runner action | Retry eligibility |
| --- | --- | --- |
| accepted |settle, retain latest confirmed version, advance watermark|matching operation removed|
| conflict |settle keeps current+proposal as needs-attention|explicit resolution only|
| rejected VALIDATION/ID_REUSED/FORBIDDEN |attention; refresh authorized snapshot at end if allowed|explicit correction/new mutation only|
| rejected DEPENDENCY_REQUIRED |attention when predecessor absent; otherwise wait for its queued predecessor, never resend out of order|after predecessor acceptance only|
| HTTP401 |retain queue; stop and request same-account login|after reauthentication|
| HTTP403 |revoke event confirmed state, isolate proposals|explicit revalidation after authorization returns|
| HTTP426 |requireUpdate; retain every envelope and draft|after compatible client/server state is established|
| HTTP429/network/5xx |defer using specified backoff/Retry-After|automatic while active and authorized|
| Other4xx |attention with safe validation message|explicit correction|

`requireUpdate` sets EventView.status to update_required without clearing records/proposals. A compatible snapshot after an app/server update may restore readiness; it must not rewrite old envelopes automatically. DraftStore methods are transactional in both adapters from tasks26–28; task30 exposes them through EventRepository. Draft values must be finite JSON and bounded to2MiB; drafts may hold incomplete form text and are validated as full payloads only on enqueue.

EventRepository delegates read/subscribe/saveDraft/loadDraft/discardDraft with the exact LocalStore signatures above, plus enqueueMutation for durable commands. Screens never access raw Dexie/SQL tables.
