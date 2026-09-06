# Task 25: Implement scoped expense reports and history

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [24](./24-return-consistent-authorized-snapshots-and-totals.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C4; F2/F4; report defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/reports/{reports.controller,report.service,history.controller}.ts`
- `apps/api/test/reports.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** ExpenseReport for groupBy category/item/bill/shopper and event/meal/common filter; authorized audit history route.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 await seedFinancialExample(f.db);
 const r=await f.request('GET',`/api/v1/events/${ids.event}/reports?groupBy=shopper&scope=event`,{as:'shopperA'});
 expect(r.body).toMatchObject({scope:'my_expenses',eventTotal:'300.00',visibleSubtotal:'160.00'});
});
```

**Required cases:** Full scopes reconcile300; A subtotal160; chef groups empty; dinner cleaning20 not40; Other expenses bucket never assigned to recorder as shopper; history denies unauthorized bill.

- [ ] **Implementation action 1:** Build one authorized source projection with applied cost filter, then group it.
- [ ] **Implementation action 2:** Item-null bill lines use the normalized description key and original item description as label; other expenses/imported legacy rows use explicit Other expenses bucket for item/bill/shopper groups and original category for category view.
- [ ] **Implementation action 3:** Full-source total and group sum must agree for same visible scope.
- [ ] **Implementation action 4:** History authorization uses present read permission and preserves original/updated attribution.
- [ ] **Implementation action 5:** No export endpoint in this scope.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/reports.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
