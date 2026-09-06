# BUPA-Satsang Kitchen: proposed specification and delivery roadmap

Updated: 2026-09-06. Status: discussion draft. This revision supersedes the earlier fund-account, advance and reimbursement design. Confirmed requirements and proposed details are distinguished below.

## 1. Confirmed product scope

BUPA means Baal-Yuva Pravrutti Anand. BUPA-Satsang serves Anand Satsang Community, with shared identities and events and Kitchen as the first event module. Android and responsive web are launch deliverables, for at most 200 registered volunteers. All five operational roles get direct workflows from launch.

Events may span one or multiple days and include several meals per day, such as morning snacks, lunch, afternoon snacks and dinner. Each dated meal has its own menu and devotee count, supplied by the Ravisabha head. The kitchen head specifies items/quantities and assigns purchasers. Purchasers log their itemwise bills. The cashier or kitchen head can enter other expenses. The event shows total expenditure with breakups, per-meal attributed costs and common event costs. Kitchen head or chef records the quantity of each menu item left at the end of the meal.

Purchases, bills, other expenses and dish leftovers must work offline and automatically sync later. No receipt images or any other user files are uploaded. Login/recovery uses Gmail; the working interpretation is Sign in with Google, with Google account recovery rather than app passwords or email OTP. English is the default UI language, with a Gujarati switch.

Excluded: fund accounts, income/cashbook balances, carry-over, advances, reimbursements and two-party payment markers, payment execution/method tracking, inventory, raw-material stock movements, dish-level cost allocation, uploads and attachments. Leftover dishes are observations for a specific meal, not stock for another meal/event. These exclusions override earlier discussions and the broader source workbook.

Future modules, automated recipes/estimates and a general workflow engine are outside the initial release. Historical migration is a maintainer operation using the supplied local workbook, not an in-app upload feature. The third backend repository is skipped at the user's request.

## 2. Role workflows and screen proposals

| Role | Direct actions |
| --- | --- |
| Ravisabha head | Provide each meal's menu/planned headcount; see event progress |
| Kitchen head | Plan quantities, assign purchasers, add other expenses and dish leftovers |
| Purchaser | View assigned list, log purchases/itemwise bills offline, see sync status |
| Chef | View menu/requirements and enter dish leftovers |
| Cashier | View bills, add other expenses, inspect final total and breakups |

Proposed navigation: My events → event → Kitchen, with a dated meal schedule. Menu and Leftovers use an explicit day/meal selector; Shopping can consolidate requirements across selected meals or the event; Expenses remains accessible at event level. One person can have several roles. Confirmed home behaviour: open the current or upcoming assigned event with role-specific shortcuts; show an event chooser when several events fit. Keep the event list accessible for switching and history. Detailed layouts and shortcut selection remain proposals, not approved wireframes. Dedicated goods-handover acknowledgement is deferred from launch; recorded purchases do not prove delivery.

English-default UI with a persistent Gujarati preference applies to navigation, labels, validation and sync messages. Preserve original dish/ingredient names and offer aliases; switching UI language must not translate or overwrite user-entered content. Mixed Gujarati/English content needs readable fonts and search support. Accepted bill-entry approach: select purchased items from the shopping list, enter actual quantities and amounts, and allow extra items. See [screen journeys](2026-09-06-kitchen-screens.md) for the proposed interaction details. Leftovers use quantity plus a suitable unit per dish, such as kg, litres, pieces or vessels. Accepted expense breakups: category, item, bill and shopping volunteer, respecting bill visibility.

## 3. Domain and expense rules

