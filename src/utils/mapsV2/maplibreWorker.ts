import { setWorkerUrl } from 'maplibre-gl';

/**
 * MapLibre GL JS v6 loads its tile-processing worker as a separate file.
 * In our Webpack setup, the worker URL is resolved incorrectly, so the worker
 * fails to start and vector map layers do not render.
 *
 * `scripts/copy-maplibre-worker.js` copies the correct worker file into `public/`
 * before development and production builds, so MapLibre can load it from the app.
 *
 * Import this module anywhere a map is created, before the map is initialized.
 */
export const MAPLIBRE_WORKER_URL = '/maplibre-gl-worker.js';

if (typeof window !== 'undefined') {
  setWorkerUrl(MAPLIBRE_WORKER_URL);
}
