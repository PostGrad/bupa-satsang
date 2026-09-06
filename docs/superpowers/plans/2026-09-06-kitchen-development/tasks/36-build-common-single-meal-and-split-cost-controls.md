# Task 36: Build common, single-meal and split-cost controls

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [35](./35-build-durable-shopping-led-bill-entry-and-correction.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1/C3; F2/F5; meal-cost screen journey**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/features/expenses/{AllocationEditor,AllocationSummary}.tsx`
- `apps/client/src/features/bills/BillForm.tsx`
- `tests/web/allocations.spec.ts`

**Additional owned test/wiring files:** `tests/web/helpers/rice-split.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** AllocationEditor value:MealAllocation[],sourceAmount:Money,meals:Meal[],onChange; shared by bill lines and other expenses.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('shows common remainder',async({signedInPage:page})=>{
 await openRiceSplitForm(page); // fixture from this card, source1000.00
 await page.getByLabel('Day 1 lunch allocation').fill('400.00');
 await page.getByLabel('Day 2 lunch allocation').fill('350.00');
 await expect(page.getByText('Common event cost: ₹250.00',{exact:true})).toBeVisible();
});
```

**Required cases:** 1000 assigned400+350 gives250common; full-meal assignment gives0common; duplicate/cross-event meal impossible; source reduction displays invalid split without rescaling; date changes preserve mealID.

- [ ] **Implementation action 1:** Create openRiceSplitForm(page) test helper through normal bill form interactions.
- [ ] **Implementation action 2:** Modes: Common clears allocations; Single sets full source amount to selected meal after user choice; Split uses explicit positive amount rows and common remainder.
- [ ] **Implementation action 3:** Reuse commonAmount and contract validation.
- [ ] **Implementation action 4:** Do not automatically allocate from requirement links.
- [ ] **Implementation action 5:** Reject save until reduced source allocations are explicitly corrected.
- [ ] **Implementation action 6:** Persist allocations within the same bill/expense envelope and version.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/allocations.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