| Record | Meaning |
| --- | --- |
| Event | Stable ID, start/end dates, timezone, occasion and venue; contains a dated meal schedule, which may be empty while being planned. |
| Meal | Stable ID and parent event, service date, type/custom label, optional time, menu and planned headcount. Actual count is separate if collected. |
| Meal menu entry | A stable occurrence of a dish in one meal, distinct from the dish catalog and ingredient catalog. The same dish may appear in several meals. |
| Requirement | Item, planned quantity/unit, meal or common-event context, optional meal-menu entry and purchaser assignment. Retain links when consolidating shopping across meals. |
| Bill | Event, purchaser, date, optional vendor/reference and itemwise lines; save header and lines atomically. |
| Bill line | Item, actual quantity/unit where applicable, line amount and category; zero or more same-event requirement links for bulk purchasing, with no dish-cost allocation. |
| Other expense | Event, description, amount, category, date and recorder. No ingredient quantity required. |
| Meal cost allocation | Source bill line or other expense, meal ID and exact amount; same-event only, unique source/meal, sum at most the source amount. Unallocated remainder is common event cost. |
| Leftover observation | Specific meal-menu entry, quantity, unit, recorder and timestamps. Zero means none left; blank means not recorded. Use a suitable dish unit, such as kg, litres, pieces or vessels; never infer vessel capacity. |

Confirmed report breakups: category, item, bill and shopping volunteer. Record author separately from purchaser; do not assume the recorder paid. Apply bill visibility to detailed breakups and exports. Meal-cost reporting is confirmed: allocate each bill line or other expense to one or more meals, or leave it as common event cost. Requirement links do not by themselves allocate costs. Dish-cost reporting remains excluded from launch.

Server total = active bill-line amounts + active other expenses. Never add a bill header total or allocation amounts on top of its lines. Event total = sum of meal-attributed totals + common event costs. Each complete breakdown reconciles to the total for the same event and record scope. A meal-filtered breakdown sums only amounts allocated to that meal; common costs remain separate. Common event cost (unallocated money) differs from Other expenses (non-bill charges). Include Other expenses as a separate bucket where no purchased item, bill or shopping volunteer applies. Never assign those costs to the recorder as if they had made a purchase. A shopper-only detail view is labelled My expenses and reconciles to that shopper's subtotal, not the full event total.

Use exact decimals in PostgreSQL and money calculations, with decimal strings in API contracts. Proposed currency: INR, two decimal places for final amounts. Keep negative corrections within an attributed correction/void workflow. Convert compatible units only; never infer packet sizes or kg-to-litre conversions. Historical purchased quantities are not recipes. Leftover observations do not reduce expense or establish waste percentage without prepared/served quantities.

After server acceptance, a saved bill counts without a separate finance approval step. Draft/local-pending entries remain labelled. Confirmed bill editing, including after the meal: purchasers edit their own bills; kitchen head/cashier can correct any bill. Retain who changed what. An audit reason and correction rules for other expenses remain proposed details. Expenses remain editable after the meal under the same permissions, with change history. There is no expense finalise/reopen workflow. Late bills and queued entries remain eligible for sync subject to current authorization and validation. Meal allocation edits follow their source-record permissions, version checks and offline sync. Source amount and all allocations save atomically; reject over-allocation, duplicate meal entries and cross-event references. Reports reflect the latest accepted records rather than an immutable closed total. Meal completion/leftover recording need not imply that all bills have synced.

## 4. Offline entry and automatic sync

Confirmed: purchases, bills, other expenses and dish leftovers work offline on Android and web and sync automatically. Login, access administration and initial event download require internet. Menu and requirement editing are proposed as online-only for the first release.

First login, onboarding and downloading event/catalogue data require internet. An already signed-in user can reopen downloaded authorised events and enter bills offline. Make event download readiness visible.

