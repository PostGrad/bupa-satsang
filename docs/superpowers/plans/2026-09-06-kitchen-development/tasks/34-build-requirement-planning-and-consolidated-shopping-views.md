# Task 34: Build requirement planning and consolidated shopping views

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [19](./19-implement-manual-requirements-and-shopper-assignments.md), [24](./24-return-consistent-authorized-snapshots-and-totals.md), [33](./33-build-event-meal-and-menu-planning-screens.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2/C4; F1/F2/F5; purchase-progress privacy defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/domain/src/{shopping,shopping.test}.ts`
- `apps/client/src/features/shopping/{RequirementEditor,ShoppingList,AssignmentPicker}.tsx`
- `tests/web/shopping.spec.ts`

**Additional owned test/wiring files:** `apps/api/src/kitchen/reports/purchase-progress.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** consolidateRequirements(requirements):ShoppingGroup[]; groupPurchasedProgress(groups,progress); role-specific shopping list and assignments.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const groups=consolidateRequirements([
 {...requirementFixture(),quantity:'5'},
 {...requirementFixture(),id:ids.reqDinner,mealId:ids.dinner,quantity:'5'}
]);
expect(groups[0].plannedQuantity).toBe('10');
expect(groups[0].requirementIds).toHaveLength(2);
```

**Required cases:** 5+5kg requirements and one8kg line show8/10 once; partial/multiple bills retained; no kg/l conversion; retired list item not silently removed from draft; assignment does not grant a role.

- [ ] **Implementation action 1:** Define ShoppingGroup={itemId,unit,description,requirementIds,plannedQuantity}.
- [ ] **Implementation action 2:** Group exact item+unit with BigInt quantity arithmetic and retain underlying IDs.
- [ ] **Implementation action 3:** Use the exact purchase-progress grouping/attribution rules in data-api.md; purchase rows linked across groups form connected attribution groups; count each source line once in server progress.
- [ ] **Implementation action 4:** When selected scope omits linked requirements, mark shared allocation unknown rather than inventing each-meal fulfillment.
- [ ] **Implementation action 5:** Show planned, recorded and device-pending quantities separately.
- [ ] **Implementation action 6:** Kitchen-head editor uses current eligible shopper list and unchanged version checks.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/domain/src/shopping.test.ts
pnpm test:web tests/web/shopping.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
