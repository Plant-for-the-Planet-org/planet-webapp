import type { Page } from '@playwright/test';
import type {
  E2EBounds,
  E2EHooks,
  E2EProjectMarker,
  E2EProjectSite,
} from '../../src/utils/e2eHooks';
import type { ProjectIntervention } from './projectDetails';

import { expect } from './fixtures';
import { INTERVENTIONS_TIMEOUT } from './projectDetails';

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

/** The map's center right now, as `[lng, lat]`. */
export const mapCenter = async (page: Page) => {
  const view = await page.evaluate(() => window.__planetE2E?.getMapView?.());
  if (!view) throw new Error('The map view hook is not set.');
  return view.center;
};

// Waits until the map has stopped moving with its center inside these bounds.
const expectMapCenteredIn = async (
  page: Page,
  bounds: E2EBounds,
  targetName: string,
  timeout?: number
) => {
  await expect
    .poll(
      async () => {
        const view = await page.evaluate(() =>
          window.__planetE2E?.getMapView?.()
        );
        if (!view) return 'map not ready';
        if (view.isMoving) return 'map still moving';
        return boundsContain(bounds, view.center)
          ? 'centered'
          : `center ${view.center.join(', ')} is outside ${targetName}`;
      },
      { message: `the map centered on ${targetName}`, timeout }
    )
    .toBe('centered');
};

/**
 * Waits until the map has stopped moving with its center on this site.
 * The page fits the map to the site's bounds, so the center lands inside them whatever the zoom.
 */
export const expectMapOnSite = (page: Page, site: E2EProjectSite) =>
  expectMapCenteredIn(page, site.bounds, `site ${site.id}`);

/** The bounds of a point or polygon intervention, or `null` for any other shape, which the map does not zoom to. */
export const interventionBounds = ({
  geometry,
}: ProjectIntervention): E2EBounds | null => {
  if (geometry?.type === 'Point') {
    const [lng, lat] = geometry.coordinates;
    return [lng, lat, lng, lat];
  }
  if (geometry?.type === 'Polygon') {
    const lngs = geometry.coordinates[0].map(([lng]) => lng);
    const lats = geometry.coordinates[0].map(([, lat]) => lat);
    return [
      Math.min(...lngs),
      Math.min(...lats),
      Math.max(...lngs),
      Math.max(...lats),
    ];
  }
  return null;
};

// About a meter, so a point intervention, whose bounds have no size, still has room for rounding.
const POINT_MARGIN = 0.00001;

/**
 * Waits until the map has stopped moving with its center on this intervention.
 * The page centers a point and fits the map to a polygon's bounds, so in both cases the center lands inside the bounds.
 */
export const expectMapOnIntervention = (
  page: Page,
  intervention: ProjectIntervention
) => {
  const bounds = interventionBounds(intervention);
  if (!bounds) {
    throw new Error(
      `Intervention ${intervention.hid} is not a point or a polygon.`
    );
  }
  const [west, south, east, north] = bounds;
  return expectMapCenteredIn(
    page,
    [
      west - POINT_MARGIN,
      south - POINT_MARGIN,
      east + POINT_MARGIN,
      north + POINT_MARGIN,
    ],
    `intervention ${intervention.hid}`,
    INTERVENTIONS_TIMEOUT
  );
};

export const highlightedInterventions = async (page: Page) =>
  (await page.evaluate(() =>
    window.__planetE2E?.getHighlightedInterventions?.()
  )) ?? [];

/**
 * Finds an intervention the visitor could click now, and the canvas point to click.
 * It must be on screen, not covered by the page, and the top feature at that point, because the click handler only acts on the top feature.
 * A polygon is tried at its bounds' center, which can fall outside an odd shape, so such a polygon is skipped.
 */
export const findClickableIntervention = async (
  page: Page,
  interventions: ProjectIntervention[]
) => {
  const candidates = interventions.flatMap((intervention) => {
    const bounds = interventionBounds(intervention);
    return bounds
      ? [{ id: intervention.id, lngLat: boundsCenter(bounds) }]
      : [];
  });
  // Typed with `as` so TypeScript does not assume it stays `null`. It cannot see that the poll below sets it.
  let found = null as { id: string; x: number; y: number } | null;
  await expect
    .poll(
      async () => {
        found = await page.evaluate((list) => {
          const hooks = window.__planetE2E;
          const canvas = document.querySelector('canvas.maplibregl-canvas');
          if (!hooks?.getScreenPoint || !hooks.getInterventionAt || !canvas) {
            return null;
          }
          const rect = canvas.getBoundingClientRect();
          for (const { id, lngLat } of list) {
            const { x, y } = hooks.getScreenPoint(lngLat);
            if (x < 0 || y < 0 || x > rect.width || y > rect.height) continue;
            const onTop = document.elementFromPoint(
              rect.left + x,
              rect.top + y
            );
            if (onTop !== canvas) continue;
            if (hooks.getInterventionAt({ x, y }) === id) return { id, x, y };
          }
          return null;
        }, candidates);
        return found !== null;
      },
      {
        message: 'an intervention the visitor can click on the map',
        timeout: INTERVENTIONS_TIMEOUT,
      }
    )
    .toBe(true);
  const { id, x, y } = found as { id: string; x: number; y: number };
  const intervention = interventions.find((item) => item.id === id);
  if (!intervention)
    throw new Error(`Intervention ${id} is not on the project.`);
  return { intervention, point: { x, y } };
};

export const mapCanvas = (page: Page) =>
  page.locator('canvas.maplibregl-canvas');
