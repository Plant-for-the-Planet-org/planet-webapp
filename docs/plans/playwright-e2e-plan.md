# Playwright end-to-end testing plan

Findings and a proposed plan for adding Playwright end-to-end (E2E) tests to this repo.
It expands the "Later: Playwright" item in [testing-roadmap.md](./testing-roadmap.md), which already says to prefer Playwright over reviving the broken Cypress suite and to keep E2E to a few critical-path smoke flows.

> Status (2026-10-22): Playwright is set up on `feature/playwright-e2e`, and the project search tests pass locally and against a Vercel preview. The CI workflow, [e2e.yml](../../.github/workflows/e2e.yml), has run on 4 of this branch's previews, and all 4 passed. The "list opens a project" test, the Cypress removal, and logged-in tests are still to do. See the tasks at the bottom.

## Summary

- Add Playwright for a few smoke tests of the most important user flows. The goal is confidence in key journeys, not coverage.
- Start with public, read-only tests: project search (done) and opening a project from the list. Add logged-in tests in a second phase.
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
Example: the crash fixed in 6c6f2fad0 ("guard against null project name in project snippet") is the kind of bug the project search tests catch against staging data, because they load the project list and fail on any uncaught page error.

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
1. Project search: a donor finds a project by name, even when typed without its accents, finds the projects in a country by its name, sees a message when nothing matches, and gets the list back after clearing the search. Done.
2. Project page: open a project from the list. Pending.

Not planned: the home redirect (`/` to `/en`), the Donate link hand-off, the German locale, and the login gate.

Logged in (phase 2):
3. The profile loads for a logged-in user.
4. A project owner (TPO) sees their projects list.

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

- Phase 1 tests are read-only. They need data that stays put, so they use a well-known staging project: `Yucatán Restoration` (slug `yucatan`), set in [e2e/projects.ts](../../e2e/projects.ts).
- Check shape, not exact values: "a project name is visible", not "1,234,567 trees", since counts change.
- Do not rely on the order of the project list. The staging API order changed between two runs on 2026-10-12, which broke a test that assumed which projects were listed first.
- Tests that create data come later. They need a dedicated account, unique names, and cleanup through the API after each test.

### Environment config

- One variable picks the target: `PLAYWRIGHT_BASE_URL`. When unset it is `http://localhost:3000`. CI sets it to the Vercel preview URL. Same tests, different target.
- Set but empty, `PLAYWRIGHT_BASE_URL` stops the run with a clear error. It does not fall back to the dev server, so CI never tests the wrong target if a preview URL is missing.
- `PLAYWRIGHT_CHANNEL` picks an installed browser instead of Playwright's own Chromium, for example `msedge`. Only Windows machines with Smart App Control need it (see [Windows: Smart App Control](#windows-smart-app-control)). CI leaves it unset.
- Locally, Playwright starts `npm run dev`, or reuses a dev server that is already running. It uses the developer's existing `.env.local`, so there is nothing new to set up.
- Phase 2 adds `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`: in a gitignored file locally, and in GitHub secrets for CI.
- Before adding those secrets, check who can trigger `e2e.yml`. Unlike `pull_request`, a `deployment_status` run gets the repo's secrets, and it runs the workflow from the deployed commit, which for a fork PR is the fork's code.
- Localhost and previews both fall back to the `planet` tenant. Testing other tenants needs their real domains, so it is out of scope for now.

## 5. Setup

### Files and scripts

- One dev dependency: `@playwright/test` 1.64. Chromium only.
- [playwright.config.ts](../../playwright.config.ts) and an `e2e/` folder for the tests:
  - [e2e/fixtures.ts](../../e2e/fixtures.ts): specs import `test` from here, so every test also fails when the page throws an uncaught error.
  - [e2e/projects.ts](../../e2e/projects.ts): the staging project the tests use, and a locator for the cards in the project list.
  - [e2e/i18n.ts](../../e2e/i18n.ts): the locale the tests open (`LOCALE`), and the app's UI text for it, read from `public/static/locales` with the same English fallback the app uses.
  - [e2e/project-search.spec.ts](../../e2e/project-search.spec.ts): the project search tests.
- Two scripts, named like the existing ones: `test:e2e` and `test:e2e:ui`.
- `.gitignore` entries: `test-results/`, `playwright-report/`, `playwright/.auth/`.
- No Vitest change. [vitest.config.mts](../../vitest.config.mts) only picks up `*.test.ts`, so `e2e/*.spec.ts` stays separate.

