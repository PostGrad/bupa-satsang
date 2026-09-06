# Task 32: Build volunteer and event-team administration screens

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [15](./15-implement-community-administration-and-audited-bootstrap.md), [31](./31-wire-web-sessions-event-navigation-and-browser-fixtures.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C4 API member/team routes; F5**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/app/admin/{volunteers,event-team}.tsx`
- `apps/client/src/features/admin/{VolunteersScreen,EventTeamScreen}.tsx`
- `tests/web/admin.spec.ts`
- `packages/ui/src/i18n/{en,gu}.json`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Online admin screens consuming existing member/team routes; active/pending/disabled membership and combinable role controls.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('head cannot grant access',async({page})=>{
 await loginAs(page,'kitchenHead');
 await page.goto('/admin/volunteers');
 await expect(page.getByText('Administrator access required',{exact:true})).toBeVisible();
});
```

**Required cases:** Nonadmin cannot navigate into data; admin sees pending and approves; changes are online only; head without admin cannot grant roles; last-admin rejection displayed without optimistic false success.

- [ ] **Implementation action 1:** Build forms with exact server enum values and localized labels.
- [ ] **Implementation action 2:** Fetch authorized member/team lists and submit explicit role arrays, allowing multiple selections.
- [ ] **Implementation action 3:** Disable writes offline with explanation.
- [ ] **Implementation action 4:** Do not use operational-head status as admin permission.
- [ ] **Implementation action 5:** After mutation refresh server state/access version; invalidate affected event snapshot without deleting pending proposals.
- [ ] **Implementation action 6:** Keep app admin separate from Keycloak admin-console access.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/admin.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
