# Task 50: Prepare pilot, physical distribution and production cutover

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [41](./41-verify-the-full-five-role-multi-day-browser-workflow.md), [42](./42-verify-offline-failures-lost-acknowledgements-and-concurrency.md), [43](./43-prepare-and-later-run-physical-android-acceptance.md), [45](./45-implement-reviewed-repeat-safe-historical-import.md), [47](./47-prepare-backup-restoration-and-operator-runbooks.md), [48](./48-measure-vps-capacity-and-reconnect-burst-behavior.md), [49](./49-rehearse-compatible-updates-and-retained-offline-queues.md)

**Risk/review:** External gate. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **All acceptance gates; external inputs**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `docs/operations/{pilot,release,cutover}.md`
- `docs/acceptance/{release-evidence.md,release-evidence.json}`
- `.github/workflows/release.yml`

**Additional owned test/wiring files:** `tools/release/evidence.ts`, `tests/release/evidence.test.ts`, `vitest.config.ts`.

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Concrete release checklist/artifact manifest and operator handoff; publishing/building native remains separately authorized.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const releaseEvidence=await readReleaseEvidence('docs/acceptance/release-evidence.json');
const required=['browser','offline-web','android-physical','google-provider','import-reconciliation','restore','capacity','upgrade','pilot'];
expect(required.every(key=>releaseEvidence[key]?.status==='passed')).toBe(true);
```

**Required cases:** Allfive roles complete two-day rehearsal; Google login/recovery verified on web/phone; signedartifact upgrade preservesqueue; totals reconcile with manual record; backuprestore capacitygates pass; namedoperator and rollbackcontact.

- [ ] **Implementation action 1:** Add readReleaseEvidence(path) that validates a JSON evidence file against the releaseEvidence schema and validation test with statusespending/passed/failed and evidence links, never a file filled with assumedpassed values.
- [ ] **Implementation action 2:** Choose Android distribution (managed Play or direct signedAPK), secure signingkey and exact domains/OAuthredirects with operator.
- [ ] **Implementation action 3:** Build/install/publish only with explicit authorization at that time.
- [ ] **Implementation action 4:** Pilot allrole workflows with Gujarati and late/offline entries; compare accepted server totals, resolve all pending devices and document limits of unseen offline queues.
- [ ] **Implementation action 5:** Record cutoverdate/operator/support path.
- [ ] **Implementation action 6:** No automatic volunteer messages, purchases or deployment from reading this plan.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit tests/release/evidence.test.ts; publication/Google/native/production checks are explicit later actions
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
