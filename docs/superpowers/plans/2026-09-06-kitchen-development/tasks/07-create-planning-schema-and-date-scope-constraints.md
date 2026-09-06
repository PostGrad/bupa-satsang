# Task 07: Create planning schema and date/scope constraints

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [06](./06-create-identity-event-schema-and-disposable-db-harness.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Data migration0002; F1/F3; C2**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/database/src/schema/{meals,planning}.ts`
- `packages/database/migrations/0002_planning.sql`
- `apps/api/test/planning-db.integration.test.ts`
- `apps/api/test/database.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Meal/menu/requirement/catalog/assignment tables; full F1 planning seed.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db);
 await expect(db.query('update events set end_date=$1 where id=$2',
 ['2026-09-11',ids.event])).rejects.toThrow();
});
```

**Required cases:** Same dish in lunch/dinner produces two menu entries; mismatched meal/entry/event rejected; range shrinking past a meal rejected; rescheduling preserves ID; duplicate assignment rejected.

- [ ] **Implementation action 1:** Use composite scope FKs and explicit null-pair checks.
- [ ] **Implementation action 2:** Implement parent event locking and date validation triggers on meal/event changes.
- [ ] **Implementation action 3:** Enforce catalog community scope via event composite references.
- [ ] **Implementation action 4:** Preserve referenced rows with RESTRICT and retired flags; no cascades from event cleanup.
- [ ] **Implementation action 5:** Test date-edit/meal-insert concurrency against actual PostgreSQL connections.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/planning-db.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
