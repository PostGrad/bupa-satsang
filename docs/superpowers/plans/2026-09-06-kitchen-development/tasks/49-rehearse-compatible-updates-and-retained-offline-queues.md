# Task 49: Rehearse compatible updates and retained offline queues

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [40](./40-add-versioned-web-shell-caching-and-safe-updates.md), [42](./42-verify-offline-failures-lost-acknowledgements-and-concurrency.md), [46](./46-write-deployment-configuration-and-configuration-validation.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C5; update policy; production gate**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tests/web/upgrade.spec.ts`
- `apps/api/test/compatibility.integration.test.ts`
- `docs/operations/upgrades.md`

**Additional owned test/wiring files:** `tests/fixtures/protocol-v1/bill-create.json`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Backward-compatible schema/API deployment procedure and measured client upgrade with queued mutations.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
expect(entityMutationSchema.safeParse({...createBill(),schemaVersion:2}).success).toBe(false);
// HTTP integration must separately assert426 and zero writes for this envelope.
```

**Required cases:** Older supported schemaVersion1mutation accepted after additive migration; unknownfutureversion426 retainsqueue; webcache update preservesIndexedDB/draft; failed migration keeps oldrecoverabledata; deployment rollback does not erase financialhistory.

- [ ] **Implementation action 1:** Create frozen schemaVersion1JSON fixtures committed under tests/fixtures/protocol-v1 and replay against current server in disposable DB.
- [ ] **Implementation action 2:** Version dispatch occurs before strict payload parsing so unsupported version produces426/update-required instead of generic400.
- [ ] **Implementation action 3:** Test oldclient queue with newserver migration, then web shell/store migration.
- [ ] **Implementation action 4:** Use expand/contract rollout only after installed-client compatibility window; destructive database rollback is not the default remedy.
- [ ] **Implementation action 5:** Document rollback of app image independently from schema forward fixes.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/compatibility.integration.test.ts
pnpm test:web tests/web/upgrade.spec.ts
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
