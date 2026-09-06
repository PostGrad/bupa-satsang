# Task 15: Implement community administration and audited bootstrap

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [12](./12-implement-backend-web-login-sessions-and-csrf.md), [14](./14-prepare-isolated-keycloak-configuration-and-google-instructions.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1/C4; F1/F4; administration defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/admin/{membership.controller,roles.controller,admin.service}.ts`
- `tools/admin/{init-community,bootstrap-community-admin}.ts`
- `apps/api/test/admin.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Member/team GET/PUT routes in data-api.md; CLI --community ID --user ID against verified existing identity, no HTTP bootstrap.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('PUT',`/api/v1/events/${ids.event}/team/${ids.shopperA}`,
 {as:'kitchenHead',body:{roles:['cashier']}});
 expect(r.status).toBe(403);
});
```

**Required cases:** Kitchen head cannot grant role; admin can grant event role but gains no kitchen access itself; cross-community grant denied; disabled members cannot act; prevent removing last active admin; audit and authRevision increment together.

- [ ] **Implementation action 1:** Lock community FOR UPDATE, verify current actor admin, validate target same-community membership and role enum, update grants/membership, append audit and increment auth_revision once.
- [ ] **Implementation action 2:** Admin approval creates active membership without silently granting kitchen roles.
- [ ] **Implementation action 3:** Implement the explicit operator init-community command described in data-api.md before the first production login.
- [ ] **Implementation action 4:** Bootstrap requires an existing verified identity, displays concrete target and audits execution; no default password or guessed production ID.
- [ ] **Implementation action 5:** Endpoint validation and SQL constraints must agree.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/admin.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
