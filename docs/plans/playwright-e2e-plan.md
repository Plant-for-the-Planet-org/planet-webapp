# Playwright end-to-end testing plan

Findings and a proposed plan for adding Playwright end-to-end (E2E) tests to this repo.
It expands the "Later: Playwright" item in [testing-roadmap.md](./testing-roadmap.md), which already says to prefer Playwright over reviving the broken Cypress suite and to keep E2E to a few critical-path smoke flows.

> Status: proposed on 2026-10-09. Nothing is installed yet. See the open questions and tasks at the bottom.

## Summary

- Add Playwright for a few smoke tests of the most important user flows. The goal is confidence in key journeys, not coverage.
- Start with 5 public, read-only tests. Add logged-in tests in a second phase.
- In CI, run the tests against the Vercel preview that is already built for every PR, instead of building the app again in GitHub Actions.
- Remove the broken Cypress setup in a separate PR, so the repo has one E2E tool.

## 1. The project today

| Area | What we have |
|---|---|
| Framework | Next.js 16 (Pages Router only), webpack, React 18, TypeScript |
| Package manager | npm 11, Node 24 |
| Routing | [middleware.ts](../../middleware.ts) picks the tenant from the host name, adds a locale (`/` goes to `/en`), then rewrites to `pages/sites/[slug]/[locale]`. On localhost and Vercel previews the tenant falls back to `planet`. |
| Data | Pages load data on the server with `getStaticProps` (`fallback: 'blocking'`). In the browser, [apiClient.ts](../../src/utils/apiRequests/apiClient.ts) calls the Planet API directly. Vercel previews use the staging API. |
| Login | Auth0 (`@auth0/auth0-react` 1.12, `auth0-spa-js` 1.22) with the hosted login page on `accounts.plant-for-the-planet.org`. The session lives in `localStorage` plus an `auth0.is.authenticated` cookie (`cacheLocation: 'localstorage'` in [_app.tsx](../../pages/_app.tsx)). |
| Donations | Payment happens in the separate donate app. This app only builds the link to it ([getDonationUrl.ts](../../src/utils/getDonationUrl.ts)). |
| Hosting | Vercel builds a public preview for every PR and reports it to GitHub as a `Preview` deployment. |

Testing tools today:

| Tool | Status |
|---|---|
| Vitest + jsdom | Works. 8 unit test files run on every PR ([test.yml](../../.github/workflows/test.yml)). A 9th (`.tsx`) waits for React Testing Library. |
| Storybook + Chromatic | Works. 47 stories, visual snapshots on push to `develop`. |
| Cypress 15 | Installed but broken. See below. |

Why the Cypress suite cannot be used as it is:
- The config is still the v8 format (`cypress.json`, `cypress/integration/`), see [MIGRATION_NEEDED.md](../../cypress/MIGRATION_NEEDED.md).
- The `Cypress tests` workflow is disabled in GitHub, and it calls `npm run export`, which no longer exists.
- None of the main `data-test-id` selectors it relies on (for example `donateButton`, `cardElement`, `test-thankYou`) exist in the app anymore.
- The donation tests fill in a Stripe card form, but payment now happens in the separate donate app.
- The last real test change was in 2022.

## 2. What Playwright is

Playwright opens a real browser, clicks and types like a person, and checks what shows on screen.
It is free, made by Microsoft, and comes with its own test runner (`@playwright/test`).

The problem it solves: Vitest checks small pieces alone, with everything around them faked. It cannot tell us whether a page still works when middleware, tenant config, translations, Auth0, and the API all run together. Playwright can.
Example: the crash fixed in 6c6f2fad0 ("guard against null project name in project snippet") is the kind of bug a simple "home page shows projects" test catches against staging data.

| Tool | What it checks | Real browser | Time per test |
|---|---|---|---|
| Vitest | One function or hook, the rest is faked | No (jsdom, a fake browser) | Milliseconds |
| Storybook + Chromatic | How one component looks | Yes (screenshots) | n/a |
| Playwright | Whole user journeys on a running app | Yes | Seconds |
| Cypress | Same job as Playwright | Yes | Seconds, but broken here |

Why Playwright instead of fixing Cypress:
- Other domains are easy. Our login (Auth0) and the donate app live on other domains. The old Cypress config needed `chromeWebSecurity: false` as a workaround.
- It waits on its own. The old tests used `cy.wait(15000)` in many places. Playwright waits for the element instead, so tests are faster and less flaky.
- Parallel runs and step-by-step recordings of failed tests are built in and free.