### Current config

Checked against [playwright.config.ts](../../playwright.config.ts) on 2026-10-12. "Local" means `PLAYWRIGHT_BASE_URL` is unset, so the tests run against the local dev server.

| Setting | Value | Why |
|---|---|---|
| `workers` | 1 locally. Against a deployed URL, Playwright's default (half the CPU cores). | When several workers hit the dev server at once, it can corrupt `.next/dev/prerender-manifest.json` and answer 500 to every page until restarted. A deployed preview can take parallel tests. `fullyParallel` is off, so tests inside one file always run one after another. |
| `timeout` (per test) | 120 s locally, 30 s against a deployed URL | The dev server builds each page on its first visit, which can take close to a minute. |
| `expect.timeout` | 10 s | Auto-retrying checks wait up to this long. Search, for example, updates the list about 1 s after typing stops. |
| `retries` | 2 in CI, 0 otherwise | Smooths over a staging blip in CI. Locally, a failure should show at once. |
| `forbidOnly` | On in CI | A `test.only` left in the code fails the CI run instead of silently skipping the other tests. |
| `trace` | `retain-on-failure` | Every test is recorded, and the recording is kept only when the test fails. The first sketch used `on-first-retry`, but local runs have no retries, so it would never record a local failure. |
| `reporter` | `list` + `html` locally, `github` + `html` in CI | `html` never opens on its own (`open: 'never'`). |
| `locale` | `en-US` | Fixes the `Accept-Language` header, so the middleware sends `/` to `/en`. |
| `channel` | `PLAYWRIGHT_CHANNEL`, or Playwright's Chromium when unset | Lets a Windows machine use the signed Edge. See [Windows: Smart App Control](#windows-smart-app-control). |
| `projects` | One, `chromium`, with `devices['Desktop Chrome']` | Desktop size, 1280 x 720. |
| `webServer` | Local only: `npm run dev`, reusing a server already on port 3000, 180 s to start | Against a deployed URL there is no server to start. |

Where to find a failed test's recording: `test-results/<test name>/trace.zip`, or open the HTML report with `npx playwright show-report`, which lists each failure with its trace.

### Running locally

- Run `npx playwright install chromium` once.
- Run `npm run test:e2e` to run the tests, or `npm run test:e2e:ui` to watch and debug them.
- The dev server builds each page on its first visit, so the first run is slow. Later runs are fast.

### Windows: Smart App Control

