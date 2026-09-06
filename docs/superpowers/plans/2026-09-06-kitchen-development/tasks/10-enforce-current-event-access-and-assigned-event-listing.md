# Task 10: Enforce current event access and assigned event listing

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [09](./09-create-receipts-history-sessions-and-migration-safety.md), [04](./04-implement-the-complete-pure-permission-matrix.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1/C4; F1/F3; access defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/access/{access.service,access.guard}.ts`
- `apps/api/src/events/events.controller.ts`
- `apps/api/src/app.module.ts`
- `apps/api/test/{services,access.integration.test}.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** AccessService.forEvent/requireCommunityAdmin; GET /api/v1/events; internal guard requires a Principal supplied by authentication.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 await seedKitchen(db); const {access}=createServices(db);
 expect((await access.forEvent({userId:ids.shopperA},ids.otherEvent)).active).toBe(false);
});
```

**Required cases:** Inactive membership overrides still-present grant; admin-only sees no events; shopperA cannot access otherEvent; combined roles return both; accessVersion changes after authorization update.

- [ ] **Implementation action 1:** Query membership and grants against the same DB transaction supplied by the caller.
- [ ] **Implementation action 2:** Empty roles mean no operational access.
- [ ] **Implementation action 3:** Return community.auth_revision as accessVersion.
- [ ] **Implementation action 4:** Add fail-closed guard: absent authenticated principal returns401, never a development fallback user.
- [ ] **Implementation action 5:** Apply event AccessGuard only to operational event routes; community-admin routes must use their own community authorization, so an admin with no kitchen role can still administer a team.
- [ ] **Implementation action 6:** Keep createApp composition separate from main.ts process startup so HTTP tests can instantiate it later.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/access.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
