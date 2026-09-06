# Task 19: Implement manual requirements and shopper assignments

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [18](./18-implement-catalogs-aliases-and-meal-menu-entries.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2; F1/F4; requirement access defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/planning/{requirements.controller,requirement.service}.ts`
- `apps/api/test/requirements.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Requirement PUT and scoped requirement query used by snapshots; planned quantity stays separate from purchases.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('PUT',`/api/v1/events/${ids.event}/requirements/${ids.reqLunch}`,
 {as:'kitchenHead',body:{expectedVersion:1,requirement:requirementFixture(),shopperIds:[ids.chef]}});
 expect(r.status).toBe(400);
});
```

**Required cases:** Kitchen head assigns only current active event shoppers; assignment never creates role; shopperA cannot readB-only requirement; common supplies valid; invalid meal/menu pair rejected.

- [ ] **Implementation action 1:** Add requirementFixture() to test-support matching reqLunch.
- [ ] **Implementation action 2:** Atomically validate positive exact quantity, scope, optimistic version and every active-shopper assignment.
- [ ] **Implementation action 3:** Replace assignment set explicitly, append audit, increment event revision.
- [ ] **Implementation action 4:** Preserve planned values when later purchases differ.
- [ ] **Implementation action 5:** Changes do not expand event role grants.
- [ ] **Implementation action 6:** Retire referenced requirements with history rather than deleting them.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/requirements.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
