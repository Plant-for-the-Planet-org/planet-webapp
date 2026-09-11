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

- tenant resolution,
- hostname rewrites,
- locale redirects,
- `NEXT_LOCALE` cookie behavior,
- authentication redirects,
- embed-mode URL handling,
- at least one donation/payment-path smoke test.

The highest-risk parts of this application are the request-wide behaviors, not the individual route files.

---

## 0.4 Make current type debt visible without blocking the upgrade

`tsc --noEmit` currently reports approximately **126 errors**.

`typescript.ignoreBuildErrors` can remain temporarily because reaching zero is not a prerequisite for the framework upgrade. The problem is that framework-related type regressions can otherwise disappear inside the existing debt.

Add a CI typecheck job such as:

```bash
npm run typecheck
```

Initially make it **non-blocking** and record a baseline error count. Fail or warn when the count materially increases.

The goal is to detect new type breakage, not to turn this project into a full type-cleanup effort.

---

# Phase 1 — Modernize dependencies and tooling while still on Next.js 14

Do dependency/tooling cleanup separately from the Next.js version bump wherever possible.

This phase should eliminate most of the custom webpack/Sentry/tooling debt before the Next.js 15 and 16 PRs.

---

## 1. Migrate Sentry first

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

Storybook is part of CI and must be treated as an upgrade blocker, not optional local tooling.

Current issue:

```text
@storybook/nextjs@8.6.18
```

declares support through Next.js 15, not Next.js 16.

`.github/workflows/chromatic.yml` runs `build-storybook` on pushes to `develop`, so leaving this unchanged will break CI even if the application itself builds.

### Task

Upgrade the Storybook stack to a Next.js 16-compatible 9.x line and verify:

```bash
npm run build-storybook
```

Also verify the Chromatic workflow end to end.

Keep Storybook changes in Phase 1 so the Next.js 16 PR is not polluted by an unrelated Storybook major migration.

---

## 3. Modernize ESLint as an independent tooling migration

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

The current package is approximately six major versions behind the target Next.js generation and wraps the exported config via the reducer at the bottom of `next.config.js`.

Upgrade it to a version compatible with the selected Next.js release and verify the analyzer path still works.

### `@netlify/plugin-nextjs`

If Netlify remains an active deployment path, upgrade from v4 to a current v5 release compatible with Next.js 16.

If Netlify is no longer used, prefer removing the plugin and its configuration instead of carrying another deployment adapter through the upgrade.

### `next-intl`

No migration work is currently expected for `next-intl@4.13.0`; its published peer range already includes Next.js 16.

Record this explicitly so the team does not budget unnecessary work for it.

---

## 5. Remove dead and fragile dependencies/scripts

Verified dead candidates:

```text
next-connect
express-rate-limit
express-slow-down
src/middlewares/rate-limiter.ts
```

`express-rate-limit` and `express-slow-down` are only referenced by the unused rate-limiter module.

Do **not** remove `express` yet unless the custom server/Heroku path is also removed; `server.js` currently uses it.

Also remove:

```text
next-unused
```

and the corresponding `find:unused` script. `next-unused@0.0.6` reaches into Next.js internals and is too fragile to carry into a major framework upgrade.

---

## 6. Remove the obsolete `next export` workflow

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

This is a deployment architecture decision that must be made before the Next.js 16 PR.

Current repository signals include:

```text
Procfile        -> runs node server.js
server.js       -> Express + cluster custom Next.js server
app.json        -> Heroku configuration / heroku-26
heroku-postbuild -> builds the application
README          -> points to Vercel as production
```

### Preferred path if Heroku is dead

Delete the unused deployment stack:

```text
server.js
Procfile
app.json
Heroku-only scripts/config
express
```

but only after confirming no live environment depends on it.

Removing this path is safer than carrying an unsupported/untested custom-server branch forward.

### Required path if Heroku/custom server is still live

Update the programmatic Next.js initialization so Webpack is explicit in Next.js 16:

```js
next({ dir: '.', dev, webpack: true })
```

Then verify that the normal request handler path still executes the tenant-routing proxy logic:

```text
Express request
    ↓
next getRequestHandler()
    ↓
proxy.ts
    ↓
tenant / locale rewrite
    ↓
Pages Router
```

Tenant rewriting is the routing model for the application, so this cannot be assumed from a successful build alone.

---

## 8. Audit Babel before the framework bump

