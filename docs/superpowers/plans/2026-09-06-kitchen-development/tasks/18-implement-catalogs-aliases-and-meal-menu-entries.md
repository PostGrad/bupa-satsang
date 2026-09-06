# Task 18: Implement catalogs, aliases and meal menu entries

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [17](./17-implement-dated-meal-scheduling-and-lifecycle.md)

**Risk/review:** Routine. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C2; F1/F4; catalog defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/api/src/kitchen/planning/{catalog.controller,catalog.service,menu.controller,menu.service}.ts`
- `apps/api/test/menu.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Catalog GET/PUT and menu PUT with stable occurrence IDs; exact aliases and retirement.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withApiFixture(async f=>{
 const r=await f.request('GET',`/api/v1/events/${ids.event}/catalog`,{as:'chef'});
 expect(r.status).toBe(200);
 expect(r.body).toMatchObject({dishes:expect.any(Array),ingredients:expect.any(Array)});
});
```

**Required cases:** Gujarati/English alias search retains original name; chef cannot edit; same dish two meals stays independent; retiring catalog does not rewrite historical menu/bill text; foreign-community item rejected.

- [ ] **Implementation action 1:** Keep dish and ingredient catalogs separate.
- [ ] **Implementation action 2:** Catalog mutations require corresponding role and event community scope.
- [ ] **Implementation action 3:** Normalize search whitespace/Unicode consistently without changing stored text; aliases are distinct normalized search keys.
- [ ] **Implementation action 4:** Menu entries snapshot display names with optional dish ID, retain stable IDs on edits and retire instead of delete.
- [ ] **Implementation action 5:** Version/audit/revision updates share transaction.
- [ ] **Implementation action 6:** Return only eligible active event shoppers for purchasing assignment UI.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/menu.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
