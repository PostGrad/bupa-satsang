# Task 46: Write deployment configuration and configuration validation

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [14](./14-prepare-isolated-keycloak-configuration-and-google-instructions.md), [42](./42-verify-offline-failures-lost-acknowledgements-and-concurrency.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Operational defaults; authentication routes; acceptance gates**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `infra/{compose.prod.yml,Caddyfile,.env.example}`
- `apps/api/Dockerfile`
- `.github/workflows/web-api.yml`
- `docs/operations/deployment.md`

**Additional owned test/wiring files:** `infra/deployment-config.ts`, `infra/deployment-config.test.ts`, `vitest.config.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Validated single-host configuration for API/Keycloak/PostgreSQL/Caddy; CI web/API artifacts only. No live deploy or native compile.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const errors=validateDeploymentConfig({PUBLIC_APP_ORIGIN:'http://example.com'});
expect(errors).toContain('Production app origin must use HTTPS');
```

**Required cases:** DB/service management ports private; app/keycloak separate DBusers; no embedded credentials; TLS hostname explicit; authenticated routes uncached; imagepins recorded; missing env fails; migrations run once before APIrollout.

- [ ] **Implementation action 1:** Add validateDeploymentConfig(input):string[] and fixture tests in infra/deployment-config.test.ts.
- [ ] **Implementation action 2:** Pin reviewed image versions/digests during execution; use env interpolation and per-service limits with total measured headroom.
- [ ] **Implementation action 3:** Bind management privately, proxy only public required routes, serve immutable hashed web assets and uncached auth/API.
- [ ] **Implementation action 4:** Add health/readiness/restart behavior and redacted logging.
- [ ] **Implementation action 5:** CI uses frozen lockfile, runs web/API checks and packages outputs; production server does not compile.
- [ ] **Implementation action 6:** Generate ignored .local/compose-validation.env from the template using example.invalid hosts and disposable validation-only secrets so compose config can run without production inputs; never deploy that file.
- [ ] **Implementation action 7:** Document migration compatibility and rollback limitations, without purchasing/deploying.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit infra/deployment-config.test.ts
docker compose --env-file .local/compose-validation.env -f infra/compose.prod.yml config --quiet
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
