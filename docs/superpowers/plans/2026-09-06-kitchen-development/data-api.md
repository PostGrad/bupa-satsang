# Data ownership, invariants and API map

## Database migration sequence

`packages/database/src/client.ts` exports `AppDatabase`, `AppTx`, `createDatabase(url)` and `withTransaction(db, fn, isolation?)`. Use `pg` plus Drizzle; driver numeric values stay strings. Default write isolation is READ COMMITTED with explicit locks; snapshots use REPEATABLE READ. All migrations are ordered SQL files, tracked in a schema_migrations table. Never run schema push against production.

| Migration / owner | Tables and required constraints |
| --- | --- |
| 0001_identity_events / 06 | communities(id,name,auth_revision); users(id,display_name); external_identities(user_id,issuer,subject,email,email_verified), unique issuer/subject; memberships(community_id,user_id,state,community_admin), unique community/user; events(id,community_id,name,venue,start_date,end_date,time_zone,version,revision), start≤end; event_role_grants(event_id,community_id,user_id,role), unique event/user/role and composite community membership/event FKs |
| 0002_planning / 07 | meals(id,event_id,serves_on,serving_time,kind,label,headcount,status,version); dish_items and ingredient_items(id,community_id,name,retired,version), each scoped to community; dish_aliases(dish_id,alias) and ingredient_aliases(ingredient_id,alias); meal_menu_entries(id,event_id,meal_id,dish_id,name,retired,version); requirements(id,event_id,meal_id,meal_menu_entry_id,item_id,description,quantity,unit,retired,version); shopping_assignments(event_id,requirement_id,shopper_id) unique requirement/shopper |
| 0003_expenses / 08 | bills(id,event_id,purchaser_id,purchased_on,vendor,reference,version,voided,created_by,updated_by); bill_lines(id,bill_id,event_id,item_id,description,quantity,unit,amount,category); bill_line_requirement_links(line_id,event_id,requirement_id); bill_line_meal_allocations(line_id,event_id,meal_id,amount); other_expenses(id,event_id,date,description,category,amount,recorder_id,version,voided,import_source_id,legacy_purchaser_label); other_expense_meal_allocations(expense_id,event_id,meal_id,amount); leftovers(id=meal_menu_entry_id,event_id,quantity,unit,recorder_id,version) |
| 0004_history_sessions / 09 | audit_entries(id,community_id,event_id nullable,actor_id nullable,operator_label nullable,action,entity_type,entity_id,old_value,new_value,reason,created_at); mutation_receipts(actor_id,mutation_id,event_id,entity_id,kind,fingerprint,result,event_revision), unique actor/mutation; web_sessions(token_hash,user_id,encrypted_tokens,key_version,csrf_hash,idle_expires_at,absolute_expires_at,revoked_at); login_transactions(state_hash,encrypted_verifier,nonce,return_path,expires_at,used_at); import_runs(source_hash,mapping_version,status), import_sources(id,workbook_hash,sheet,row_start,row_end,source_key), unique source_key |

Append created_at/updated_at UTC where appropriate. Foreign keys use RESTRICT/NO ACTION for history-bearing records; catalog retirement and voids replace cleanup deletes. Index scoped lookups `(event_id)`, `(event_id,purchaser_id)`, membership/user, role/user, receipt actor/mutation and snapshot line/parent joins. UUID composite uniqueness `(id,event_id)` or `(id,community_id)` enables same-scope foreign keys. Leftover's key is the menu occurrence, not the dish.

Amounts numeric(14,2) nonnegative; allocations positive; source allocation sum≤source amount. Quantities numeric(14,3), positive except leftovers can be zero. Unit/role/status checks match contract enums. A non-null menu-entry requirement must point to that requirement's own meal. Record purchaser/parent event cannot change. Referenced catalog items belong to event community. Role grant refers to community membership; **active** state remains a runtime check so disabling membership does not destroy history.

Date-range trigger validates meal service dates on meal insert/update and event date-range update. Both acquire the event lock before validation. Range edits cannot strand existing meals, including cancelled meals; require an explicit consistent schedule edit instead.

