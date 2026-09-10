/**
 * Copies the MapLibre worker files from `node_modules` to `public/`.
 *
 * MapLibre v6 loads its worker as a separate file. In our Webpack setup,
 * MapLibre cannot resolve the worker URL correctly, so vector map tiles
 * are not processed.
 *
 * `src/utils/mapsV2/maplibreWorker.ts` tells MapLibre to use the worker
 * copied by this script.
 *
 * This script runs before development and production builds so the worker
 * files always match the installed MapLibre version.
 *
 * The worker also depends on a shared file, so both files are copied.
 * They are saved as `.js` files so they are served correctly as JavaScript
 * and can be loaded as module workers.
 */
const fs = require('fs');
const path = require('path');

const SHARED_SPECIFIER = './maplibre-gl-shared.mjs';
const SHARED_SPECIFIER_OUT = './maplibre-gl-shared.js';

const publicDir = path.join(__dirname, '..', 'public');
const workerSource = require.resolve('maplibre-gl/dist/maplibre-gl-worker.mjs');
const sharedSource = require.resolve('maplibre-gl/dist/maplibre-gl-shared.mjs');
const { version } = require('maplibre-gl/package.json');

const workerCode = fs.readFileSync(workerSource, 'utf8');
if (!workerCode.includes(SHARED_SPECIFIER)) {
  throw new Error(
    `Expected MapLibre's worker to import "${SHARED_SPECIFIER}". MapLibre ${version} appears to ` +
      'have changed its bundle layout, so scripts/copy-maplibre-worker.js needs updating.'
  );
}

fs.writeFileSync(
  path.join(publicDir, 'maplibre-gl-worker.js'),
  workerCode.split(SHARED_SPECIFIER).join(SHARED_SPECIFIER_OUT)
);
fs.copyFileSync(sharedSource, path.join(publicDir, 'maplibre-gl-shared.js'));

console.log(
  `Copied MapLibre ${version} worker and shared chunk to public/ (maplibre-gl-worker.js, maplibre-gl-shared.js)`
);