Terms you will see:
- Locator: how a test finds an element, the way a user would. Example: `page.getByRole('link', { name: 'Donate' })`.
- Auto-wait: `await expect(locator).toBeVisible()` keeps checking until it is true or times out.
- Browser context: each test gets a fresh, empty browser profile, like a new incognito window, so tests do not affect each other.
- `storageState`: a saved file of cookies and `localStorage`, used to start tests already logged in.
- Trace viewer: a recording of each test step (screen, network, console). When CI fails, download it and replay.
- Codegen and UI mode: `npx playwright codegen` writes test code while you click; `--ui` runs tests while you watch each step.

## 3. User flows worth testing

Public, no login (phase 1):
1. Home: `/` goes to `/en` and the project list loads. This needs middleware, tenant config, translations, and the API to all work.
2. Project page: open a project from the list, or go to one directly (for example `/en/yucatan`).
3. Donate hand-off: the Donate link points to the donate app with the right project and tenant. This is the money path. We check the link; we do not pay.
4. Language: `/de` shows German.
5. Login gate: a logged-out user opening `/en/profile` is sent to the Auth0 login page.

Logged in (phase 2):
6. The profile loads for a logged-in user.
7. A project owner (TPO) sees their projects list.

Later, only if needed: PlanetCash, bulk codes, payouts, donation receipts, and redeeming codes. They matter a lot, but they write data and need special accounts.

## 4. How Playwright fits this app

### Authentication

- Playwright's standard pattern: a setup step logs in once per run and saves the session with `storageState`. Every logged-in test starts from that file, so no test goes through the login screen.
- This fits our app well, because Auth0 keeps its session in `localStorage` and a cookie, and `storageState` saves both.
- There are two ways to do the one login:
  - A. Fill in the real Auth0 login form once per run. No Auth0 changes needed. Risk: bot checks or MFA can block it (the old Cypress notes say MFA was turned off for the test account).
  - B. Get a token straight from the Auth0 API and write it into the browser. Faster and more stable, and the testing roadmap prefers it. It needs the password grant turned on for a test-only Auth0 client, which is a security decision for the Auth0 owner.
- Recommendation: start with A, and move to B only if A turns flaky.
- Always use a dedicated staging test user. Never a real person's account, never production.

### API requests

- Requests from the browser to the API (project list, profile) can be watched, waited for, or faked with `page.route()`.
- Requests from the Next.js server to the API (the tenant lookup in middleware, `getStaticProps`) happen on the server. Playwright cannot see or fake them.
- Recommendation: use the real staging API for smoke tests, since testing the real setup is the point. Use `page.route()` later only for cases that are hard to create for real, like "the API returns 500 and the user sees an error".

### Test data

- Phase 1 tests are read-only. They need data that stays put, so they use a well-known staging project. `yucatan` exists on staging today.
- Check shape, not exact values: "a project name is visible", not "1,234,567 trees", since counts change.
- Tests that create data come later. They need a dedicated account, unique names, and cleanup through the API after each test.

### Environment config

- One variable picks the target: `PLAYWRIGHT_BASE_URL`. When unset it is `http://localhost:3000`. CI sets it to the Vercel preview URL. Same tests, different target.
- Locally, Playwright starts `npm run dev`, or reuses a dev server that is already running. It uses the developer's existing `.env.local`, so there is nothing new to set up.
- Phase 2 adds `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`: in a gitignored file locally, and in GitHub secrets for CI.
- Localhost and previews both fall back to the `planet` tenant. Testing other tenants needs their real domains, so it is out of scope for now.

## 5. Proposed setup

### Files and scripts

- One new dev dependency: `@playwright/test`. Chromium only at first.
- New `playwright.config.ts` and an `e2e/` folder for the tests.
- Two scripts, named like the existing ones: `test:e2e` and `test:e2e:ui`.
- `.gitignore` entries: `test-results/`, `playwright-report/`, `playwright/.auth/`.
- No Vitest change. [vitest.config.mts](../../vitest.config.mts) only picks up `*.test.ts`, so `e2e/*.spec.ts` stays separate.

Config sketch (for illustration, to be finalised in the implementation PR):

```ts
export default defineConfig({
  testDir: './e2e',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    locale: 'en-US',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 180_000 },
});
```

### Running locally

- Run `npx playwright install chromium` once.
- Run `npm run test:e2e` to run the tests, or `npm run test:e2e:ui` to watch and debug them.
- The dev server builds each page on its first visit, so the first run is slow. Later runs are fast.

### Running in CI

