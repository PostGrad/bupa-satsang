# Task 04: Implement the complete pure permission matrix

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [03](./03-define-event-meal-and-planning-runtime-schemas.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1; binding access defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/domain/src/{access,access.test}.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** can,canReadBill,canEditBill with EventAccess from C1; community administration remains a separate server permission.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const access={active:true,roles:['ravisabha_head'] as const,accessVersion:1};
expect(canReadBill({...access,roles:[...access.roles]},ids.ravisabhaHead,ids.shopperA)).toBe(true);
expect(canEditBill({...access,roles:[...access.roles]},ids.ravisabhaHead,ids.shopperA)).toBe(false);
```

**Required cases:** Inactive membership denies every capability; chef cannot read/edit bills; shopper own only; both heads read all; only kitchen head/cashier edit all; mixed roles union within event.

- [ ] **Implementation action 1:** Use deny-first active/roles checks, then explicit capability sets.
- [ ] **Implementation action 2:** Ownership is required for shopper read/edit; bill.create requires shopper role even for a head/cashier.
- [ ] **Implementation action 3:** Encode other-expense/planning/leftover defaults exactly from decisions.md.
- [ ] **Implementation action 4:** Add table-driven tests covering each role and two meaningful role combinations; never encode community-admin as a kitchen role.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/domain/src/access.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
