# Task 02: Implement exact money and quantity arithmetic

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [01](./01-add-deterministic-test-builders-and-package-boundaries.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1; F1**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/domain/src/{money,quantity,money.test,quantity.test}.ts`
- `packages/domain/{package,project,tsconfig}.json`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** normalizeMoney,toPaise,fromPaise,sumMoney,commonAmount,quantityMillis from C1.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
expect(sumMoney(['0.10','0.20','160.00'])).toBe('160.30');
expect(toPaise('160.30')).toBe(16030n);
expect(commonAmount('1000.00',[
 {mealId:ids.lunch,amount:'400.00'}, {mealId:ids.nextLunch,amount:'350.00'}
])).toBe('250.00');
expect(()=>normalizeMoney('1.001')).toThrow();
```

**Required cases:** 0.10+0.20+160.00=160.30; source maximum accepted; aggregate may exceed source maximum; negative/exponent/3-decimal money rejected; quantity1.001 retained; no kg/l conversion.

- [ ] **Implementation action 1:** Validate decimal grammar before splitting.
- [ ] **Implementation action 2:** Convert whole and fraction to BigInt paise, pad exactly two digits when formatting.
- [ ] **Implementation action 3:** Reject allocation duplicates/nonpositive values and sum above source.
- [ ] **Implementation action 4:** Keep source-bound validation separate from unbounded aggregate formatting.
- [ ] **Implementation action 5:** Quantity uses a separate1000 multiplier and independent positive/nonnegative validation.
- [ ] **Implementation action 6:** Never parseFloat, Number(amount), or floating-point addition.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/domain/src/money.test.ts packages/domain/src/quantity.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
