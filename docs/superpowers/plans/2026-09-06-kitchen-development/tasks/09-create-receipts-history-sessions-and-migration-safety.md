# Task 09: Create receipts, history, sessions and migration safety

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [08](./08-create-expenses-allocations-and-leftover-schema.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **Data migration0004; F3; C3/C4**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `packages/database/src/schema/{audit,sessions,imports}.ts`
- `packages/database/migrations/0004_history_sessions.sql`
- `apps/api/test/history-db.integration.test.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Unique actor/mutation receipts; audit and session/login/import tables; complete ordered empty-DB migration path.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
await withTestDb(async db=>{
 const r=await db.query("select count(*)::int as n from schema_migrations");
 expect(r.rows[0].n).toBe(4);
});
```

**Required cases:** Duplicate actor/mutation rejected; another actor can use same mutation UUID independently; failed transaction adds neither data nor audit; history update/delete denied through application role.

- [ ] **Implementation action 1:** Create0004 and add import-source FK for existing expense columns.
- [ ] **Implementation action 2:** Make audit append-only using DB grants for production app role and no update/delete repository method.
- [ ] **Implementation action 3:** Receipt result stores canonical JSON and fingerprint/event revision.
- [ ] **Implementation action 4:** Encrypted token and hash columns store no plaintext secrets.
- [ ] **Implementation action 5:** Test migrate-empty then rerun applies zero extra migrations, and transaction rollback leaves no partial audit.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:api apps/api/test/history-db.integration.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
