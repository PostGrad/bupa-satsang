# Task 30: Implement recovery, drafts and pending-cost projection

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [29](./29-implement-queue-runner-retries-and-account-cancellation.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F6; recovery defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/local-store/src/{drafts,recovery,projection}.ts`
- `packages/sync/src/recovery.test.ts`
- `apps/client/src/data/event-repository.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** EventRepository.read/subscribe/saveDraft/loadDraft/discardDraft; resolveConflict with new mutation; signed pending delta formatting separate from Money.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
expect(pendingDelta('160.00','150.00')).toBe('-10.00');
expect(pendingDelta('0.00','160.00')).toBe('+160.00');
```

**Required cases:** Navigation keeps draft; declined logout retains state; accountB never seesA draft; conflict resolution uses current version and new mutationID; multiple updates to one bill count one latest delta; revoke retains original account proposal.

- [ ] **Implementation action 1:** Create pendingDelta(confirmed:Money,proposed:Money):string using BigInt subtraction and explicit sign, not Money schema.
- [ ] **Implementation action 2:** Store drafts scoped user/event/form/entity.
- [ ] **Implementation action 3:** Conflict UI command selects current server version, creates a new attributed mutation with preserved proposal and marks old chain resolved; never edits old envelope.
- [ ] **Implementation action 4:** Rebase children explicitly or leave needs-attention.
- [ ] **Implementation action 5:** Discard requires clear user choice.
- [ ] **Implementation action 6:** Repository notifications drive editable screens; Query owns only request state, not a second mutable bill copy.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit packages/sync/src/recovery.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
