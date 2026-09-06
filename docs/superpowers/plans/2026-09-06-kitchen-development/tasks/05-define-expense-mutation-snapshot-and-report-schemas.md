# Task 05: Define expense, mutation, snapshot and report schemas

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [03](./03-define-event-meal-and-planning-runtime-schemas.md), [04](./04-implement-the-complete-pure-permission-matrix.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1–C4; F1/F2**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/contracts/src/{bill,expense,leftover,mutation,snapshot,reports}.ts`
- `packages/contracts/src/mutation.test.ts`
- `packages/test-support/src/fixtures.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** C3/C4 DTOs and named runtime schemas; C6 builders now use actual types. No new API route yet.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const m=createBill();
m.payload.lines[0].allocations=[{mealId:ids.lunch,amount:'160.01'}];
expect(entityMutationSchema.safeParse(m).success).toBe(false);
expect(entityMutationSchema.safeParse({...createBill(),base:{kind:'version',value:1}}).success).toBe(false);
```

**Required cases:** Reject duplicate line/requirement/meal IDs; invalid base/kind pairs; foreign event validated later; over-allocation/source reduction rejected; zero cost valid but positive quantity required; leftover zero valid.

- [ ] **Implementation action 1:** Implement discriminated runtime unions for create/update/void and source record types.
- [ ] **Implementation action 2:** Normalize user money before queue creation and require canonical normalized envelopes for transport.
- [ ] **Implementation action 3:** Validate field bounds from C2, version safe-integer bounds and same leftover entity/menu-entry ID.
- [ ] **Implementation action 4:** Snapshot schemas validate aggregate decimal format without a single-line maximum.
- [ ] **Implementation action 5:** Keep unknown fields rejected; no permissive z.any payload.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/contracts/src/mutation.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
