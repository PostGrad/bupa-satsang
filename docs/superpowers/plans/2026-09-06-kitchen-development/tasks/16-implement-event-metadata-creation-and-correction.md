# Task 16: Implement event metadata creation and correction

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [15](./15-implement-community-administration-and-audited-bootstrap.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2; data API event routes; F4**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/events/{events.controller,event.service}.ts`
- `apps/api/test/events.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Admin event POST/PATCH from API map; assigned-event listing keeps existing role scope.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('POST',`/api/v1/communities/${ids.community}/events`,
 {as:'shopperA',body:{name:'Unauthorized'}});
 expect(r.status).toBe(403);
});
```

**Required cases:** Draft event can have zero meals; date range inclusive; invalid timezone rejected; stale version409; ordinary head cannot create event; shrinking range cannot orphan a meal.

- [ ] **Implementation action 1:** Add explicit create/patch schemas from C2.
- [ ] **Implementation action 2:** Use community-admin guard, community→event locks, expectedVersion check, increment metadata version and event revision and append audit together.
- [ ] **Implementation action 3:** For create allow client UUID but reject existing ID; no default operational role grant to creator.
- [ ] **Implementation action 4:** Return full metadata only after authorization.
- [ ] **Implementation action 5:** There is no event delete route.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/events.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
