# Task 43: Prepare and later run physical Android acceptance

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [42](./42-verify-offline-failures-lost-acknowledgements-and-concurrency.md), [13](./13-prepare-native-pkce-sign-in-and-secure-restoration.md), [28](./28-implement-native-sqlite-adapter-without-compiling.md)

**Risk/review:** External gate. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **F6; physical-device and Google external-input gates**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tests/android/{offline-bill.yaml,offline-leftovers.yaml,account-switch.yaml}`
- `docs/acceptance/android-physical-device.md`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Physical-device test instructions and evidence form. Compilation/install executes only after an explicit later instruction.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```yaml
appId: org.bupasatsang.kitchen
---
- launchApp
- assertVisible: "BUPA-Satsang"
- tapOn: "Gujarati"
- stopApp
appId: org.bupasatsang.kitchen
---
- launchApp
- assertVisible: "બુપા સત્સંગ"
```

**Required cases:** Fresh English/Gujarati persistence; native SQLiterestart; airplane-mode bill/expense/leftover save; process kill/reopen; reconnect once; numeric keyboard/font scaling; system-browser login; app upgrade keeps queue.

- [ ] **Implementation action 1:** Prepare Maestro scripts with actual implemented accessibility labels and an accompanying manual airplane-mode/process-restart guide.
- [ ] **Implementation action 2:** At execution gate confirm user authorized compilation and supplied physical device; record device/Android version and artifact hash.
- [ ] **Implementation action 3:** Build/install development artifact only then, run native storage contract and F2 workflow.
- [ ] **Implementation action 4:** Record actual API bill count and totals.
- [ ] **Implementation action 5:** Google-specific cases require configured provider; test realm results remain separate.
- [ ] **Implementation action 6:** No emulator and no iOS task.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
Preparation: review YAML/selectors against implemented screens; no build command is authorized by this card alone. Later authorized device run: maestro test tests/android/offline-bill.yaml
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
