# Task 41: Verify the full five-role multi-day browser workflow

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [32](./32-build-volunteer-and-event-team-administration-screens.md), [33](./33-build-event-meal-and-menu-planning-screens.md), [34](./34-build-requirement-planning-and-consolidated-shopping-views.md), [35](./35-build-durable-shopping-led-bill-entry-and-correction.md), [36](./36-build-common-single-meal-and-split-cost-controls.md), [37](./37-build-other-expenses-totals-report-filters-and-history.md), [38](./38-build-per-dish-offline-leftovers.md), [39](./39-build-visible-sync-status-and-conflict-recovery.md), [40](./40-add-versioned-web-shell-caching-and-safe-updates.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **F1/F2/F5; all binding product invariants**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tests/web/kitchen-journey.spec.ts`
- `docs/acceptance/browser-workflow.md`

**Additional owned test/wiring files:** `apps/client/src/features/expenses/ExpenseOverview.tsx`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Measured complete web scenario from administration→meal plans→shopping→costs→leftovers with role restrictions and Gujarati.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('all roles see the same aggregate',async({page})=>{
 await seedScenario('financial');
 for(const actor of ['shopperA','shopperB','chef','kitchenHead','cashier','ravisabhaHead'] as const){
 await loginAs(page,actor); await page.goto(`/events/${ids.event}/expenses`);
 await expect(page.getByTestId('event-total')).toHaveText('₹300.00');
 }
});
```

**Required cases:** F1/F2 totals exact; correct role actions/denials; second event forbidden; meal reschedule preserves entry/allocations; Gujarati labels and keyboard/touch layout at325/390/1280px.

- [ ] **Implementation action 1:** Use real test-realm login for each actor and actual API/database assertions.
- [ ] **Implementation action 2:** Add stable event-total test ID to the already-built overview only if absent; do not rewrite screens during acceptance.
- [ ] **Implementation action 3:** Inspect response payloads for hidden bill/requirement leakage, not just button visibility.
- [ ] **Implementation action 4:** Record defects with owning task IDs and rerun only affected scenarios after correction.
- [ ] **Implementation action 5:** Acceptance document lists actual environment/results and pending native/provider gates.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/kitchen-journey.spec.ts
pnpm test:api
pnpm test:unit
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
