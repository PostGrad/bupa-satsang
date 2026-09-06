# Task 45: Implement reviewed, repeat-safe historical import

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [44](./44-extract-and-preview-workbook-history-without-importing.md), [20](./20-create-bills-through-one-replay-safe-transaction.md), [22](./22-add-other-expense-create-correction-and-void.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **F3; import tables; source mapping guide**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tools/migration/{import-history.ts,import-history.test.ts}`
- `docs/operations/history-import.md`

**Additional owned test/wiring files:** `vitest.integration.config.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** CLI preview first; explicit --apply with reviewed manifest hash/operator user; deterministic source-key idempotency and attributed imported expenses.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const first=await importReviewedManifest(db,manifest,{operatorId:ids.admin,apply:true});
const second=await importReviewedManifest(db,manifest,{operatorId:ids.admin,apply:true});
expect(first.inserted).toBeGreaterThan(0);
expect(second.inserted).toBe(0);
```

**Required cases:** Second run adds0expenses; changed mapping requires new reviewed version; unknown purchaser does not fabricate user/billowner; known sheet totals reconcile; partial failure rolls back scoped transaction.

- [ ] **Implementation action 1:** Define importReviewedManifest with validated Manifest from task44.
- [ ] **Implementation action 2:** Default CLI produces preview only.
- [ ] **Implementation action 3:** Apply requires zero unresolved reviewIssues, explicit event grouping, valid operator and exact expected workbook/mapping hash.
- [ ] **Implementation action 4:** Use import_sources unique stable keys, source SQL constraints and audit; preserve legacy purchaser label on imported expense where no approved identity mapping exists.
- [ ] **Implementation action 5:** Use mapped bills only where ownership/line grouping is reviewed.
- [ ] **Implementation action 6:** Reconcile before marking import_run complete.
- [ ] **Implementation action 7:** Run against disposable DB; live import remains an operator-reviewed action.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api tools/migration/import-history.test.ts
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
