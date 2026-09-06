# Task 08: Create expenses, allocations and leftover schema

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [07](./07-create-planning-schema-and-date-scope-constraints.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Data migration0003; F2/F3; C3**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/database/src/schema/{bills,expenses,leftovers}.ts`
- `packages/database/migrations/0003_expenses.sql`
- `apps/api/test/expense-db.integration.test.ts`
- `apps/api/test/database.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Financial/source tables plus seedFinancialExample; source-sum, ownership, same-event and leftover uniqueness constraints.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db); await seedFinancialExample(db);
 await expect(db.query(
  `update bill_lines l set amount='139.99' from bills b
   where l.bill_id=b.id and b.purchaser_id=$1 and b.event_id=$2`,
  [ids.shopperA,ids.event]
 )).rejects.toThrow(); // existing allocations total140.00
});
```

**Required cases:** 160 split100+40 leaves20; source sum never multiplied by joins; allocation sum161 rejected; cross-event allocation/link rejected; two leftovers for same menu occurrence rejected; no delete cascade.

- [ ] **Implementation action 1:** Create0003 with exact numeric precision and scope FKs.
- [ ] **Implementation action 2:** Parent-event lock triggers serialize financial child writes.
- [ ] **Implementation action 3:** Deferred sum triggers validate final source and allocation rows at commit, including amount reductions.
- [ ] **Implementation action 4:** Bill purchaser/event immutable; source ownership history not deleted.
- [ ] **Implementation action 5:** Leftover primary ID equals meal menu entry.
- [ ] **Implementation action 6:** Include import metadata columns with source FK added in0004.
- [ ] **Implementation action 7:** Add explicit violating-SQL tests, not just TypeScript validation.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/expense-db.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
