# Task 11: Verify Keycloak bearer tokens and map app identities

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [10](./10-enforce-current-event-access-and-assigned-event-listing.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1/C4; F4; authentication defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/auth/{auth.module,auth.guard,oidc-verifier,identity.service}.ts`
- `apps/api/test/{issuer,http,auth-token.integration.test}.ts`
- `apps/api/src/app.module.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** authenticateBearer(token):Promise<Principal>; stable identity mapping; GET /api/v1/me; F4 HTTP fixture.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const denied=await f.request('GET','/api/v1/events');
 expect(denied.status).toBe(401);
 const pending=await f.request('GET','/api/v1/events',{as:'pending'});
 expect(pending.body).toEqual([]);
});
```

**Required cases:** Reject wrong issuer/audience/algorithm/expiry/signature/ID token; unknown verified identity pending with no kitchen access; same issuer+subject reuses user; email match with new subject does not merge.

- [ ] **Implementation action 1:** Use a maintained jose/OIDC verifier with configured discovery/JWKS, issuer, bupa-api audience, access-token typ and expiry validation.
- [ ] **Implementation action 2:** Cache signing keys with rotation support; fail closed on unknown key if refresh fails.
- [ ] **Implementation action 3:** Persist identity by unique issuer/subject transactionally and create a pending membership in configured initialized BUPA_COMMUNITY_ID.
- [ ] **Implementation action 4:** Missing community configuration fails startup.
- [ ] **Implementation action 5:** Do not treat email_verified as community approval.
- [ ] **Implementation action 6:** Compose F4 real signed-token tests, never accept a userId request header.
- [ ] **Implementation action 7:** Guard every protected route by default.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/auth-token.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
