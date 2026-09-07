# BUPA-Satsang Monorepo Resources

## Knowledge

- [pnpm Workspace docs](https://pnpm.io/workspaces)
  Official source for pnpm workspace behavior, including why a root `pnpm-workspace.yaml` defines the workspace and how `workspace:` dependencies resolve to local packages. Use for: package membership and local package links.
- [pnpm workspace settings](https://pnpm.io/settings)
  Official source for `pnpm-workspace.yaml` settings such as `packages`, `allowBuilds`, and shared workspace behavior. Use for: interpreting root workspace settings.
- [Nx Project Configuration](https://nx.dev/docs/reference/project-configuration)
  Official source for how Nx combines inferred tasks, `nx.json` target defaults, and per-project `project.json` or `package.json` configuration. Use for: understanding where task behavior comes from.
- [Nx CLI command reference: `nx show`](https://nx.dev/docs/reference/nx-commands#nx-show)
  Official source for listing projects and inspecting resolved project/target configuration. Use for: exploring this repo from the command line.
- [Nx `nx.json` reference](https://nx.dev/docs/reference/nx-json)
  Official source for `defaultBase`, `targetDefaults`, task inputs, outputs, and cacheable target settings. Use for: understanding root Nx policy.

## Wisdom (Communities)

- [Nx Discord](https://nx.dev/community)
  Official community entry point. Use for: unclear Nx behavior, project graph questions, or cache/debugging help after local evidence is exhausted.
- [pnpm Discussions](https://github.com/pnpm/pnpm/discussions)
  Maintainer-adjacent community for workspace and package manager questions. Use for: workspace dependency behavior and install/linking surprises.

## Local Evidence

- `package.json`
  Root scripts, pinned package manager, Node engine, and repo-wide dev tools.
- `pnpm-workspace.yaml`
  Workspace membership: `apps/*` and `packages/*`, plus approved dependency build scripts.
- `nx.json`
  Workspace-level Nx defaults for `typecheck`, `lint`, and `web-build`.
- `apps/*/project.json`
  Per-app Nx targets for API and client commands.
- `packages/*/package.json`
  Shared package names and public exports consumed by apps and tests.
