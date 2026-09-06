# Deterministic fixtures and test harness contracts

Fixtures are synthetic and test-only. Do not read the supplied workbook to populate ordinary unit, UI or authorization tests. Do not bundle `packages/test-support` into Expo or the production API.

## F1. IDs and planned event

Task01 exports UUIDs using `00000000-0000-4000-8000-` plus these twelve-digit suffixes:

| Key | Suffix | Meaning |
| --- | --- | --- |
| community | 000000000001 | Anand test community |
| event / otherEvent | 000000000010 / 000000000011 | primary event / unauthorized second event |
| shopperA / shopperB | 000000000020 / 000000000021 | two shoppers |
| chef / kitchenHead / cashier / ravisabhaHead / admin | 000000000022 / 000000000023 / 000000000024 / 000000000025 / 000000000026 | distinct actors; admin has no operational role |
| lunch / dinner / nextLunch / nextDinner | 000000000030 / 000000000031 / 000000000032 / 000000000033 | four meals in one two-day event |
| rotliLunch / rotliDinner | 000000000040 / 000000000041 | same dish, separate menu entries |
| rice / tomato | 000000000050 / 000000000051 | ingredients |
| reqLunch / reqDinner | 000000000060 / 000000000061 | rice5kg for lunch, rice5kg for dinner |

Event: name `Anand two-day test`, dates2026-09-12–2026-09-13, Asia/Kolkata. Meals: day1 lunch12:00/headcount250, dinner19:00/200; day2 lunch12:00/300, dinner19:00/null. Other event: same date in same community but only shopperB assigned. Add another community fixture in database scope tests. All actors initially active, each named operational role only; admin has community_admin=true but no event role. Assign reqLunch to A and reqDinner to B; heads/chef/cashier can read both.

`bill160()` returns purchaserA, purchasedOn2026-09-11, null vendor/reference, one fresh-ID tomato line4kg/160.00/categoryVegetables/no requirements/no allocations. `createBill()` generates fresh mutation/entity IDs and absent base around bill160. Builders deep-clone inputs; do not share mutable arrays between tests. Fake clock default `2026-09-12T04:30:00Z` (10:00 IST).

## F2. Expense reconciliation fixture

`seedFinancialExample(db)` initially inserts these source records in task08 with versions1 and event revision3. Task09 extends the fixture with attributed audit rows after migration0004 creates history tables. Each task owns its explicit fixture extension; do not catch missing-table errors and pretend seeding passed.

| Source | Total | Day1 lunch | Day1 dinner | Common | Detail scope |
| --- | --- | --- | --- | --- | --- |
| A tomato bill |160.00|100.00|40.00|20.00|A, both heads, cashier|
| B rice bill |100.00|100.00|0.00|0.00|B, both heads, cashier|
| Cleaning other expense by cashier |40.00|0.00|20.00|20.00|both heads, cashier|
| Event |300.00|200.00|60.00|40.00|aggregates available to all five roles|

A's My expenses subtotal160.00; B's100.00; chef groups empty/visibleSubtotal0.00, eventTotal300.00. Dinner-filtered other-expense contribution20.00, not40.00. A kitchen head voiding B's bill yields event200.00, lunch100.00, dinner60.00, common40.00. A later50.00 common other expense raises event total to250.00 even after meals complete.

Bulk quantity fixture is separate from the financial fixture: rice requirements5+5kg and one purchased line8kg linking both. One connected component of requirement links reports8/10kg once. A selected subset must not claim8kg fulfilled for each meal. If a component includes requirements outside the current shopper's read scope, show only scoped planned quantities and label purchase attribution shared; do not reveal hidden requirement IDs or exact hidden planned totals.

## F3. PostgreSQL harness (task06, extended07–09)

`withTestDb(run)` requires `TEST_DATABASE_URL`, verifies the database is explicitly a disposable test target, creates a random schema, sets search_path per connection, applies versioned migrations and drops only that owned schema after closing its pool. No public-schema truncation, global database drop, production URL fallback or catch-and-pass when PostgreSQL is missing. Run DB integration files serially or isolate their schemas completely. Failed connections mean BLOCKED, never PASS.

`seedKitchen(db)` inserts F1 as tables become available. `seedFinancialExample(db)` belongs to task08. Fixtures use SQL on this test connection only. `createServices(db)` in `apps/api/test/services.ts` composes implemented services directly, with no authentication bypass in production code.

## F4. HTTP/identity harness (task11, extended12/15)

```ts
export type Actor = 'shopperA'|'shopperB'|'chef'|'kitchenHead'|'cashier'|'ravisabhaHead'|'admin'|'pending';
export interface TestReply { status:number; body:unknown; headers:Headers }
export interface ApiFixture {
 db:AppDatabase;
 request(method:string,path:string,options?:{as?:Actor;body?:unknown;headers?:Record<string,string>}):Promise<TestReply>;
}
export declare function withApiFixture(run:(f:ApiFixture)=>Promise<void>):Promise<void>;
```

Task11 starts a loopback issuer with a fresh signing key, discovery and JWKS endpoint and issues standards-compliant access tokens for fixture identities. The real verifier is configured for that issuer in the isolated Nest test application. No `as` query parameter or header-based user override exists in shipped routes: the harness converts `as` into a signed test bearer token. The fixture issuer also creates wrong-audience/expired/ID-token cases. Task12 adds a test authorization endpoint/code exchange and cookie jar for state/nonce/PKCE/CSRF tests; local Keycloak realm is exercised separately by browser acceptance.

Tests narrow `body` through runtime response schemas before field access. Test examples using `expect(body).toMatchObject(...)` intentionally accept unknown data and are directly usable without any-casts. Use real HTTP assertions where a guard/route is under test and service tests for transaction races.

## F5. Browser fixture (task31)

`tests/web/fixtures.ts` exports Playwright `test` and `expect`. Fixture `signedInPage` is a Page authenticated through the isolated Keycloak test realm as shopperA; `loginAs(page, Actor)` clears/replaces only test sessions through normal logout/login; `seedScenario(name)` resets only the test schema to `planning` or `financial`. `apiState(eventId)` reads assertions via the test harness database, never a production-only admin endpoint. Synthetic Keycloak test users are seeded from local test configuration; no real Google credentials are needed.

Start test API/Keycloak/web explicitly using loopback test configuration. The fixture must refuse a production issuer/origin. Browser login must exercise the normal web callback/session path. An unauthenticated mock web page is insufficient acceptance for offline saving.

## F6. Local-store contract harness (task26–28)

Task26 supplies `snapshotFixture(overrides?)`, `queuedBillFixture(overrides?)`, `createMemoryStore()` as a reference test adapter, and a `runStoreContract(makeStore)` suite. Memory tests prove reducer behavior only. Task27 runs the same scenarios in actual browser IndexedDB (Playwright), including close/reopen and an injected failure inside a transaction. Task28 wires the same assertions to an installed native SQLite diagnostic harness; execute only when physical-device testing is authorized. A fake SQLite mock cannot be reported as native persistence evidence.

Use injectable storage failure hooks only in test adapters/harnesses, not public production API endpoints. Name every injected point: after proposed-record write/before outbox write; after server commit/before response; after snapshot fetch/before apply; before migration commit.
