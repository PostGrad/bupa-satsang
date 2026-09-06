# Task 27: Implement browser IndexedDB transactions and leases

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [26](./26-define-local-records-immutable-queue-and-reconciliation.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F6; browser lease defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/local-store/src/{store.web,lease.web}.ts`
- `packages/local-store/src/migrations/web.ts`
- `tests/web/storage.spec.ts`

**Additional owned test/wiring files:** `tests/web/storage-harness.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Dexie LocalStore adapter; transaction lease acquire/renew/release; persistent events/records/queue/drafts/watermarks.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const browserStore=await openBrowserStore('bupa-storage-test');
const q=queuedBillFixture();
await browserStore.saveWithOutbox(q); await browserStore.close();
const reopened=await openBrowserStore('bupa-storage-test');
expect((await reopened.read(q.userId,q.mutation.eventId)).proposals).toHaveLength(1);
```

**Required cases:** Fail between record/outbox commits neither; close/reopen retains queue; migration retains pending envelopes; two tabs share one active lease; stale lease takeover; quota error never says saved.

- [ ] **Implementation action 1:** Implement openBrowserStore(name) and browserStore fixture inside actual Playwright page test harness, not Node fake-indexeddb acceptance.
- [ ] **Implementation action 2:** Dexie transactions cover all related writes; no awaited HTTP inside transactions.
- [ ] **Implementation action 3:** Persist leases with atomic expiry comparisons and coordinate tabs via BroadcastChannel notifications.
- [ ] **Implementation action 4:** Request navigator.storage.persist when supported and report unavailable/failed storage clearly.
- [ ] **Implementation action 5:** Versioned migration is transactional and never deletes queues on error.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/storage.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