- Persist each bill, other expense or leftover observation plus its queued operation locally in one transaction before displaying “Saved on this device.” Use stable client record/mutation IDs, actor/event scope, payload version and timestamps. Data survives restart on the same device while storage remains intact.
- Use a durable native local database and persistent browser storage plus a cached web app shell. The architecture proposal uses expo-sqlite on Android and Dexie/IndexedDB on web, to be proven early. TanStack Query/Zustand alone are not the write store.
- Automatically attempt sync on reconnect, launch/resume and restored authentication. Retry transient failures with backoff. Provide sync status and an optional manual retry. Connectivity does not guarantee server reachability.
- Server reauthenticates and checks current role, event and record state; transactionally records the mutation ID, the affected record (all header/lines for a bill) and audit. An identical retry returns the original result. The same ID with a different payload is rejected.
- Send dependent operations in order. Replace/reconcile the local optimistic record with the server result without double-counting it. Pull others' changes and void markers without replacing unsynced local edits. Bound batches for the shared VPS.
- Detect stale updates through versions. Show “Needs attention” with the current record and proposed edit; do not silently overwrite money. Separate manually entered but similar bills may be duplicates: flag matches for review, never auto-delete based only on similarity.
- Proposed leftover model: one current observation per meal-menu entry, with a revision history. Chef and kitchen head update that observation; concurrent edits or concurrent first entries create a conflict to resolve, never an automatic sum. Zero is an explicit observation.
- Expired login retains the queue for reauthentication. Revoked access or validation failure keeps a recoverable entry and stops blind retries. Account switching never replays another user's queue.
- Show “Saved on this device,” “Syncing,” “Synced” and “Needs attention” in the selected language. Separate the confirmed server total from this device's pending contribution. Other offline devices' unsynced bills are unknown.
- Warn before logout with pending data. Any retained queue remains protected and bound to the original identity. Clearing browser storage/uninstalling can remove unsynced data; local durability is not remote backup.
- Meal completion does not lock expense entry. Late entries can sync normally; show when totals were last refreshed and whether this device has pending entries. No device can prove that all other offline devices have synced.

