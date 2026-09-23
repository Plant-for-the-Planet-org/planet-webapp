# App Router migration: decision and roadmap

> Status: proposal, written 2026-09-23. No code has been changed.

This is the single source for the App Router decision and plan. It replaces the earlier `nextjs-16-app-router-assessment.md` (2026-09-04), which is still in git history.

The Next.js 16 upgrade itself, on the Pages Router, is tracked in [nextjs-16-staged-upgrade-plan-pages-router.md](./nextjs-16-staged-upgrade-plan-pages-router.md).

**Recommendation: hybrid, gradual migration, starting only after Next.js 16 ships on the Pages Router.** Move the public pages (projects, project details, public profiles). Leave the ~30 logged-in `/profile/*` routes on the Pages Router unless server-side auth becomes a real goal.

## Contents

- [What has changed since the earlier assessment](#what-has-changed-since-the-earlier-assessment)
- [A gap the earlier assessment missed: SEO tags never reach the server HTML](#a-gap-the-earlier-assessment-missed-seo-tags-never-reach-the-server-html)
- [Is it worth migrating?](#is-it-worth-migrating)
- [What the migration touches](#what-the-migration-touches)
- [The React 19 dependency chain](#the-react-19-dependency-chain)
- [Where regressions are most likely](#where-regressions-are-most-likely)
- [Why not upgrade and migrate at the same time](#why-not-upgrade-and-migrate-at-the-same-time)
- [What the full benefit would take](#what-the-full-benefit-would-take)
- [Staying on the Pages Router with Next.js 16](#staying-on-the-pages-router-with-nextjs-16)
- [Does the plan still make sense with Next.js 16 in progress?](#does-the-plan-still-make-sense-with-nextjs-16-in-progress)
- [Roadmap](#roadmap)
- [Topic by topic](#topic-by-topic)
- [Common pitfalls for this codebase](#common-pitfalls-for-this-codebase)
- [Recommended order of execution](#recommended-order-of-execution)
- [Recommendation](#recommendation)
- [Open questions](#open-questions)

## What has changed since the earlier assessment

| Item | Earlier assessment (2026-09-04) | `develop` on 2026-09-23 |
| --- | --- | --- |
| Next.js | 14.2.35 | 15.5.25, merged via PR #3139 |
| Sentry | v6, needs a rewrite | Done, `@sentry/nextjs` v10 with `instrumentation.ts` (PR #3121) |
| `serverRuntimeConfig` | Hard blocker | Gone, no `getConfig` use left |
| Netlify plugin | Needs removal | Removed |
| Unit tests | 4 | 8 files, including `middleware.test.ts` and tenant helper tests (PR #3119) |
| React 19 needed for Next 16? | Spike needed | Spike done: Next 16.3.5 builds and runs on React 18 with the Pages Router and Webpack |

Still open:
- ESLint flat config, bundle analyzer and dead-tooling branches, not merged yet.
- Cypress is still broken.
- `typescript.ignoreBuildErrors: true`, hiding about 127 type errors.
- The Heroku / `server.js` decision.
- The `middleware.ts` to `proxy.ts` rename.
- The `agentRules` decision.

The React 18 result matters most. A Pages-only Next 16 does not need React 19, so the whole React 19 dependency chain (Auth0 v2, MUI date pickers, framer-motion, react-lazyload) can wait until there is a reason for the App Router.

## A gap the earlier assessment missed: SEO tags never reach the server HTML

In `pages/_app.tsx`, the whole page tree sits inside `Layout`, which is loaded with `dynamic(..., { ssr: false })`. All page meta tags are rendered inside that tree:
- `src/utils/getMetaTags/ProjectDetailsMeta.tsx` is rendered by `ProjectDetails`, and also returns `<></>` until `isInitialized`.
- `GetHomeMeta`, `ProjectsListMeta` and `GetPublicUserProfileMeta` work the same way.

So, going by the code, the server HTML has no project title, description or `og:image`.
Google runs JavaScript and mostly copes. Facebook, LinkedIn, X, WhatsApp and Slack do not, so a shared project link most likely shows a generic card or none.
Confirm with `curl` on a project URL and search the output for `og:title`.

This is the one concrete, measurable gain the App Router would bring here. It can also be fixed on the Pages Router, see [Staying on the Pages Router](#staying-on-the-pages-router-with-nextjs-16).

## Is it worth migrating?

**The whole app: no. The public pages: yes, later, and only with a clear goal.**

Why not the whole app:
- **The server has nothing to work with.** Auth is `@auth0/auth0-react` with the token in `localStorage`, so the server never knows who is logged in. All product data is fetched in the browser. The App Router's value is doing work on the server.
- **Most routes are logged-in pages.** 30 of the 47 route files under `pages/sites/[slug]/[locale]/` are `/profile/*`. They need the browser token, so after migration they would render exactly as they do now.
- **The migration is wide.** 74 files import `next/router`, 42 import `next/head`, 16 wait on `router.isReady`, 2 use `shallow: true`, and `pages/_document.tsx` has hand-built Emotion SSR.
- **The safety net is thin.** Cypress is broken, type errors are hidden, and the tenant and locale logic in `middleware.ts` runs on every request.

Why the public pages are worth it:
- Project details, the projects list and `t/[profile]` show public data that needs no login.
- Donation traffic arrives through search and social shares.
- These pages could fetch data on the server and send real HTML and meta tags, instead of an empty shell.

## What the migration touches

Counts checked against `develop` on 2026-09-23.

| Change | Files affected | Notes |
| --- | --- | --- |
| Add `'use client'` | ~30 to 50 entry components | Zero today. Only needed where a server file imports a client component, see [Server Components vs Client Components](#server-components-vs-client-components). |
| `next/head` to the metadata API | 42 | Includes the SEO-critical `src/utils/getMetaTags/ProjectDetailsMeta.tsx` and `GetHomeMeta.tsx`. |
| `next/router` to `next/navigation` | 74 | Not a find-and-replace, see below. |
| `getStaticProps` / `getStaticPaths` to `generateStaticParams` | 46 | Mostly mechanical. |
| `_app.tsx` and `_document.tsx` to a root `layout.tsx` | 2 | Includes redoing the Emotion SSR extraction. |
| `getLayout` to nested layouts | 3 | Genuinely nicer in the App Router. |
| next-intl setup | `i18n.ts` and all routes | Different setup: request config, `[locale]` layout, `setRequestLocale`. |

No product logic needs a rewrite. Maps, donations, profiles and bulk codes are ordinary client React and carry over almost unchanged. What changes is the shell: `_app`, `_document`, the route files, the head and meta layer, and the router-access layer. Wide, not deep.

### Why the router change is not a find-and-replace

- `router.query` mixes route params and query-string params in one object. The App Router splits them into `useParams()` and `useSearchParams()`. `src/hooks/useInitializeParams.ts` reads both kinds from `query`.
- `router.isReady` has no equivalent in the App Router. 16 files wait on it.
- `shallow: true` is gone. `src/stores/singleProjectStore.ts` uses it to update the URL on map site clicks without refetching. The other use is `src/features/user/Settings/ImpersonateUser/ImpersonateUserForm.tsx`.
- Many files pass `router` objects into stores and helper functions. That plumbing changes shape.
- `dynamic(..., { ssr: false })` is not allowed in a Server Component. It is used in `pages/_app.tsx`, `src/features/projectsV2/ProjectsMap/index.tsx` and `src/features/user/ManageProjects/components/ProjectSites.tsx`.

## The React 19 dependency chain

The App Router on Next 16 needs React 19.2. A Pages-only Next 16 does not, as the spike proved. These packages block React 19:

| Package | Installed | Problem |
| --- | --- | --- |
| `@auth0/auth0-react` | 1.x | Peers cap at React 18. v2 renames the props we use: `redirectUri` becomes `authorizationParams.redirect_uri`, `audience` becomes `authorizationParams.audience`. Touches the auth entry point in `_app.tsx`. |
| `@mui/x-date-pickers` | 5.x | Peers cap at React 18. v7 and later replace `renderInput` with `slots` at every call site. |
| `framer-motion` | 2.9.5 | Released 2020. Peer range is loose, but React 19 support is untested. The current package is `motion`. |
| `react-lazyload` | 3.x | Peers cap at React 18. |
| `@mui/lab` | 5.0.0-alpha | Permanent alpha, tied to MUI v5. |
| `@mui/material` | 5.x | Peers allow React 19, but MUI's own React 19 guidance is v6 or v7. |

## Where regressions are most likely

Ranked by how much breaks if it goes wrong:

1. **Tenant resolution in the proxy.** Runs on every request. A bug shows up as wrong branding, or 404s across a whole tenant's domain.
2. **Locale redirect and the `NEXT_LOCALE` cookie.** Every locale times every tenant. Easy to create a redirect loop.
3. **Emotion and SCSS style order.** Rebuilding the `_document.tsx` extraction risks a flash of unstyled content across 136 SCSS modules.
4. **Auth0 redirect and token refresh.** `onRedirectCallback` in `_app.tsx` uses `Router.replace` from the Pages Router.
5. **Embed mode.** `?embed=true` is used by external widgets we do not control, and it depends on the `router.query` reading that has to change.
6. **SEO meta on project pages.** Donation traffic arrives through search and social cards.
7. **Donation hand-off.** Highest value, and only covered by `getDonationUrl.test.ts`.

What makes all of these worse: Cypress is broken and `ignoreBuildErrors: true` hides type errors, so a passing build tells us little.

## Why not upgrade and migrate at the same time

Doing Next 16, React 19 and the App Router in one go means one pull request covering the route files, both root files, 42 head usages, 74 router usages, MUI, Auth0 v2 and React 19. Nobody can review that properly. When staging breaks, there is no way to tell which change caused it and no partial rollback.

Doing them one after another gives separate changes that can each be reverted. Both routers can run side by side, so the App Router can arrive route by route. The cost is touching some files twice and living with two routers for a while.

## What the full benefit would take

Switching routers alone gains almost nothing. These are also needed:

1. **Tenant config ready on the first server render.** Remove the `if (!isInitialized) return <></>` gate (42 route files) and the `ssr: false` Layout, so the server renders real content.
2. **Public data fetched on the server.** Load the project before rendering, so the HTML and meta tags are complete.
3. **The React 19 chain.** The App Router on Next 16 needs React 19.2. That means Auth0 v2, `@mui/x-date-pickers` v7 or later, `motion` instead of framer-motion v2, a replacement for `react-lazyload`, and likely MUI v6 or v7.
4. **Optional, and a separate project: server-side auth sessions** via `@auth0/nextjs-auth0`. This is hard here because the Auth0 client ID changes per tenant (`tenantConfig.config.auth0ClientId`) and every API call reads the `localStorage` token. Only worth it if server-rendered profile pages become a goal.

## Staying on the Pages Router with Next.js 16

This is a reasonable place to stay. The Pages Router is fully supported in Next 16, and the spike proved it works for this app.

What we give up:
- Server Components and streaming. We cannot use them today anyway.
- Nested layouts. Only 3 pages use `getLayout`, so the gain is small.
- Per-section `loading.tsx` and `error.tsx`, and the metadata API.
- New framework features. These land in the App Router first, and some will never reach the Pages Router. This is a slow, long-term cost, not an urgent one.

What we keep: security patches, Turbopack, and good SEO.

The share card gap can be fixed on the Pages Router today:
- In `getStaticProps` for `[p].tsx`, fetch the public project and set a `revalidate` time.
- In `_app.tsx`, render a `<Head>` from `pageProps` outside the `ssr: false` Layout.

This is a small change and gets most of the SEO benefit without any migration.

## Does the plan still make sense with Next.js 16 in progress?

Yes as a direction, no as the next step.

- Next 16 is close: we are on 15.5 and the spike passed. Finish it as the staged plan describes.
- Mixing App Router work into the Next 16 upgrade would undo that plan's main benefit: small, separate changes that can each be rolled back.
- Once 16 is live, start the App Router work with a written goal, for example "project pages send full HTML and correct share cards". Without a goal, it becomes a months-long rename.

## Roadmap

### Stage 0: finish Next.js 16 on the Pages Router

1. Merge `feature/eslint-flat-config-migration`, `feature/upgrade-bundle-analyzer` and `feature/remove-dead-tooling`.
2. Decide on Heroku. `server.js`, `Procfile` and `app.json` were last touched on 2026-07-28, so something may still use them. If nothing does, delete them. A custom server makes every later step harder.
3. Upgrade to Next 16 with `--webpack`, set `agentRules: false` (it rewrites `CLAUDE.md`), and rename `middleware.ts` to `proxy.ts` with the codemod.
4. Fix E2E: move Cypress to the current setup, or replace it with Playwright.
5. Add the typecheck job and record the baseline of about 127 errors.

### Stage 1: groundwork, still on the Pages Router, no `app/` folder yet

6. **Quick SEO fix.** Move project meta tags into the server HTML, as described above. This also gives us a before-and-after test for later.
7. **React 19 chain, one package per PR, all on the Pages Router:**
   - Auth0 v2: `redirectUri` becomes `authorizationParams.redirect_uri`, `audience` becomes `authorizationParams.audience`.
   - Date pickers v7: `renderInput` becomes `slots` at every call site.
   - `motion` in place of framer-motion.
   - Replace `react-lazyload` with native lazy loading or IntersectionObserver.
   - Then React 19 itself.
8. **Router adapter.** The `next/navigation` hooks (`usePathname`, `useSearchParams`, `useParams`) work in both routers, and so does `next/compat/router`. Moving shared components onto them lets us migrate the 74 router files gradually, on the Pages Router, before any route moves.
9. **Stop passing `router` objects into stores and helpers.** Pass a plain `navigate(url)` function instead.

### Stage 2: routing and layout

10. **Keep the rewrite scheme exactly as it is.** Create `app/sites/[slug]/[locale]/` next to `pages/sites/[slug]/[locale]/`. `proxy.ts` does not change.
11. **Root layout at `app/sites/[slug]/[locale]/layout.tsx`:**
    - Renders `<html lang={locale}>`, replacing the lang logic in `_document.tsx`.
    - Loads tenant config and messages on the server.
    - Renders one client `Providers` component holding Auth0, next-intl, Emotion, the MUI theme, `ThemeProvider`, `StoreInitializer`, GTM and `Layout`.
12. **Emotion:** use MUI's `@mui/material-nextjs` `AppRouterCacheProvider` instead of porting the hand-written extraction. Check style order against the 136 SCSS modules with screenshots.
13. **`getLayout` to nested layouts**, one for the projects section. `isMobile` comes from `window.innerWidth`, which the server cannot know, so keep a small client component that picks the mobile or desktop layout.
14. **Move routes one group at a time:**
    - First, one leaf page such as `vto-fitness-challenge`. Run it for a sprint.
    - Then `index` and `[p]` together, in one PR. Moving between a Pages route and an App route is a full page reload, so splitting list and details would reload the map on every click.
    - Then `t/[profile]`, `s/[id]`, `claim`, `mangroves` and the other public pages.
    - `/profile/*` last, or never.

## Topic by topic

### Data fetching

- Replace `getStaticPaths` with `generateStaticParams`, and `fallback: 'blocking'` with `dynamicParams = true`.
- Replace `getStaticProps` with server calls in the layout, since tenant config and messages are the same for every page.
- There is no `revalidate` today, so tenant config stays fixed per deploy. Choose a cache time on purpose rather than copying that by accident.
- The real gain: fetch the project on the server in `[p]/page.tsx`. It feeds both `generateMetadata` and the first render.
- `getMessagesForPage` loads a subset of translation files per page. Keep that by wrapping each page in its own `NextIntlClientProvider`, rather than loading every file in the root layout.

### Server Components vs Client Components

- **Server:** layouts, page shells, metadata, loading tenant config and messages, fetching public project data, static text on marketing pages.
- **Client:** everything else. That covers maps, anything using Zustand, MUI forms, Auth0 and the donation hand-off.
- `'use client'` is not needed on most of the 506 `.tsx` files. The directive marks a boundary: anything a client component imports is client automatically. Expect roughly 30 to 50 feature entry components to need it.
- The 3 uses of `dynamic(..., { ssr: false })` must move inside client components.

### API routes

- There is only one: `pages/api/restor/sync-sites.ts`.
- Leave it in `pages/api`. It keeps working, and the proxy matcher already skips `/api`.
- Moving it to an `app/api/.../route.ts` handler later is optional and low risk.

### Authentication

- Keep browser-side Auth0 (v2 after Stage 1) inside the client `Providers`.
- `onRedirectCallback` in `_app.tsx` uses `Router.replace` from `next/router`, which fails in App routes. Switch it to `window.location.replace` or the router adapter.
- While `/profile/*` stays on the Pages Router, Auth0 must work in both routers. Keep one shared config helper so the two setups cannot drift.
- Server-side sessions are out of scope, see [What the full benefit would take](#what-the-full-benefit-would-take).

### State management

- The Zustand stores in `src/stores/` stay as they are, and stay client-only.
- **New risk:** today nothing store-based renders on the server, because of `ssr: false`. Once server rendering is on, a store created at module level is shared across all requests on the server, so one tenant's config can leak into another tenant's HTML.
  - Never write to stores during server render.
  - Pass `tenantConfig` down as a prop.
  - For `tenantStore`, consider a per-request store created through React context.
- `queryParamStore` and embed mode: `useSearchParams` needs a `<Suspense>` wrapper in the App Router. Without it, that part falls back to client-only rendering or the build fails.
- `?embed=true` is used by external widgets we do not control. Test it on every migrated route.

### Middleware / proxy

- Rename to `proxy.ts` in Stage 0 and do not redesign it. It works the same for both routers.
- Do not add next-intl's own middleware. The custom locale and `NEXT_LOCALE` cookie logic stays in charge.
- Fix the dead `/sites` guard (issue #3137) in its own small PR, not inside the migration.

### SEO and metadata

- Turn the 5 files in `src/utils/getMetaTags/` into `generateMetadata` functions per route.
- Keep the same fields: title, Open Graph, Twitter, and the `android-app` link for the `planet` tenant.
- Test: a `curl` of each migrated public page must include `og:title` and `og:image`.

### Loading and error states

- Replace the blank `<></>` screens with `loading.tsx` in the projects section.
- Add `error.tsx` per section and a `global-error.tsx` that reports to Sentry.
- Add `not-found.tsx` inside `[locale]`.
- Keep `pages/404.tsx` and `pages/_error.js` while any Pages routes remain.

### Testing

- **Before any route moves:** E2E smoke tests for home, projects list, project details, login, one profile page, the donation hand-off and `?embed=true`. Run them on 2 tenants and 2 locales.
- **For each moved route:** an HTML-level test that checks the meta tags and the tenant branding in the server response.
- Use Chromatic plus E2E screenshots to catch style-order problems.
- Keep code under `app/` free of type errors, even while `ignoreBuildErrors` stays on for the rest of the app.
- Keep `middleware.test.ts`, `authRedirectGuard.test.ts` and `getDonationUrl.test.ts` green throughout.

### Deployment

- Production is on Vercel. Remove Heroku before Stage 2 if possible.
- Tenants are resolved by hostname. Check how to reach more than one tenant on preview or staging deploys before relying on them.
- Every route move is its own PR, so a `git revert` puts that route back on the Pages Router.
- GTM starts in `_app.tsx` today. It must also start in the App layout, and full-page reloads between the two routers can double-count page views. Check analytics after the first move.

## Common pitfalls for this codebase

1. The same route in both `pages/` and `app/`, which fails the build.
2. Splitting the projects list and details across routers, which reloads the map on every click.
3. Tenant data leaking between requests through module-level Zustand stores.
4. Hydration mismatches from `isMobile`, `window` and `localStorage` reads in components that now render on the server.
5. Missing `<Suspense>` around `useSearchParams`.
6. `router.query` mixed route params and query params. Missing one when splitting them into `useParams` and `useSearchParams` breaks embed mode (see `src/hooks/useInitializeParams.ts`).
7. `shallow: true` in `src/stores/singleProjectStore.ts` has no direct equivalent. The replacement is `window.history.replaceState`, done when the projects routes move. Getting it wrong means a full re-render on every map click.
8. Emotion styles landing above the SCSS, causing a flash of unstyled content.
9. Adding `'use client'` everywhere to be safe, which throws away the only benefit.

## Recommended order of execution

1. Finish Stage 0: Next 16 on the Pages Router.
2. Quick SEO fix on the Pages Router.
3. React 19 chain, one PR per package.
4. Router adapter, and remove `router` from stores and helpers.
5. Root App layout and providers, plus one leaf page. Run it for a sprint.
6. Projects list and project details together.
7. Remaining public pages.
8. Stop and reassess. Move `/profile/*` only if server-side auth becomes a real goal.

## Recommendation

**Hybrid, gradual migration, after Next 16 ships on the Pages Router.**

- **Not a migrate-now approach:** 74 router files, a thin safety net and request-wide tenant logic make a big-bang change unsafe. The React 19 chain also has to come first.
- **Not staying on the Pages Router forever:** the public project pages have a real payoff in share cards and server-rendered HTML, and donation traffic depends on them.
- **Hybrid fits this codebase:** both routers run side by side and the tenant rewrite works the same for both. We migrate only the ~17 public routes where the server has useful work, and leave the 30 logged-in routes where it has none.

## Open questions

1. What is the main reason for the App Router? If it is SEO and share cards, the quick Pages Router fix may be enough for a long time. If it is staying current or nested layouts, step 5 above is a cheap way to test that.
2. Is Heroku still serving anything? The answer decides how much of Stage 0 can be simplified.
