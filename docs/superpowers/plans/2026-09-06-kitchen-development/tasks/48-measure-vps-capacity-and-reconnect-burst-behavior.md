# Task 48: Measure VPS capacity and reconnect burst behavior

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [46](./46-write-deployment-configuration-and-configuration-validation.md), [42](./42-verify-offline-failures-lost-acknowledgements-and-concurrency.md)

**Risk/review:** External gate. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **F2; operational defaults; capacity gates**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tests/load/{active-users.js,reconnect-burst.js}`
- `docs/acceptance/capacity.md`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Reproducible k6-compatible load scenarios, measurements and pass/fail record on intended host class.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
export const options={scenarios:{reconnect:{executor:'shared-iterations',vus:50,iterations:50,maxDuration:'2m'}}};
```

**Required cases:** 20active volunteers;50devices replay queued writes; no duplicate/lost expenses; simultaneous backup; latency/error/memory/swap/DBconnection measurements; hidden detail not returned under load.

- [ ] **Implementation action 1:** Use synthetic users/event and idempotent fixture IDs, record counts/totals before and after.
- [ ] **Implementation action 2:** ScenarioA20VUs for10min with mixed snapshot/report/edits; scenarioB50VUs each sends20 queued mutations including duplicate retries.
- [ ] **Implementation action 3:** Proposed gate: no correctness failure, <1% unexpected HTTPerrors, p95snapshot<2s and mutation<1s, no OOM/restarts, sustained memory<85%, no sustained swap growth; report these as engineering targets.
- [ ] **Implementation action 4:** Repeat with backup only after a baseline pass.
- [ ] **Implementation action 5:** Run on isolated intended2vCore/4GB capacity; laptop measurements do not prove VPS capacity.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
k6 run tests/load/active-users.js
k6 run tests/load/reconnect-burst.js (only against explicitly designated test target)
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
