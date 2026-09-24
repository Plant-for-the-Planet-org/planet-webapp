# Next.js 16 Upgrade Plan — Keep Pages Router

## Goal

Upgrade the application from **Next.js 14.2.35 to Next.js 16** while **keeping the existing Pages Router architecture intact**.

This plan intentionally does **not** include an App Router migration.

The upgrade should be staged so that dependency modernization, Next.js version changes, CI repairs, and build-system changes remain independently testable and revertible.

---

## Scope

### In scope

- Upgrade Next.js from 14.2.35 to 15.x, then to 16.x.
- Keep the existing `pages/` directory and Pages Router.
- Keep `pages/_app.tsx`.
- Keep `pages/_document.tsx`.
- Keep existing `next/router` usage unless Next.js 16 compatibility requires a specific fix.
- Keep existing `next/head` usage.
- Keep `getStaticProps` and `getStaticPaths`.
- Keep the existing tenant rewrite and locale routing architecture.
- Replace APIs/configuration that are removed or deprecated in Next.js 16.
- Modernize build-chain dependencies required for Next.js 16 compatibility.
- Repair CI paths that are already broken before the framework upgrade.
- Make an explicit decision about the custom Express/Heroku deployment path.
- Improve enough automated coverage to make the upgrade safe.

### Out of scope

The following belong to a future App Router migration and should **not** be included in this upgrade:

- Creating an `app/` directory.
- Creating `app/layout.tsx`.
- Adding `'use client'` across the application.
- Migrating `next/router` to `next/navigation`.
- Migrating `next/head` to the Metadata API.
- Migrating `getStaticProps` / `getStaticPaths` to `generateStaticParams`.
- Replacing `_app.tsx` or `_document.tsx`.
- Migrating `getLayout` to nested layouts.
- Reworking `router.query`.
- Replacing `router.isReady`.
- Replacing Pages Router shallow routing.
- Moving Auth0 to a server-session model.
- Moving product data fetching to Server Components or server-side fetching.
- Migrating the application to React Server Components.

---

# Phase 0 — Preflight and safety net

Do this before committing to the dependency strategy.

## 0.1 Run a day-one React 18 / Next.js 16 compatibility spike

**Status: Done.** Tested on a disposable branch (`spike/nextjs-16-react18-webpack`, now deleted) against Next.js 16.3.5 with React 18.3.1 on Webpack.

- `next build --webpack`: succeeded, all 45 pages generated, no errors.
- `next dev --webpack`: ready in 1.4s. Tenant/locale middleware verified end to end through a real request (`/` returned 307, `/en` returned 200, `NEXT_LOCALE` cookie set, rewrite to `/sites/planet/en` confirmed in the log).
- Only warnings seen: the expected `middleware` to `proxy` deprecation notice (see Phase 3.3), Sass `@import` deprecation noise (see Phase 3.4), and local Sentry "no auth token" warnings (expected without `SENTRY_AUTH_TOKEN` set locally).

**Decision: keep React 18.** It works correctly with Next.js 16.3.5 and the app's critical dependencies on Webpack. React 19 is not a required prerequisite for this upgrade.

**New finding, not previously in this plan:** the spike saw Next.js 16 write to three files. These come from two separate behaviors, and the spike notes first treated them as one.

- `CLAUDE.md` and `AGENTS.md` come from `agentRules`, which is on by default. Its doc comment in `next/dist/server/config-shared.d.ts` says `next dev` writes these files when it detects an AI coding agent. This repository keeps its own `CLAUDE.md`, so Phase 3.2 needs a decision.
- `tsconfig.json` and `next-env.d.ts` come from Next.js's TypeScript setup, which runs on every `next dev` and `next build`. `agentRules: false` does not stop these writes. See Phase 3.5.

Create a throwaway branch and answer the React question immediately, before investing in the staged upgrade.

Test:

```text
Next.js 16
Pages Router
React 18
Webpack
```

At minimum:

```bash
next dev --webpack
next build --webpack
```

The repository is betting on a real versioning tension:

- the Next.js 16 upgrade documentation describes React 19 as the minimum/recommended baseline,
- while the published Next.js 16 package peer range still permits React 18 in the version checked during assessment.

Do not assume either side of that tension is sufficient for this application. Verify the actual dependency graph and production build.

### Decision

- If React 18 works correctly with the selected Next.js 16 release and all critical dependencies, keep React 18 for this project.
- If it does not, make React 19 a separately tracked prerequisite with an explicit dependency-impact review.

This spike is disposable; its purpose is to de-risk the dependency strategy, not to become the upgrade PR.

---

## 0.2 Repair or replace Cypress before upgrading Next.js

**Not a blocker.** The suite is dormant: `cypress.yml` declares `on: pull_request`, but no Cypress check appears on open pull requests, so it cannot fail and cannot produce a false Next.js 16 regression. Nothing below needs doing for this upgrade.

The current Cypress path is already broken independently of Next.js 16:

- Cypress 15 is installed.
- `cypress.json` is still the old v9 configuration format.
- Specs are still under `cypress/integration/`.
- `cypress/MIGRATION_NEEDED.md` already records the migration need.
- `.github/workflows/cypress.yml` still runs the removed `next export` command.
- The same workflow runs `npm run start -p 3000`, while the `start` script already carries its own port flag, producing an invalid/double-port invocation.

Choose one path:

1. migrate Cypress fully to the current configuration/spec layout, or
2. replace the suite with Playwright.

Do not let a pre-existing broken E2E job become a false Next.js 16 regression.

---

## 0.3 Add the minimum regression suite

