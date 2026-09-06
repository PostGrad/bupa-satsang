# Binding decisions for this development plan

Confirmed user decisions override this file. The following implementation defaults make tasks executable without another long questionnaire. They are reviewable choices, not claims that the user explicitly chose every technical detail.

## Product and access defaults

- Community administrator creates/edits event metadata, membership and role grants online. Administrator permission alone grants no kitchen read access.
- Ravisabha head creates/edits/completes/cancels dated meals and their menu/headcount online. Kitchen head edits requirements and purchasing assignments online.
- Kitchen head/cashier create, read, correct and void other expenses; Ravisabha head reads them. Shopper/chef-only roles see totals but no other-expense rows.
- Bill void uses bill-correction permission and retains history. Undoing a void is excluded initially; a permitted corrective replacement remains a new attributed record. UI requires a reason for void; ordinary correction reason is optional.
- All assigned roles read schedule, menu and leftovers. Kitchen head/chef/cashier/Ravisabha head read all requirements. Shopper-only users receive assigned requirements. A shopper can enter unplanned bill lines without claiming another shopper's hidden requirement.
- Chef gets operational purchased quantities without prices, vendor, bill ID, purchaser identity or references. Price-free progress aggregates are a separate response shape, never serialized bill objects with fields hidden only on screen.
- Catalog maintenance belongs to Ravisabha head for dishes and kitchen head for ingredients, within an assigned event's community. Read aliases in both scripts; do not translate stored names. Exact-unit consolidation only at launch; automatic g/kg and ml/l conversion is deferred to avoid inferred purchase fulfillment.
- Event date range is inclusive; default timezone Asia/Kolkata. Dates use ISO calendar strings, clocks use HH:mm, server audit timestamps use UTC. Headcount is null until known or a nonnegative integer.
- Blank allocation list means common event cost. A UI may suggest a meal but cannot silently assign money merely because a requirement is linked.
- No export download UI at launch. Required breakups are on-screen. Any future export must reuse the exact report authorization scope.
- Historical import produces attributed imported expense records, including unresolved legacy purchaser labels, without creating fictional Google identities. Legacy rows without a reviewed purchaser mapping are separate imported expenses, never shopper-owned bills.

## Authentication/session defaults for implementation

- Keycloak realms: production template `bupa-satsang`, isolated test realm `bupa-satsang-test`. Client IDs: `bupa-android` public PKCE S256; `bupa-web` confidential; API audience `bupa-api`.
- Server configuration names one initialized `BUPA_COMMUNITY_ID`; first verified login creates a pending membership there. Initial community/operator setup is task15; no public community/admin bootstrap route exists.
- Production volunteer sign-in uses Google only. Local Keycloak users exist only in the test realm. No app password form, password storage, client secret in native app, or runtime production test-login route.
- Google broker uses `openid email profile`. Stable application identity is Keycloak `(issuer, subject)`; matching email must not auto-link identities in the app or bypass broker reauthentication.
- Proposed access token lifetime: 5 minutes; idle session: 30 minutes; absolute web session: 12 hours; pending login transaction: 10 minutes. Refresh before access expiry while online, never extend absolute expiry. Provider disable/logout may lag local JWT checks until access-token expiry; app membership revocation is checked on the next request.
- Web cookie: `__Host-bupa_session`, Secure, HttpOnly, SameSite=Lax, Path=/, no Domain in production. Local HTTP test mode uses a distinct non-__Host cookie, allowed only by an explicit loopback test configuration. Browser holds an opaque CSRF token returned by `/api/v1/me` in memory; unsafe cookie requests require matching `X-CSRF-Token` and exact Origin. Login callback uses one-time state, nonce and PKCE.
- A request carrying both a bearer token and the app session cookie is rejected400 as ambiguous. Browser calls use cookies; native calls use bearer authentication.
- Session IDs are random 32 bytes and stored as SHA-256 hashes. Retained provider tokens are encrypted with authenticated encryption and a key version; cryptographic keys live outside Git. Never log bearer tokens, cookies, codes or secrets.
- Native credential storage uses SecureStore. OAuth transaction verifier/state/nonce also survive a browser round-trip securely and are one-time. Test native redirect `bupasatsang://auth/callback` in an installed build; production release chooses exact registered redirect/verified app-link policy at the physical/release gate.

These timeout/redirect choices can change by editing this decision file and affected tests together. A new model must not choose its own defaults in a screen task.

## Offline defaults

- Local store keys begin with internal user ID and event ID. Different accounts never share queued operations, subscriptions, cached private rows or refresh credentials.
- Once queued, a mutation envelope is immutable. A new edit is a new mutation whose base references the previous same-entity operation. This stricter rule simplifies smaller-model implementation.
- Persist record proposal and outbox atomically before claiming a local save. Keep confirmed server records separate. Update server totals only from accepted revisioned snapshots; label local pending deltas separately.
- Send at most 20 mutations per sync pass, sequentially. Retry transient failure after 1, 2, 4, 8, 16, 32 then 60 seconds, capped at 60 with 0–20% positive jitter; tests inject clock/random. Retry-After takes precedence within 1–300 seconds. Resume on launch, foreground, reconnect and same-account reauthentication.
- Browser runners use Web Locks where available plus an IndexedDB transaction lease (owner ID, 30-second expiry, renewal every 10 seconds). All tabs must honor the lease. Native uses one process runner and serialized exclusive write transactions. Server idempotency remains necessary after tab/process failure.
- HTTP 401 retains queue and requests login. HTTP 403 purges inaccessible confirmed data and isolates that event's proposals in needs-attention. Conflicts retain both values. 400/422/ID_REUSED are permanent needs-attention. 429/network/5xx retry. Dependent children wait for their predecessor's accepted receipt; they never bypass a conflict.
- Revoked proposals remain accessible only under their original account in a recovery view with no send/copy-to-other-account action. Returning authorization allows explicit revalidation. Discarding a proposal requires a clear user action; logging out is not silent deletion.
- Durable schema migrations are transactional and retain unsent envelopes. Incompatible server schema gives a visible update-required state while preserving queued data. Automatic background sync is best-effort when the app is closed.

## Operational defaults

Single proposed VPS, Compose, Caddy, API, Keycloak and one PostgreSQL instance with separate databases/users. No Redis, object storage, replicas or extra modules. Pin images when the operations task executes. Builds run outside the production VPS. Proposed recovery targets: RPO 24h, RTO 4h. Load scenarios: 20 active clients and 50 reconnecting devices, not 200 concurrent users. Measure on the intended 2-vCore/4-GB host before accepting capacity.
