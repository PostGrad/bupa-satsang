# Task 31: Wire web sessions, event navigation and browser fixtures

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [14](./14-prepare-isolated-keycloak-configuration-and-google-instructions.md), [15](./15-implement-community-administration-and-audited-bootstrap.md), [24](./24-return-consistent-authorized-snapshots-and-totals.md), [30](./30-implement-recovery-drafts-and-pending-cost-projection.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C4/C5; F5; authentication/navigation defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/auth/{session.web,AuthProvider}.tsx`
- `apps/client/app/{_layout,sign-in,index}.tsx`
- `apps/client/src/features/events/EventChooser.tsx`
- `tests/web/fixtures.ts`
- `tests/web/navigation.spec.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** AuthSession web adapter; F5 signedInPage/loginAs/seedScenario/apiState fixtures; event auto-open/chooser and offline downloaded-event access.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('opens assigned event',async({signedInPage:page})=>{
 await expect(page.getByRole('heading',{name:'Anand two-day test'})).toBeVisible();
});
```

**Required cases:** No assignment explains pending/admin access; one current event opens; several current events chooser; without current use upcoming choices; past events remain accessible; logout/account switch isolates local state.

- [ ] **Implementation action 1:** Use same-origin HttpOnly cookie requests with credentials included, fetch /me and keep CSRF in memory.
- [ ] **Implementation action 2:** Cache only original user identity needed to reopen its downloaded local partition; authenticate again before network sync.
- [ ] **Implementation action 3:** Add TanStack Query for /me/events request state and repository subscriptions for editable data.
- [ ] **Implementation action 4:** On account change abort runner, remove old subscriptions, then activate new partition.
- [ ] **Implementation action 5:** Build F5 real test-realm browser login and reject production test targets.
- [ ] **Implementation action 6:** Add localized pending/no-assignment/error states.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/navigation.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
