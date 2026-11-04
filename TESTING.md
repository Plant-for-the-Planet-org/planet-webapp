# Testing

This project has two kinds of automated tests.

| | Unit tests | End-to-end (E2E) tests |
|---|---|---|
| Tool | [Vitest](https://vitest.dev) | [Playwright](https://playwright.dev) |
| What they check | One function, hook or store, with everything around it faked | Whole pages in a real browser, against a running app and the staging API |
| Speed | Milliseconds per test | Seconds per test |
| Files | `src/**/*.test.ts` | `e2e/tests/**/*.spec.ts` |
| Run all | `npm run test` | `npm run test:e2e` |
| CI check | **Vitest on Ubuntu**, on every pull request | **Playwright on Ubuntu**, on every Vercel preview |

Neither CI check is required yet, so a red run does not block a merge.

## Unit tests (Vitest)

### Commands

| Command | What it does |
|---|---|
| `npm run test` | Runs all unit tests once. |
| `npm run test:watch` | Reruns tests when you save a file. |
| `npm run test:verbose` | Runs all tests and lists each one by name. |
| `npx vitest run src/utils/apiRequests/validateToken.test.ts` | Runs one file. |
| `npx vitest run -t "some words"` | Runs only tests whose name contains the words. |

### Adding a test

- Put the test next to the code it tests, named `<file>.test.ts`.
- Only `.ts` test files are picked up. See the comment in `vitest.config.mts` for why.
- Tests run in jsdom, so `window` and `localStorage` exist.

## End-to-end tests (Playwright)

### First-time setup

1. Install dependencies: `npm ci`
2. Download Playwright's Chromium, once per machine: `npx playwright install chromium`

### Commands

| Command | What it does |
|---|---|
| `npm run test:e2e` | Runs all E2E tests. Starts `npm run dev`, or reuses one already running on port 3000. |
| `npm run test:e2e:ui` | Opens UI mode: pick a test, run it, and click through each step afterwards. The best way to learn or debug a test. |
| `npm run test:e2e:report` | Opens the HTML report from the last run, with a trace for each failed test. |
| `npm run test:e2e -- -g "no match"` | Runs only tests whose title contains the text. Case does not matter. |
| `npm run test:e2e -- -g "no match" --list` | Lists the tests a filter picks, without running them. |
| `npm run test:e2e -- --headed` | Shows a real browser window while the tests run. |
| `npm run test:e2e -- --debug` | Pauses before each action. Step through in the Playwright Inspector. |
| `npm run test:e2e -- e2e/tests/projects/project-search.spec.ts:75` | Runs the test at that line. `--list` shows each test's line. |

Anything after `--` goes straight to Playwright, so options can be combined.

The first run is slow, because the dev server builds each page on its first visit. Later runs are fast.

### Run against a deployed site

Set `PLAYWRIGHT_BASE_URL` for one command. No dev server starts.

```bash
PLAYWRIGHT_BASE_URL=https://<preview-url> npm run test:e2e
```

- Find a PR's preview URL in Vercel's comment on the PR.
- The test files on your machine should come from the same branch as the preview. A preview from an older branch may be missing markup the tests need.
- Leave the variable unset to test your dev server. Do not put it in `.env.local`: Playwright does not read that file.
- If you `export` it, it stays set for that terminal. Run `unset PLAYWRIGHT_BASE_URL` to go back to localhost.

### What changes between local and CI

`playwright.config.ts` changes a few settings based on two things: whether `PLAYWRIGHT_BASE_URL` is set, and whether `CI` is set (GitHub sets it on every job).

| Setting | Local dev server | Deployed URL from your machine | GitHub CI |
|---|---|---|---|
| Starts the dev server | Yes, or reuses one | No | No |
| Tests at once | 1 | 1 per spec file, see below | 1 per spec file, see below |
| Time limit per test | 120 s | 30 s | 30 s |
| Retries | 0 | 0 | 2 |
| `test.only` | Allowed | Allowed | Fails the run |

The config file explains the reason for each setting.

On a deployed URL, Playwright may run several workers, but it spreads only test files across them. Tests in the same file run one after another, so a run uses at most one worker per spec file.

### Read a failure

- Locally: run `npm run test:e2e:report`, open the failed test, then open its trace. The trace shows each step, the page, and the network calls.
- In CI: open the **Playwright on Ubuntu** run, download the `playwright-report` artifact from the run summary, unzip it, and run `npm run test:e2e:report -- <unzipped folder>`.

### When something goes wrong

- **A run looks stuck.** A page crash can remove the button a test is waiting to click, and a click waits for the full 120 s limit. Rerun one test with `--headed` and look at the browser, or shorten the limit with `--timeout=20000`.
- **Every page returns 500.** The dev server's build files are broken. Stop it, delete `.next/dev`, and start it again.
- **Tests hit the wrong app, or wait for a server that never comes.** Playwright always checks port 3000. Run `lsof -i :3000` to see what is running there. If Next started on 3001 because 3000 was busy, free port 3000 and try again.
- **"PLAYWRIGHT_BASE_URL is empty".** The variable is set to an empty value. Unset it, or set it to a URL.
- **Windows: the browser will not start with a visible window.** Smart App Control blocks Playwright's Chromium. Set `PLAYWRIGHT_CHANNEL=msedge`. See [Windows: Smart App Control](docs/plans/playwright-e2e-plan.md#windows-smart-app-control).

### Writing a test

- Put specs in `e2e/tests/<feature>/` and shared helpers in `e2e/support/`.
- Import `test` and `expect` from `e2e/support/fixtures.ts`, not from `@playwright/test`. The fixture fails the test on any uncaught page error.
- Find elements by role and name, such as `page.getByRole('button', { name: ... })`. This also checks that each control has a name a screen reader can read.
- Take UI text from `e2e/support/i18n.ts`, so a wording change in the locale files does not break the test.
- Add a `data-testid` only where no role fits.
- Check results with `expect(...)`, which retries until it passes. Never add fixed waits.
- Staging data changes. Check the shape of a result, not exact counts or list order.
- `test.only` is fine while you work, but CI fails the run if one is committed.

### Map tests

Project markers, sites and interventions are drawn on a WebGL canvas, so they are not in the page for Playwright to find. Tests read them from the map itself, through `window.__planetE2E` from [src/utils/e2eHooks.ts](src/utils/e2eHooks.ts). [e2e/tests/projects/project-filter.spec.ts](e2e/tests/projects/project-filter.spec.ts) shows the pattern for markers, and [e2e/tests/project-details/](e2e/tests/project-details/) for sites and interventions. The helpers are in [e2e/support/map.ts](e2e/support/map.ts).

- Call `allowSoftwareWebGL(page)` before `page.goto`. Without a GPU, as in CI, Chromium renders WebGL in software (SwiftShader), and the app's WebGL check would show "Graphics acceleration required" instead of the map. MapLibre draws fine in software, so the helper hides the renderer's name from that check.
- Read markers with `waitForProjectMarkers(page)` and `projectMarkers(page)`. They call `window.__planetE2E.getProjectMarkers()`, which returns each marker's `slug`, `allowDonations`, `purpose` and `classification` (`null` for conservation projects).
- The hooks are on in local development by themselves. A deployed preview needs `NEXT_PUBLIC_E2E_HOOKS=true` in Vercel, set for the Preview environment only, before the build. Without it, map tests fail with a message saying so. Never set it for production.
- Call `test.slow()` in map tests. Software rendering is slow, and the map alone can take over 10 s to appear.

#### How the hooks are set

- Each part of the map adds its own hooks with `setE2EHooks` in a `useEffect`, and returns the cleanup it gives back. So a hook exists only while its part of the map is shown. For example, `getProjectSites` exists only on a project page.
- Wait for a hook with the `waitFor...` helpers in `map.ts`, not for `window.__planetE2E` alone. Another part of the map may have set `window.__planetE2E` before the hook you need is there.
- To add a hook, add its type to `E2EHooks`, and set it from the component that owns that map data.

#### Checking where the map is

- `expectMapOnSite` and `expectMapOnIntervention` wait until the map stops moving, then check that its center is inside the target's bounds. They check the center, not the zoom, because the zoom depends on the window size.
- Pick a target away from where the map starts. Otherwise a map that never moved would still pass. `firstAndOtherSite` in `site-map.spec.ts` does this for sites, and the click test in `intervention-map.spec.ts` does it with `mapCenter` for interventions.

#### Clicking on the map

- Use `findClickableIntervention` to get a point to click. It returns an intervention that is on screen, not covered by the page, and the top feature at that point. The app's click handler acts only on the top feature, so a click on any other point may select nothing.
- Before clicking, wait for the map to settle with `expectMapOnSite`. While the map is still moving, the intervention moves away from under the pointer.

#### Project data and TreeMapper

- `openProject` in [e2e/support/projectDetails.ts](e2e/support/projectDetails.ts) opens a project page and returns its sites and interventions as the page fetched them. Staging data changes, so take ids and names from here. Do not hard-code them.
- Interventions come from TreeMapper, not the Planet API, so the build needs `TREEMAPPER_URL`. `.env.development` sets it for local development. Without it, the page skips the fetch, and `interventions()` fails after 30 s with a message saying so.
- `interventions()` waits for TreeMapper only when a test calls it. Site tests do not call it, so they still pass when TreeMapper is slow or down.

### In CI

- `.github/workflows/e2e.yml` runs when Vercel reports a finished preview, and tests that preview. It does not build the app again.
- If the preview build failed, the check fails too.
- The report is kept for 14 days as the `playwright-report` artifact.

## More

- [Playwright E2E plan](docs/plans/playwright-e2e-plan.md): why each choice was made, risks, and next steps.
- [Testing roadmap](docs/plans/testing-roadmap.md): what to test next, and in what order.
