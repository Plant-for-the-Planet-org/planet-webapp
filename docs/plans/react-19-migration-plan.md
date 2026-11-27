# React 19 migration plan

> Status: planned on 2026-11-27. Nothing is migrated yet. Based on a read-only assessment of `develop` at `bcafeb214`.

## Goal

Move the app from React 18.3.1 to React 19 in small, safe PRs.

## Ground rules

- Stay on React 18 until PR 4. Only PR 4 changes `react` and `react-dom`.
- PRs 1 to 3 upgrade libraries to versions that support both React 18 and 19. Each one ships and is tested on its own.
- One PR, one scope. Every branch starts from the latest `develop` and targets `develop`.
- `.npmrc` sets `legacy-peer-deps=true`, so npm will not warn about peer conflicts. Check versions by hand with `npm ls`.
- CI does not run typecheck, and `next build` ignores type errors. Every PR checks that it adds no new `tsc` errors compared with `develop` (see [Type error check](#type-error-check)).

## PR overview and dependencies

| Step | Title | Branch | Target | Depends on |
|---|---|---|---|---|
| Phase 0 | Baseline checks | none | none | none |
| PR 1 | `chore(deps): replace small libraries that break on React 19` | `feature/react-19-small-libs` | `develop` | Phase 0 |
| PR 2 | `feat(deps): upgrade MUI X date pickers to v7` | `feature/react-19-date-pickers-v7` | `develop` | Phase 0 |
| PR 3 | `feat(auth): upgrade Auth0 React SDK to v2` | `feature/react-19-auth0-v2` | `develop` | Phase 0 |
| PR 4 | `feat(deps): upgrade React and React DOM to 19` | `feature/react-19-core` | `develop` | PR 1, PR 2, PR 3 merged |
| Phase 5 | Final regression testing | none | none | PR 4 |

```
Phase 0 (baseline)
  ├── PR 1  small libraries ──┐
  ├── PR 2  date pickers v7 ──┼──> PR 4  React 19 ──> Phase 5 (regression)
  └── PR 3  Auth0 v2 ─────────┘
```

- PR 1, PR 2 and PR 3 are independent. They can be built, reviewed and merged in any order, or in parallel.
- PR 4 starts only after PR 1, PR 2 and PR 3 are merged into `develop`. No stacked branches are needed.

## Standard checks

Every PR runs these. PR sections below only list extra checks.

- [ ] `npm run lint:errors`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run build-storybook`
- [ ] `npm run test:e2e`
- [ ] No new `tsc` errors compared with `develop` (see [Type error check](#type-error-check))
- [ ] No new React warnings in the browser console on the pages this PR touches

### Type error check

`develop` already has type errors, so compare the lists, not the counts. Line numbers are removed, so moved code does not show up as a new error.

1. Build the baseline on `develop` with its own packages, before installing anything new:

```sh
git switch develop && git pull && npm ci
npx tsc --noEmit --incremental false 2>&1 | grep "error TS" | sed -E 's/\([0-9]+,[0-9]+\)//' | sort > /tmp/tsc-baseline.txt
```

2. Build the same list on your PR branch, with its packages installed:

```sh
git switch <your-branch> && npm ci
npx tsc --noEmit --incremental false 2>&1 | grep "error TS" | sed -E 's/\([0-9]+,[0-9]+\)//' | sort > /tmp/tsc-pr.txt
```

3. Compare. Lines starting with `>` are new errors and must be fixed:

```sh
diff /tmp/tsc-baseline.txt /tmp/tsc-pr.txt
```

- The two files have different names, so a PR run never overwrites the baseline. They live in `/tmp`, so they are never committed.
- Rebuild the baseline from `develop` any time `develop` moves. Nobody needs to share the file.

---

## Phase 0: Baseline checks (no PR)

**Outcome:** Known starting numbers, so later PRs can prove nothing got worse.

### Tasks

- [ ] Pull the latest `develop` and run `npm ci`
- [ ] Build the type error baseline with step 1 of [Type error check](#type-error-check) (on 2026-11-27: 92 errors in 37 files)
- [ ] Run `npm test` (on 2026-11-27: 25 files, 253 tests, all pass)
- [ ] Run the other standard checks and note any failure as pre-existing
- [ ] Open key pages in dev and note the existing console warnings
- [ ] Share the numbers in the PR 1 description for reference. Each PR still builds its own type error baseline from `develop`.

---

## PR 1: Replace small libraries that break on React 19

**Branch:** `feature/react-19-small-libs` · **Target:** `develop` · **Depends on:** Phase 0

**Outcome:** The low-cost React 19 risks are gone, while still on React 18.

### Packages

| Package | From | To | Why |
|---|---|---|---|
| `react-content-loader` | 5.1.4 | 7.x | v5 sets `defaultProps` on a function component. React 19 ignores them, so the loader loses its animation and gradient. |
| `material-ui-popup-state` | 4.1.0 | 5.x | v4 only supports up to React 18. |
| `framer-motion` | 2.9.5 | removed | From 2020, not tested on React 19, used in one place only. |
| `prop-types` | 15.x | removed | React 19 ignores `propTypes` on function components. |

### Files

- `src/features/common/ContentLoaders/Projects/ProjectLoader.tsx`
- `src/features/common/ContentLoaders/Projects/GlobeLoader.tsx` (plus a new SCSS module)
- `src/features/projectsV2/ProjectDetails/components/microComponents/InfoIconPopup.tsx`
- `src/features/common/Layout/CustomTooltip/index.tsx`
- `pages/_error.js`
- `package.json`, `package-lock.json`

### Tasks

- [ ] Upgrade `react-content-loader` to 7.x
- [ ] Check that v7 no longer uses `defaultProps`. If it still does, pass `animate`, `interval`, `gradientRatio` and `title` in `ProjectLoader.tsx`
- [ ] Upgrade `material-ui-popup-state` to 5.x and fix imports if paths changed
- [ ] In `GlobeLoader.tsx`, replace `motion.div` with a `div` and a CSS keyframe: move down 20px and back, 1s, ease-in-out, repeat forever
- [ ] Keep `aria-busy` and the live region in `GlobeLoader.tsx` as they are
- [ ] Remove `framer-motion` from `package.json`
- [ ] Remove the `propTypes` block and import from `pages/_error.js`, then remove `prop-types` from `package.json`
- [ ] Run `npm run knip` to confirm nothing else uses the removed packages

### Testing

- [ ] Standard checks
- [ ] Project list skeleton loader animates with the same colors
- [ ] Globe loader bounces as before
- [ ] Info icon popup and custom tooltip open on hover and close on leave

### Acceptance criteria

- [ ] Still on React 18
- [ ] `framer-motion` and `prop-types` are no longer in `package.json`
- [ ] Loaders and tooltips look and behave as before

### Risks and blockers

- Low risk. `react-content-loader` v7 may change default speed or colors, so compare side by side.
- No blockers.

---

## PR 2: Upgrade MUI X date pickers to v7

**Branch:** `feature/react-19-date-pickers-v7` · **Target:** `develop` · **Depends on:** Phase 0

**Outcome:** All date fields run on a date picker that supports React 19, while still on React 18.

### Packages

| Package | From | To | Why |
|---|---|---|---|
| `@mui/x-date-pickers` | 5.0.20 | 7.x | v5 and v6 only support React 18. v7 supports React 19 and still works with MUI core v5 and date-fns v2. |

MUI core v5, `date-fns` v2 and `AdapterDateFns` stay as they are.

### Files

- `src/features/user/Account/CancelModal.tsx`
- `src/features/user/Account/EditModal.tsx`
- `src/features/user/Account/PauseModal.tsx`
- `src/features/user/ManageProjects/components/DetailedAnalysis.tsx`
- `src/features/user/ManageProjects/components/ProjectCertificates.tsx`
- `src/features/user/ManageProjects/components/ProjectSpending.tsx`
- `package.json`, `package-lock.json`

### Tasks

- [ ] Upgrade `@mui/x-date-pickers` to the latest 7.x
- [ ] Replace `renderInput={(props) => <TextField {...props} />}` with `slotProps={{ textField: { ... } }}`
- [ ] Move extra TextField props (`required`, `label`, `helperText`, `error`, `className`) into `slotProps.textField`
- [ ] Rename `inputFormat` to `format`
- [ ] Check the MUI X v6 and v7 migration guides for any other renamed props used in these files
- [ ] Keep `react-hook-form` wiring as it is and confirm the field value is still a `Date`
- [ ] Do not change `renderInput` in `EditProfileForm.tsx`, `DonationLinkForm.tsx` and `SpeciesListTable.tsx`. Those belong to MUI `Autocomplete`, not the date picker.

### Testing

- [ ] Standard checks
- [ ] For each date field: open the picker, pick a date, type a date, clear it, hit the min and max dates, trigger the required error, submit, and confirm the saved value
- [ ] Check date display in at least English and German
- [ ] Check the mobile picker on a small screen

### Acceptance criteria

- [ ] Still on React 18
- [ ] Every date field saves the same values as before
- [ ] No `renderInput` or `inputFormat` left on date pickers

### Risks and blockers

- Medium risk. Typing a date works differently in v7 (sections instead of a mask). No unit tests cover these forms, so manual testing matters.
- No blockers.

---

## PR 3: Upgrade Auth0 React SDK to v2

**Branch:** `feature/react-19-auth0-v2` · **Target:** `develop` · **Depends on:** Phase 0

**Outcome:** Login, logout and token refresh run on an Auth0 SDK that supports React 19, while still on React 18.

### Packages

| Package | From | To | Why |
|---|---|---|---|
| `@auth0/auth0-react` | 1.12.1 | 2.x | v1 only supports up to React 18 and is no longer maintained. |

### Files

- `pages/_app.tsx`
- `pages/sites/[slug]/[locale]/login.tsx`
- `pages/sites/[slug]/[locale]/profile/projects/new-project.tsx`
- `pages/sites/[slug]/[locale]/claim/[type]/[code].tsx`
- `src/features/common/VerifyEmail/VerifyEmail.tsx`
- `src/features/common/Layout/Navbar/microComponents/SignInButton.tsx`
- `src/hooks/useAuthSession.ts`
- `src/hooks/useInitializeAuth.ts`
- `src/hooks/useProfileErrorHandler.ts`
- `package.json`, `package-lock.json`

### Tasks

- [ ] Upgrade `@auth0/auth0-react` to the latest 2.x
- [ ] In `_app.tsx`, move `redirectUri` and `audience` into `authorizationParams={{ redirect_uri, audience }}`
- [ ] In `_app.tsx`, add `useRefreshTokensFallback={true}` to keep today's behavior (v2 defaults to `false`)
- [ ] In the 7 `loginWithRedirect` calls, move `redirectUri`, `ui_locales` and the other login params into `authorizationParams`, renaming `redirectUri` to `redirect_uri`
- [ ] Optional: add one shared helper for these 7 calls, since they all build the same options
- [ ] In `useAuthSession.ts`, change `logout({ returnTo })` to `logout({ logoutParams: { returnTo } })`
- [ ] Check that `getAccessTokenSilently` options and the `AppState` type still match v2
- [ ] Update Auth0 mocks in hook tests if their shape changed

### Testing

- [ ] Standard checks
- [ ] On a preview deploy with the real Auth0 tenant:
  - [ ] Log in from the navbar, login page, verify email page, claim code page and new project page
  - [ ] After login, land on the page you started from
  - [ ] Log out and land on the right URL
  - [ ] Reload while logged in and stay logged in
  - [ ] Token refresh works after the access token expires
  - [ ] Impersonation works
  - [ ] Auth0 login page shows the app language (`ui_locales`)
  - [ ] A session created before the upgrade still works, or the user is asked to log in once (write down which)

### Acceptance criteria

- [ ] Still on React 18
- [ ] All auth flows above work as before on the preview deploy

### Risks and blockers

- High risk. This touches every logged-in user. Merge at a quiet time and be ready to revert.
- Blocker: the preview URL must be in the Auth0 allowed callback, logout and web origin lists.

---

## PR 4: Upgrade React and React DOM to 19

**Branch:** `feature/react-19-core` · **Target:** `develop` · **Depends on:** PR 1, PR 2 and PR 3 merged into `develop`

**Outcome:** The app runs on React 19 with no new type errors and no regressions.

### Packages

| Package | From | To |
|---|---|---|
| `react` | 18.3.1 | 19.x latest (19.3.1 on 2026-11-27) |
| `react-dom` | 18.3.1 | same as `react` |
| `@types/react` | 18.3.27 | 19.x latest |
| `@types/react-dom` | 18.3.7 | 19.x latest |

`next` stays on 16.4.6. It already supports React 19 in the Pages Router.

### Files

- `package.json`, `package-lock.json`
- `src/features/user/Profile/ContributionsMap/Markers/index.tsx`
- `src/features/user/Profile/ContributionsMap/Markers/DonationClusterMarker.tsx`
- `src/utils/superclusterConfig.ts`
- Any other file that the `tsc` diff or the codemod flags

### Tasks

- [ ] Branch from `develop` after PR 1, PR 2 and PR 3 are merged
- [ ] Upgrade the 4 packages above
- [ ] Run `npm ls react react-dom @types/react @types/react-dom` and confirm one version of each
- [ ] Run `npx types-react-codemod@latest preset-19 ./pages ./src` and review every change
- [ ] Change `RefObject<MapRef>` to `RefObject<MapRef | null>` in the 3 files above
- [ ] Fix any other new type errors from the `tsc` diff
- [ ] Do not refactor `forwardRef` or add new React 19 APIs in this PR

### Testing

- [ ] Standard checks
- [ ] Phase 5 checklist on the PR preview deploy

### Acceptance criteria

- [ ] `react`, `react-dom` and their types are on 19.x, one copy each
- [ ] No new type errors compared with `develop`
- [ ] Phase 5 passes on the preview deploy

### Risks and blockers

- Low to medium risk. The number of new type errors is unknown until install.
- React 19 no longer re-throws errors caught by error boundaries. Confirm Sentry still gets them (Phase 5).
- In dev, StrictMode renders slightly differently in React 19. Watch the console.
- Blocker: PR 1, PR 2 and PR 3 must be merged first.

---

## Phase 5: Final regression testing (no PR)

**When:** On the PR 4 preview deploy before merge, then again on staging after merge.

**Outcome:** Confidence that React 19 is safe to release.

### Checklist

- [ ] Projects map and project list, on the planet tenant and one other tenant, in at least 2 locales
- [ ] Project details: video (`react-player`), image stories (`react-insta-stories`), carousels (`react-slick`, `swiper`)
- [ ] Donation flow end to end
- [ ] Profile: contributions map, TPO projects list (`react-lazyload`), donation receipts
- [ ] Manage projects: project list (lazy loading), site geometry upload (`react-dropzone`), all date fields
- [ ] Account modals: edit, pause, cancel, reactivate
- [ ] Login, logout and token refresh
- [ ] Throw a test error on the client and on the server, and confirm each reaches Sentry once
- [ ] No hydration warnings and no new React warnings in the console

### Acceptance criteria

- [ ] Every item passes, or has an issue logged and fixed before release

---

## Optional follow-ups (not blocking)

- Replace `react-lazyload` (unmaintained, only supports up to React 18) with native lazy loading or `IntersectionObserver`.
- Replace `forwardRef` with `ref` as a prop (6 files).
- Upgrade `eslint-plugin-react-hooks` to the version with React Compiler rules.
- Fix the 92 existing type errors and add typecheck to CI.
- Review `react-insta-stories` v3 and `react-player` v3.

## No change needed

- `next` 16.4.6 already supports React 19 in the Pages Router.
- MUI core v5, Emotion, `next-intl`, `react-hook-form`, `zustand`, `react-map-gl`, `@sentry/nextjs`, Testing Library and Storybook already support React 19.
- `react-dropzone` 11 sets `defaultProps` on its component, but its hook applies the same defaults itself.
- App code uses none of the APIs removed in React 19. `forwardRef`, `Context.Provider` and `useId` keep working.
