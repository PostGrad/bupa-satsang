# Task 38: Build per-dish offline leftovers

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [23](./23-add-versioned-leftover-observations.md), [30](./30-implement-recovery-drafts-and-pending-cost-projection.md), [33](./33-build-event-meal-and-menu-planning-screens.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C5; F1/F5**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/features/leftovers/{LeftoverList,LeftoverForm}.tsx`
- `apps/client/app/events/[eventId]/leftovers.tsx`
- `tests/web/leftovers.spec.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Leftover form keyed by meal-menu-entry with quantity/unit and shared durable queue.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('records explicit zero',async({page})=>{
 await loginAs(page,'chef'); await page.goto(`/events/${ids.event}/leftovers?mealId=${ids.lunch}`);
 await page.getByLabel('Rotli quantity').fill('0');
 await page.getByRole('button',{name:'Save leftovers',exact:true}).click();
 await expect(page.getByText('0 pieces',{exact:true})).toBeVisible();
});
```

**Required cases:** Blank Not recorded vs0none; piece/vessel accepted independently; shopper read-only; chef/head writes; repeated dish different meals independent; stable target through schedule changes.

- [ ] **Implementation action 1:** Use menu occurrence as entityId and version/predecessor base from local repository.
- [ ] **Implementation action 2:** Do not create an observation for untouched blank fields.
- [ ] **Implementation action 3:** Persist quantity and selected suitable unit together.
- [ ] **Implementation action 4:** Render meal date/label in edit header and keep ID stable through rerenders; never sum observations or change expense totals.
- [ ] **Implementation action 5:** Current-form unit defaults must be explicit fixture/user selection, not inferred vessel capacity.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/leftovers.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
