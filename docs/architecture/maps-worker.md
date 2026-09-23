# Maps and the MapLibre worker

MapLibre v6 runs its tile processing in a Web Worker that it loads as a separate file at runtime. Webpack cannot give it a URL it can resolve, so we copy that file into `public/` ourselves and tell MapLibre where it is. Anything that creates a map has to opt in.

The failure when this goes wrong is silent. No exception, no failed request the app notices, no console error from our code. The map renders its background and no vector tiles. It looks like empty data rather than a broken build, which is why the rule below is worth following exactly.

## The rule

If you create a MapLibre map, import the worker module in that file, above the map.

```ts
import '../../../utils/mapsV2/maplibreWorker';
```

The module is a side effect. Importing it runs `setWorkerUrl()`, which is global, so one import covers every map that follows on that route.

Six files create a map today and all six do this:

- `src/features/projectsV2/ProjectsMap/index.tsx`
- `src/features/projectsV2/ProjectsMap/TimeTravel/index.tsx`
- `src/features/user/Profile/ContributionsMap/index.tsx`
- `src/features/user/ManageProjects/components/SiteGeometryEditor.tsx`
- `src/features/user/ManageProjects/components/microComponent/SitePreviewMap.tsx`
- `src/features/user/ManageProjects/components/microComponents/ProjectLocationMap.tsx`

## Why each file, rather than once in `_app.tsx`

Bundle size. `maplibreWorker.ts` imports from `maplibre-gl`, and MapLibre is code split today. It sits in its own chunk of roughly 576 KB that only loads on map routes, and it is absent from `_app`, `main` and `framework`.

Importing the worker module in `pages/_app.tsx` would put that chunk on every page in the product, including the many with no map. The per-file import is a deliberate trade, not an oversight.

## What happens if you forget

MapLibre falls back to its own `defaultWorkerUrl()`, which derives the URL from `import.meta.url` and returns an empty string when that is not an `http` or `https` URL. Under webpack it always is not. MapLibre then tries to start a worker from an empty URL, the worker never replies, and tile requests hang forever.

MapLibre does not notice either. It has no `onerror`, no `onmessageerror` and no timeout on the worker, so no map `error` event fires and an `onError` prop would not catch it. Nothing reports the failure.

This only bites a **new** map on a route where nothing else already imported the module, since the setting is global once anything has run it.

## How the file gets into `public/`

`scripts/copy-maplibre-worker.js` copies two files out of `node_modules`, the worker and the shared chunk it imports. Both are copied byte for byte, keeping their `.mjs` names, because Next serves `.mjs` as `application/javascript` and the worker's own relative import then resolves without anything being rewritten.

It is wired to two npm hooks:

- `postinstall`, so any install produces the files. This covers Storybook, Cypress, a bare `next start` and a fresh clone.
- `prebuild`, `predev` and `predev-https`, so a build or dev start always refreshes them against the installed MapLibre version.

Both generated files are gitignored. They are build output, not source.

Two guards exist because the failure is silent:

- The script asserts the worker's only relative import is the shared chunk it copies. If MapLibre ever splits the worker into another file, the copy would be incomplete, and this stops the build instead of shipping a map with no tiles.
- `next.config.js` asserts both files exist, scoped to `PHASE_PRODUCTION_BUILD`. That check lives there because the config is read inside `next build`, so it still fires if someone runs `next build` directly and skips the npm hooks. The phase scope matters: Storybook loads `next.config.js` with `PHASE_DEVELOPMENT_SERVER`, and an unscoped throw would break `npm run storybook` on a fresh clone.

## If a shared map wrapper is ever introduced

`react-map-gl` v8 exposes this as a `workerUrl` prop on `<Map>`, and it only calls `setWorkerUrl` when the prop is set, so it does not conflict with the module-level call. A wrapper component that owns that prop would remove the need to remember the import for the five `react-map-gl` maps, while staying code split.

`TimeTravel` builds its two maps directly with `new MaplibreMap()`, so it would keep the import either way.

## WebGL2 is required

MapLibre v5 and later render through WebGL2 only. `src/hooks/useWebGL.ts` probes for a `webgl2` context, because probing WebGL1 would pass browsers where the map then fails on construction.

Wrap user-facing maps in `WebGLGuard`, which shows a fallback instead of a broken canvas. `SitePreviewMap` deliberately does not, because the space available is too small for the fallback to read well.

## Related

- `scripts/copy-maplibre-worker.js`
- `src/utils/mapsV2/maplibreWorker.ts`
- `src/features/common/WebGLGuard/index.tsx`
- PR #3127, the MapLibre v4 to v6 upgrade that introduced all of this
