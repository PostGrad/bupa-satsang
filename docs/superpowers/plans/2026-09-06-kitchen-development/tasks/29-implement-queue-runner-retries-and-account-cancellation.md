# Task 29: Implement queue runner, retries and account cancellation

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [27](./27-implement-browser-indexeddb-transactions-and-leases.md), [28](./28-implement-native-sqlite-adapter-without-compiling.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F6; retry/lease defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/sync/src/{enqueue,runner,backoff,transport}.ts`
- `packages/sync/src/runner.test.ts`
- `apps/client/src/data/sync-coordinator.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** enqueueMutation and syncOnce C5; HTTP Transport; one leased runner for active account/event.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const store=createMemoryStore();
const m=createBill(); const sent:EntityMutation[]=[];
const transport={push:async(x:EntityMutation)=>{sent.push(x);throw new HttpError('network');},
 snapshot:async()=>snapshotFixture()};
await store.saveWithOutbox({userId:ids.shopperA,mutation:m});
await syncOnce(store,transport,contextFixture());
expect(sent[0]).toEqual(m);
expect((await store.read(ids.shopperA,ids.event)).proposals).toHaveLength(1);
```

**Required cases:** HTTP426 retains envelopes/drafts and sets update-required; Lost ack retries same envelope; predecessor order; network/429/5xx backoff;401 no deletion;403 quarantine; account switch aborts;20-operation cap; needs-attention blocks children.

- [ ] **Implementation action 1:** Add contextFixture with injected deterministic clock/random and AbortController.
- [ ] **Implementation action 2:** Follow C8 runner order exactly: coordinator acquires the platform lease, then initial authorized snapshot is applied before any queue read/send.
- [ ] **Implementation action 3:** Define HttpError constructor(message,status=0,retryAfterSeconds?) in transport.
- [ ] **Implementation action 4:** Fetch/apply a current snapshot at the start of an authenticated sync pass;401 retains the queue and403 quarantines the event without sending.
- [ ] **Implementation action 5:** After any processed pass, including permanent record rejection, fetch current authorized state when still allowed.
- [ ] **Implementation action 6:** Fetch one final snapshot after the bounded pass, not one per acknowledgement; snapshot errors do not roll back accepted acknowledgements.
- [ ] **Implementation action 7:** Check active account/abort before each publication.
- [ ] **Implementation action 8:** Recover abandoned in-flight entries after lease expiry; never retry conflict as ordinary network failure.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/sync/src/runner.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