Automatic sync is reliable when the app/page is running and can reach the service with a valid session. Closed-app/background operation is best-effort because OS scheduling and browser support vary. Reopening must resume sync automatically; do not promise immediate upload from a terminated app. [Expo background tasks](https://docs.expo.dev/versions/latest/sdk/background-task/), [browser background sync](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)

Offline web loading needs deliberate caching/update behaviour, not merely an Expo web build. [Expo PWA guidance](https://docs.expo.dev/guides/progressive-web-apps/)

## 5. Identity and permissions

Google sign-in requests minimal identity scopes, not Gmail mailbox access. Map verified external identity to a stable internal user ID. A signed-in Google user receives no event access until membership/roles are granted. Google account recovery and restoring BUPA membership under a different account are distinct; do not silently link identities by email alone. [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)

Proceed with Keycloak on the proposed Netcup VPS, brokering Google sign-in. Keep the user experience centred on Sign in with Google. The [architecture specification](../superpowers/specs/2026-09-06-kitchen-architecture.md) defines proposed native/web session handling and offline-store boundaries.

Store community/event membership and scoped role assignments in the app database. Deny by default and check permissions on reads, writes, sync, exports and corrections. Roles are combinable. A purchaser-only user cannot edit someone else's bill; chef-only access includes leftovers, not expense editing. Kitchen head and cashier can add other expenses. Confirmed read permissions within assigned events: all five roles see event and meal totals plus the common-cost aggregate; Ravisabha head, kitchen head and cashier see all bills; purchasers see their own bills. Chef-only users cannot see bill details. Apply this to API reads, search, local downloads and exports, not only navigation. Confirmed bill correction permissions, including after the meal: purchasers edit their own bills; kitchen head and cashier can correct any bill with change history. Ravisabha-head-only access to bills is read-only. Aggregate and detailed report responses must preserve this visibility boundary; detailed item/bill/shopper views are scoped to visible records.

Confirmed launch administration: designated community administrators manage volunteer access and all event roles. An existing volunteer may also hold this permission. Event-head roles alone do not grant role-management authority. Event roles cover all meals in that event. Kitchen-head shopping assignments select from existing event shoppers; they do not grant access. Proposed access changes are online and audited. See the [screen permission matrix](2026-09-06-kitchen-screens.md). Identity administrators and community administrators have separate responsibilities. Event grants do not grant future modules or all events. Assignment revocation affects the next server request; disconnected devices can retain cached records until reconnecting. Secure native credential storage and web HttpOnly cookies/CSRF controls are proposed. Isolate queues/caches by user and event.

## 6. Architecture and hosting

Provisional stack: pnpm/light Nx, Expo Router, Node/TypeScript with NestJS, PostgreSQL/Drizzle, TanStack Query for server reads and narrow Zustand UI state. Add a durable local store and sync layer. One modular backend; no upload/object-storage service or microservices.

Proposed packages: contracts, API client, pure domain calculations, sync/local-store adapters, UI tokens/components and server-only database/migrations. Keep platform storage details behind small interfaces. Modules cover identity/access, events, kitchen planning/purchasing/expenses/leftovers and audit. Validate runtime inputs and maintain mobile-compatible API contracts.

Proposed Netcup VPS 500 G12: 2 x86 vCores, 4 GB RAM, 128 GB NVMe. This is a starting candidate for 200 registered users, including Keycloak, subject to load testing. Test reconnect/sync bursts as well as logins/reports. Build in CI; keep databases/recovery configuration backed up off-host. See [authentication and hosting assessment](2026-09-05-auth-options.md) for dated pricing and limitations.

## 7. Delivery roadmap

| Milestone | Work | Evidence required |
| --- | --- | --- |
| 0. Finish screens | Role shortcuts, expense entry, report breakups, leftovers form and edit/visibility rules; home behaviour and language choice confirmed | Agreed flows and permission matrix |
| 1. Foundation and offline proof | Compatible workspace, CI/staging, Google login, events/roles, Android/web offline shell/store | Reopen both clients offline and retain an entered sample bill |
| 2. Offline expense-to-report flow | Purchaser bill, cashier/kitchen-head other expenses, durable sync, totals/breakups | Retry/restart causes no lost/duplicate expense; conflicts and expired/revoked access recover |
| 3. Planning and leftovers | Multi-day schedule, per-meal menu/count, consolidated manual quantities, assignment and meal-specific leftovers | All five roles complete direct workflows; zero and missing leftovers remain distinct |
| 4. Migration and reports | Local maintainer migration of event/menu/item/expense data, source validation and exports | Known event totals reconcile; no income, advance or carry-over becomes expense |
| 5. Rehearsal and pilot | Devices/accessibility, intermittent connectivity, load test, restore drill and parallel event | Roles succeed and totals match; no unresolved sync data loss or authorization failures |
| 6. Release | Signed Android distribution, web deployment, support/monitoring and cutover | Operational acceptance and documented recovery |

The [delivery and foundation implementation plan](../superpowers/plans/2026-09-06-kitchen-delivery.md) now defines the complete delivery sequence and detailed first-slice tasks. No implementation has started.

## 8. Production acceptance and open decisions

Integration tests use real PostgreSQL for totals, scopes, idempotency, transactions, corrections and late entries after meal completion. On Android and web, test offline creation/restart, lost acknowledgement/retry, reconnect, two-device bill and leftover edits (including concurrent first observations in the same meal), repeated dishes in different meals, date-range changes and cross-meal bulk purchases, expired session, revoked permissions and logout with pending entries. Local schema/app updates preserve queued data. Verify browser persistence/caching rather than assuming support.

CI checks types, lint, domain/integration tests, migrations and builds. Separate environment secrets; monitor redacted errors, queue age on reconnect, server latency and memory. Preserve API compatibility with installed clients. Back up app/identity databases and recovery configuration off-host and demonstrate restore. Proposed server recovery targets remain at most 24 hours' data loss and four hours to restore; unsynced local data is outside server backups.

Remaining product review: proposed detailed role shortcuts, other-expense permissions and layout defaults. Per-meal costs with explicit allocations/common event costs are confirmed. Multi-day, multi-meal events are confirmed for launch. Expense breakups, community-admin role assignment and offline leftovers are confirmed. Home behaviour, shopping-list-led bill entry with extra items, leftovers as quantity plus dish unit, English-default/Gujarati-switch UI, offline purchases/bills/other expenses/leftovers, expense-only scope and Google-based login are settled. Keycloak is the working identity choice. Architecture defaults, operator, measured server capacity, delivery availability, Android distribution and release date remain for review or execution input.