This application currently opts out of the normal SWC compilation path by providing:

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

This matters because Next.js 16/Turbopack will detect Babel configuration and continue through the Babel path, which makes any future Turbopack migration slower and less representative of the default compiler path.

The repository also includes:

```text
@emotion/babel-plugin
```

but it does not appear in the shown Babel configuration, so determine whether it is dead or whether configuration is missing.

### Tasks

- Test whether `@babel/plugin-transform-unicode-regex` is still required for supported browsers/runtimes.
- Determine whether `@emotion/babel-plugin` is actually needed.
- If neither requires a project-level Babel file, remove `.babelrc` and verify the application on SWC.
- If Babel must remain, document the reason and treat it as a known Turbopack constraint.

A recorded `.babelrc` decision is required before this project is complete.

---

# Phase 2 — Upgrade Next.js 14 to Next.js 15

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

The one identified Next.js 15 request-object change touching the repository was `NextRequest.geo` / `.ip` usage inside `src/middlewares/rate-limiter.ts`, and that module is deleted in Phase 1 because it is unused.

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

---

## 1. Keep Webpack explicitly for both development and production build

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

If the custom server remains active, also set:

```js
next({ dir: '.', dev, webpack: true })
```

The Sentry work in Phase 1 should already have removed a large portion of the custom webpack surface. Re-audit what remains before declaring Turbopack incompatible.

### Initial migration rule

Do **not** combine:

```text
Next.js 16 upgrade
+
Webpack → Turbopack migration
```

Stabilize the framework first.

---

## 2. Rename `middleware.ts` to `proxy.ts`

Move the existing request interception logic from:

```text
middleware.ts
```

to:

```text
proxy.ts
```

Use the official Next.js codemod where appropriate.

`middleware.ts` remains a deprecated compatibility path in Next.js 16, so the rename is low-risk and should be completed during this upgrade.

`proxy.ts` uses the Node runtime, which is acceptable for the current tenant lookup behavior.

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

## 3. Validate Sass / CSS behavior under the Next.js 16 loader stack

Next.js 16 moves the Sass loader stack forward, including `sass-loader` v16 behavior and the modern Sass API.

This repository has a large legacy Sass surface:

```text
138 .scss files
134 @import usages
0 @use usages identified during assessment
```

There are no identified `~`-prefixed node_modules imports, which avoids one of the most common loader-upgrade failures, but the scale of legacy `@import` usage still warrants deliberate regression testing.

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

## 4. Run full regression verification

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
- Cypress or Playwright E2E passes,
- Storybook builds,
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

```text
Phase 0
Preflight + safety net
│
├─ Day-one Next 16 + React 18 + --webpack spike
├─ Fix/replace Cypress
├─ Add tenant rewrite tests
├─ Add locale tests
├─ Add donation smoke tests
└─ Add non-blocking typecheck baseline (~126 current errors)
        │
        ▼
Phase 1
Dependency/tooling modernization on Next.js 14
│
├─ Sentry → @sentry/nextjs
│  └─ remove RewriteFrames/getConfig/serverRuntimeConfig
├─ Storybook 8 → Next-16-compatible Storybook 9
├─ ESLint 9 + flat config + @typescript-eslint v8 path
├─ Upgrade @next/bundle-analyzer
├─ Upgrade/remove Netlify plugin
├─ Mark next-intl as already compatible
├─ Remove dead rate-limiter dependencies/module
├─ Remove next-unused
├─ Remove dead next export workflow
├─ Decide Heroku/custom server: delete or support
└─ Decide .babelrc: remove for SWC or document why it remains
        │
        ▼
Phase 2
Next.js 14 → 15
│
├─ Upgrade Next.js
├─ Run only relevant codemods
└─ Full regression test
   (no invented App Router request-API work)
        │
        ▼
Phase 3
Next.js 15 → 16
│
├─ Keep React 18 if Phase 0 proved it viable
├─ Use --webpack on dev and build
├─ If custom server remains, set webpack: true there too
├─ middleware.ts → proxy.ts
├─ Validate proxy through every active deployment path
├─ Validate sass-loader v16 / CSS ordering behavior
└─ Full app + CI regression testing
        │
        ▼
DONE
```

---

# Explicitly defer these projects

After Next.js 16 is stable, the following can be evaluated independently.

## Turbopack migration

Move from Webpack to Turbopack only after the framework upgrade is stable.

