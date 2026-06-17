# Treemapper + Register Trees Dead Code Cleanup

## Tasks

- [x] Delete `pages/sites/[slug]/[locale]/profile/treemapper/` (4 pages)
- [x] Delete `src/features/user/TreeMapper/`
- [x] Delete `pages/api/data-explorer/` (API routes that only served the deleted analytics page)
- [x] Delete `pages/sites/[slug]/[locale]/profile/register-trees.tsx`
- [x] Delete `src/features/user/RegisterTrees/`
- [ ] Delete `public/static/locales/*/treemapperAnalytics.json` (7 files)
- [ ] Delete `public/static/locales/*/registerTrees.json` (7 files)
- [ ] Trim `public/static/locales/*/treemapper.json` to 4 migration keys (7 files)
- [ ] Remove `registerTrees` key from `public/static/locales/*/me.json` (7 files)
- [ ] Delete `public/assets/images/icons/Sidebar/RegisterIcon.tsx`
- [ ] Remove commented-out register-trees import + nav block from `UserLayout.tsx`
- [ ] Remove `DB_CONN_URL`, `ENABLE_ANALYTICS`, and register-trees redirect from `next.config.js`
- [ ] Remove `'registerTrees'` from filename union type in `getMessagesForPage.ts`
- [ ] Uninstall unused npm packages

## Background

PR #2928 migrated the TreeMapper feature. The `/treemapper` route now renders a migration card pointing users to `dash.treemapper.app`. All `/:locale/profile/treemapper/*` URLs are server-redirected there via `next.config.js`. The old feature code was intentionally left in place for a follow-up cleanup — this is that cleanup.

The `register-trees` feature was hidden earlier (nav entry commented out, redirect to `/profile` added) but its code was also never removed.

## What is being removed

### Pages

- `pages/sites/[slug]/[locale]/profile/treemapper/` (index, data-explorer, import, my-species)
- `pages/sites/[slug]/[locale]/profile/register-trees.tsx`

### Feature code

- `src/features/user/TreeMapper/` (entire directory)
- `src/features/user/RegisterTrees/` (entire directory)

### Locale files

- `public/static/locales/*/treemapperAnalytics.json` (7 locales)
- `public/static/locales/*/registerTrees.json` (7 locales)
- `public/static/locales/*/treemapper.json` — trimmed to 4 keys used by `TreemapperMigration` (`migrationTitle`, `migrationSubtitle`, `openDashboard`, `contactSupport`)
- `registerTrees` key removed from `public/static/locales/*/me.json` (7 locales)

### Icons

- `public/assets/images/icons/Sidebar/RegisterIcon.tsx`

### Config changes

- `next.config.js`: remove `ENABLE_ANALYTICS` env var + `DB_CONN_URL` destructure; remove `register-trees` redirect
- `src/utils/language/getMessagesForPage.ts`: remove `'registerTrees'` from filename union type
- `src/features/common/Layout/UserLayout/UserLayout.tsx`: remove commented-out register-trees import and nav entry

### npm packages removed (only used by old TreeMapper feature)

`@math.gl/web-mercator`, `apexcharts`, `react-apexcharts`, `d3-ease`, `file-saver`, `geojson-flatten`, `react-json-editor-ajrm`, `react-mapbox-gl`, `react-mapbox-gl-draw` (+ their `@types` companions)

## What is kept

- `src/features/user/TreemapperMigration/` — active component
- `pages/sites/[slug]/[locale]/treemapper/index.tsx` — active migration page
- `next.config.js` redirects for `profile/treemapper/*` — needed for graceful migration of old bookmarks
- `TREEMAPPER_URL` env var — still used by `projectsV2/ProjectDetails` to fetch intervention data
- `TreeMapperBrand` component and related icons — used in project intervention cards
- `TreemapperApiResponse<T>` type — used by `projectsV2/ProjectDetails/index.tsx`
- `public/assets/images/icons/Sidebar/TreeMapperIcon.tsx` — used in the sidebar nav
