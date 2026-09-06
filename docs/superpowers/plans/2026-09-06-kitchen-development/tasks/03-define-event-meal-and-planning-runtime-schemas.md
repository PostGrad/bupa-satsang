# Task 03: Define event, meal and planning runtime schemas

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [02](./02-implement-exact-money-and-quantity-arithmetic.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1/C2; F1**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/contracts/src/{common,events,planning,index}.ts`
- `packages/contracts/src/planning.test.ts`
- `packages/domain/src/dates.ts`
- `packages/contracts/{package,project,tsconfig}.json`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** C1/C2 types plus eventDetailsSchema,mealSchema,catalogItemSchema,menuEntrySchema,requirementSchema; validateMealInEvent(meal,event):void.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
expect(()=>validateMealInEvent(
 {...mealFixture(),servesOn:'2026-09-14'}, eventFixture()
)).toThrow();
expect(mealSchema.safeParse({...mealFixture(),plannedHeadcount:null}).success).toBe(true);
```

**Required cases:** Reject2026-02-30, out-of-range meal, invalid time24:00, invalid timezone and negative headcount; allow null headcount, same-date/type distinct meals and purchasing before event.

- [ ] **Implementation action 1:** Add Zod with exact pinned version.
- [ ] **Implementation action 2:** Implement strict schemas and separate create/update inputs.
- [ ] **Implementation action 3:** Add eventFixture/mealFixture to test-support using F1 dates and IDs.
- [ ] **Implementation action 4:** CatalogItem includes version:number.
- [ ] **Implementation action 5:** Keep meal identity independent of date/type.
- [ ] **Implementation action 6:** Enforce requirement entry/meal association locally; database scope checks remain mandatory.
- [ ] **Implementation action 7:** Export runtime schemas and inferred DTO types through the package barrel.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/contracts/src/planning.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