Financial-child triggers lock the parent event before changing source amounts or allocations. Deferred constraint triggers validate final source sums after all lines/allocations are written. Every service path uses the same mutation transaction. Import uses the same constraints and audit attribution. Test direct SQL violations as well as service calls; frontend validation is not enough.

## Write ordering and replay

For a kitchen mutation: begin → lock community row FOR SHARE → read active membership/current roles → lock event FOR UPDATE → look up actor/mutation receipt → recheck current record visibility → compare canonical fingerprint → resolve entity/base/ownership → validate all scoped references → write source/children → increment event revision once → append audit and receipt → commit. A rejected transaction commits no partial data. Same-ID identical retries return the stored acknowledgement without increasing revision. Different content yields ID_REUSED. Never return an old receipt before current access is checked.

Role/membership/admin changes lock community FOR UPDATE, write change and audit, increment auth_revision once, then commit. All code follows community→event→entity lock order. An in-flight request that already acquired its authorized shared community lock may finish before a revocation commits; after revocation commits, new requests cannot pass stale app membership.

Fingerprint serialization recursively sorts object keys; preserves array order; uses normalized scalar strings; includes the complete mutation envelope. Distinct array content/order after queueing must not silently share a fingerprint. The authenticated actor is part of the receipt key, never trusted from an input user ID.

Snapshots use one REPEATABLE READ transaction for access and every included table, data revision and access version. Financial totals aggregate source rows before allocation joins to prevent multiplication. Do not infer all-device completion from an event snapshot.

## Endpoints and authorization

All app routes use `/api/v1`. IDs in body and URL must agree. Malformed JSON/schema→400; unauthenticated→401; forbidden→403 (including unassigned event without leaking its metadata); missing record within an already authorized event→404; online optimistic conflict→409; too-large request→413; supported schema mismatch→426. Mutation domain conflicts/rejections use PushResult with HTTP200 after envelope validation. Transport 403 never contains a private record. Configured body limit:2MiB; fixture maximum bill must fit it. Snapshot capacity is measured separately, not truncated.

| Endpoint / owner | Input → result | Permission |
| --- | --- | --- |
| GET /health/live / 00 | `{status:'ok'}` | public; no DB/secret detail |
| GET /auth/login / 12 | optional returnPath allowlisted app-relative path → redirect | state/nonce/PKCE transaction |
| GET /auth/callback / 12 | code,state → session+redirect | one-time matching transaction |
| POST /auth/logout / 12 | no body →204 | valid session, CSRF/Origin; revoke local session |
| GET /api/v1/me / 11–15 | `{userId,displayName,memberships:[{communityId,state,communityAdmin}],csrfToken?}` | authenticated identity; pending allowed |
| GET /api/v1/events / 10 | EventSummary[] | active membership and ≥1 event role |
| POST /api/v1/communities/:c/events / 16 | EventDetails minus version, communityId fixed by URL →EventDetails | community admin |
| PATCH /api/v1/events/:e / 16 | `{expectedVersion,changes:{name?,venue?,startDate?,endDate?,timeZone?}}`→EventDetails | community admin |
| GET /api/v1/communities/:c/members / 15 | member IDs/names/state/admin | community admin |
| PUT /api/v1/communities/:c/members/:u / 15 | `{state:'pending'|'active'|'disabled',communityAdmin:boolean}`→membership | community admin; guard last active admin |
| GET /api/v1/events/:e/team / 15 | `{userId,displayName,roles}[]` | community admin; authorized event roles get only eligible shopper names via planning response |
| PUT /api/v1/events/:e/team/:u / 15 | `{roles:Role[]}`→team member | community admin; same community membership |
| POST /api/v1/events/:e/meals / 17 | Meal minus version, eventId fixed →Meal | Ravisabha head |
| PUT /api/v1/events/:e/meals/:m / 17 | `{expectedVersion,meal:Meal}`→Meal | Ravisabha head; stable IDs |
| GET /api/v1/events/:e/catalog / 18 | `{dishes:CatalogItem[],ingredients:CatalogItem[],eligibleShoppers:[{userId,displayName}]}` | assigned event role; catalog scope is community |
| PUT /api/v1/events/:e/catalog/:kind/:id / 18 | `{expectedVersion:number|null,name,aliases,retired}`→CatalogItem | dish Ravisabha head; ingredient kitchen head |
| PUT /api/v1/events/:e/menu/:id / 18 | `{expectedVersion:number|null,entry:MealMenuEntry}`→entry | Ravisabha head |
| PUT /api/v1/events/:e/requirements/:id / 19 | `{expectedVersion:number|null,requirement:Requirement,shopperIds:Id[]}`→Requirement | kitchen head; assignees already active event shoppers |
| POST /api/v1/events/:e/mutations / 20–23 | EntityMutation→PushResult | current record-specific access |
| GET /api/v1/events/:e/snapshot / 24 | EventSnapshot | any event role; arrays filtered |
| GET /api/v1/events/:e/reports?groupBy=category&scope=event / 25 | ExpenseReport; scope=common or scope=meal&mealId=UUID | any event role; own/detail/totals scope computed server-side |
| GET /api/v1/events/:e/history/:type/:id / 25 | ordered attributed audit revisions | same underlying bill/expense/leftover read access |