Before doing so, re-evaluate:

- any custom webpack aliases/fallbacks that remain after the Sentry cleanup,
- Sentry source-map behavior,
- whether `.babelrc` still forces Babel,
- custom-server behavior,
- build performance and correctness.

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

Do not mix a 100+ file stylesheet migration into the Next.js 16 framework PR unless necessary for compatibility.

---

# Definition of done

The Next.js 16 upgrade is complete when:

- [ ] The application runs on Next.js 16.
- [ ] The Pages Router remains the active routing architecture.
- [ ] No `app/` migration is required.
- [ ] The React 18/React 19 decision is based on an actual Next.js 16 spike, not assumptions.
- [ ] React 18 remains in place if it passed the compatibility spike, or React 19 has a separately justified migration.
- [ ] `serverRuntimeConfig` has been removed during the Sentry modernization work.
- [ ] Legacy Sentry webpack aliases/plugin wiring are removed where no longer needed.
- [ ] Sentry works in production.
- [ ] Source maps upload correctly.
- [ ] `next dev --webpack` works.
- [ ] `next build --webpack` succeeds.
- [ ] If `server.js` remains, programmatic Next.js startup explicitly uses `webpack: true` and the custom-server path is regression-tested.
- [ ] If Heroku is no longer active, `server.js`, `Procfile`, `app.json`, Heroku-only config, and `express` are removed where appropriate.
- [ ] `middleware.ts` has been migrated to `proxy.ts`.
- [ ] Tenant hostname rewrites work through every active deployment path.
- [ ] Locale redirects and cookies work.
- [ ] Auth0 login/logout/redirect flows work.
- [ ] Donation/payment flows pass regression testing.
- [ ] Embed mode works.
- [ ] Existing `next/router` behavior works.
- [ ] Existing `next/head` behavior works.
- [ ] Existing `getStaticProps` / `getStaticPaths` behavior works.
- [ ] Storybook builds on the Next.js 16-compatible Storybook version.
- [ ] Chromatic CI passes.
- [ ] ESLint runs on the modern supported dependency stack and flat config.
- [ ] The typecheck job exists with a recorded baseline and does not show an unexplained material regression.
- [ ] Cypress has been migrated successfully, or Playwright has replaced it.
- [ ] No CI workflow calls `next export`.
- [ ] CI start commands do not pass duplicate port flags.
- [ ] `next-unused` and its fragile script are removed.
- [ ] `@next/bundle-analyzer` is upgraded and works if still used.
- [ ] Netlify plugin is upgraded if Netlify is active, or removed if it is not.
- [ ] `next-intl` is recorded as compatible with the selected Next.js version unless testing proves otherwise.
- [ ] A deliberate `.babelrc` decision is recorded: removed to use SWC, or retained with a documented requirement.
- [ ] Emotion SSR remains correct.
- [ ] SCSS/Sass compiles under the Next.js 16 loader stack.
- [ ] SCSS/global CSS ordering remains correct in production.
- [ ] No unacceptable hydration or flash-of-unstyled-content regression is introduced.
- [ ] The production deployment path is verified.
- [ ] All required CI jobs pass.

---

# Final scope summary

The intended upgrade is:

```text
Day-one spike
Next.js 16 + React 18 + Webpack
        ↓
Dependency/tooling cleanup on Next.js 14
        ↓
Next.js 14.2.35
        ↓
Next.js 15.x
        ↓
Next.js 16.x

Pages Router: KEEP
React 18: KEEP IF VERIFIED
Webpack: KEEP INITIALLY AND MAKE EXPLICIT
App Router: DEFER
React 19: DEFER IF POSSIBLE
Turbopack migration: DEFER
Server-side auth/data migration: DEFER
Heroku/custom server: EXPLICIT KEEP-OR-DELETE DECISION
Babel: EXPLICIT KEEP-OR-REMOVE DECISION
```

The objective is to make the application **current on Next.js without turning a framework version upgrade into an architectural rewrite**, while also removing pre-existing CI/tooling failures that would otherwise obscure the real migration signal.

---

# Reference material

- Next.js 16 announcement: https://nextjs.org/blog/next-16
- Upgrading to Next.js 16: https://nextjs.org/docs/app/guides/upgrading/version-16
- Upgrading to Next.js 15: https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js custom server guide: https://nextjs.org/docs/pages/guides/custom-server
