# Task 26: Define local records, immutable queue and reconciliation

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [24](./24-return-consistent-authorized-snapshots-and-totals.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F6; offline defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/local-store/src/{types,reducer,memory-store}.ts`
- `packages/local-store/src/reducer.test.ts`
- `packages/test-support/src/local-fixtures.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** C5 LocalStore/EventView/QueueEntry/DraftRecord and C8 requireUpdate transitions plus reference memory adapter, snapshotFixture(),queuedBillFixture(),runStoreContract().

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const store=createMemoryStore(); const q=queuedBillFixture();
await store.saveWithOutbox(q);
await store.applySnapshot(q.userId,snapshotFixture());
expect((await store.read(q.userId,q.mutation.eventId)).proposals).toHaveLength(1);
```

**Required cases:** Replayed old ack clears queue but keeps newer version; stale data/access snapshot ignored; pending edits survive replacement; successive same-entity versions do not double count; revoked state hides confirmed data.

- [ ] **Implementation action 1:** Design normalized tables for confirmed records, queue envelopes/attempt state, drafts, event snapshots and revision/access watermarks.
- [ ] **Implementation action 2:** Implement pure transition functions and adapter contract suite.
- [ ] **Implementation action 3:** All queued payloads immutable after enqueue; new edit references predecessor.
- [ ] **Implementation action 4:** Reconciliation uses recordType+ID keys and version comparisons.
- [ ] **Implementation action 5:** Attention stores server conflict separately from local proposal.
- [ ] **Implementation action 6:** On a newer access version use snapshot roles to isolate proposals no longer writable; keep them out of active editable views.
- [ ] **Implementation action 7:** Memory adapter is test reference only, never production persistence.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/local-store/src/reducer.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
