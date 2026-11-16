/**
 * Copies the MapLibre worker files from `node_modules` to `public/`.
 *
 * MapLibre v6 loads its worker as a separate file.
 * In our Webpack setup, MapLibre cannot resolve the worker URL correctly, so vector map tiles are not processed.
 *
 * `src/utils/mapsV2/maplibreWorker.ts` tells MapLibre to use the worker copied by this script.
 *
 * This script runs before development and production builds so the worker files always match the installed MapLibre version.
 *
 * The worker also depends on a shared file, so both files are copied verbatim, keeping their `.mjs` names.
 * Next serves `.mjs` as `application/javascript`, so the worker loads as a module worker and its relative import of the shared file resolves on its own.
 */
const fs = require('fs');
const path = require('path');

const SHARED_SPECIFIER = './maplibre-gl-shared.mjs';

const publicDir = path.join(__dirname, '..', 'public');
const workerSource = require.resolve('maplibre-gl/dist/maplibre-gl-worker.mjs');
const sharedSource = require.resolve('maplibre-gl/dist/maplibre-gl-shared.mjs');
const { version } = require('maplibre-gl/package.json');

// The worker is copied on its own, so it must not depend on any file beyond the shared chunk copied alongside it.
const workerCode = fs.readFileSync(workerSource, 'utf8');

// Covers all three import forms: `from "./x"`, a bare `import "./x"`, and `import("./x")`.
const relativeImports = [
  ...workerCode.matchAll(/(?:from|import)\s*\(?\s*["'](\.[^"']*)["']/g),
].map((match) => match[1]);
const unexpectedImports = relativeImports.filter(
  (specifier) => specifier !== SHARED_SPECIFIER
);

if (!relativeImports.includes(SHARED_SPECIFIER) || unexpectedImports.length) {
  throw new Error(
    `Expected MapLibre's worker to import only "${SHARED_SPECIFIER}", but found ${JSON.stringify(
      relativeImports
    )}. MapLibre ${version} appears to have changed its bundle layout, so scripts/copy-maplibre-worker.js needs updating.`
  );
}

fs.copyFileSync(workerSource, path.join(publicDir, 'maplibre-gl-worker.mjs'));
fs.copyFileSync(sharedSource, path.join(publicDir, 'maplibre-gl-shared.mjs'));

console.log(
  `Copied MapLibre ${version} worker and shared chunk to public/ (maplibre-gl-worker.mjs, maplibre-gl-shared.mjs)`
);
