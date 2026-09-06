# Task 44: Extract and preview workbook history without importing

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [09](./09-create-receipts-history-sessions-and-migration-safety.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Existing cashbook-workflow.md; import defaults; F3**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `tools/migration/{extract-cashbook.py,mapping.json,preview-schema.json}`
- `tools/migration/tests/test_extract.py`
- `docs/operations/history-import.md`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Expense-only JSON manifest with workbook/sheet/row provenance and reconciliation preview; original workbook untouched.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```python
before = sha256(source.read_bytes()).hexdigest()
manifest = extract_workbook(source, mapping)
assert sha256(source.read_bytes()).hexdigest() == before
assert all(row['source']['sheet'] for row in manifest['expenses'])
```

**Required cases:** 33 event sheets retained separately; same-date events not merged; dish headings not invented meals; balances/advances/reimbursements excluded; uncertain purchaser/date/group rows marked review-needed; source hash unchanged.

- [ ] **Implementation action 1:** Read existing cashbook-workflow.md and use a maintained Python workbook reader.
- [ ] **Implementation action 2:** Define extract_workbook(Path,Mapping)->Manifest and explicit classify/include/exclude mapping with source ranges.
- [ ] **Implementation action 3:** Preserve Gujarati names and original raw values.
- [ ] **Implementation action 4:** Manifest includes events, source references, expenses, excluded rows/reasons, reviewIssues and per-sheet totals.
- [ ] **Implementation action 5:** Default all imported amounts common; only reviewed explicit evidence allocates to a meal.
- [ ] **Implementation action 6:** Output preview into ignored local directory; no DB writes or app upload route.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
python3 -m unittest discover -s tools/migration/tests -p test_extract.py
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
