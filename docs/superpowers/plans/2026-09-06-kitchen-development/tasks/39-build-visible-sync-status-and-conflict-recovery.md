# Task 39: Build visible sync status and conflict recovery

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [30](./30-implement-recovery-drafts-and-pending-cost-projection.md), [35](./35-build-durable-shopping-led-bill-entry-and-correction.md), [37](./37-build-other-expenses-totals-report-filters-and-history.md), [38](./38-build-per-dish-offline-leftovers.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F5/F6; recovery policy**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/features/sync/{SyncStatus,ConflictScreen,RecoveryScreen,LogoutDialog}.tsx`
- `tests/web/recovery.spec.ts`
- `packages/ui/src/i18n/{en,gu}.json`

**Additional owned test/wiring files:** `tests/web/helpers/conflicts.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Saved on this device/Syncing/Synced/Needs attention; same-account reauthentication, side-by-side current/proposed conflict and discard confirmation.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('preserves a rejected local proposal',async({signedInPage:page})=>{
 await arrangeBillConflict(page); // real competing API correction via F5 harness
 await expect(page.getByRole('heading',{name:'Needs attention'})).toBeVisible();
 await expect(page.getByText('Your changes',{exact:true})).toBeVisible();
 await expect(page.getByText('Current saved version',{exact:true})).toBeVisible();
});
```

**Required cases:** Expired session retains proposal; revoked event hides confirmed rows; other account sees nothing; conflict not silently overwritten; resolving creates newmutationID/currentversion; declined discard preserves proposal.

- [ ] **Implementation action 1:** Add arrangeBillConflict helper by saving offline locally, applying a permitted head correction through test API and reconnecting.
- [ ] **Implementation action 2:** Render contract result states with translated actionable messages.
- [ ] **Implementation action 3:** Reauthentication returns original account queue; a different account cannot replay/reassign it.
- [ ] **Implementation action 4:** Resolution explicitly chooses retained proposal against newest version and preserves audit; old chain remains until resolution saved.
- [ ] **Implementation action 5:** Logout warns about local pending data and clears credentials/subscriptions without silently deleting proposals.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/recovery.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