- Symptom: any run with a visible browser fails at the start with `browserType.launch: spawn UNKNOWN` (`--headed`) or `browserType.connect: spawn UNKNOWN` (the VS Code extension with "Show browser" on). No test reaches the page.
- Cause: Windows 11 Smart App Control blocks unsigned programs, and Playwright's full Chromium (`%LOCALAPPDATA%\ms-playwright\chromium-<version>\chrome-win64\chrome.exe`) is unsigned. Headless runs still work, because they use a separate headless Chromium that is not blocked.
- To confirm: Event Viewer, then Applications and Services Logs > Microsoft > Windows > CodeIntegrity > Operational, shows event 3077 for that `chrome.exe`.
- Fix: set `PLAYWRIGHT_CHANNEL=msedge`. Playwright then uses the installed Microsoft Edge, which is signed, so Windows lets it run. `chrome` (an installed Google Chrome) also works.
  - PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'msedge'; npm run test:e2e -- --headed`
  - Git Bash: `PLAYWRIGHT_CHANNEL=msedge npm run test:e2e -- --headed`
  - VS Code Playwright extension: add `"playwright.env": { "PLAYWRIGHT_CHANNEL": "msedge" }` to `.vscode/settings.json`, which is gitignored, then run "Developer: Reload Window".
- When the variable is unset, nothing changes. CI and other machines keep using Playwright's Chromium.
- UI mode and the trace viewer open in Playwright's own Chromium window, so they can hit the same block. Add `--ui-port=0` (UI mode) or `--port=0` (`npx playwright show-trace`) to open them in your normal browser instead.
- Do not turn off Smart App Control to fix this. Windows cannot turn it back on without a full reset.

### Running in CI

- The workflow is [e2e.yml](../../.github/workflows/e2e.yml), triggered by `deployment_status`, which fires when Vercel reports a deployment to GitHub.
- The job runs only for `Preview` deployments created by `vercel[bot]`. Vercel also reports `Production`. Heroku deploys report `planet-app-sf` and `planet-app-sf-prod`, created by team members on `develop` and release commits. The job skips all of those.
- When Vercel reports `failure`, the first step fails the job. The job must not skip it instead: GitHub counts a job skipped by `if:` as passed, even for a required check, so a PR that breaks the Vercel build would pass E2E with no tests run. 5 of the last 120 previews failed (checked 2026-10-12).
- Steps: fail if the preview failed, check out the deployed commit, Node 24 with npm cache, `npm ci`, install Chromium's headless shell only (`npx playwright install --with-deps --only-shell chromium`), run `npm run test:e2e` with `PLAYWRIGHT_BASE_URL` set to the deployment's `environment_url`, and upload the HTML report (which holds the traces) whenever the tests ran. Green runs upload it too, so a test that passed only on a retry keeps the trace of its failed try. The report is kept for 14 days.
- `npm ci` sets `CYPRESS_INSTALL_BINARY=0`, so it skips the large Cypress app download. Remove that line together with Cypress.
- The workflow token is read-only (`contents: read`), and the job stops after 20 minutes.
- Checkout sets `persist-credentials: false`. Nothing after checkout uses git, so the token is not saved on disk, where `npm ci` scripts and test code could read it.
- The workflow uses the Node 24 versions of its actions (`checkout`, `setup-node` and `upload-artifact` at v7). Older versions run on Node 20, which GitHub has deprecated. The other workflows still use older versions: see #3225.
- GitHub reads the workflow from the deployed commit, so it only runs for branches that contain `e2e.yml`.
- Checked on 2026-10-12: Vercel previews are public (a preview returned 200 with no login wall), and the project search tests passed against one in about 30 seconds. That preview was built from another branch, so it proved the setup, not this branch's code.
- Checked on 2026-10-12 with the GitHub API: Vercel sends exactly one status per preview, `success` or `failure`, never `pending`. `environment_url` is set to the public preview URL. The deployment's `ref` is the commit SHA, not the branch name.
- Why not build the app in GitHub Actions: Vercel already builds every PR. A second build would need Redis, Auth0, and API secrets (in production mode the app throws on start without Redis, see [redis-client.ts](../../src/redis-client.ts)) and would add minutes. Testing the preview also covers real Vercel hosting.
- Start as a non-required check, like the unit tests. A check is only required when it is listed in the branch protection or ruleset of `develop`, and `develop` lists no required checks today, so nothing needs to change. Make it required once it has been stable for a few weeks.
- Each Heroku deploy still starts the workflow and leaves a skipped `Playwright on Ubuntu` run on its commit. Feature PRs into `develop` never have one, so requiring the check on `develop` is safe. Release PRs (`develop` to `main`) do: the head commits of #3198 and #3193 have both a Heroku and a Vercel deployment. It is not confirmed which run branch protection uses when two runs share a name, so a later skipped run might hide a red one.
- So before requiring the check on `main`, have the job write its own commit status (for example `e2e/preview`, which needs `statuses: write`) and require that status instead. Skipped runs never write it.

### Cypress

- Remove it in its own small PR: `cypress/`, `cypress.json`, `.github/workflows/cypress.yml`, the 3 packages (`cypress`, `cypress-plugin-stripe-elements`, `eslint-plugin-cypress`), the 2 `cypress:*` scripts, and the related `.gitignore` and ESLint lines.
- Keeping it would mean two tools for the same job. It also downloads a large app binary on every fresh `npm ci`.

## 6. Drawbacks and risks

- Flaky tests: staging data changes (the project list order already has), staging goes down, and the dev server builds pages slowly on first visit. A red check that is not caused by the PR teaches people to ignore red. To limit this: few tests, loose checks, 2 retries in CI, and non-blocking at first.
- Slower than unit tests: seconds per test, not milliseconds. Expect about 3 to 5 minutes per CI run, including install.
- Upkeep: UI changes can break locators. Prefer roles and labels, and take their text from [e2e/i18n.ts](../../e2e/i18n.ts) instead of typing it, so a wording change or another locale does not break them.
- Add `data-testid` only where no role fits. Today there is one: `project-list-item`, on each card in the project list. Each card is a link that wraps its own Donate link, which is invalid HTML (React warns about it), so a locator built on that would break once the markup is fixed.
- Tests run in English. Setting `LOCALE` to `de` or `fr` works for the UI text (checked 2026-10-13), but the accent search test then fails, because staging gives the project a name per locale (German: "Yucatán Renaturierung").
- Login is fragile: bot checks, MFA, password changes, and token expiry. Someone must own the test account.
- Outside dependencies: if staging or Vercel is down, the E2E check fails.
- Maps: MapLibre needs WebGL, and CI browsers draw it slowly in software. Tests check the project list and panels, not the map itself.
- Secrets: the test password lives in GitHub secrets. The saved session file holds tokens, so it must be gitignored.
- Traces: a trace records network calls with their headers and the page's storage, so a logged-in trace holds the Auth0 token. `e2e.yml` uploads the report on every run, and this repo is public, so anyone with a GitHub account can download it. Before phase 2, turn traces off for logged-in tests, or do not upload their reports.
- CI minutes: one run per preview, so one per push to a PR branch.

## 7. First tests

Phase 1: no login, read-only. Each test also fails if the page throws an uncaught error (Playwright's `pageerror` event, set up in [e2e/fixtures.ts](../../e2e/fixtures.ts)), which catches React crashes.

| # | Test | Status | What it checks |
|---|---|---|---|
| 1 | Project search | Done | Search finds the right project and hides the others, shows a message when nothing matches, and brings the list back when cleared. |
| 2 | List opens a project | Pending | Clicking a project card opens its page and shows its name. Navigation inside the app works. |

The project search tests, in [e2e/project-search.spec.ts](../../e2e/project-search.spec.ts):
- `yucatan restoration`, typed without the accent, shows "Yucatán Restoration", and every other card that was on screen disappears.
- `Italy` shows only cards from Italy. On staging, no project has Italy in its name, location or TPO, so a result proves the country name is searched. The name comes from the locale's `country.json`.
- Country names match only in the site's language, on purpose: on the English site, "Mexiko" finds nothing. No test covers this.
- A search with no match shows "Oops! No project found" and no cards.
- Emptying the search box brings back the cards that were listed before.
- The Clear search button closes the search, keeps the Top Projects tab selected, and brings back the earlier cards. The next search starts from an empty box.

Phase 2: after phase 1 is stable.

| # | Test | What it checks |
|---|---|---|
| 3 | Login setup | Logs in once and saves the session file. |
| 4 | Profile loads | A logged-in user sees their name on `/en/profile`. |
| 5 | Projects list | A TPO test user sees their projects on `/en/profile/projects`. |

## Open questions

Decided:
- CI target: run E2E against Vercel previews, not a build in GitHub Actions. Previews are public and the tests pass against them.
- First PR scope: the setup, the project search tests, and `e2e.yml`. The "list opens a project" test comes in a follow-up.

Still open:
1. Cypress: it comes out in its own PR, not this one. Remove it right after this PR, or later?
2. Phase 2 login: is there a staging test account to use (the old Cypress one was `test-tpo@plant-for-the-planet.org`), and who owns Auth0? Logged-in tests on previews also need preview URLs in Auth0's allowed callback URLs, which has not been checked yet.

## Tasks

Done:
- [x] Add Playwright: dependency, config, scripts, and `.gitignore` entries.
- [x] Fail every test on an uncaught page error.
- [x] Project search tests, passing locally (Chromium and Edge) and against a Vercel preview.
- [x] Let a Windows machine use Edge through `PLAYWRIGHT_CHANNEL`, for Smart App Control.
- [x] Add `e2e.yml` running against Vercel previews, as a non-required check.
- [x] Push `feature/playwright-e2e` and open a PR to `develop` ([#3203](https://github.com/Plant-for-the-Planet-org/planet-webapp/pull/3203)).
- [x] Check that `e2e.yml` runs and passes on this branch's previews: 4 of 4 runs passed.
- [x] Link this plan from [testing-roadmap.md](./testing-roadmap.md).

Pending:
- [ ] Answer the open questions.
- [ ] Add the "list opens a project" test.
- [ ] Make the E2E check required on `develop` after a few stable weeks. For `main`, switch to a commit status first (see [Running in CI](#running-in-ci)).
- [ ] Remove Cypress (separate PR).
- [ ] Phase 2: test account, login setup, and the logged-in tests. Keep login tokens out of the uploaded report first (see [Drawbacks and risks](#6-drawbacks-and-risks)).
- [ ] Tick the Playwright task in [testing-roadmap.md](./testing-roadmap.md) when Cypress is retired.