- A new workflow, `e2e.yml`, triggered by `deployment_status`, which fires when Vercel finishes a preview.
- It runs only when the state is `success` and the environment is `Preview`. There is also a `planet-app-sf` environment, which it should skip.
- Steps: checkout, Node 24 with npm cache, `npm ci`, install Chromium, run the tests against the deployment's `environment_url`, and upload the HTML report and traces when a test fails.
- Why not build the app in GitHub Actions: Vercel already builds every PR. A second build would need Redis, Auth0, and API secrets (in production mode the app throws on start without Redis, see [redis-client.ts](../../src/redis-client.ts)) and would add minutes. Testing the preview also covers real Vercel hosting.
- Start as a non-required check, like the unit tests. Make it required once it has been stable for a few weeks.

### Cypress

- Remove it in its own small PR: `cypress/`, `cypress.json`, `.github/workflows/cypress.yml`, the 3 packages (`cypress`, `cypress-plugin-stripe-elements`, `eslint-plugin-cypress`), the 2 `cypress:*` scripts, and the related `.gitignore` and ESLint lines.
- Keeping it would mean two tools for the same job. It also downloads a large app binary on every fresh `npm ci`.

## 6. Drawbacks and risks

- Flaky tests: staging data changes, staging goes down, and the dev server builds pages slowly on first visit. A red check that is not caused by the PR teaches people to ignore red. To limit this: few tests, loose checks, 2 retries in CI, and non-blocking at first.
- Slower than unit tests: seconds per test, not milliseconds. Expect about 3 to 5 minutes per CI run, including install.
- Upkeep: UI changes can break locators. Text comes in 7 languages, so tests fix the locale to English. Prefer roles and labels; add `data-testid` only where nothing else works (the app has none today).
- Login is fragile: bot checks, MFA, password changes, and token expiry. Someone must own the test account.
- Outside dependencies: if staging or Vercel is down, the E2E check fails.
- Maps: MapLibre needs WebGL, and CI browsers draw it slowly in software. Tests check the project list and panels, not the map itself.
- Secrets: the test password lives in GitHub secrets. The saved session file holds tokens, so it must be gitignored.
- CI minutes: one run per preview, so one per push to a PR branch.

## 7. First tests

Phase 1: no login, read-only. Each test also fails if the page throws an uncaught error (Playwright's `pageerror` event), which catches React crashes.

| # | Test | What it checks |
|---|---|---|
| 1 | Home shows projects | `/` goes to `/en`, the page language is `en`, and at least one project card is visible. Middleware, tenant config, translations, and the API all work. |
| 2 | List opens a project | Clicking a project card opens its page and shows its name. Navigation inside the app works. |
| 3 | Project page and Donate link | `/en/yucatan` shows the project name and a Donate link. The link goes to the donate app with `to=yucatan` and a `tenant=` value. Guards the money hand-off without paying. |
| 4 | German locale | `/de` loads with the page language `de` and German text in the navigation. Translations load for real (the middleware unit tests only check the logic). |
| 5 | Login gate | When logged out, `/en/profile` goes to `/en/login` and then to the Auth0 login page (the host set in `AUTH0_CUSTOM_DOMAIN`). Private pages are protected. No account needed. |

Phase 2: after phase 1 is stable.

| # | Test | What it checks |
|---|---|---|
| 6 | Login setup | Logs in once and saves the session file. |
| 7 | Profile loads | A logged-in user sees their name on `/en/profile`. |
| 8 | Projects list | A TPO test user sees their projects on `/en/profile/projects`. |

## Open questions

1. CI target: run E2E against Vercel previews (recommended), or build the app in GitHub Actions?
2. Cypress: remove it before the Playwright PR, after it, or not yet?
3. Phase 2 login: is there a staging test account to use (the old Cypress one was `test-tpo@plant-for-the-planet.org`), and who owns Auth0? Logged-in tests on previews also need preview URLs in Auth0's allowed callback URLs, which has not been checked yet.
4. First PR scope: phase 1 only (5 public tests, local and CI setup)?

## Tasks

- [ ] Agree on this plan and answer the open questions.
- [ ] Remove Cypress (separate PR).
- [ ] Add Playwright: dependency, config, scripts, `.gitignore` entries, and the 5 phase 1 tests, passing locally.
- [ ] Add `e2e.yml` running against Vercel previews, as a non-required check.
- [ ] Make the E2E check required after a few stable weeks.
- [ ] Phase 2: test account, login setup, and the logged-in tests.
- [ ] Update [testing-roadmap.md](./testing-roadmap.md) when Cypress is retired and Playwright is in place.
