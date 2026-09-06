# Task 37: Build other expenses, totals, report filters and history

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [22](./22-add-other-expense-create-correction-and-void.md), [25](./25-implement-scoped-expense-reports-and-history.md), [30](./30-implement-recovery-drafts-and-pending-cost-projection.md), [36](./36-build-common-single-meal-and-split-cost-controls.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C4/C5; F2/F5**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/features/expenses/{ExpenseForm,ExpenseOverview,ExpenseReports,HistoryView}.tsx`
- `apps/client/app/events/[eventId]/expenses.tsx`
- `tests/web/expenses.spec.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Other-expense offline forms, event/meal/common views, category/item/bill/shopper filters and permitted history.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('labels shopper detail scope',async({page})=>{
 await seedScenario('financial'); await loginAs(page,'shopperA');
 await page.goto(`/events/${ids.event}/expenses`);
 await expect(page.getByText('My expenses',{exact:true})).toBeVisible();
 await expect(page.getByText('₹160.00',{exact:true})).toBeVisible();
});
```

**Required cases:** 300total with200lunch/60dinner/40common; A My expenses160 visibly scoped; chef has totals only; pending delta separated; void requires reason and preserves history; late expenses editable.

- [ ] **Implementation action 1:** Reuse AllocationEditor and queued command path for other expenses.
- [ ] **Implementation action 2:** Use server report scope labels and visible subtotal; never derive full event totals from readable rows.
- [ ] **Implementation action 3:** Provide meal/common filters using stable meal ID, labeled attributed cost while common remains.
- [ ] **Implementation action 4:** Other expenses bucket stays distinct from common costs.
- [ ] **Implementation action 5:** Subscribe editable entries to local repository; history/report reads are request-state only and never overwrite drafts.
- [ ] **Implementation action 6:** No paid/reimbursed fields, approvals or export screen.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/expenses.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
