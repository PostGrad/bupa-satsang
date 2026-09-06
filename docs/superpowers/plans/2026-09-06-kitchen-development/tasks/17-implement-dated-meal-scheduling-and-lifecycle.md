# Task 17: Implement dated meal scheduling and lifecycle

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [16](./16-implement-event-metadata-creation-and-correction.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2; data meal routes; F1/F4**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/planning/{meals.controller,meal.service}.ts`
- `apps/api/test/meals.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Meal POST/PUT with expectedVersion; planned/completed/cancelled lifecycle without expense closure.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const meal={...mealFixture(),servesOn:'2026-09-13'};
 const r=await f.request('PUT',`/api/v1/events/${ids.event}/meals/${ids.lunch}`,
 {as:'ravisabhaHead',body:{expectedVersion:1,meal}});
 expect(r.body).toMatchObject({id:ids.lunch,servesOn:'2026-09-13',version:2});
});
```

**Required cases:** Two lunches on same date allowed with distinct IDs; null headcount preserved; completion does not complete next meal; reschedule ID unchanged; out-of-range and stale edit rejected.

- [ ] **Implementation action 1:** Require Ravisabha-head capability and active event access.
- [ ] **Implementation action 2:** Lock event and compare version; validate local date/time/range then write meal, revision and audit.
- [ ] **Implementation action 3:** Preserve allocations/menu-entry IDs through status/date changes.
- [ ] **Implementation action 4:** Reject unsafe deletion or date-range inconsistency with actionable409/400.
- [ ] **Implementation action 5:** Snapshot meal context is added by task24; this card tests response/database behavior directly.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/meals.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
