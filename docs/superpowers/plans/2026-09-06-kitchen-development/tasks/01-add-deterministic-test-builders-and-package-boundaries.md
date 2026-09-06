# Task 01: Add deterministic test builders and package boundaries

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [00](./00-checkpoint-and-finish-the-existing-web-api-scaffold.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **F1; C6**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/test-support/src/{fixtures,fixtures.test}.ts`
- `packages/test-support/{package,project,tsconfig}.json`
- `tsconfig.base.json`
- `eslint.config.mjs`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** ids, bill160(), createBill() builders from C6/F1; test-only package exports and client/server import boundaries.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const a = createBill(); const b = createBill();
expect(a.mutationId).not.toBe(b.mutationId);
a.payload.lines[0].description = 'Changed';
expect(b.payload.lines[0].description).toBe('Tomatoes');
```

**Required cases:** Two builds have different mutation/entity/line UUIDs; changing one payload does not modify another; public packages cannot import database/Nest/test fixture modules.

- [ ] **Implementation action 1:** Create F1 constants and deep-cloned builders with fresh randomUUID IDs.
- [ ] **Implementation action 2:** Keep initial builder return types structural until contracts exist; task05 replaces them with exported contract types.
- [ ] **Implementation action 3:** Add workspace package manifests and lint restricted-import rules for client/domain/contracts/ui/local-store/sync.
- [ ] **Implementation action 4:** Test-support imports remain allowed in *.test.ts and test directories only.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/test-support/src/fixtures.test.ts
pnpm lint
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
