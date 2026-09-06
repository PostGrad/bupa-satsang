# Task 33: Build event, meal and menu planning screens

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [16](./16-implement-event-metadata-creation-and-correction.md), [17](./17-implement-dated-meal-scheduling-and-lifecycle.md), [18](./18-implement-catalogs-aliases-and-meal-menu-entries.md), [31](./31-wire-web-sessions-event-navigation-and-browser-fixtures.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2; F1/F5; screen journeys dated meal schedule**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/app/events/[eventId]/index.tsx`
- `apps/client/src/features/planning/{EventForm,MealForm,MenuEditor,MealSchedule}.tsx`
- `tests/web/planning.spec.ts`
- `packages/ui/src/i18n/{en,gu}.json`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Date-grouped meal schedule, menu/headcount per meal, admin event metadata and head meal/menu forms.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('keeps meals separate',async({signedInPage:page})=>{
 await expect(page.getByText('Day 1 lunch',{exact:true})).toBeVisible();
 await expect(page.getByText('Day 2 dinner',{exact:true})).toBeVisible();
});
```

**Required cases:** Distinct lunch/dinner counts; null shown Not entered not0; long Gujarati dish name readable; meal selector cannot change an open form target at midnight; stale correction shows409 recovery.

- [ ] **Implementation action 1:** Use route IDs and explicit form target IDs, never date/type as key.
- [ ] **Implementation action 2:** Present event range/timezone and day groups; highlight current/next meal without changing selected target.
- [ ] **Implementation action 3:** Read mode available to all event roles; writes reflect permissions and are online only.
- [ ] **Implementation action 4:** Support custom meal label, optional time, nullable count and status.
- [ ] **Implementation action 5:** Catalog selection creates an independent menu occurrence.
- [ ] **Implementation action 6:** Retirement/cancellation UI explains preserved history.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/planning.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
