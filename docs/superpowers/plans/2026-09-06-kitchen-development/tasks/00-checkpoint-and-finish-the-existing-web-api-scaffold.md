# Task 00: Checkpoint and finish the existing web/API scaffold

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** None; implementation must first be explicitly started.

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Execution guide baseline; existing version matrix**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `package.json`
- `pnpm-lock.yaml`
- `nx.json`
- `apps/client/project.json`
- `apps/client/app/{_layout,index}.tsx`
- `apps/api/src/{main,health.controller}.ts`
- `.github/workflows/ci.yml`
- `docs/development/version-matrix.md`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** GET /health/live → {status:"ok"}; existing root lint/typecheck/test scripts; bilingual web shell. No native compilation.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const response = await fetch('http://127.0.0.1:3000/health/live');
expect(response.status).toBe(200);
expect(await response.json()).toEqual({status:'ok'});
```

**Required cases:** English fresh start; Gujarati survives reload; selected radio has aria-checked; 325px viewport has no horizontal scroll; health returns200.

- [ ] **Implementation action 1:** Inspect git diff and preserve the partial implementation.
- [ ] **Implementation action 2:** Reconcile manifests with the existing lockfile, without framework upgrades.
- [ ] **Implementation action 3:** Verify explicit Nx run commands; remove native build from default CI and default test commands.
- [ ] **Implementation action 4:** Use the existing shell browser regression test.
- [ ] **Implementation action 5:** Record each actual result and checkpoint the reviewed scaffold separately from the workbook.
- [ ] **Implementation action 6:** Do not claim interrupted Android work passed.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:web apps/client/e2e/shell.spec.ts
pnpm exec nx run client:web-build
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
