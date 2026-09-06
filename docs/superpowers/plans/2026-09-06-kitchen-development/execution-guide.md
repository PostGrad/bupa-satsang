# Execution guide for smaller models

## Current checkout: preserve before changing

Planning snapshot: 2026-09-06, repository `/Users/postgrad/Github/BUPA-Satsang`, current branch `codex/kitchen-foundation`, HEAD `a3179c9` (`initial commit`). The worktree contains uncommitted scaffold and documentation changes. A previous scratch ledger refers to another baseline; do not reconstruct history from it.

Present: root pnpm/Nx/TypeScript/Vitest/Playwright configuration, an Expo shell, English/Gujarati catalogues, a Nest health endpoint and a dependency lockfile. Absent: business contracts, production schema, actual IAM, expenses, local-store/sync and complete screens. Generated Android files are ignored. Android compilation was interrupted intentionally; no successful APK or physical-device acceptance is claimed. Earlier shell tests are observations, not a substitute for task 00's inspection of the current checkout.

Do not reset, clean, regenerate the repository, discard source changes or commit the source workbook. Task 00 inventories the actual files and captures a local checkpoint only when implementation is explicitly started. Keep unrelated user edits separate. Use `codex/` for new feature branches; a new task should inspect the actual branch rather than assume this snapshot is still current.

Use the installed package manifests and lockfile as the compatibility baseline. Do not independently upgrade Expo, React and React Native. Record needed package additions exactly when their owning task starts. Check Expo-native packages with Expo's compatibility tooling. No speculative dependency installations during planning.

## Selecting models and containing context

Use a small coding model for pure functions, schema validators and a screen with a stable API. Use a capable coding model or a human reviewer for authentication, authorization, SQL constraints, transactions, migrations and offline reconciliation. A small model may implement those cards, but the risk gate still applies. The task index marks these cards **review required**; price alone is not an acceptance criterion.

Give the model its task card, the binding decisions, the named contract sections and existing directly affected files. Avoid handing it old discussions, the workbook, all51 task cards or all prior reports. Exact fixtures and signatures are shared to prevent each model designing a different app.

Dependency means **accepted implementation**, not merely a file with that name. Execute in index order for the simplest safe route. Parallelism is optional only for tasks explicitly shown as independent, on isolated branches; do not run two package installations or two migration writers in one checkout.

## Copyable implementation prompt

```text
Implement exactly task <TASK-ID> from docs/superpowers/plans/2026-09-06-kitchen-development/tasks/<TASK-FILENAME>.
Read its dependencies, docs/superpowers/plans/2026-09-06-kitchen-development/decisions.md, and only the contract/data/test-fixture sections named in the card.
Inspect the existing files listed by the card before editing. Preserve unrelated changes and the workbook. Use the existing lockfile; no framework upgrades or new architecture.
Work inline; do not spawn agents or start another task unless I explicitly request that. Implement only this task. Start with the stated failing behavior test for business logic, implement the smallest correct change, then run the focused commands. Configuration/documentation work needs actual validation, not invented unit tests.
Do not run Android/iOS compilation, create an emulator, deploy, push, purchase, or configure real credentials. Native runtime checks require a separate instruction and the user's physical device.
If a required interface is missing or differs, show the exact difference and stop this task; do not silently invent a replacement or expand into another task.
Report files changed, test commands and real results, unverified items and the next eligible task. Do not claim production readiness. Stop after this card.
```

The two angle-bracket values are prompt substitutions: take both from the task index. They are not missing engineering decisions.

## Copyable review prompt

```text
Review task <TASK-ID> against its task card, binding decisions, shared contracts and the attached task diff and implementation report. Do not implement another feature.
Check spec compliance and correctness separately. Focus on the task's named failure cases, actual server permissions, data invariants and real test assertions. Flag a hidden UI control that substitutes for API enforcement, floating-point money, unstable IDs, or offline data loss.
Return PASS or NEEDS FIXES, with file/line and a reproducible reason for each blocking issue. Distinguish code defects from explicitly deferred physical-device/Google/production checks. Do not rerun a whole suite without a specific unresolved concern.
```

## Handoff report and checkpoint rules

Create `docs/development/handoffs/<TASK-ID>.md` during execution with:

```markdown
Task: exact ID and title
Base: commit before this task
Result: ready for review / blocked
Files: changed paths and purpose
Tests: command, observed result, relevant failure before change and pass after change
Manual evidence: environment, date, observed behavior; otherwise explicitly pending
Contract changes: none, or an approved named revision
Open defects: concrete remaining defects
Next: first eligible task ID, without starting it
```

After review, update that task's row in `progress.md` with commit and evidence. One accepted task per commit is the default. Do not auto-commit another person's unreviewed edits. For a review fix, rerun tests covering changed behavior; run all affected package checks once at the gate. Do not repeatedly run the whole application for every small edit.

If interrupted, keep drafts/outstanding changes, record the failed command or last completed step, and resume that task. Never report “done” because a model ran out of context. Keep production and native acceptance pending until measured.

## Reading regression examples

Each task includes a core assertion to place inside its named Vitest/Playwright test. Add imports from the named package or harness; examples are not complete application implementations. Expand every listed Required case into a meaningful test. The tests must call actual implementations, not functions returning fixture values. Vitest configuration must include the card's exact test path (notably infra, tools and tests/release); add that path only in its owning task.

Use `withTestDb` around snippets with db/manifest in migration tests and load a validated synthetic manifest from the extractor fixtures. Use Playwright's `test` fixture for snippets involving page, context or browser IndexedDB. Native diagnostic snippets run only inside the authorized physical-device harness; do not execute them under Node and call the result native validation. Generated code snippets specify behavior and interfaces; do not copy them into production modules as test shortcuts.
