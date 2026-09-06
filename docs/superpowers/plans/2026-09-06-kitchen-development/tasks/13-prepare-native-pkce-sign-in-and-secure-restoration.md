# Task 13: Prepare native PKCE sign-in and secure restoration

> Execute this card only after a user starts development and its dependencies are accepted. Stop after this card. Follow [the execution guide](../execution-guide.md); no Android/iOS compilation, emulator, push or deployment is authorized by this plan.

**Dependencies:** [11](./11-verify-keycloak-bearer-tokens-and-map-app-identities.md)

**Risk/review:** Review required. A reviewer must check both requirement coverage and actual behavior; review-required cards need a capable reviewer or human familiar with the risk.

**Read:** [Binding decisions](../decisions.md); [Contracts](../contracts.md) and [Test fixtures](../test-fixtures.md), sections **C1; session defaults; physical-device restriction**. Read [Data/API map](../data-api.md) when this card changes persistence or an endpoint.

**Files to inspect/change:**

- `apps/client/src/auth/{session.native,types,native-flow}.ts`
- `apps/client/src/auth/native-flow.test.ts`
- `apps/client/app/auth/callback.tsx`
- `apps/client/app.config.ts`

**Consumes:** Accepted dependency outputs and the named shared contracts. Do not change another task's public signature to make this task easier.

**Produces:** AuthSession interface: restore(),signIn(),signOut(),getAccessToken(),subscribe(); NativeTokenStore backed by SecureStore; no compilation.

## Implementation steps

- [ ] Inspect the named existing files and capture the actual base commit/worktree changes. Add a missing package manifest/test target only if the card's new package requires it; preserve pinned framework versions.
- [ ] Add the following regression example and the explicit cases below to the named test file. Supply imports from the packages/harnesses named in the references. For behavior work, run it before implementation and record the expected missing behavior failure. Configuration and operational cards instead validate the concrete artifact; do not create a fake passing service.

```ts
const result = validateNativeCallback({expectedState:'a',actualState:'b',code:'code'});
expect(result.ok).toBe(false);
```

**Required cases:** State/nonce mismatch rejected; cancellation preserves prior session; matching callback consumed once; tokens kept out of AsyncStorage/logs; refresh token rotation saved before old token discarded.

- [ ] **Implementation action 1:** Define AuthSession/NativeTokenStore interfaces in types.ts and validateNativeCallback input/result in native-flow.ts.
- [ ] **Implementation action 2:** Use Expo AuthSession/WebBrowser system browser code+PKCE S256, discovery, exact redirect and nonce validation.
- [ ] **Implementation action 3:** SecureStore holds credentials and pending OAuth transaction.
- [ ] **Implementation action 4:** App receives Keycloak access token, not Google API tokens.
- [ ] **Implementation action 5:** Persist stable app identity separately for offline reopening; online resume resolves /me and current access.
- [ ] **Implementation action 6:** Pure flow tests use injected transport/store; label actual native OAuth unverified until task43.
- [ ] **Implementation action 7:** Do not run prebuild/Gradle/Xcode.
- [ ] Run the focused verification commands below. A failed prerequisite is recorded as blocked or pending, never passed. Native/external acceptance remains pending until its gate is explicitly opened.

```sh
pnpm test:unit apps/client/src/auth/native-flow.test.ts
pnpm typecheck
```

- [ ] Self-review the diff against the cases and forbidden scope, then request task review with a diff and real output. Fix blocking findings and rerun only covering checks. Record the handoff/accepted commit in [Progress](../progress.md); do not start the next card automatically.

## Done means

The stated public output exists, all applicable listed cases pass, no unrelated feature or breaking interface was added, and evidence is recorded. External-gate preparation may be complete with execution pending; it does not satisfy the release gate.
