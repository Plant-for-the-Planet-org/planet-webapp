# Next.js 16 and App Router: migration assessment

> Status: assessment only, written 2026-09-04. No code has been changed. Nothing here is committed to yet.

This answers two separate questions that are easy to confuse:
1. Should we upgrade Next.js from 14.2.35 to 16.x?
2. Should we move from the Pages Router to the App Router?

The short version: **yes to the upgrade (staged), no to the App Router for now**. The reasoning is at the bottom under [Verdict](#verdict).

Phase 0 of the plan below is the work already tracked in [testing-roadmap.md](./testing-roadmap.md). The two documents describe the same prerequisite.

## Contents

- [How the app uses Next.js today](#how-the-app-uses-nextjs-today)
- [Next.js 16 blockers, independent of router](#nextjs-16-blockers-independent-of-router)
- [The React 19 dependency chain](#the-react-19-dependency-chain)
- [What App Router would cost](#what-app-router-would-cost)
- [Would anything need a major rewrite](#would-anything-need-a-major-rewrite)
- [Where regressions are most likely](#where-regressions-are-most-likely)
- [Two approaches compared](#two-approaches-compared)
- [Phased plan](#phased-plan)
- [Verdict](#verdict)
- [Sources](#sources)

## How the app uses Next.js today

### Routing is driven by a rewrite, not by the file tree

Pages Router, 49 files under `pages/`. Every real page lives under `pages/sites/[slug]/[locale]/`, and nothing is served from that path directly.

`middleware.ts` runs on every request and does three jobs:
- reads the hostname, resolves which tenant it belongs to, and rewrites `/en/profile` to `/sites/planet/en/profile`;
- redirects to add a locale when the URL has none, picking it from the `NEXT_LOCALE` cookie or `Accept-Language`;
- writes the `NEXT_LOCALE` cookie when the locale in the path changes.

Tenant resolution calls `getTenantConciseInfo` in `src/utils/multiTenancy/helpers.ts`, which hits an in-memory cache, then Redis (`@vercel/kv`), then the API over `fetch`. This means a network call sits on the critical path of every cold request.

### There is no server-side data fetching worth the name

Zero uses of `getServerSideProps` in the whole repo.

45 pages use `getStaticProps` plus `getStaticPaths` with `fallback: 'blocking'`. Next pre-builds one page per tenant and generates the rest on demand, so this behaves like SSR with a cache rather than a static site.

Those functions fetch exactly two things: the tenant config, and the translation JSON for that page. See `pages/sites/[slug]/[locale]/index.tsx` for the pattern. Every piece of real product data (projects, donations, user profile) is fetched in the browser.

### The app is effectively a client-rendered SPA

`pages/_app.tsx` loads the whole `Layout` with `dynamic(..., { ssr: false })`.

Most pages return `<></>` until the tenant store hydrates on the client, via `if (!isInitialized) return <></>`.

So the server currently produces very little useful HTML. This matters a lot for the App Router argument later.

### Auth is browser-only

`@auth0/auth0-react` v1.12, configured in `pages/_app.tsx`. Token lives in `localStorage`. The server never sees the user and cannot render anything personalised.

### State is Zustand, already migrated off context

16 stores in `src/stores/`, all client-side, wired up by `src/features/common/StoreInitializer/StoreInitializer.tsx`. One React context remains, `src/theme/themeContext.tsx`. See [context-to-store.md](../architecture/context-to-store.md) for the background on that migration.

### Styling runs three systems at once

- MUI v5 with Emotion, using hand-written SSR style extraction in `pages/_document.tsx`.
- 138 SCSS module files.
- styled-jsx, via `src/theme/theme.ts`.

The comment in `_document.tsx` about Emotion tags landing above the SCSS is a sign this ordering is delicate.

### Everything else

| Area | Current state |
| --- | --- |
| API routes | Exactly one: `pages/api/restor/sync-sites.ts` |
| `next/head` | 41 files |
| `next/router` | 76 files |
| `next/image` | 0 files |
| `next/link` | 19 files |
| `next/navigation` | 0 files |
| `'use client'` | 0 files |
| Custom server | `server.js`, Express plus process clustering, run on Heroku via `Procfile` |
| Unit tests | 4 running (`vitest.config.mts` matches `src/**/*.test.ts` only) |
| E2E tests | Cypress broken, see `cypress/MIGRATION_NEEDED.md` |
| Type safety in CI | `typescript.ignoreBuildErrors: true` in `next.config.js` |

## Next.js 16 blockers, independent of router

These break a plain version bump. They apply whether or not we touch the App Router.

### 1. `serverRuntimeConfig` was removed

We use it. `next.config.js` sets `serverRuntimeConfig: { rootDir: __dirname }`, and `pages/_app.tsx` reads it back with `getConfig()` to build the Sentry source-map path.

On Next 16, `getConfig()` no longer exists and this throws at startup. The fix is small (use an environment variable), but it is a hard stop.

### 2. Turbopack is the default, and a custom webpack config makes the build fail on purpose

Next 16 fails `next build` when it finds a webpack config, to stop silent misconfiguration.

Our webpack function in `next.config.js` does three real jobs:
- aliases `@sentry/node` to `@sentry/browser` in the browser bundle;
- stubs `fs` to `false` and shims `path` with `path-browserify`;
- runs the Sentry source-map upload plugin in production.

Options are to pass `--webpack` and keep the old path, or port all three to `turbopack.resolveAlias` and a Turbopack-compatible Sentry setup.

### 3. Sentry is six years out of date

`@sentry/browser` and `@sentry/node` at 6.19.7, plus `@sentry/webpack-plugin` v1 and the deprecated `@sentry/integrations`.

The modern answer is one `@sentry/nextjs` package. This is a rewrite of our error tracking regardless of router, and it touches `pages/_app.tsx`, `pages/_error.js`, and `next.config.js`.

### 4. Stale build-chain packages

- `@next/bundle-analyzer` is on 10.2.3, six majors behind even our current Next 14.
- `@netlify/plugin-nextjs` is on v4, and Next 16 needs v5.

### 5. `middleware.ts` is deprecated in favour of `proxy.ts`

Good news for us: `proxy` runs on the Node runtime, not Edge. Our middleware calls `fetch` and `@vercel/kv`, so Node is the better home for it.

A codemod handles the rename, including config flags such as `skipMiddlewareUrlNormalize` becoming `skipProxyUrlNormalize`.

### 6. ESLint moved to flat config

`@next/eslint-plugin-next` now defaults to flat config. We are on legacy `.eslintrc.js`.

### 7. Dead scripts already in the repo

`"export": "next export"` in `package.json` has not worked since Next 14.

`.github/workflows/cypress.yml` still calls `npm run export`, so that CI job is already broken today.

### 8. Runtime versions are fine

Next 16 needs Node 20.9+ and TypeScript 5.1+. We declare Node 24.x and run TypeScript 5.9.

## The React 19 dependency chain

Next 16.2.4 still declares a peer range of `^18.2.0 || ^19.0.0`. That suggests a **Pages-Router-only** upgrade could stay on React 18.

**This is worth a one-day spike before planning anything else**, because it changes the cost of Phase 3 substantially. Do not bank on it without testing it.

The **App Router on Next 16 requires React 19.2**. React 19 sets off this chain:

| Package | Installed | Problem |
| --- | --- | --- |
| `@auth0/auth0-react` | 1.12.1 | Peers cap at React 18. v2 renames the props we use: `redirectUri` becomes `authorizationParams.redirect_uri`, `audience` becomes `authorizationParams.audience`. Touches our auth entry point directly. |
| `@mui/x-date-pickers` | 5.0.20 | Peers cap at React 18. v7/v8 replaces `renderInput` with `slots` at every call site. |
| `framer-motion` | 2.9.5 | Released 2020. Peer range is permissive, but React 19 compatibility is untested. |
| `react-lazyload` | 3.2.1 | Peers cap at React 18. |
| `@mui/lab` | 5.0.0-alpha.177 | Perpetual alpha, tied to MUI v5. |
| `@mui/material` | 5.18.0 | Peers allow React 19, but MUI's own guidance for React 19 is v6/v7. |

## What App Router would cost

| Change | Files affected | Notes |
| --- | --- | --- |
| Add `'use client'` | most of 625 | We currently have zero. Anything with a hook or event handler needs it. |
| `next/head` to metadata API | 41 | Includes SEO-critical `src/utils/getMetaTags/ProjectDetailsMeta.tsx` and `GetHomeMeta.tsx`. |
| `next/router` to `next/navigation` | 76 | The sharp edge, see below. |
| `getStaticProps`/`getStaticPaths` to `generateStaticParams` | 45 | Mostly mechanical. |
| `_app.tsx` plus `_document.tsx` to `app/layout.tsx` | 2 | Includes redoing the Emotion SSR extraction. |
| `getLayout` to nested layouts | 3 | Genuinely nicer in App Router. |
| next-intl reconfiguration | `i18n.ts` and all routes | Different setup: plugin, `[locale]/layout.tsx`, `setRequestLocale`. |

### The router migration is not a find-and-replace

- `router.query` mixes route params and query-string params into one object. App Router splits them into `useParams()` and `useSearchParams()`. `src/hooks/useInitializeParams.ts` destructures both kinds out of the single `query` object.
- `router.isReady` has **no equivalent** in App Router. 16 files gate on it.
- `shallow: true` is gone. `src/stores/singleProjectStore.ts` uses it to update the URL as the user clicks map sites without refetching. The replacement is `window.history.replaceState`, and getting it wrong means a full re-render on every map click. The other use is `src/features/user/Settings/ImpersonateUser/ImpersonateUserForm.tsx`.
- 76 files pass `router` objects into stores and helper functions. That plumbing changes shape.

### `dynamic(ssr: false)` is not allowed in a Server Component

Used in three places: `pages/_app.tsx`, `src/features/projectsV2/ProjectsMap/index.tsx`, `src/features/user/ManageProjects/components/ProjectSites.tsx`.

## Would anything need a major rewrite

**No product logic does.** Maps, donations, profiles, bulk codes are ordinary client React that carries over almost unchanged. That is a real piece of good news.

What needs rewriting is the **shell**: `_app`, `_document`, all 49 route files, the head and meta layer, the router-access layer, and the Sentry integration. Wide, not deep.

### The argument that actually matters

The App Router's whole value is doing work on the server: Server Components, server data fetching, streaming. This app cannot use any of it today, because:
- auth is a browser-only SPA token, so the server does not know who is logged in and cannot fetch personalised data;
- all product data is fetched client-side;
- the layout is deliberately `ssr: false`.

A straight App Router migration therefore lands us with **all of the cost and almost none of the benefit**: a large pile of `'use client'` files that render exactly as they do now.

To actually get the wins we would also have to move Auth0 to a server-session model and move data fetching server-side. That is a second project, larger than the first.

## Where regressions are most likely

Ranked by blast radius:

1. **Tenant resolution in the middleware.** Runs on every request. A bug shows up as wrong branding, or a 404 storm across an entire tenant's domain.
2. **Locale redirect and the `NEXT_LOCALE` cookie.** 7 locales times every tenant. Easy to produce a redirect loop.
3. **Emotion and SCSS style ordering.** Rebuilding the `_document.tsx` extraction for App Router risks flash-of-unstyled-content across 138 SCSS modules.
4. **Auth0 redirect and token refresh.** `onRedirectCallback` in `_app.tsx` uses `Router.replace` from the Pages Router.
5. **Embed mode.** `?embed=true` is consumed by external widgets we do not control, and it is driven by exactly the `router.query` reading that has to change.
6. **SEO meta on project pages.** Donation traffic arrives through search and social cards.
7. **Donation and payment flows.** Highest value, essentially no test coverage.

### The multiplier on all of the above

We have 4 running unit tests. `vitest.config.mts` matches `src/**/*.test.ts` only, so even the one `.tsx` test is excluded. Cypress is broken. `typescript.ignoreBuildErrors: true` means a passing build tells us very little.

A migration of this size with this safety net is how silent breakage reaches production.

## Two approaches compared

### A. Upgrade Next.js first, migrate to App Router later

Two independent, revertible changes. When the tenant rewrite breaks in staging, we know which change caused it.

Both routers can coexist in one app, so App Router can then arrive route by route. Start with a leaf page such as `vto-fitness-challenge.tsx` and keep `/profile/*` on Pages for as long as we like.

If the React 18 peer range holds for a Pages-only Next 16, the entire dependency chain gets deferred.

Cost: some files get touched twice, and we live with two routers for a while.

### B. Upgrade and migrate at the same time

One deploy, no interim state, no double work.

Cost: a single pull request changing 49 route files, both root files, 41 head usages, 76 router usages, plus Sentry, MUI, Auth0 v2 and React 19. Nobody can review that honestly. When staging breaks, and with 4 tests it will, there is no way to bisect and no partial rollback. With `ignoreBuildErrors: true`, the type system will not catch what we miss.

**Approach B is not viable here.** Not because it is wrong in general, but because this repo lacks the tests to make it survivable.

## Phased plan

Each phase is independently shippable and revertible.

### Phase 0: build the safety net

Do this whether or not we migrate. This is the work in [testing-roadmap.md](./testing-roadmap.md).

- Fix Cypress per `cypress/MIGRATION_NEEDED.md`, or retire it in favour of Playwright.
- Get smoke tests green and gating in CI.
- Start reducing `typescript.ignoreBuildErrors: true`.
- Add targeted tests for tenant resolution, locale redirect, and the donation path.

This is the phase teams skip and then regret.

### Phase 1: modernise dependencies, still on Next 14

- Sentry v6 to `@sentry/nextjs`.
- `@next/bundle-analyzer` 10 to current.
- `@netlify/plugin-nextjs` v4 to v5.
- Remove unused packages: `next-connect`, `express-rate-limit`, `express-slow-down`, and `src/middlewares/rate-limiter.ts`. Nothing imports them.
- Delete the dead `export` script and fix `.github/workflows/cypress.yml`.

### Phase 2: Next 14 to 15

Run the async-request-APIs codemod while Next 15 still allows the synchronous fallback. This is the step that makes 16 straightforward.

### Phase 3: Next 15 to 16, Pages Router intact

- Spike first: does a Pages-only build run on React 18? The answer sets the size of this phase.
- Replace `serverRuntimeConfig` with an environment variable.
- Decide Turbopack versus `--webpack`.
- Rename `middleware.ts` to `proxy.ts` via codemod.
- Move ESLint to flat config.
- If the React 18 spike fails, this phase absorbs the whole React 19 dependency chain.

### Phase 4: reassess

We will be current, supported and faster to build, with no App Router work done. Genuinely re-ask whether the remaining benefit justifies the rest.

### Phase 5 and beyond, only if we continue

- Set up `app/layout.tsx` with Emotion and next-intl alongside the existing `pages/`.
- Migrate one leaf marketing page. Live with it for a sprint.
- Then the projects routes.
- Leave `/profile/*` for last.

## Verdict

**Migration difficulty**
- Next 16 upgrade alone: **Medium**
- Next 16 plus App Router: **High**

**Main benefits**
- A supported version with security patches, and faster builds via Turbopack.
- A forcing function to fix six-year-old Sentry and other stale packages.
- Nested layouts would genuinely improve the `getLayout` pattern.
- Long term, a path to server-rendering project pages for better SEO.

**Main risks**
- The tenant rewrite in `middleware.ts` touches every request.
- 4 unit tests and broken Cypress mean regressions ship silently.
- `ignoreBuildErrors: true` hides the errors a migration creates.
- Auth0 v1, MUI date-pickers v5 and framer-motion v2 all block React 19.
- Emotion and SCSS ordering is delicate and hand-rolled.

**Biggest code areas affected**
- `middleware.ts` and the `pages/sites/[slug]/[locale]/` rewrite scheme.
- `pages/_app.tsx` and `pages/_document.tsx`.
- 76 files on `next/router`, 41 on `next/head`.
- All 45 pages using `getStaticProps` and `getStaticPaths`.
- The webpack and Sentry block in `next.config.js`.

**Recommended approach**

Sequential: safety net, then dependencies, then 15, then 16, then decide about App Router.

**Should we migrate now?**

**Next.js 16: yes**, but staged, and only after Phase 0. We are on a version that will go unsupported, and `serverRuntimeConfig` plus the Sentry upgrade are debts we owe regardless.

**App Router: no, not now.** Not because the migration is too hard, but because this app would gain almost nothing from it. Server Components are the entire point, and client-side Auth0 plus client-side data fetching means we cannot run any component on the server that matters. We would spend months producing an app that renders identically.

Revisit when there is a concrete reason to move auth and data fetching server-side. At that point App Router becomes the tool for that job, rather than a goal in itself.

## Sources

- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [next@16.2.4 package metadata](https://registry.npmjs.org/next/16.2.4)
