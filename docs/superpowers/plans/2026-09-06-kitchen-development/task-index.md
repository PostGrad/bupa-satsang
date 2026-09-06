# Task index

All tasks are planned, not accepted. Execute in numeric order for a straightforward dependency-safe path. Each card is a separate model prompt/review boundary; the high-risk cards intentionally contain more failure tests.

| ID | Deliverable | Depends on | Review |
| --- | --- | --- | --- |
| 00 | [Checkpoint and finish the existing web/API scaffold](tasks/00-checkpoint-and-finish-the-existing-web-api-scaffold.md) | — | Routine |
| 01 | [Add deterministic test builders and package boundaries](tasks/01-add-deterministic-test-builders-and-package-boundaries.md) | 00 | Routine |
| 02 | [Implement exact money and quantity arithmetic](tasks/02-implement-exact-money-and-quantity-arithmetic.md) | 01 | Routine |
| 03 | [Define event, meal and planning runtime schemas](tasks/03-define-event-meal-and-planning-runtime-schemas.md) | 02 | Routine |
| 04 | [Implement the complete pure permission matrix](tasks/04-implement-the-complete-pure-permission-matrix.md) | 03 | Review required |
| 05 | [Define expense, mutation, snapshot and report schemas](tasks/05-define-expense-mutation-snapshot-and-report-schemas.md) | 03, 04 | Review required |
| 06 | [Create identity/event schema and disposable DB harness](tasks/06-create-identity-event-schema-and-disposable-db-harness.md) | 05 | Review required |
| 07 | [Create planning schema and date/scope constraints](tasks/07-create-planning-schema-and-date-scope-constraints.md) | 06 | Review required |
| 08 | [Create expenses, allocations and leftover schema](tasks/08-create-expenses-allocations-and-leftover-schema.md) | 07 | Review required |
| 09 | [Create receipts, history, sessions and migration safety](tasks/09-create-receipts-history-sessions-and-migration-safety.md) | 08 | Review required |
| 10 | [Enforce current event access and assigned event listing](tasks/10-enforce-current-event-access-and-assigned-event-listing.md) | 09, 04 | Review required |
| 11 | [Verify Keycloak bearer tokens and map app identities](tasks/11-verify-keycloak-bearer-tokens-and-map-app-identities.md) | 10 | Review required |
| 12 | [Implement backend web login, sessions and CSRF](tasks/12-implement-backend-web-login-sessions-and-csrf.md) | 11 | Review required |
| 13 | [Prepare native PKCE sign-in and secure restoration](tasks/13-prepare-native-pkce-sign-in-and-secure-restoration.md) | 11 | Review required |
| 14 | [Prepare isolated Keycloak configuration and Google instructions](tasks/14-prepare-isolated-keycloak-configuration-and-google-instructions.md) | 12, 13 | Review required |
| 15 | [Implement community administration and audited bootstrap](tasks/15-implement-community-administration-and-audited-bootstrap.md) | 12, 14 | Review required |
| 16 | [Implement event metadata creation and correction](tasks/16-implement-event-metadata-creation-and-correction.md) | 15 | Routine |
| 17 | [Implement dated meal scheduling and lifecycle](tasks/17-implement-dated-meal-scheduling-and-lifecycle.md) | 16 | Routine |
| 18 | [Implement catalogs, aliases and meal menu entries](tasks/18-implement-catalogs-aliases-and-meal-menu-entries.md) | 17 | Routine |
| 19 | [Implement manual requirements and shopper assignments](tasks/19-implement-manual-requirements-and-shopper-assignments.md) | 18 | Review required |
| 20 | [Create bills through one replay-safe transaction](tasks/20-create-bills-through-one-replay-safe-transaction.md) | 19 | Review required |
| 21 | [Add bill corrections, dependent bases and voids](tasks/21-add-bill-corrections-dependent-bases-and-voids.md) | 20 | Review required |
| 22 | [Add other-expense create, correction and void](tasks/22-add-other-expense-create-correction-and-void.md) | 21 | Review required |
| 23 | [Add versioned leftover observations](tasks/23-add-versioned-leftover-observations.md) | 22 | Review required |
| 24 | [Return consistent authorized snapshots and totals](tasks/24-return-consistent-authorized-snapshots-and-totals.md) | 23 | Review required |
| 25 | [Implement scoped expense reports and history](tasks/25-implement-scoped-expense-reports-and-history.md) | 24 | Review required |
| 26 | [Define local records, immutable queue and reconciliation](tasks/26-define-local-records-immutable-queue-and-reconciliation.md) | 24 | Review required |
| 27 | [Implement browser IndexedDB transactions and leases](tasks/27-implement-browser-indexeddb-transactions-and-leases.md) | 26 | Review required |
| 28 | [Implement native SQLite adapter without compiling](tasks/28-implement-native-sqlite-adapter-without-compiling.md) | 26 | Review required |
| 29 | [Implement queue runner, retries and account cancellation](tasks/29-implement-queue-runner-retries-and-account-cancellation.md) | 27, 28 | Review required |
| 30 | [Implement recovery, drafts and pending-cost projection](tasks/30-implement-recovery-drafts-and-pending-cost-projection.md) | 29 | Review required |
| 31 | [Wire web sessions, event navigation and browser fixtures](tasks/31-wire-web-sessions-event-navigation-and-browser-fixtures.md) | 14, 15, 24, 30 | Routine |
| 32 | [Build volunteer and event-team administration screens](tasks/32-build-volunteer-and-event-team-administration-screens.md) | 15, 31 | Routine |
| 33 | [Build event, meal and menu planning screens](tasks/33-build-event-meal-and-menu-planning-screens.md) | 16, 17, 18, 31 | Routine |
| 34 | [Build requirement planning and consolidated shopping views](tasks/34-build-requirement-planning-and-consolidated-shopping-views.md) | 19, 24, 33 | Review required |
| 35 | [Build durable shopping-led bill entry and correction](tasks/35-build-durable-shopping-led-bill-entry-and-correction.md) | 21, 30, 31, 34 | Review required |
| 36 | [Build common, single-meal and split-cost controls](tasks/36-build-common-single-meal-and-split-cost-controls.md) | 35 | Routine |
| 37 | [Build other expenses, totals, report filters and history](tasks/37-build-other-expenses-totals-report-filters-and-history.md) | 22, 25, 30, 36 | Routine |
| 38 | [Build per-dish offline leftovers](tasks/38-build-per-dish-offline-leftovers.md) | 23, 30, 33 | Routine |
| 39 | [Build visible sync status and conflict recovery](tasks/39-build-visible-sync-status-and-conflict-recovery.md) | 30, 35, 37, 38 | Review required |
| 40 | [Add versioned web shell caching and safe updates](tasks/40-add-versioned-web-shell-caching-and-safe-updates.md) | 31, 39 | Review required |
| 41 | [Verify the full five-role multi-day browser workflow](tasks/41-verify-the-full-five-role-multi-day-browser-workflow.md) | 32, 33, 34, 35, 36, 37, 38, 39, 40 | Review required |
| 42 | [Verify offline failures, lost acknowledgements and concurrency](tasks/42-verify-offline-failures-lost-acknowledgements-and-concurrency.md) | 41 | Review required |
| 43 | [Prepare and later run physical Android acceptance](tasks/43-prepare-and-later-run-physical-android-acceptance.md) | 42, 13, 28 | External gate |
| 44 | [Extract and preview workbook history without importing](tasks/44-extract-and-preview-workbook-history-without-importing.md) | 09 | Review required |
| 45 | [Implement reviewed, repeat-safe historical import](tasks/45-implement-reviewed-repeat-safe-historical-import.md) | 44, 20, 22 | Review required |
| 46 | [Write deployment configuration and configuration validation](tasks/46-write-deployment-configuration-and-configuration-validation.md) | 14, 42 | Review required |
| 47 | [Prepare backup, restoration and operator runbooks](tasks/47-prepare-backup-restoration-and-operator-runbooks.md) | 46, 45 | External gate |
| 48 | [Measure VPS capacity and reconnect burst behavior](tasks/48-measure-vps-capacity-and-reconnect-burst-behavior.md) | 46, 42 | External gate |
| 49 | [Rehearse compatible updates and retained offline queues](tasks/49-rehearse-compatible-updates-and-retained-offline-queues.md) | 40, 42, 46 | Review required |
| 50 | [Prepare pilot, physical distribution and production cutover](tasks/50-prepare-pilot-physical-distribution-and-production-cutover.md) | 41, 42, 43, 45, 47, 48, 49 | External gate |

## Milestones

- **00–05:** verified existing shell, exact arithmetic, permissions and stable contracts.
- **06–15:** database integrity, identity and administration.
- **16–25:** complete authorized Kitchen APIs, replay-safe offline mutation endpoints and accurate reports.
- **26–30:** durable local stores, queue runner and recovery primitives.
- **31–40:** all launch screens and offline web shell.
- **41–43:** full browser/failure evidence and physical-device gate.
- **44–50:** reviewed history import, operational rehearsal, compatibility and release preparation.

Optional independent work: task13 can follow11 while12 is implemented on another isolated branch; task44 can follow09 while UI work proceeds; task28 can follow26 independently of27. Default to serial execution for smaller models. Never parallelize shared migration files, root dependency edits or shared contract changes in one checkout.
