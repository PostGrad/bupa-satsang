# Task 42: Verify offline failures, lost acknowledgements and concurrency

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [41](./41-verify-the-full-five-role-multi-day-browser-workflow.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C3/C4/C5; F2/F5/F6**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tests/web/offline-bill.spec.ts`
- `tests/web/offline-leftovers.spec.ts`
- `tests/web/account-switch.spec.ts`
- `apps/api/test/sync-faults.integration.test.ts`
- `docs/acceptance/offline-web.md`

**Additional owned test/wiring files:** `tests/web/helpers/bill.ts`, `tests/web/fixtures.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Measured browser offline persistence and server replay/concurrency evidence across all offline source types.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('retains an offline bill across reload',async({signedInPage:page,context})=>{
 await context.setOffline(true); await enterTomatoBill(page);
 await expect(page.getByText('Saved on this device',{exact:true})).toBeVisible();
 await page.reload(); await expect(page.getByText('Tomatoes',{exact:true})).toBeVisible();
 await context.setOffline(false); await expect(page.getByText('Synced',{exact:true})).toBeVisible();
 expect((await apiState(ids.event)).billCount).toBe(1);
});
```

**Required cases:** Offline save→reload→reconnect one expense; servercommit/lostresponse one expense; two-tabs lease; stale snapshot after new ack ignored; same-dish concurrent first leftover conflicts; another-meal leftover independent; quota/migration failures retain data.

- [ ] **Implementation action 1:** Add enterTomatoBill(page) helper using task35 labels, kg and Vegetables selection.
- [ ] **Implementation action 2:** Extend apiState to return billCount/eventTotal/mealTotals from test DB.
- [ ] **Implementation action 3:** Simulate network loss after real DB commit at the test HTTP transport boundary, not a fake accepted response.
- [ ] **Implementation action 4:** Use clock/barrier controls for races.
- [ ] **Implementation action 5:** Test other-expense/leftover queues, expired login and role revocation.
- [ ] **Implementation action 6:** Measure a realistic two-day snapshot and record uncompressed bytes/parse time; do not silently truncate.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/offline-bill.spec.ts tests/web/offline-leftovers.spec.ts tests/web/account-switch.spec.ts
pnpm test:api apps/api/test/sync-faults.integration.test.ts
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
