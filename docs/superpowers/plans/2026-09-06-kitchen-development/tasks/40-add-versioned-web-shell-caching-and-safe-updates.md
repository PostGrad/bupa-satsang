# Task 40: Add versioned web shell caching and safe updates

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [31](./31-wire-web-sessions-event-navigation-and-browser-fixtures.md), [39](./39-build-visible-sync-status-and-conflict-recovery.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C5; F5; offline/update defaults**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/public/service-worker.js`
- `apps/client/src/web/register-worker.ts`
- `tools/web/write-precache-manifest.ts`
- `tests/web/service-worker.spec.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** Offline reload of downloaded app; build-specific static precache manifest; explicit safe update activation.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
test('does not cache authenticated routes',async({signedInPage:page})=>{
 const urls=await page.evaluate(async()=>{
 const all=await Promise.all((await caches.keys()).map(async k=>(await (await caches.open(k)).keys()).map(r=>r.url)));
 return all.flat();});
 expect(urls.some(u=>new URL(u).pathname.startsWith('/api/')||new URL(u).pathname.startsWith('/auth/'))).toBe(false);
});
```

**Required cases:** Offline deep route reload works; auth and /api never CacheStorage entries; only same-origin generated assets precached; update waits while form/queue activity unsafe; IndexedDB unchanged across cache cleanup.

- [ ] **Implementation action 1:** Generate explicit hashed asset manifest after web export.
- [ ] **Implementation action 2:** Cache only listed static assets and a navigation app shell; bypass /auth and /api entirely.
- [ ] **Implementation action 3:** For offline deep links return shell and resolve route using local data.
- [ ] **Implementation action 4:** Install new cache alongside old; do not force skipWaiting/client reload mid-edit.
- [ ] **Implementation action 5:** UI prompts update after draft persisted and migrations compatible.
- [ ] **Implementation action 6:** Delete only owned obsolete asset caches, never browser databases or another app cache.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:web tests/web/service-worker.spec.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
