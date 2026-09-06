# Task 14: Prepare isolated Keycloak configuration and Google instructions

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [12](./12-implement-backend-web-login-sessions-and-csrf.md), [13](./13-prepare-native-pkce-sign-in-and-secure-restoration.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Authentication defaults; F4; Google setup guide**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `infra/keycloak/{realm.template.json,realm.test.json,README.md}`
- `infra/compose.dev.yml`
- `docs/operations/identity.md`
- `docs/development/google-oauth-setup.md`

**Additional owned test/wiring files:** `infra/keycloak/realm.test.ts`, `tools/keycloak/render-realm.ts`, `vitest.config.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Production template and isolated test realm; exact environment/redirect/secret setup instructions, no real Google credentials.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const realm=JSON.parse(await readFile('infra/keycloak/realm.template.json','utf8'));
const native=realm.clients.find((c:{clientId:string})=>c.clientId==='bupa-android');
expect(native.publicClient).toBe(true);
expect(native.attributes['pkce.code.challenge.method']).toBe('S256');
```

**Required cases:** Android has no secret and requiresS256; web confidential; access token includes bupa-api audience; test users only in test realm; production Google-only flow; no email auto-link bypass.

- [ ] **Implementation action 1:** Create environment-neutral templates with explicit substitution keys for issuer/client secret/redirects/Google credentials.
- [ ] **Implementation action 2:** Render configuration through a validating script that fails if a required value is absent; never import the unrendered production template.
- [ ] **Implementation action 3:** Test realm may use synthetic local users and HTTP loopback; production import must reject those flags/users.
- [ ] **Implementation action 4:** Document broker callback from Keycloak UI and two independent Keycloak clients.
- [ ] **Implementation action 5:** Validate audience and first-broker-login account-linking rules using local realm.
- [ ] **Implementation action 6:** Real Google acceptance remains pending user configuration.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit infra/keycloak/realm.test.ts
pnpm test:api apps/api/test/auth-token.integration.test.ts
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
