import type { Page } from '@playwright/test';
import type { E2EProjectMarker } from '../../src/utils/e2eHooks';

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
  (await page.evaluate(() => window.__planetE2E?.getProjectMarkers())) ?? [];

/** Waits for the map to show its first markers and returns them. */
export const waitForProjectMarkers = async (page: Page) => {
  try {
    await page.waitForFunction(() => window.__planetE2E !== undefined, null, {
      timeout: 60_000,
    });
  } catch {
    throw new Error(MAP_HOOK_MISSING);
  }
  let markers: E2EProjectMarker[] = [];
  await expect
    .poll(async () => (markers = await projectMarkers(page)).length, {
      message: 'project markers on the map',
    })
    .toBeGreaterThan(0);
  return markers;
};

// An iconKey reads `pin-<type>-<tier>`, such as `pin-mangroves-regularProject`. Types can contain hyphens, tiers cannot.
export const markerType = ({ iconKey }: E2EProjectMarker) =>
  iconKey.slice('pin-'.length, iconKey.lastIndexOf('-'));

export const markerTier = ({ iconKey }: E2EProjectMarker) =>
  iconKey.slice(iconKey.lastIndexOf('-') + 1);
