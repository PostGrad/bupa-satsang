# Task 23: Add versioned leftover observations

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [22](./22-add-other-expense-create-correction-and-void.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3; F1/F4; leftover defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/leftovers/{leftover.service,leftover.repository}.ts`
- `apps/api/src/sync/mutation.service.ts`
- `apps/api/test/leftovers.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** leftover.create/update for entityId=mealMenuEntryId; one observation with revision history.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('POST',`/api/v1/events/${ids.event}/mutations`,
 {as:'chef',body:leftoverMutation(ids.rotliLunch,'0','piece')});
 expect(r.body).toMatchObject({status:'accepted',record:{payload:{quantity:'0',unit:'piece'}}});
});
```

**Required cases:** Chef/kitchen head write; shopper denied; zero distinct from missing; two first creates same occurrence conflict; same dish another meal independent; retired entry stale create rejected with retained client proposal.

- [ ] **Implementation action 1:** Add leftoverMutation(entryId,quantity,unit) fixture with fresh mutation ID, absent base and entityId equal entryId.
- [ ] **Implementation action 2:** Require entry in event, nonnegative exact quantity, valid unit and current write permission.
- [ ] **Implementation action 3:** Existing observation+absent returns conflict rather than summing.
- [ ] **Implementation action 4:** Completed meal accepts observation; retired menu occurrence disallows new creation but permits authorized correction of existing history.
- [ ] **Implementation action 5:** Mutations share event revision/audit/receipt infrastructure.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/leftovers.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