**Status: Done.** See PR [#3119](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3119) (`feature/phase-0-3-regression-suite`).

Add automated coverage for the highest-risk shared infrastructure:

- tenant resolution — added,
- hostname rewrites — added,
- locale redirects — added,
- `NEXT_LOCALE` cookie behavior — added,
- authentication redirects — already covered by `src/utils/authRedirectGuard.test.ts`,
- embed-mode URL handling — already covered by `src/utils/getDonationUrl.test.ts`,
- at least one donation/payment-path smoke test — already covered by `src/utils/getDonationUrl.test.ts`. The webapp has no checkout flow; it hands off to the donation app, and this test covers that handoff.

The highest-risk parts of this application are the request-wide behaviors, not the individual route files.

### Known gaps in the suite

Phase 3 asks for more than this suite covers. Listed here so the safety net is not overstated.

- **Redis is mocked out.** Nothing tests reading from it, writing to it, or falling back when it is missing. Phase 3 needs this verified by hand. The in-memory cache and the stale-cache fallback are covered.
- **`getTenantConfig` and `constructPathsForTenantSlug` have no tests.** The second one decides which pages get built, and has a Heroku-only branch that Phase 1 will either keep or remove.
- **Locale negotiation is only tested with a cookie present.** The cookie wins over `Accept-Language`, so the first-visit path is unproven.
- **The middleware and the tenant helpers are never run together.** Each is tested with the other mocked out, so a change to what `getTenantConciseInfo` returns would pass both suites.
- **A dead security guard is pinned, not fixed.** See issue [#3137](https://github.com/Plant-for-the-Planet-org/planet-webapp/issues/3137).

E2E coverage is not part of this item. See 0.2.

---

## 0.4 Make current type debt visible without blocking the upgrade

**Status: Still open.** No workflow runs a typecheck yet; `test.yml` runs only `npm run test`.

`tsc --noEmit` currently reports **125 errors** (measured on 2026-09-24 on Next.js 16.3.6). The first assessment counted about 126.

`typescript.ignoreBuildErrors` can remain temporarily because reaching zero is not a prerequisite for the framework upgrade. The problem is that framework-related type regressions can otherwise disappear inside the existing debt.

Add a CI typecheck job such as:

```bash
npm run typecheck
```

Initially make it **non-blocking** and record a baseline error count. Fail or warn when the count materially increases.

The goal is to detect new type breakage, not to turn this project into a full type-cleanup effort.

**When the job can run.** This changed with the Next.js 16 branch.

- On Next.js 15, `next-env.d.ts` was committed and referenced `.next/types/routes.d.ts`, which only exists after a build. Typechecking a clean checkout reported a spurious `TS6053` for the missing file, so the job had to run after a build. Measured after a build, the count was 127 errors, unchanged by the Next.js 15 upgrade.
- On Next.js 16, `next-env.d.ts` is no longer committed (see 3.5). A fresh CI checkout has no such file, and `tsc` then reports the same 125 errors as a checkout that has been built. The two error lists were compared and are identical. So the job can run with or without a build first.

The old `TS6053` cannot come back either. Next.js 16 writes `next-env.d.ts` with side-effect `import` lines instead of the old `/// <reference path>` line, and TypeScript does not check side-effect imports unless `noUncheckedSideEffectImports` is on. With the file present and `.next/types` deleted, `tsc` still reported the same 125 errors and nothing about the missing files.

---

## 0.5 Repair the Chromatic job, which is already red

**Status: Still open (checked 2026-09-24).**

Chromatic fails on every push to `develop`. All 21 runs from 2026-09-15 to 2026-09-23 are red, and 2026-09-15 is before any of this upgrade work started.

The cause is not snapshot differences. The CLI exits 2 with `Encountered 2 build errors`, meaning two stories throw while Chromatic renders them. Everything else is healthy: in the latest run (2026-09-23) all 94 stories across 46 components captured snapshots normally. Earlier runs showed 90 stories across 45 components; the new ones were added since, and the error count stayed at 2.

Storybook 10 did not introduce this. Build 1163 (2026-09-18, Storybook 8, Chromatic CLI 11) and build 1169 (2026-09-21, Storybook 10, CLI 18) fail the same way with the same counts.

`exitZeroOnChanges: true` does not help here, because it suppresses snapshot changes only.

Which two stories throw is visible only on the build page in the Chromatic UI; the CLI log does not name them.

Two ways out:

- Fix the two stories. Preferred. A story that throws is a real signal, and the point of Phase 0 is to make the upgrade's signal readable.
- There is no workflow flag that avoids this. `allowConsoleErrors` was removed from the Chromatic CLI before the version this repository uses, and it would not have helped anyway: it concerns console errors, while a story that throws is a render failure.

Do this before Phase 3, so that a Chromatic failure during the Next.js 16 work actually means something.

### Workflow actions are on deprecated Node

Separate and small, but it lands in the same file. GitHub is deprecating Node 20 for actions and already forces runs onto Node 24 with a warning. `chromatic.yml` uses `actions/checkout@v3` and `actions/setup-node@v3`; `codeql-analysis.yml`, `cypress.yml`, and `eslint.yml` use `actions/checkout@v2`. Only `test.yml` is on `v4`.

`v4` is not the fix. Those versions still run on Node 20, which is the deprecated runtime. As of 23 September 2026 the current releases are `actions/checkout@v7` and `actions/setup-node@v7`. Move the workflows to a version that runs on Node 24 while CI is already open, so a forced-runtime failure does not land in the middle of the framework upgrade.

See issue [#3144](https://github.com/Plant-for-the-Planet-org/planet-webapp/issues/3144), which also proposes `node-version-file: '.nvmrc'` so the workflows stop hardcoding a version each.

---

# Phase 1 — Modernize dependencies and tooling while still on Next.js 14

Do dependency/tooling cleanup separately from the Next.js version bump wherever possible.

This phase should eliminate most of the custom webpack/Sentry/tooling debt before the Next.js 15 and 16 PRs.

---

## 1. Migrate Sentry first

**Status: Done.** See PR [#3121](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3121) (`feature/migrate-sentry-nextjs`).

Move to the modern integration:

```text
@sentry/nextjs
```

Expected areas affected:

```text
pages/_app.tsx
pages/_error.js
next.config.js
```

Remove the legacy combination where no longer required:

```text
@sentry/browser
@sentry/node
@sentry/webpack-plugin
@sentry/integrations
```

The current Sentry migration has unusually high leverage because it should also remove several pieces of framework/build debt at once:

- the `@sentry/node` → `@sentry/browser` webpack alias,
- the manual `SentryWebpackPlugin` insertion,
- the `RewriteFrames` dependency that currently consumes `distDir`,
- the `getConfig()` call used only to retrieve `serverRuntimeConfig`,
- the `serverRuntimeConfig` block itself.

### Move `serverRuntimeConfig` removal into this phase

`serverRuntimeConfig` is a Next.js 16 blocker, but in this repository it should disappear as a consequence of the Sentry migration rather than as a later standalone task.

Current locations identified during assessment:

```text
next.config.js
pages/_app.tsx
```

After the Sentry migration, confirm there are zero remaining imports/usages of `getConfig()` for this purpose and zero remaining `serverRuntimeConfig` configuration.

This materially reduces the custom webpack surface before the Next.js 16 build-system decision.

---

## 2. Fix Storybook before Next.js 16

**Status: Done and merged.** PR #3142, branch `feature/storybook-10-upgrade`, cut from `feature/nextjs-15-upgrade`, merged into `develop` on 2026-09-21. Storybook went from 8.6.18 to 10.6.0, not the 9.x line this section originally named. By the time the work ran, 10.6.0 was the stable release and its `@storybook/nextjs` peer range already covered `next ^16` and `react ^18`, so it met the Next.js 16 requirement while avoiding a second major migration a few months later. The upgrade CLI refuses to skip a major, so it ran as 8 to 9 to 10 in one branch.

Storybook is part of CI and must be treated as an upgrade blocker, not optional local tooling.

Original issue:

```text
@storybook/nextjs@8.6.18
```

declared support through Next.js 15, not Next.js 16.

`.github/workflows/chromatic.yml` runs `build-storybook` on pushes to `develop`, so leaving this unchanged would have broken CI even if the application itself built.

### What changed

- `@storybook/nextjs`, `storybook`, and `eslint-plugin-storybook` are pinned at `10.6.0`. `@storybook/addon-docs` was added at `10.6.0` as well.
- Four packages were removed because Storybook 9 folded them into the `storybook` core package: `@storybook/addon-interactions` and `@storybook/addon-actions` into the core addon set, `@storybook/test` into `storybook/test`, and `@storybook/theming` into `storybook/theming`.
- `@storybook/addon-essentials` was removed and split. Its component addons are part of core now, and its docs half became the separate `@storybook/addon-docs` entry in `.storybook/main.js`.
- `@storybook/react` was removed and replaced by `@storybook/nextjs`, which is where the story types live under the framework-based configuration.
- `@storybook/addon-links` was removed outright, with no replacement. Nothing in the repo imported it.
- The 45 story files moved from `import type { Meta, StoryObj } from '@storybook/react'` to `'@storybook/nextjs'`, which is the framework-based configuration Storybook 9 requires. `.storybook/preview.js` moved from `@storybook/theming` to `storybook/theming`, and the one `fn` import moved from `@storybook/test` to `storybook/test`. All of this was applied by the official automigrations, not by hand.
- The framework stays `@storybook/nextjs` on webpack. The `nextjs-to-nextjs-vite` automigration was offered and deliberately not taken, because `.storybook/main.js` carries a `webpackFinal` hook for the `fs` and `path-browserify` fallbacks. Moving to Vite is a separate decision, not part of a compatibility fix.
- The `addon-mcp` automigration installed `@storybook/addon-mcp`. It was removed again as unrelated to this upgrade.
- `.storybook/main.js` lost three dead entries: the `*.stories.mdx` glob (the repo has no MDX stories and Storybook 9 dropped that format), the `features.emotionAlias` flag (a Storybook 6-era flag that no longer exists), and an empty `docs: {}`.
- `.github/workflows/chromatic.yml` moved from Node 18 to Node 24. Storybook 10's CLI hard-exits below Node 20.19 or 22.12, so `build-storybook` would have failed on Node 18. No Storybook package declares an `engines` field, so `npm ci` itself would have succeeded; the failure comes at build time, not install time. Node 24 matches the `engines` field in `package.json`.
- `tsconfig.json` now excludes `storybook-static`. Running `build-storybook` locally copies `public/` into that directory, which includes a few `.tsx` files, and `tsc --noEmit` was then typechecking build output.
- The Chromatic side was refreshed to match. `chromatic` went from `^6.24.1` to `^18.9.4` and `chromaui/action` from `v1` to `v18`. The `v1` tag is a floating tag Chromatic stopped moving in March 2025, where it maps to CLI 11.27.0, which predates Storybook 9 and 10. The workflow now also passes `storybookBuildDir: storybook-static` so the action reuses the existing build step instead of building Storybook a second time. It also passes `exitZeroOnChanges: true`, so the step reports snapshot differences without failing the job, which is the policy the `chromatic` script in `package.json` has always used locally.
- `.github/workflows/eslint.yml` moved from Node 22 to Node 24 and `.nvmrc` from 16 to 24. `eslint-plugin-storybook@10` is a pure ESM package, while `0.6.15` was CommonJS, so linting through the CommonJS `.eslintrc.js` now needs Node's `require(ESM)` support (`^20.19 || >=22.12`). `chromatic@18` separately declares `engines.node >= 22`. Every Node signal in the repo now reads 24.

### Verification

- `npm run build-storybook` passes. The generated `index.json` holds 135 entries across all 45 story files, so nothing dropped out of the index silently.
- `npm run storybook` serves and responds on port 6006.
- `npm run lint` reports 0 errors. `eslint-plugin-storybook@10` declares `eslint >= 8`, so it works on the current ESLint 8 without waiting for the 1.3 flat-config migration.
- `npx tsc --noEmit` went from 128 to 125 pre-existing errors, with no new ones. The three that cleared were the unresolvable `@storybook/test` import and the two `storybook-static` files.
- `npm test` passes, 68 tests across 6 files.
- `npm run build` (Next.js 15) still passes.

### The first Chromatic run after merge

This section previously said the workflow had only been verified by reasoning, and predicted a flood of snapshot differences held back by `exitZeroOnChanges`. It has now had its real test: build 1169 ran on the `develop` merge commit for PR #3142 on 2026-09-21. The prediction was wrong in both directions.

What worked: Storybook published, Chromatic found 45 components with 90 stories, and all 90 snapshots captured. `storybookBuildDir: storybook-static` did reuse the existing build rather than building Storybook a second time. The CLI reported no snapshot-difference count at all, so the expected flood never appeared in the job output. Whether the baseline still needs re-accepting is only answerable in the Chromatic UI.

What failed: the job went red anyway, for a reason unrelated to the upgrade. The CLI exited 2 with `Encountered 2 build errors`, which is Chromatic's wording for stories that throw while rendering. `exitZeroOnChanges` suppresses snapshot *changes* only, not component errors, so it could never have kept this run green.

Those two errors predate the upgrade. Build 1163, on `develop` on 2026-09-18 with Storybook 8 and Chromatic CLI 11, failed identically: same exit code, same two component errors, same 90 stories across 45 components. So the Storybook 10 upgrade neither caused the failure nor fixed it, and the red belongs to Phase 0 CI repair rather than to this section. See 0.5.

Keeping Storybook changes in Phase 1 means the Next.js 16 PR is not polluted by an unrelated Storybook major migration.

---

## 3. Modernize ESLint as an independent tooling migration

**Status: Done and merged.** PR [#3150](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3150) (`feature/eslint-flat-config-migration`), merged into `develop` on 2026-09-23.

- `eslint` 8 to 9, and `.eslintrc.js` replaced by `eslint.config.mjs` (flat config).
- `@typescript-eslint` v5 replaced by `typescript-eslint` v8, plus `@typescript-eslint/parser` v8.
- `eslint-plugin-react-hooks` 4 to 5, `eslint-plugin-cypress` 2 to 6, and `@eslint/js` and `globals` added for flat config.
- `eslint-plugin-import` and `eslint-plugin-jsx-a11y` removed. The old config used neither, apart from turning two `import/` rules off.
- The flat config keeps the same rule sets as the old one: ESLint, typescript-eslint and React recommended, Storybook, Emotion and Cypress.

Some packages in the list below had already gone before this PR. `eslint-config-airbnb`, `eslint-config-next`, `eslint-config-prettier` and `eslint-plugin-prettier` were removed in PR [#3111](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3111) on 2026-09-07.

One small leftover: `eslint-plugin-react-hooks` is installed, but `eslint.config.mjs` does not use it, and the old `.eslintrc.js` did not either. Either turn on its rules or remove the package. That is a separate lint change, not part of the Next.js 16 upgrade.

This is larger than simply renaming `.eslintrc.js` to `eslint.config.mjs`.

The current dependency graph is internally inconsistent and contains several pre-flat-config-era packages. The assessment identified examples including:

```text
eslint-config-next@^16.0.6   -> expects ESLint >= 9
eslint@^8.26.0              -> currently below that requirement
@typescript-eslint v5       -> needs modernization for the ESLint 9 path
eslint-config-airbnb@18
eslint-config-prettier@6
eslint-plugin-prettier@3
eslint-plugin-react-hooks@4
eslint-plugin-cypress@2
```

### Tasks

- Upgrade to ESLint 9-compatible versions.
- Move TypeScript ESLint to the current v8 generation.
- Replace or upgrade legacy plugins/configs that block flat config.
- Recreate the existing rule intent in `eslint.config.mjs`.
- Remove redundant Prettier-in-ESLint integration if the project can run Prettier separately.
- Verify editor linting and CI linting.

Treat this as tooling-only work and keep it out of the Next.js 16 framework PR.

---

## 4. Upgrade Next.js-adjacent build packages

### `@next/bundle-analyzer`

**Status: Done.** PR [#3157](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3157) (`feature/upgrade-bundle-analyzer`), merged on 2026-09-23, took it from 10.2.3 to 15.5.25. The `feature/nextjs-16-upgrade` branch then moved it to `^16.3.6` together with `next`, since its version follows the `next` release.

The current package is approximately six major versions behind the target Next.js generation and wraps the exported config via the reducer at the bottom of `next.config.js`.

Upgrade it to a version compatible with the selected Next.js release and verify the analyzer path still works.

### `@netlify/plugin-nextjs`

**Status: Done and merged.** PR #3143, branch `feature/remove-netlify`, merged into `develop` on 2026-09-21.

Decided on 2026-09-21: Netlify is not a deployment path any more. Netlify deployments for this repo were blocked a while back and no current version of the app is served from there. Vercel is the deployment path.

So do not upgrade the plugin to v5. Remove `@netlify/plugin-nextjs` from `package.json` and delete `netlify.toml`, instead of carrying a dead deployment adapter through the upgrade.

The removal is safe. All three redirects in `netlify.toml` (`/my-trees`, `/redeem`, `/yucatan-reforestation`) already exist in the `redirects()` block in `next.config.js`, so deleting the file loses nothing. The repo signals agree too: the last 100 GitHub deployments are all Vercel or manual `planet-app-sf` ones, no Netlify check or commit status appears on `develop`, and `netlify.toml` has not been touched since August 2023.

One detail, now historical: Netlify resolved its build Node version from `.nvmrc` when `NODE_VERSION` was unset, and `netlify.toml` set none. That is why raising `.nvmrc` from 16 to 24 was checked against Netlify at all. With `netlify.toml` gone, `.nvmrc` has no deployment consumer left. Heroku was never affected either way, because its Node buildpack reads `engines.node` from `package.json`, which already said `24.x`.

### `next-intl`

No migration work is currently expected for `next-intl@4.13.0`; its published peer range already includes Next.js 16.

Record this explicitly so the team does not budget unnecessary work for it.

---

## 5. Remove dead and fragile dependencies/scripts

**Status: Done and merged.** PR [#3156](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3156) (`feature/remove-dead-tooling`), merged on 2026-09-23. It removed `express-rate-limit`, `express-slow-down`, `@types/express-slow-down`, `src/middlewares/rate-limiter.ts`, `next-unused` with its `find:unused` script and config block, and the `export` script (see 1.6). `next-connect` had already been removed in PR [#3111](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3111) on 2026-09-07. `express` stays, as below.

Verified dead candidates:

```text
next-connect
express-rate-limit
express-slow-down
src/middlewares/rate-limiter.ts
```

`express-rate-limit` and `express-slow-down` are only referenced by the unused rate-limiter module.

Do **not** remove `express`. Item 1.7 below has since been decided: Heroku is live, so `server.js` stays and it needs `express`.

Also remove:

```text
next-unused
```

and the corresponding `find:unused` script. `next-unused@0.0.6` reaches into Next.js internals and is too fragile to carry into a major framework upgrade.

---

## 6. Remove the obsolete `next export` workflow

**Status: The package script is done; the workflow part is left with the Cypress work.** PR [#3156](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3156) removed the `export` script from `package.json`. The `cypress.yml` changes below belong to the Cypress work in 0.2, which is not a blocker for this upgrade.

Remove the dead package script:

```json
"export": "next export"
```

Update `.github/workflows/cypress.yml` so CI no longer runs:

```bash
npm run build && npm run export
```

Also fix the start invocation so the port is supplied exactly once.

This issue already exists independently of the Next.js 16 upgrade and should not appear later as a false migration regression.

---

## 7. Decide whether the custom Express/Heroku server is still a real production path

**Status: Decided on 2026-09-21. Heroku is live, so the custom Express server stays.** Evidence and consequences below.

This is a deployment architecture decision that must be made before the Next.js 16 PR.

Current repository signals include:

```text
Procfile        -> runs node server.js
server.js       -> Express + cluster custom Next.js server
app.json        -> Heroku configuration / heroku-26
heroku-postbuild -> builds the application
README          -> points to Vercel as production
```

### Evidence that Heroku is still live

The GitHub deployment history settles this. Two Heroku apps are deployed from this repository and both are current:

- `planet-app-sf.herokuapp.com` — 18 of the last 100 deployments, the most recent on 2026-09-21 at 10:52 UTC from commit `4812a059f`, which was `develop` HEAD at that moment.
- `planet-app-sf-prod.herokuapp.com` — 5 of the last 100 deployments, on 2026-09-21, 09-18, 09-17, 09-16 and 09-15.

These are manual deployments made by team members, not by a bot, which is why no workflow in `.github/workflows/` mentions Heroku. The absence of a Heroku workflow is not evidence that Heroku is dead. The Netlify check in item 1.4 reached the opposite conclusion from similar-looking signals, so the two cases should not be reasoned about together.

The other 77 deployments in that window are Vercel Preview and Production. Vercel remains the main path; Heroku is a second, parallel one.

### Decision

Keep `server.js`, `Procfile`, `app.json`, the Heroku scripts, and `express`.

Do not delete them unless the team separately decides to retire `planet-app-sf` and `planet-app-sf-prod`. That retirement is a product decision and is not part of this upgrade.

### If Heroku is retired later

Delete the unused deployment stack:

```text
server.js
Procfile
app.json
Heroku-only scripts/config
express
```

but only after confirming no live environment depends on it.

### Required work, now that the custom server stays

Three things follow from the decision, and all of them belong to Phase 3.

First, update the programmatic Next.js initialization so Webpack is explicit in Next.js 16:

```js
next({ dir: '.', dev, webpack: true })
```

This lives in `server.js`. **Done** on the `feature/nextjs-16-upgrade` branch. It only matters when `server.js` runs in dev mode; see 3.1.

Second, put `--webpack` in the `build` script in `package.json` rather than only on the local command line. Heroku builds through `heroku-postbuild`, which runs `npm run build`, so a flag typed at a developer's terminal never reaches the Heroku build. **Done** on the same branch.

Third, verify that the normal request handler path still executes the tenant-routing middleware:

```text
Express request
    ↓
next getRequestHandler()
    ↓
middleware.ts (kept; the proxy.ts rename is skipped for now, see 3.3)
    ↓
tenant / locale rewrite
    ↓
Pages Router
```

Tenant rewriting is the routing model for the application, so this cannot be assumed from a successful build alone.

That third point is the real risk in this decision. `server.js` reaches `getRequestHandler()` through a `server.get('*')` catch-all, so what arrives there is GET and HEAD requests that fall through the `/static` middleware.

**Status: Verified locally on Next.js 16.3.6, still to verify on a Heroku dyno.** After `npm run build`, `server.js` was started as the `Procfile` starts it (`NODE_ENV=production node server.js`), with `WEB_CONCURRENCY=1` and an `x-forwarded-proto: https` header so the HTTPS redirect did not fire. The middleware ran on every request through the Express path:

- `/` with `Accept-Language: de` returned 307 to `/de/`.
- `/en` returned 200, set `NEXT_LOCALE=en` with `Secure`, and sent the `Strict-Transport-Security` header from `server.js`.
- `/en/profile` returned 200.
- The server log showed `Rewritten URL: /sites/planet/en` and `Rewritten URL: /sites/planet/en/profile`.

A local run is not a dyno: it has a different host name, no Heroku router in front, and different env vars. Repeat these checks on `planet-app-sf` before merging.

Requests with other methods never reach the catch-all, so they need a separate check. `pages/api/restor/sync-sites.ts` answers only `POST`, and Heroku starts the app with `node server.js` from the `Procfile`, so that route cannot be reached in production as the server stands today. Confirm on a dyno whether any non-GET path is meant to work, and add an explicit route for it if so.

Note also that `server.js` uses Express 4. The `'*'` catch-all route is not valid in Express 5, so an Express major upgrade is a separate piece of work and should not be folded into the Next.js 16 PR.

`server.js` also prints a Node.js `DEP0169` warning on start, because the catch-all calls `url.parse()`, which Node.js now deprecates. The WHATWG `URL` API replaces it. It is only a warning and is not caused by Next.js 16. Fix it together with the Express 5 work.

---

## 8. Audit Babel before the framework bump

**Status: Done.** See PR [#3139](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3139) (`feature/nextjs-15-upgrade`). Decision: `.babelrc` removed, the app builds on SWC. `@babel/plugin-transform-unicode-regex` and `babel-loader` were removed as dead dependencies alongside it. `@emotion/babel-plugin` had already been removed in PR [#3111](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3111) on 2026-09-07, so no Emotion-related Babel dependency was left. This turned out to be a Next.js 15 build blocker, not just tooling debt: keeping `.babelrc` broke `npm run build` under Next 15 with a `jsxDEV is not a function` error during page-data collection.

Before this fix, the application opted out of the normal SWC compilation path by providing:

```text
.babelrc
```

with:

```json
{
  "presets": ["next/babel"]
}
```

and an additional Unicode-regex transform plugin.

This mattered because Next.js 16/Turbopack detects Babel configuration and continues through the Babel path, which would have made any future Turbopack migration slower and less representative of the default compiler path.

### Tasks (resolved)

- `@babel/plugin-transform-unicode-regex` was not required and was removed.
- `@emotion/babel-plugin` had already been removed in PR [#3111](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3111), so there was nothing left to remove.
- `.babelrc` was removed and the application verified on SWC.

---

# Phase 2 — Upgrade Next.js 14 to Next.js 15

**Status: Done.** Merged into `develop` through PR [#3139](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3139) (`feature/nextjs-15-upgrade`). `next` is at 15.5.25 and `serverComponentsExternalPackages` moved to the stable `serverExternalPackages` key. The Phase 1.8 Babel decision above was resolved as part of this PR rather than beforehand, since it turned out to be required for the Next 15 build to succeed. Build, unit tests, and lint pass, and the upgrade was verified on staging before merging. E2E was not part of that check; the Cypress suite is dormant, see item 0.2.

### Note on sequencing

This PR started Phase 2 before finishing the rest of Phase 0 and Phase 1.

Skipped for now:

- 0.4 Typecheck CI baseline (still open)
- 1.2 Storybook upgrade (done since, merged as PR #3142)
- 1.3 ESLint modernization (done since, merged as PR #3150)
- 1.4 `@next/bundle-analyzer` upgrade (done since, merged as PR #3157; the Netlify half was removed in PR #3143)
- 1.5 Dead dependency removal (done since, merged as PR #3156)
- 1.6 `next export` workflow removal (the script is done in PR #3156; the `cypress.yml` part stays with the Cypress work in 0.2)
- 1.7 Heroku/Express decision (decided on 2026-09-21: Heroku stays)

This was a deliberate choice to get a working Next 15 build landed first rather than finish all cleanup up front.

None of these block Next 15 itself.
The installed `@sentry/nextjs` and `@storybook/nextjs` versions already declare peer support for Next 15.
The repo has no App Router surface for the async-request-API changes to touch.
Node and React already meet Next 15's minimums.

That merge has happened, and as of 2026-09-24 every skipped item has been done since, except 0.4 and the `cypress.yml` half of 1.6. 0.4 and the Chromatic repair in 0.5 are the Phase 0 items still open.

Upgrade to the latest appropriate Next.js 15 release before moving to Next.js 16.

## Tasks

- Upgrade `next` from 14.2.35 to 15.x.
- Run only the official codemods relevant to this Pages Router repository.
- Run:
  - unit tests,
  - smoke tests,
  - E2E tests,
  - Storybook build,
  - production build,
  - staging verification.

## Do not invent App Router migration work

The common Next.js 15 async request API changes around:

```text
cookies()
headers()
draftMode()
params
searchParams
```

are App Router concerns for this codebase and should **not** be budgeted as a migration task.

Repository assessment found:

- no `app/` directory,
- no `next/headers`,
- no `next/navigation`,
- no `getServerSideProps` usage relevant to this migration item.

There is no `NextRequest.geo` / `.ip` exposure either. An earlier version of this plan flagged `src/middlewares/rate-limiter.ts`, but that file types its argument as express's `Request`, so `request.ip` is express's property and Next.js 15 does not touch it. The module is also imported nowhere, so leaving it in place (Phase 1.5 was skipped) costs nothing for this upgrade.

## Why still use Next.js 15 as an intermediate step?

The staged version split remains useful even though there is little Next.js-15-specific application work.

It gives two readable framework PRs:

```text
PR 1
Next.js 14.2.35
    ↓
Next.js 15.x

PR 2
Next.js 15.x
    ↓
Next.js 16.x
```

This makes framework regressions easier to bisect without inventing work that the repository does not need.

---

# Phase 3 — Upgrade Next.js 15 to Next.js 16

Keep the Pages Router intact throughout this phase.

The React 18 feasibility question, Sentry migration, `serverRuntimeConfig` removal, Storybook migration, and ESLint modernization should already be resolved before this PR starts.

**Status (2026-09-24): all five are resolved.** React 18 passed the 0.1 spike, Sentry moved to `@sentry/nextjs` in PR #3121 (which also removed `serverRuntimeConfig`), Storybook 10 merged in PR #3142, and ESLint 9 merged in PR #3150.

Still open from Phase 0: the typecheck job (0.4) and the red Chromatic job (0.5). Neither blocks the Next.js 16 build, but without them a type or story regression from this PR is hard to see.

---

## 1. Keep Webpack explicitly for both development and production build

**Status: Done.** On the `feature/nextjs-16-upgrade` branch, `dev`, `dev-https` and `build` in `package.json` all pass `--webpack`, and `server.js` passes `webpack: true`. `next build --webpack` and `next dev --webpack` both work on Next.js 16.3.6.

Next.js 16 defaults to Turbopack, while this project has custom webpack behavior and a custom-server path that may also instantiate Next.js programmatically.

A custom webpack configuration is not just a reason to be cautious: the Next.js 16 build must be told to use Webpack.

Update scripts so both common entry points are explicit, for example:

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack"
  }
}
```

The custom server remains (item 1.7), so also set:

```js
next({ dir: '.', dev, webpack: true })
```

This option only matters when `server.js` runs in dev mode. Heroku starts it with `NODE_ENV=production`, where Next.js serves the finished `.next` build and no bundler runs. What protects Heroku is the `--webpack` in the `build` script, because `heroku-postbuild` runs `npm run build`.

### Check the Vercel Build Command

**Status: Checked on 2026-09-24.** The Build Command Override in the Vercel project settings is off, so Vercel runs the `build` script from `package.json`, which is `next build --webpack`.

The repository has no `vercel.json`, so this dashboard setting decides what Vercel runs. With the override off, Vercel's Next.js builder runs the `package.json` `build` script (it checks for a `vercel-build` script first; this repo has none), and uses a plain `next build` only when no script exists. The `next build` shown when the override is switched on is just the value it would use then.

Keep the override off. If it is switched on with a plain `next build`, the `--webpack` flag is skipped and the build fails on Turbopack.

To confirm it on a real build, the first Vercel preview of this branch should log `▲ Next.js 16.3.6 (webpack)`.

### What custom webpack config remains

The Sentry work in Phase 1 removed most of the custom webpack surface. What is left is the `resolve.fallback` block in `next.config.js` (`fs: false` and `path-browserify` for `path`), plus the webpack plugin that `withSentryConfig` adds. Re-audit these before declaring Turbopack incompatible.

### Initial migration rule

Do **not** combine:

```text
Next.js 16 upgrade
+
Webpack → Turbopack migration
```

Stabilize the framework first.

---

## 2. Decide on the `agentRules` auto-write behavior

**Status: Done.** Decided on the `feature/nextjs-16-upgrade` branch: `agentRules: false` is set in `next.config.js`. With it set, `next dev` did not create or change `CLAUDE.md` or `AGENTS.md`.

Discovered during the Phase 0.1 spike: Next.js 16 ships an `agentRules` feature that is on by default. When `next dev` detects an AI coding agent, it generates `CLAUDE.md` and `AGENTS.md` at the project root, pointing the agent at the docs bundled in `node_modules/next/dist/docs/`.

This repository keeps its own `CLAUDE.md` with real team instructions, so the choice was:

- set `agentRules: false` in `next.config.js` to opt out, or
- accept the auto-writes deliberately and record why.

`agentRules` covers only those two files. The `tsconfig.json` and `next-env.d.ts` changes seen in the spike come from Next.js's TypeScript setup and happen whatever `agentRules` is set to. See 3.5.

---

## 3. Rename `middleware.ts` to `proxy.ts`

Move the existing request interception logic from:

```text
middleware.ts
```

to:

```text
proxy.ts
```

Use the official Next.js codemod where appropriate.

**Status: Skipped for now (decided 2026-09-24).** The Next.js 16 PR keeps `middleware.ts`, and no follow-up PR is planned until one of the triggers below happens. `middleware.ts` still works in Next.js 16.3.6; the build only prints a deprecation warning.

### Why it is skipped

- Nothing is broken. The docs mark `middleware` as deprecated but give no removal date, and say that all functionality stays the same and only the file and export names have changed.
- The code gains nothing from Node. `middleware.ts` and `src/utils/multiTenancy/helpers.ts` use only `fetch`, `URL`, cookies, `negotiator`, `@formatjs/intl-localematcher` and `@vercel/kv`. `@vercel/kv` talks to Redis over HTTP, so all of it already runs on Edge. There is no Node-only API the rename would unlock.
- It has a real cost on Vercel. Edge middleware runs close to the visitor. Node middleware runs where the Vercel functions run, so visitors far from that region would likely wait longer on every page request. Planet has international tenants and many locales, so this matters.
- Next.js has not finished this story. The upgrade guide says: "We will follow up on a minor release with further `edge` runtime instructions." Moving to Node now could mean redoing the work once that guidance ships.
- Heroku gains nothing. Middleware already runs inside the `server.js` process there.
- The named `middleware` export is also deprecated, but it does not apply here. The function is a default export.

So the only cost of waiting is one deprecation warning in each build.

### When to revisit

- Next.js sets a removal date for `middleware`, or ships the promised `edge` runtime guidance.
- The middleware needs a Node-only feature, such as a TCP Redis client or server-side Auth0 sessions.
- Someone measures Node middleware on a Vercel preview and finds it no slower for visitors outside the function region.

### Why this is not just a rename

The rename also changes the runtime. The Next.js 16 upgrade guide (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`) says: "The `edge` runtime is **NOT** supported in `proxy`. The `proxy` runtime is `nodejs`, and it cannot be configured. If you want to continue using the `edge` runtime, keep using `middleware`."

`middleware.ts` has no `runtime` export, so it runs on the Edge runtime today. Moving to `proxy.ts` moves every request's tenant and locale lookup from Edge to Node.

- On Vercel, this changes cold starts, which region runs the code, and cost, for every request.
- It also changes how long the in-memory tenant cache in `src/utils/multiTenancy/helpers.ts` lives, since a Node instance usually lives longer than an Edge one.
- On Heroku the change is smaller. Self-hosted Next.js already runs middleware inside the Node server process, but in an Edge-style sandbox with only the Edge APIs. After the rename it runs as plain Node code.

The Node runtime should work for the current tenant lookup: `@vercel/kv` and `negotiator` both run on Node. The risk is the runtime change itself, not the code.

When it is done, do the rename in its own PR. That keeps with this plan's rule of not mixing the framework upgrade with other changes, and a runtime regression can then be reverted on its own.

### Tasks, when a trigger happens

- Rename `middleware.ts` to `proxy.ts` with `npx @next/codemod@canary middleware-to-proxy .`. The function is a default export, so its name does not matter.
- Update `middleware.test.ts`, which imports `./middleware` by path.
- Compare latency and errors on a Vercel preview against the Edge version before merging.

### Important

Do **not** redesign the tenant-routing architecture as part of this task.

The existing flow should remain conceptually the same:

```text
Incoming request
    ↓
proxy.ts
    ↓
Resolve hostname / tenant
    ↓
Resolve locale
    ↓
Rewrite public URL
    ↓
/sites/[slug]/[locale]/...
    ↓
Pages Router
```

Do not add work for `skipMiddlewareUrlNormalize` unless an actual repository usage is found; it is not part of the current code path identified in assessment.

Regression-test this heavily because it affects every request.

---

## 4. Validate Sass / CSS behavior under the Next.js 16 loader stack

Next.js 16 moves the Sass loader stack forward, including `sass-loader` v16 behavior and the modern Sass API.

This repository has a large legacy Sass surface:

```text
140 .scss files
136 @import usages
0 @use usages
```

Recounted on 2026-09-24 across `src/`, `pages/` and `public/`. The first assessment counted 138 files and 134 `@import` usages.

There are no `~`-prefixed node_modules imports, which avoids one of the most common loader-upgrade failures, but the scale of legacy `@import` usage still warrants deliberate regression testing.

### What the Next.js 16 build showed

**Status: Compiles, CSS behavior still to verify.** On the `feature/nextjs-16-upgrade` branch, `npm run build` with Next.js 16.3.6 and `sass` 1.97.2 compiled every stylesheet with no Sass errors.

- It printed 741 Sass deprecation warnings. All 741 are the same kind: "Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0."
- A few lines in the log contain the word "error", but only because of file names such as `ErrorComponents/AuthFailed.module.scss`. None of them are Sass errors.
- The same warnings appear on `next dev`.

These warnings are noise for this upgrade, not a blocker. They also have a deadline: `@import` will stop working in Dart Sass 3.0.0. `package.json` has `sass` at `^1.94.2`, so npm will not install 3.x on its own, but a later manual `sass` major bump will need the `@import` to `@use` cleanup first. See "Sass module-system cleanup" below.

The CSS behavior items below have not been checked yet. A clean compile does not prove ordering or hydration are unchanged.

### Verify

- production CSS ordering,
- SCSS module ordering,
- global stylesheet order,
- Emotion SSR output,
- hydration behavior,
- flash-of-unstyled-content behavior,
- Sass warnings/errors from the modern API,
- any path-resolution differences.

Do not turn this upgrade into a full Sass `@import` → `@use` rewrite unless the loader/runtime actually requires it. Track that cleanup separately if needed.

---

## 5. Handle the TypeScript config changes Next.js 16 forces

Next.js runs a TypeScript setup step on every `next dev` and `next build`. In Next.js 16 it changes two committed files. `agentRules: false` does not affect this (see 3.2).

### `tsconfig.json`: `jsx` becomes `react-jsx`

**Status: Done.** Accepted on the `feature/nextjs-16-upgrade` branch.

This is a mandatory change, not a suggestion. The build prints: "The following mandatory changes were made to your tsconfig.json: jsx was set to react-jsx (next.js uses the React automatic runtime)". In `node_modules/next/dist/lib/typescript/writeConfigurationDefaults.js`, `jsx` is set with a `value`, which Next.js always enforces, not only with `suggested`, which it fills in only when missing. There is no config option or env var to turn it off.

Next.js 15 enforced the opposite, `jsx: "preserve"`, which is why this setting never changed before. Keeping `preserve` is not an option: every dev or build run, locally and on Vercel and Heroku, would rewrite it.

The impact is small. SWC compiles the app and ignores this setting, and `noEmit: true` means `tsc` never outputs JSX. It only changes how `tsc` type-checks JSX. The typecheck count stayed at 125 errors, and unit tests and the Storybook build pass with it.

When Next.js makes this change it also reformats the arrays in `tsconfig.json`. That reformatting is not required, so the branch keeps only the one-line `jsx` change.

### `next-env.d.ts`: stop committing it

**Decision (2026-09-24): add `next-env.d.ts` to `.gitignore` and remove it from the repository in the Next.js 16 PR.**

Next.js 16 writes different content into this file depending on the command:

- `next build` imports `./.next/types/routes.d.ts` and `./.next/types/root-params.d.ts`.
- `next dev` imports the same files from `./.next/dev/types/`, because Next.js 16 keeps dev output in its own folder.

So a committed copy shows as modified after every switch between `next dev` and `next build`. New Next.js projects already keep this file out of git, and Next.js recreates it on every dev or build run.

Nothing in CI needs the committed copy. ESLint is not type-aware and already ignores the file in `eslint.config.mjs`, and no workflow references it. `tsc` does not need it either: with no `next-env.d.ts` it reports the same 125 errors as after a build, so the typecheck job from 0.4 can run without building first. See 0.4.

## 6. Run full regression verification

### Tenant routing

Verify:

- known tenant hostname resolves correctly,
- unknown tenant handling works correctly,
- cold-cache tenant resolution works,
- Redis/API fallback behavior works,
- rewrites still target:

```text
/sites/[slug]/[locale]/...
```

If the custom Express server remains, run these tests through that server path as well as the normal local Next.js path.

### Locale handling

Test all supported locales for:

- locale already in URL,
- locale missing from URL,
- `NEXT_LOCALE` cookie present,
- `Accept-Language` fallback,
- locale cookie updates,
- redirect-loop prevention.

### Authentication

Verify:

- Auth0 login,
- Auth0 logout,
- redirect callback,
- token refresh,
- protected pages,
- deep links through login redirects.

### Routing

Verify:

- `router.query`,
- `router.isReady`,
- shallow routing,
- query-string handling,
- dynamic routes,
- client-side navigation,
- direct page loads.

These should continue to work through the existing Pages Router APIs.

### Styling

Verify:

- Emotion SSR output,
- SCSS module ordering,
- hydration,
- flash-of-unstyled-content behavior,
- production CSS ordering,
- no new Sass loader/API regressions.

### Business-critical flows

Verify:

- donation/payment path,
- projects,
- user profile,
- project management,
- embed mode,
- SEO metadata,
- tenant branding.

### Tooling / CI

Verify:

- lint passes,
- non-blocking typecheck baseline does not regress materially,
- Storybook builds,
- Cypress or Playwright E2E passes,
- Chromatic workflow passes,
- production application build passes,
- no CI job calls `next export`,
- no CI job supplies duplicate `-p` flags to the start script.

---

# What should remain unchanged

The following existing patterns should stay in place during this project unless a specific Next.js 16 incompatibility is discovered.

## `next/router`

Keep:

```tsx
import { useRouter } from "next/router";
```

Do not migrate these usages to `next/navigation` as part of this upgrade.

---

## `next/head`

Keep:

```tsx
import Head from "next/head";
```

Do not migrate the existing usages to the App Router Metadata API.

---

## `getStaticProps`

Keep Pages Router data-fetching functions such as:

```tsx
export async function getStaticProps() {
  // existing logic
}
```

---

## `getStaticPaths`

Keep:

```tsx
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
```

Do not replace them with `generateStaticParams`.

---

## `_app.tsx`

Keep:

```text
pages/_app.tsx
```

Do not replace it with `app/layout.tsx`.

---

## `_document.tsx`

Keep:

```text
pages/_document.tsx
```

including the existing Emotion SSR setup unless a Next.js 16-specific compatibility fix is required.

Do not reimplement it using App Router styling patterns.

---

## Pages directory structure

Keep the current structure:

```text
pages/
└── sites/
    └── [slug]/
        └── [locale]/
            └── ...
```

The hostname/locale rewrite strategy can continue routing requests into this Pages Router hierarchy.

---

# Recommended implementation sequence

Status as of 2026-09-24. Phase 2 landed before most of Phase 1, so most Phase 1 work was done on Next.js 15; see the Phase 2 note on sequencing.

```text
Phase 0
Preflight + safety net
│
├─ Day-one Next 16 + React 18 + --webpack spike (done)
├─ Add tenant rewrite tests (done, #3119)
├─ Add locale tests (done, #3119)
├─ Add donation smoke tests (done, #3119)
├─ Add non-blocking typecheck baseline (open, 125 current errors)
└─ Repair the red Chromatic job (open, 2 stories throw)
        │
        ▼
Phase 1
Dependency/tooling modernization
│
├─ Sentry → @sentry/nextjs (done, #3121)
│  └─ remove RewriteFrames/getConfig/serverRuntimeConfig (done)
├─ Storybook 8 → Storybook 10 (done, #3142)
├─ ESLint 9 + flat config + typescript-eslint v8 (done, #3150)
├─ Upgrade @next/bundle-analyzer (done, #3157; 16.3.6 in Phase 3)
├─ Remove Netlify plugin and netlify.toml (done, #3143)
├─ Mark next-intl as already compatible (done)
├─ Remove dead rate-limiter dependencies/module (done, #3156)
├─ Remove next-unused (done, #3156)
├─ Remove the next export script (done, #3156; cypress.yml part stays with 0.2)
├─ Heroku/custom server decided: keep, Heroku is live (done)
└─ .babelrc removed for SWC (done, #3139)
        │
        ▼
Phase 2
Next.js 14 → 15 (done, #3139)
│
├─ Upgrade Next.js
├─ Run only relevant codemods
└─ Full regression test
   (no invented App Router request-API work)
        │
        ▼
Phase 3
Next.js 15 → 16 (in progress, feature/nextjs-16-upgrade)
│
├─ Keep React 18 (done, the spike passed)
├─ Use --webpack on dev, dev-https and build (done)
├─ Set webpack: true in server.js (done)
├─ Set agentRules: false (done)
├─ Accept jsx: react-jsx, stop tracking next-env.d.ts (done)
├─ Keep middleware.ts; skip the proxy.ts rename for now (decided, see 3.3)
├─ Validate middleware through every active deployment path
│  (local done; Heroku dyno and Vercel preview open)
├─ Validate Sass / CSS ordering behavior (compiles; ordering open)
└─ Full app + CI regression testing (open)
        │
        ▼
DONE

Skipped for now: middleware.ts → proxy.ts (Edge → Node runtime, see 3.3)
```

---

# Explicitly defer these projects

After Next.js 16 is stable, the following can be evaluated independently.

## Turbopack migration

Move from Webpack to Turbopack only after the framework upgrade is stable.

Before doing so, re-evaluate:

- the custom webpack config that remains: the `resolve.fallback` block in `next.config.js` (`fs: false` and `path-browserify` for `path`) and the webpack plugin that `withSentryConfig` adds (see 3.1),
- Sentry source-map behavior,
- the webpack opt-ins that must be removed together: `--webpack` in the `dev`, `dev-https` and `build` scripts, and `webpack: true` in `server.js`,
- custom-server behavior,
- build performance and correctness.

Babel is no longer a question here: `.babelrc` was removed in PR #3139, so the app already builds on SWC (see 1.8).

---

## `middleware.ts` → `proxy.ts`

Skipped for now. The rename moves every request from the Edge runtime to Node, which likely adds latency on Vercel for no gain in this codebase. See 3.3 for the reasons, the triggers that should bring it back, and the tasks.

---

## React 19 migration

Upgrade React independently unless the Phase 0 spike proves React 19 is required for the selected Next.js 16 release/dependency graph.

If React 19 becomes required, separately review compatibility for packages such as:

```text
@auth0/auth0-react
@mui/x-date-pickers
framer-motion
react-lazyload
@mui/lab
@mui/material
```

---

## App Router migration

Reassess separately when there is a concrete architectural reason to adopt:

- Server Components,
- server-side authentication,
- server-side product data fetching,
- streaming,
- nested layouts,
- server-rendered SEO-heavy pages.

The Next.js 16 upgrade should not be used as a reason to perform this migration.

---

## Sass module-system cleanup

A future cleanup can migrate legacy Sass `@import` usage to `@use` / `@forward` if desired or required by future Sass releases.

It will be required, not optional. Every Sass warning in the Next.js 16 build says `@import` "will be removed in Dart Sass 3.0.0" (see 3.4). The `^1.94.2` range in `package.json` keeps npm on Sass 1.x, so there is no deadline until someone moves `sass` to 3.x on purpose. Do this cleanup before that bump.

Do not mix a 100+ file stylesheet migration into the Next.js 16 framework PR unless necessary for compatibility.

---

## Turn on or remove `eslint-plugin-react-hooks`

`eslint-plugin-react-hooks` is installed (`^5.2.0`), but `eslint.config.mjs` does not use it, and the old `.eslintrc.js` did not either. So no lint rule checks the rules of hooks today.

Either turn on its recommended rules, which may bring up new lint findings, or remove the package. This is lint work, not part of the Next.js 16 upgrade. See 1.3.

---

# Definition of done

The Next.js 16 upgrade is complete when:

Status as of 2026-09-24, on the `feature/nextjs-16-upgrade` branch. A box is only ticked when it has been checked, not when it is expected to work.

- [ ] The application runs on Next.js 16. Runs locally on 16.3.6 (build, dev, and the custom server); not deployed yet.
- [x] The Pages Router remains the active routing architecture.
- [x] No `app/` migration is required. There is still no `app/` directory.
- [x] The React 18/React 19 decision is based on an actual Next.js 16 spike, not assumptions. Done via Phase 0.1, see that section.
- [x] React 18 remains in place if it passed the compatibility spike, or React 19 has a separately justified migration. React 18 passed.
- [x] `agentRules` in `next.config.js` has an explicit decision recorded (disabled, or accepted deliberately). Disabled; see Phase 3.2.
- [x] `serverRuntimeConfig` has been removed during the Sentry modernization work. Removed in PR #3121.
- [x] Legacy Sentry webpack aliases/plugin wiring are removed where no longer needed. Removed in PR #3121; none of `@sentry/browser`, `@sentry/node`, `@sentry/webpack-plugin`, `SentryWebpackPlugin` or `RewriteFrames` remain.
- [ ] Sentry works in production.
- [ ] Source maps upload correctly.
- [x] `next dev --webpack` works.
- [x] `next build --webpack` succeeds.
- [x] The Heroku/custom-server question is answered with deployment evidence rather than assumption. Heroku is live; see Phase 1.7.
- [ ] `server.js` starts Next.js with `webpack: true`, and the custom-server path is regression-tested. `webpack: true` is done and the path was checked locally (1.7); a Heroku dyno check is still needed.
- [x] The `build` script itself carries `--webpack`, so the Heroku `heroku-postbuild` build gets it too.
- [ ] Tenant rewrites and the middleware are confirmed to run through the Express `getRequestHandler()` path on a real Heroku dyno. Confirmed locally only; see 1.7.
- [x] A deliberate `middleware.ts` / `proxy.ts` decision is recorded. Kept `middleware.ts` on Edge; the rename is skipped for now, see 3.3.
- [ ] Tenant hostname rewrites work through every active deployment path.
- [ ] Locale redirects and cookies work. Checked locally on `next dev` and the custom server; not on a deployment yet.
- [ ] Auth0 login/logout/redirect flows work.
- [ ] Donation/payment flows pass regression testing.
- [ ] Embed mode works.
- [ ] Existing `next/router` behavior works.
- [ ] Existing `next/head` behavior works.
- [ ] Existing `getStaticProps` / `getStaticPaths` behavior works.
- [x] Storybook builds on the Next.js 16-compatible Storybook version (10.6.0). Also checked against Next.js 16.3.6.
- [ ] Chromatic CI passes. Still red, from two component errors that predate the upgrade. See 0.5.
- [x] ESLint runs on the modern supported dependency stack and flat config. PR #3150.
- [ ] The typecheck job exists with a recorded baseline and does not show an unexplained material regression. The job does not exist yet; the local count is 125, unchanged by Next.js 16. See 0.4.
- [ ] Cypress has been migrated successfully, or Playwright has replaced it. Nice to have rather than a gate; the suite is dormant, see 0.2.
- [ ] No CI workflow calls `next export`.
- [ ] CI start commands do not pass duplicate port flags.
- [x] `next-unused` and its fragile script are removed. PR #3156.
- [x] `@next/bundle-analyzer` is upgraded and works if still used. `^16.3.6`; `ANALYZE=true npm run build` wrote the client, nodejs and edge reports to `.next/analyze/`.
- [x] `@netlify/plugin-nextjs` and `netlify.toml` are removed, since Netlify is no longer a deployment path. Done in PR #3143.
- [x] `next-intl` is recorded as compatible with the selected Next.js version unless testing proves otherwise. `next-intl@4.13.0` lists `next ^16.0.0` as a peer, and the Next.js 16.3.6 build passes.
- [x] A deliberate `.babelrc` decision is recorded: removed to use SWC, or retained with a documented requirement. Removed in PR #3139; see 1.8.
- [ ] Emotion SSR remains correct.
- [x] SCSS/Sass compiles under the Next.js 16 loader stack. No Sass errors, only `@import` deprecation warnings; see 3.4.
- [ ] SCSS/global CSS ordering remains correct in production.
- [ ] No unacceptable hydration or flash-of-unstyled-content regression is introduced.
- [ ] The production deployment path is verified.
- [ ] All required CI jobs pass.

---

# Final scope summary

The upgrade as it actually ran:

```text
Day-one spike
Next.js 16 + React 18 + Webpack (done)
        ↓
Next.js 14.2.35
        ↓
Next.js 15.x (done, 15.5.25)
        ↓
Dependency/tooling cleanup, mostly on Next.js 15 (done)
        ↓
Next.js 16.x (in progress, 16.3.6)

Pages Router: KEEP
React 18: KEEP (verified by the spike)
Webpack: KEEP INITIALLY AND MAKE EXPLICIT (done)
App Router: DEFER
React 19: DEFER
Turbopack migration: DEFER
Server-side auth/data migration: DEFER
middleware.ts → proxy.ts: SKIP FOR NOW (stays on Edge, see 3.3)
Heroku/custom server: KEEP (Heroku is live)
Babel: REMOVED (the app builds on SWC)
```

The objective is to make the application **current on Next.js without turning a framework version upgrade into an architectural rewrite**, while also removing pre-existing CI/tooling failures that would otherwise obscure the real migration signal.

---

# Reference material

- Next.js 16 announcement: https://nextjs.org/blog/next-16
- Upgrading to Next.js 16: https://nextjs.org/docs/app/guides/upgrading/version-16
- Upgrading to Next.js 15: https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js custom server guide: https://nextjs.org/docs/pages/guides/custom-server
