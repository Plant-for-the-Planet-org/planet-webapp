# Testing roadmap

Tests are the highest-leverage way to make reviews faster, and the repo has no reliable
automated tests today (the Cypress suite is broken and needs migration or retirement). This is
a separate, larger track. It supports the review process in
[review-process-roadmap.md](./review-process-roadmap.md). It can start small.

> Status: roadmap. Nothing here is built yet; start with the quick wins.

## Why this exists

The deepest cause of slow reviews is that the repo has no working automated tests, so every
"behavior preserved" claim is proven by hand. This compounds with PR size.

## How tests cut review time

Review time goes into two things a test can replace:
- proving a refactor kept behavior (the migration review diffed new against old, file by file);
- confirming a claim by manual repro (log in, redeem twice, watch the balance).

A green suite on the risky logic lets a reviewer trust both instead of re-deriving them. CI
gating (typecheck plus tests) moves a class of issues out of review entirely.

## What to test, by payoff (not by coverage percent)

Target the risk map, not a coverage number. In order:
1. Pure logic and store actions (highest payoff, lowest effort). For this codebase:
   `userStore` actions (fetch success and each error branch, enter and exit impersonation, the
   refetch trigger), `setHeader.ts` (malformed JSON, the localStorage fallback, param
   precedence), `validateToken.ts` (expired vs valid). These are where the real findings were,
   and they need little or no React.
2. Init hooks (timing and gates): `useInitializeUser`, `useInitializeAuth`,
   `useProfileErrorHandler`, tested with `renderHook` (from `@testing-library/react`) and mocked
   Auth0, router, and fetch. The gate and redirect logic where the subtle bugs live.
3. Page and component render (integration): tests "the page renders without crashing and shows
   the expected content," given seeded state. Needs a shared `renderWithProviders` helper that
   mocks `next/router`, wraps next-intl messages, mocks Auth0 (`useAuth0`), seeds the zustand
   stores, and stubs `useApi`/fetch with fixtures. Build the helper once; each page test is
   cheap after. This is where the render-gate and null-profile bugs from the review would be
   caught (render with `userProfile: null` vs set). It tests the client render only, not SSR,
   `getServerSideProps`, routing, or middleware. Feasible, but do it after the priority 1 and 2
   wins.
4. End-to-end (a real browser at a URL): highest fidelity, highest cost. Needs a running app, a
   way through Auth0 login (programmatic token injection, not driving the login UI), backend
   data or network stubbing, and tenant and env config. Prefer Playwright over reviving the
   broken Cypress suite. Reserve it for a few critical-path smoke flows, not many pages. Defer.

Test behavior, not implementation (assert outcomes, not internal calls), so tests survive the
next refactor, which is the whole point.

## Quick wins to get the ball rolling (does not need to be perfect)

1. Stand up the runner. Add vitest and jsdom (jsdom gives tests a browser environment, so
   `localStorage` and `window` work); add `test`, `test:watch`, and `typecheck` (`tsc --noEmit`)
   scripts and a minimal `vitest.config.ts` (set `environment: 'jsdom'` in it, since vitest
   defaults to a node environment). Prove the pipe with one passing test. Vitest fits
   Next pages-router and TS, runs fast, and uses its own build, so it will not disturb the
   pinned webpack. Add `@testing-library/react` later, only when you start the hook tests
   (priority 2 above); the pure-logic tests do not need it.
2. First real tests on pure logic: `validateToken.ts`, then `setHeader.ts`, then the `userStore`
   actions. Fast green, little mocking.
3. Turn findings into tests. A review finding becomes a regression test: what was found by hand
   becomes a guard for next time. Two concrete examples from the migration review:
   - Refetch runs only once: a boolean refetch flag never resets, so a second refetch is a
     no-op. Test: trigger the refetch twice and assert the fetch fires both times.
   - Redirect-loop guard never trips: the counter resets on the full-page redirect, so it never
     reaches the limit. Test: remount the hook to model the redirect and assert the guard trips
     at the limit.
4. A CI job running typecheck plus tests. Start it non-blocking, then make it required once it is
   stable. Caveat for typecheck: `next.config.js` sets `ignoreBuildErrors: true` and the codebase
   reports many `tsc --noEmit` errors today, so a typecheck gate cannot demand zero errors on day
   one. Baseline the current errors (block new ones) or fix them first; keep typecheck
   non-blocking until then.

Dependency on the migration (PR 2837, the zustand user migration reviewed here): the harness and
the `validateToken` and `setHeader` tests can land on `develop` now, since those files already
exist there. The `userStore`, `authStore`, and init-hook tests target files that 2837 creates,
so they need 2837 merged first, or must be written on top of the migration branch. 2837 lists
testability as a goal, so those tests can ride with it or follow right after it merges.

Then, separately, decide the fate of Cypress (migrate per `cypress/MIGRATION_NEEDED.md`, or
retire it) so the CI signal is honest.

## Keep it effective

- Risk-first, not coverage-first.
- Behavior over implementation.
- For a refactor or migration, write characterization tests first (pin current behavior) so the
  port is provable by a green run instead of a line-by-line read.
- When a finding is verified by manual repro, note what to test and how in the finding, so it is
  ready to write once the harness lands.

## Tasks (quick wins first)

Ordered. Items marked "needs 2837" depend on the migration (PR 2837) landing first, since they
target files that PR creates. See the sections above for detail.

- [ ] Stand up the runner: vitest + jsdom, `test` / `test:watch` / `typecheck` scripts,
      `vitest.config.ts`, one passing test.
- [ ] Pure-logic tests: `validateToken.ts`, then `setHeader.ts`.
- [ ] CI job: run typecheck + tests. Keep typecheck non-blocking until the existing `tsc`
      errors are baselined or fixed.
- [ ] Store tests (needs 2837): `userStore` actions, `authStore`.
- [ ] Add `@testing-library/react`; init-hook tests (needs 2837): `useInitializeUser`,
      `useInitializeAuth`, `useProfileErrorHandler`.
- [ ] `renderWithProviders` helper, then page render tests.
- [ ] Decide Cypress: migrate (per `cypress/MIGRATION_NEEDED.md`) or retire.
- [ ] Later: Playwright for a few critical-path end-to-end smoke flows.
