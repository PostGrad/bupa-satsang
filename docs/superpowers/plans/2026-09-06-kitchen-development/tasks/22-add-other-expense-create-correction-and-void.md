# Task 22: Add other-expense create, correction and void

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [21](./21-add-bill-corrections-dependent-bases-and-voids.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3; F2/F4; other-expense defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/other-expenses/{expense.service,expense.repository}.ts`
- `apps/api/src/sync/mutation.service.ts`
- `apps/api/test/other-expense.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** expense.create/update/void using existing receipt/transaction engine; recorder from Principal.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const mutation=expense40Mutation();
 const r=await f.request('POST',`/api/v1/events/${ids.event}/mutations`,{as:'shopperA',body:mutation});
 expect(r.body).toMatchObject({status:'rejected',code:'FORBIDDEN'});
});
```

**Required cases:** Kitchen head/cashier write; Ravisabha head read-only; shopper/chef cannot write; split allocations reconcile; recorder not changed on correction; no payment field accepted; updates after meal completion allowed.

- [ ] **Implementation action 1:** Add expense40Mutation() fixture for cashier cleaning40.00, dinner20.00/common20.00.
- [ ] **Implementation action 2:** Reuse transaction/receipt/base helpers, not a copied sync engine.
- [ ] **Implementation action 3:** Validate same-event allocations/source bounds with schema and DB constraints.
- [ ] **Implementation action 4:** Preserve original recorder, latest editor in audit.
- [ ] **Implementation action 5:** Void/correction semantics match bills, without invented purchaser/quantity.
- [ ] **Implementation action 6:** Reconciliation is verified again in task24/25.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/other-expense.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
