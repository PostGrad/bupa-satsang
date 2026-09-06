# Task 20: Create bills through one replay-safe transaction

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [19](./19-implement-manual-requirements-and-shopper-assignments.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C4; write ordering; F1/F3**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/sync/{mutation.service,sync.controller,fingerprint}.ts`
- `apps/api/src/kitchen/bills/{bill.service,bill.repository}.ts`
- `apps/api/test/mutation-create.integration.test.ts`
- `apps/api/test/services.ts`

**Additional owned test/wiring files:** `apps/api/src/sync/schema-version.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** MutationService.apply initially implements bill.create; POST mutations returns C3 PushResult; unsupported kinds rejected until owning task adds them.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db); const {mutations}=createServices(db); const m=createBill();
 const first=await mutations.apply({userId:ids.shopperA},m);
 expect(first.status).toBe('accepted');
 expect(await mutations.apply({userId:ids.shopperA},m)).toEqual(first);
});
```

**Required cases:** Lost acknowledgement retry returns exactly first receipt; concurrent same-ID creates one bill/audit/revision; changed payload ID_REUSED; another user cannot read receipt; revoked membership retry denied; tx failure rolls back all children.

- [ ] **Implementation action 1:** Follow exact lock/replay ordering in data-api.md.
- [ ] **Implementation action 2:** Normalize and canonical-hash complete envelope.
- [ ] **Implementation action 3:** Check shopper ownership and all requirement/item/meal scopes; accept absent base only.
- [ ] **Implementation action 4:** Persist bill/lines/links/allocations, one event revision, audit and receipt in one AppTx connection.
- [ ] **Implementation action 5:** Receipt lookup must come after current access.
- [ ] **Implementation action 6:** Serialize concurrent requests using event lock plus receipt uniqueness.
- [ ] **Implementation action 7:** Add injected transaction failure test at after-lines/before-receipt; production path has no fault header.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/mutation-create.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
