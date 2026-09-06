# Task 24: Return consistent authorized snapshots and totals

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [23](./23-add-versioned-leftover-observations.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C4; F1/F2/F3; snapshot ordering**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/sync/{snapshot.service,sync.controller}.ts`
- `apps/api/src/kitchen/reports/totals.ts`
- `apps/api/test/snapshot.integration.test.ts`
- `apps/api/test/services.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** SnapshotService.read and GET snapshot; all C4 arrays populated with permission filters and revision watermarks.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db); await seedFinancialExample(db);
 const s=await createServices(db).snapshots.read({userId:ids.chef},ids.event);
 expect([s.eventTotal,s.commonEventCost]).toEqual(['300.00','40.00']);
 expect(s.bills).toEqual([]); expect(s.otherExpenses).toEqual([]);
});
```

**Required cases:** All roles total300/lunch200/dinner60/common40; A sees own bill; chef sees zero bills/other expenses; hidden requirements/purchaser data absent; snapshot cannot mix before/after concurrent commit.

- [ ] **Implementation action 1:** Read access/revisions/current roles and data within one REPEATABLE READ AppTx.
- [ ] **Implementation action 2:** Include current roles in the snapshot for client permission-change recovery.
- [ ] **Implementation action 3:** Aggregate active source amounts before joining allocations.
- [ ] **Implementation action 4:** Include totals independent of readable details and the authorized catalog context required for offline forms.
- [ ] **Implementation action 5:** Filter assignments/requirements and construct price-free purchaseProgress from scoped links, using attribution marker for shared groups.
- [ ] **Implementation action 6:** Never serialize bill IDs/prices/purchaser into chef progress.
- [ ] **Implementation action 7:** Include retired context needed for visible history.
- [ ] **Implementation action 8:** Test concurrent snapshot/write with a controlled barrier, not timing sleeps.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/snapshot.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
