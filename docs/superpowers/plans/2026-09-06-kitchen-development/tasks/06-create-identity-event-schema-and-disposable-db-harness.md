# Task 06: Create identity/event schema and disposable DB harness

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [05](./05-define-expense-mutation-snapshot-and-report-schemas.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Data migration0001; F1/F3; C4**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/database/src/{client,index}.ts`
- `packages/database/src/schema/{identity,events}.ts`
- `packages/database/migrations/0001_identity_events.sql`
- `apps/api/test/{database,identity-db.integration.test}.ts`
- `infra/compose.dev.yml`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** AppDatabase,AppTx,createDatabase,withTransaction,withTestDb,initial seedKitchen; migration command pnpm db:migrate using explicit DATABASE_URL.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db);
 const rows=await db.query('select count(*)::int as n from events');
 expect(rows.rows[0].n).toBe(2);
});
```

**Required cases:** Unique issuer/subject; unique role grant; cross-community role/event rejected; start>end rejected; DB absence fails honestly; disposable schemas never target public.

- [ ] **Implementation action 1:** Pin pg/Drizzle and define C4 connection wrapper with query(sql,params), close(), and transaction access to the same connection.
- [ ] **Implementation action 2:** Add0001 constraints/indexes from data-api.md.
- [ ] **Implementation action 3:** Create isolated schema harness with explicit test target guard.
- [ ] **Implementation action 4:** Compose exposes development PostgreSQL on loopback only, uses local uncommitted env values and named development volumes.
- [ ] **Implementation action 5:** Apply migrations in order with checksums; abort on changed applied migration.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/identity-db.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
