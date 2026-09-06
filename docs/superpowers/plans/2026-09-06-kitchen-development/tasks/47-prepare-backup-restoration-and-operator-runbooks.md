# Task 47: Prepare backup, restoration and operator runbooks

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [46](./46-write-deployment-configuration-and-configuration-validation.md), [45](./45-implement-reviewed-repeat-safe-historical-import.md)

**Risk/review:** External gate. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Operations recovery defaults; external-input checklist**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `infra/backup/{backup.sh,restore-test.sh}`
- `docs/operations/{backup-restore,incident-response}.md`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Encrypted off-host app+identity backup procedure; restore drill checklist; proposed24hRPO/4hRTO evidence.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```sh
test "$(psql "$RESTORE_APP_DATABASE_URL" -Atc 'select count(*) from schema_migrations')" -ge 4
test "$(psql "$RESTORE_IDENTITY_DATABASE_URL" -Atc 'select count(*) from realm')" -ge 1
```

**Required cases:** Both databases/config included; restored login and role access; schema versions consistent; backup-age alert; no plaintext secrets in logs; restore targets isolated DBnames and never overwrite production.

- [ ] **Implementation action 1:** Use explicit app/identity connection inputs and operator-supplied encryption recipient/off-host destination.
- [ ] **Implementation action 2:** Backup from consistent database dumps, include pinned deployment/configuration metadata securely, verify integrity and retain rotation policy7daily/4weekly copies.
- [ ] **Implementation action 3:** Restore script refuses production host/database names and requires explicit isolated target.
- [ ] **Implementation action 4:** Measure elapsed restore and usable data age; compare financial totals/roles and Keycloak login after restore.
- [ ] **Implementation action 5:** A successful dump command alone is not a restore drill.
- [ ] **Implementation action 6:** Real destination/operator are required before scheduling any live backup.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
bash -n infra/backup/backup.sh infra/backup/restore-test.sh; execute isolated restore drill only after destination/operator inputs are provided
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
