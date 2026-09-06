# Task 28: Implement native SQLite adapter without compiling

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [26](./26-define-local-records-immutable-queue-and-reconciliation.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F6; no-native-compilation constraint**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/local-store/src/{store.native,native-write-queue}.ts`
- `packages/local-store/src/migrations/native.ts`
- `tests/android/storage-contract.ts`
- `docs/acceptance/native-storage.md`

**Additional owned test/wiring files:** `packages/local-store/src/native-write-queue.test.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** SQLite LocalStore adapter and callable runNativeStorageContract(); same transition/reconciliation behavior as browser.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const result=await runNativeStorageContract();
expect(result.failed).toEqual([]);
expect(result.executed).toContain('restart-preserves-pending');
```

**Required cases:** Atomic record/outbox; serialized exclusive writes; close/reopen; pending-schema migration; disk failure; per-user partition; actual runtime tests explicitly pending.

- [ ] **Implementation action 1:** Use expo-sqlite transactional API with exclusive transaction handle and serialize writes at adapter boundary.
- [ ] **Implementation action 2:** Execute parameterized SQL only on that handle.
- [ ] **Implementation action 3:** Reuse pure reducers to compute next state; write affected rows/watermarks atomically.
- [ ] **Implementation action 4:** Prepare diagnostic harness callable on a physical development build, not enabled in production routes.
- [ ] **Implementation action 5:** Run TypeScript/shared pure tests now only when execution starts; do not prebuild/compile/emulate.
- [ ] **Implementation action 6:** The snippet is a future device-run assertion, not Node SQLite evidence.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm typecheck
pnpm test:unit packages/local-store/src/reducer.test.ts
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
