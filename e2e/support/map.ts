import type { Page } from '@playwright/test';
import type { E2EBounds, E2EHooks } from '../../src/utils/e2eHooks';

import { expect } from './fixtures';

const mapHookMissing = (name: keyof E2EHooks) =>
  [
    `The map never exposed window.__planetE2E.${name}, so the test cannot read the map.`,
    'On a deployed preview, the build needs NEXT_PUBLIC_E2E_HOOKS=true (Vercel, Preview scope). A local dev server turns the hook on by itself.',
    'Otherwise the map, or the map layer that sets this hook, did not render: check the trace for the "graphics acceleration" message.',
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

export const waitForHook = async (page: Page, name: keyof E2EHooks) => {
  try {
    await page.waitForFunction(
      (hook) => window.__planetE2E?.[hook] !== undefined,
      name,
      { timeout: 60_000 }
    );
  } catch {
    throw new Error(mapHookMissing(name));
  }
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
export const expectMapCenteredIn = async (
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

export const mapCanvas = (page: Page) =>
  page.locator('canvas.maplibregl-canvas');