Catalog `kind` is `dish` or `ingredient`; CatalogItem carries version in C2. Planning creates use expectedVersion:null and omit/ignore no fields silently: task03 provides separate create schemas that require initial version1, then service verifies nonexistence. Updates require exact matching expectedVersion and payload version; response increments it.

No ordinary public “create admin”, arbitrary-user impersonation, payment, inventory, upload or event-delete endpoint exists. The bootstrap tool works only on an already verified identity and writes an audit entry. Never expose it as HTTP.

## Scope columns and initial community setup

Any table referencing a community catalog item also stores `community_id`. Use `(event_id,community_id)`→events and `(item_id,community_id)`→the specific catalog table; add the corresponding UNIQUE target keys. Menu entries use the dish table, requirements and bill lines use the ingredient table. Bill lines also reference `(bill_id,event_id,community_id)` on bills. These are database-only scope columns and need not be repeated in client payloads. Use two alias tables to keep ordinary enforceable foreign keys, not a polymorphic alias foreign key.

The deployment has one configured `BUPA_COMMUNITY_ID`. Task15 adds `tools/admin/init-community.ts --name ... --operator-label ...`, which creates a UUID/community once and prints its ID for configuration. It is a local operator command, not an HTTP endpoint. Audit represents this one pre-user initialization action with operator_label and null actor_id; all user actions require actor_id. Add a CHECK enforcing these alternatives. After initialization, first verified login creates a pending membership in the configured community (task11); admin bootstrap then promotes that verified identity explicitly (task15). Missing/invalid configured community is a startup configuration error, not permission to create arbitrary communities during login. The test configuration uses F1's seeded community.

Schema-unsupported requests return426 before ordinary payload validation. The server must recognize schemaVersion first; this is established in task20, not deferred to release. An existing accepted receipt binds its mutation ID to its fingerprint forever. Validation/conflict/revocation proposals remain immutable on the client and are resolved with a new ID rather than editing/retrying the rejected envelope.

## Deterministic report and progress keys

For report grouping, use catalog item ID where present. Unplanned bill items group by NFKC-normalized, trimmed, case-folded description and keep the original description for display; do not combine all unrelated unplanned items into one generic item. Category keys use the same normalization without translating stored text. Bill keys use bill ID and shopper keys use immutable purchaser ID. Other expenses keep an explicit Other expenses bucket where no item/bill/shopper applies.

Build purchaseProgress by item (or normalized unplanned description), exact unit, exact sorted readable requirement-ID set and attribution marker. Each active source line contributes once before grouping. A partly hidden link set uses shared_group and reveals only readable IDs; it cannot claim a complete planned quantity or fulfillment for the visible subset. The client applies the same conservative shared marker when its meal filter selects only part of an otherwise readable link set. No price/vendor/purchaser/bill identity enters this DTO.
