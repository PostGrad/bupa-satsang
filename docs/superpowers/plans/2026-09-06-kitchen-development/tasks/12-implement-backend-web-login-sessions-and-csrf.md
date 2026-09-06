# Task 12: Implement backend web login, sessions and CSRF

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [11](./11-verify-keycloak-bearer-tokens-and-map-app-identities.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C4; F4; session/CSRF defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/auth/{auth.controller,web-session,login-transaction,token-crypto}.ts`
- `apps/api/test/auth-web.integration.test.ts`
- `apps/api/test/issuer.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** GET /auth/login and /auth/callback; POST /auth/logout; cookie-authenticated Principal; csrfToken on /api/v1/me.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('POST','/auth/logout',{headers:{Origin:'https://attacker.invalid'}});
 expect([401,403]).toContain(r.status);
});
```

**Required cases:** Wrong/reused/expired state and wrong nonce rejected; code exchanged with PKCE; cookie flags correct; missing/wrong CSRF or Origin denied; expired absolute session cannot refresh; logout revokes local session.

- [ ] **Implementation action 1:** Use an established OIDC client library for authorization-code validation.
- [ ] **Implementation action 2:** Persist one-time login transaction with hashed state and encrypted verifier; bind it to a same-browser correlation cookie, validate nonce and allowlisted return path.
- [ ] **Implementation action 3:** Persist hashed session ID and encrypted tokens with idle/absolute expiry.
- [ ] **Implementation action 4:** Serialize per-session refresh under row lock; rotate refreshed provider tokens atomically.
- [ ] **Implementation action 5:** Validate exact Origin plus CSRF for cookie writes; bearer calls use bearer auth without cookie ambiguity.
- [ ] **Implementation action 6:** On logout revoke local session even if provider logout is unavailable; distinguish provider-session result in UI.
- [ ] **Implementation action 7:** Test successful cookie writes and negative CSRF cases, not only unauthenticated failures.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/auth-web.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
