import type { Page } from '@playwright/test';
import type { E2EProjectMarker } from '../../../src/utils/e2eHooks';

import { test, expect } from '../../support/fixtures';
import {
  LOCALE,
  allProjectsText as text,
  formatMessage,
  projectText,
} from '../../support/i18n';
import { projectCards, projectListTab } from '../../support/projects';
import {
  allowSoftwareWebGL,
  markerTier,
  markerType,
  projectMarkers,
  waitForProjectMarkers,
} from '../../support/map';

const MANGROVES = 'mangroves';

const filterOption = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true });

// Summed up so a failure shows what the map held, not just "false".
const summarize = (markers: E2EProjectMarker[]) => ({
  types: [...new Set(markers.map(markerType))],
  nonDonatable: markers.filter(
    (marker) => markerTier(marker) === 'nonDonatableProject'
  ).length,
});

test.beforeEach(async ({ page }) => {
  await allowSoftwareWebGL(page);
  await page.goto(`/${LOCALE}`);
});

test('Mangroves, then Accepting Donations, narrow the project list and the map markers, and Clear Filter brings them all back', async ({
  page,
}) => {
  // The map renders in software without a GPU, as in CI, which is slow.
  test.slow();

  const startMarkers = await waitForProjectMarkers(page);
  // The map starts with other types, so the Mangroves check below cannot pass before the filter applies.
  const start = summarize(startMarkers);
  expect(start.types).toContain(MANGROVES);
  expect(start.types.length).toBeGreaterThan(1);

  await page.getByRole('button', { name: text.filterProjects }).click();
  const mangroves = filterOption(page, text.classificationTypes.mangroves);
  const donations = filterOption(page, text.acceptingDonations);

  await mangroves.click();
  await expect(mangroves).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(async () => summarize(await projectMarkers(page)).types, {
      message: 'only mangrove projects on the map',
    })
    .toEqual([MANGROVES]);
  // Staging data changes. Without a non-donatable mangrove project here, the donation check below would pass even if that filter did nothing.
  expect(
    summarize(await projectMarkers(page)).nonDonatable,
    'non-donatable mangrove projects before Accepting Donations'
  ).toBeGreaterThan(0);

  await donations.click();
  await expect(donations).toHaveAttribute('aria-pressed', 'true');

  // Donation is checked on the map, not the list: the list puts donatable projects first, so its top cards are donatable even without the filter.
  await expect
    .poll(async () => summarize(await projectMarkers(page)), {
      message: 'only donatable mangrove projects on the map',
    })
    .toEqual({ types: [MANGROVES], nonDonatable: 0 });
  const filteredCount = (await projectMarkers(page)).length;

  // The header counts the same projects the map shows. Every mangrove project has a pin, so the numbers match exactly.
  await expect(
    page.getByText(
      formatMessage(text.filterResult, { count: filteredCount }).trim(),
      { exact: true }
    )
  ).toBeVisible();
  await expect(projectCards(page).first()).toBeVisible();
  await expect(
    projectCards(page).filter({
      hasNotText: projectText.classification.mangroves,
    })
  ).toHaveCount(0);

  await page.getByRole('button', { name: text.clearFilter }).click();

  await expect(mangroves).toHaveAttribute('aria-pressed', 'false');
  await expect(donations).toHaveAttribute('aria-pressed', 'false');
  // The tabs only come back once the filter result count is gone.
  await expect(projectListTab(page, text.allProjects)).toBeVisible();
  await expect(
    projectCards(page)
      .filter({ hasNotText: projectText.classification.mangroves })
      .first()
  ).toBeVisible();
  await expect
    .poll(async () => (await projectMarkers(page)).length, {
      message: 'all project markers back on the map',
    })
    .toBe(startMarkers.length);
});
