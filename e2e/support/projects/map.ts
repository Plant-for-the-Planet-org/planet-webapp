import type { Page } from '@playwright/test';
import type { E2EProjectMarker } from '../../../src/utils/e2eHooks';

import { expect } from '../fixtures';
import { waitForHook } from '../map';

// Markers are drawn on a canvas, so they are read from the map's own data through the hook in src/utils/e2eHooks.ts.
export const projectMarkers = async (page: Page) =>
  (await page.evaluate(() => window.__planetE2E?.getProjectMarkers?.())) ?? [];

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
