import type { Page } from '@playwright/test';
import type {
  E2EBounds,
  E2EHooks,
  E2EProjectMarker,
  E2EProjectSite,
} from '../../src/utils/e2eHooks';

import { expect } from './fixtures';

const MAP_HOOK_MISSING = [
  'The map never exposed window.__planetE2E, so its markers cannot be read.',
  'On a deployed preview, the build needs NEXT_PUBLIC_E2E_HOOKS=true (Vercel, Preview scope). A local dev server turns the hook on by itself.',
  'Otherwise the map did not render: check the trace for the "graphics acceleration" message.',
].join('\n');

// Without a GPU, as in CI, headless Chromium renders WebGL with SwiftShader, and the app's WebGL check then hides the map. MapLibre draws the map and markers fine on SwiftShader, so map tests hide its name from that check.
export const allowSoftwareWebGL = (page: Page) =>
  page.addInitScript(() => {
    const UNMASKED_RENDERER_WEBGL = 0x9246;
    const getParameter = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (name) {
      const value = getParameter.call(this, name);
      return name === UNMASKED_RENDERER_WEBGL &&
        String(value).includes('SwiftShader')
        ? 'Software renderer (E2E)'
        : value;
    };
  });

// Markers are drawn on a canvas, so they are read from the map's own data through the hook in src/utils/e2eHooks.ts.
export const projectMarkers = async (page: Page) =>
  (await page.evaluate(() => window.__planetE2E?.getProjectMarkers?.())) ?? [];

const waitForHook = async (page: Page, name: keyof E2EHooks) => {
  try {
    await page.waitForFunction(
      (hook) => window.__planetE2E?.[hook] !== undefined,
      name,
      { timeout: 60_000 }
    );
  } catch {
    throw new Error(MAP_HOOK_MISSING);
  }
};

/** Waits for the map to show its first markers and returns them. */
export const waitForProjectMarkers = async (page: Page) => {
  await waitForHook(page, 'getProjectMarkers');
  let markers: E2EProjectMarker[] = [];
  await expect
    .poll(async () => (markers = await projectMarkers(page)).length, {
      message: 'project markers on the map',
    })
    .toBeGreaterThan(0);
  return markers;
};

// The project type a pin shows: the classification of a tree project, such as `mangroves`, or `conservation`.
export const markerType = ({ purpose, classification }: E2EProjectMarker) =>
  classification ?? purpose;

// Sites are drawn on a canvas too, so they are read the same way.
export const mapSites = async (page: Page) =>
  (await page.evaluate(() => window.__planetE2E?.getProjectSites?.())) ?? [];

/** Waits for the map to draw the project's sites and returns them. */
export const waitForMapSites = async (page: Page) => {
  await waitForHook(page, 'getProjectSites');
  let sites: E2EProjectSite[] = [];
  await expect
    .poll(async () => (sites = await mapSites(page)).length, {
      message: 'project sites on the map',
    })
    .toBeGreaterThan(0);
  return sites;
};

export const boundsCenter = ([west, south, east, north]: E2EBounds): [
  number,
  number
] => [(west + east) / 2, (south + north) / 2];

export const boundsContain = (
  [west, south, east, north]: E2EBounds,
  [lng, lat]: [number, number]
) => lng >= west && lng <= east && lat >= south && lat <= north;

/**
 * Waits until the map has stopped moving with its center on this site.
 * The page fits the map to the site's bounds, so the center lands inside them whatever the zoom.
 */
export const expectMapOnSite = async (page: Page, site: E2EProjectSite) => {
  await expect
    .poll(
      async () => {
        const view = await page.evaluate(() =>
          window.__planetE2E?.getMapView?.()
        );
        if (!view) return 'map not ready';
        if (view.isMoving) return 'map still moving';
        return boundsContain(site.bounds, view.center)
          ? 'on the site'
          : `center ${view.center.join(', ')} is outside the site`;
      },
      { message: `the map centered on site ${site.id}` }
    )
    .toBe('on the site');
};
