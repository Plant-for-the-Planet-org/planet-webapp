import type { Page } from '@playwright/test';
import type { E2EBounds, E2EProjectSite } from '../../../src/utils/e2eHooks';
import type { ProjectIntervention } from './data';

import { expect } from '../fixtures';
import { boundsCenter, expectMapCenteredIn, waitForHook } from '../map';
import { INTERVENTIONS_TIMEOUT } from './data';

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

/** The intervention types the map draws now, each listed once and sorted. */
export const mapInterventionTypes = async (page: Page) => {
  const types =
    (await page.evaluate(() =>
      window.__planetE2E?.getMapInterventionTypes?.()
    )) ?? [];
  return [...new Set(types)].sort();
};

/** Waits for the map to draw the project's interventions and returns their types. */
export const waitForMapInterventionTypes = async (page: Page) => {
  await waitForHook(page, 'getMapInterventionTypes');
  let types: string[] = [];
  await expect
    .poll(async () => (types = await mapInterventionTypes(page)).length, {
      message: 'interventions on the map',
      timeout: INTERVENTIONS_TIMEOUT,
    })
    .toBeGreaterThan(0);
  return types;
};

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
