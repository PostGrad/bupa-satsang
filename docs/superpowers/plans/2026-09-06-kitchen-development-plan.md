# BUPA-Satsang Kitchen Detailed Development Plan

> **For agentic workers:** Use the task-at-a-time execution guide linked below. If using Superpowers, apply `executing-plans` for a single-model session or `subagent-driven-development` only when delegation is explicitly selected. This is a planning handoff, not authorization to begin implementation. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the complete Android and web Kitchen module through small, independently reviewable tasks suitable for lower-cost coding models.

**Architecture:** Shared community identity and events; Kitchen owns meals, requirements, expenses and leftovers. One Expo client and one NestJS/PostgreSQL API use a durable local outbox and a replay-safe server protocol. Keycloak brokers Google authentication.

**Tech Stack:** TypeScript, pnpm, Nx run commands, Expo Router/React Native, NestJS, PostgreSQL/Drizzle, Zod, TanStack Query, React Hook Form, SQLite, Dexie, Keycloak.

**Spec:** [Kitchen architecture](../specs/2026-09-06-kitchen-architecture.md), [product scope](../../planning/2026-09-05-kitchen-proposal.md), [screen journeys](../../planning/2026-09-06-kitchen-screens.md).

**Status:** Planning only, 2026-09-06. Android compilation and development were stopped at the user's request. The partial scaffold remains in the worktree and is not accepted as a completed foundation. No iOS build was running; iOS is outside launch scope. No new implementation, application test or build is required to read this plan.

## Global constraints

- The first release serves at most 200 registered volunteers on Android and responsive web.
- An event may span one or multiple days and contains multiple dated meals.
- English is the default, with a persistent Gujarati switch.
- Expenses remain editable after the meal, with attributed history.
- There is no financial approval or finalise/reopen workflow.
- Purchases, bills, other expenses and leftovers work offline after an authenticated event download.
- Google handles volunteer sign-in and account recovery through Keycloak.
- Use maintained stable releases, pin the resolved versions and commit the lockfile.
- Do not combine independently newest Expo, React and React Native versions.
- Do not silently merge accounts based on email.
- No cascading deletion of financial history.
- Report both event and per-meal expenses; explicit allocations plus common event costs reconcile to the event total.
- No emulator images or emulator setup. Native compilation/install requires a separate instruction; physical Android testing is user-led.

## Development pack

| Read | Purpose |
| --- | --- |
| [Start here](2026-09-06-kitchen-development/README.md) | Scope and navigation |
| [Execution guide and prompts](2026-09-06-kitchen-development/execution-guide.md) | Give a smaller model one task with a controlled context |
| [Binding decisions](2026-09-06-kitchen-development/decisions.md) | Explicit product/technical defaults and boundaries |
| [Shared contracts](2026-09-06-kitchen-development/contracts.md) | Exact DTOs, functions, protocol and local-store interfaces |
| [Data and API map](2026-09-06-kitchen-development/data-api.md) | Tables, constraints, routes, authorization and lock order |
| [Test fixtures](2026-09-06-kitchen-development/test-fixtures.md) | Deterministic two-day/five-role data and exact expected totals |
| [51 task cards](2026-09-06-kitchen-development/task-index.md) | Dependencies, files, interfaces, regression examples and commands |
| [Progress tracker](2026-09-06-kitchen-development/progress.md) | Durable handoff between models; all tasks initially planned |
| [Acceptance and release gates](2026-09-06-kitchen-development/acceptance.md) | Requirement coverage and evidence required before production |

Start future development with task00, which reviews the existing partial scaffold rather than regenerating it. Then follow the dependency order. Keep a capable reviewer for authentication, authorization, money, transactions, migrations and offline sync; isolated UI and pure-function tasks suit smaller models once their contracts are accepted.

This pack supersedes the coarse task sequence in [the earlier foundation plan](2026-09-06-kitchen-delivery.md). It preserves the agreed product scope and adds execution detail for the entire Kitchen release. It makes no claim that the app is production-ready or that any listed future command has run.
