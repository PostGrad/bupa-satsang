# Acceptance gates and requirement traceability

Code may be ready for review while a physical device, real Google provider or production operation remains untested. Keep those states separate. Never mark release-ready by counting completed documents or generated test files.

## Gate A — contracts and integrity (00–10)

Pass: compatible existing web/API scaffold, exact money/quantity/date tests, complete role matrix, empty-database migrations, direct SQL scope/precision/allocation/date constraints, access lookup tests. Record actual commands and output. Native compilation is not part of this gate.

## Gate B — identity and service behavior (11–25)

Pass: test-issuer and local Keycloak login, token rejection cases, web state/nonce/PKCE/CSRF/session expiry, admin-only grants and auditable bootstrap, event/meal/catalog/requirements endpoints, all financial/leftover mutation operations, lost-ack/concurrent retries, consistent authorized snapshots and report reconciliation. Native auth implementation is reviewable, but actual callback/secure-storage behavior remains gated on a physical build.

## Gate C — durable browser workflow (26–42)

Pass: actual IndexedDB restart/transaction/migration tests, queue/backoff/account isolation, completed five-role two-day web workflow, English/Gujarati switching and narrow-screen layout, offline app reload, server-commit/lost-response duplicate prevention, conflict/revocation recovery. A passing memory adapter does not count as IndexedDB/SQLite evidence. UI status alone does not count as a correct server bill count or total.

## Gate D — physical Android and real Google (43, part50)

Requires user authorization to compile/install and a physical device. Pass: native SQLite survives process restart, offline bill/expense/leftover flows sync once, correct Google/system-browser login and recovery, SecureStore restoration/logout, readable Gujarati/font scaling/keypad, signed-app upgrade retains pending data. Report test-realm identity separately from real Google. No emulator download and no iOS work.

## Gate E — history and operation (44–49)

Pass: read-only extraction provenance/reconciliation and reviewed idempotent import; validated deployment configuration; measured restore for both databases; intended-host capacity tests; old-client queued data survives upgrades. No source workbook modification or accidental cashbook ledger import. A localhost load run does not prove the proposed VPS sufficient.

## Gate F — pilot/release (50)

Requires a named maintainer/operator, distribution choice, signing custody, production domains/OAuth setup, backup destination and concrete deployment authorization. Pilot with all five roles and at least a full two-day rehearsal. Reconcile known totals and resolve all known pending devices. Retain a manual fallback during pilot. Public release is allowed only with passed evidence for every applicable gate, not an LLM's confidence statement.

## Requirement → task coverage

| Requirement | Implement | Prove |
| --- | --- | --- |
| Shared community/event platform, no future-module engine |06,10,16,31|41|
| Multi-day/multi-meal schedule and per-meal headcount/menu |03,07,17,18,33|41|
| All five roles, combined event scope, admin-only grants |04,10,11,15,32|11–15,41|
| Google via Keycloak, native PKCE and web protected sessions |11–14,31|43,50|
| Shopping requirements/assignments, partial/bulk/unplanned purchasing |19,20,34,35|41,42|
| Bills plus other expenses, exact line/bill/event totals |02,05,08,20–22,35,37|24,25,41,42|
| Shared purchases allocated per meal or kept common |02,05,08,20–22,24–25,36|F2,41,42|
| Category/item/bill/shopper breakups with scoped visibility |04,24,25,37|25,41|
| Ongoing corrections/void and attributed history |09,21,22,25,37|41,42|
| Leftovers quantity/unit, zero vs unrecorded, dish occurrence identity |03,07,08,23,38|42,43|
| Offline bills, other expenses and leftovers, durable local save |26–30,35,37,38,40|42,43|
| Replay, stale conflicts, permission change and account isolation |20–30,39|42,43,49|
| English default/Gujarati, current assigned event and role shortcuts |00,31–39|41,43|
| Workbook preserved, expense-only historical migration |44,45|45|
| Proposed VPS, secure configuration, backups and real restore |46–48|47,48|
| Backward compatibility, release signing and cutover |49,50|43,49,50|
| Explicit exclusions: no uploads/inventory/payments/advances/etc. |Every card's scope|Task review +41+50|

## Inputs that are intentionally external

| Input | Current state | Needed before | Work possible meanwhile |
| --- | --- | --- | --- |
| Google Cloud OAuth client |Not created by user|Real Google login in43/50|Local test realm, integration code and instructions|
| Physical Android device/build authorization |User will test physical device; compilation currently stopped|Native execution43|Adapter/flow code, scripts and web evidence|
| Production domains and TLS target |Not selected|46 real deployment and50|Configuration templates and local validation|
| Android distribution/signing owner |Not selected|43 signed upgrade and50|Release checklist, unexecuted workflow preparation|
| VPS/host access |Proposed Netcup2vCore/4GB; not provisioned here|48 intended-host proof|Load scripts and local functional tests|
| Backup operator/destination/encryption recipient |Not named|47 live backups/restore drill|Scripts, validation and runbook|
| Historical mapping review |Source analysis exists; actual import not approved|45 apply|44 extraction/preview and disposable tests|
| Pilot participants and cutover date |Not named|50 release|Synthetic five-role rehearsal|

These missing real-world inputs are explicit gates, not vague implementation gaps. No model should invent them, store their secrets in Git or ask for them before it has made the relevant configuration reviewable.
