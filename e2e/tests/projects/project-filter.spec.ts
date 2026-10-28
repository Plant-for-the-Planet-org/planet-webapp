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

test('Accepting Donations alone hides non-donatable projects from the map without filtering by project type', async ({
  page,
}) => {
  test.slow();

  const start = summarize(await waitForProjectMarkers(page));
  expect(start.nonDonatable).toBeGreaterThan(0);
  expect(start.types.length).toBeGreaterThan(1);

  await page.getByRole('button', { name: text.filterProjects }).click();
  const donations = filterOption(page, text.acceptingDonations);
  await donations.click();
  await expect(donations).toHaveAttribute('aria-pressed', 'true');

  await expect
    .poll(async () => summarize(await projectMarkers(page)).nonDonatable, {
      message: 'no non-donatable projects on the map',
    })
    .toBe(0);
  const donatableMarkers = await projectMarkers(page);
  // Catches a donation filter that also filters by type.
  expect(summarize(donatableMarkers).types.length).toBeGreaterThan(1);

  // Holds while every staging project has a known type: a project without one is counted in the header but gets no pin.
  await expect(
    page.getByText(
      formatMessage(text.filterResult, {
        count: donatableMarkers.length,
      }).trim(),
      { exact: true }
    )
  ).toBeVisible();
});

test('two project types show the projects of either type, and unpicking one leaves only the other', async ({
  page,
}) => {
  test.slow();
  const AGROFORESTRY = 'agroforestry';

  const startMarkers = await waitForProjectMarkers(page);
  // A third type on the map means the two-type check below cannot pass before the filters apply.
  const start = summarize(startMarkers);
  expect(start.types).toEqual(
    expect.arrayContaining([MANGROVES, AGROFORESTRY])
  );
  expect(start.types.length).toBeGreaterThan(2);

  // Expected counts come from this page's own start markers, not fixed numbers, so changing staging data cannot break them.
  const startCount = (type: string) =>
    startMarkers.filter((marker) => markerType(marker) === type).length;
  const mapState = async () => {
    const markers = await projectMarkers(page);
    return { types: summarize(markers).types.sort(), count: markers.length };
  };

  await page.getByRole('button', { name: text.filterProjects }).click();
  const mangroves = filterOption(page, text.classificationTypes.mangroves);
  const agroforestry = filterOption(
    page,
    text.classificationTypes.agroforestry
  );

  await mangroves.click();
  await agroforestry.click();
  await expect(mangroves).toHaveAttribute('aria-pressed', 'true');
  await expect(agroforestry).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(mapState, { message: 'every mangrove and agroforestry project' })
    .toEqual({
      types: [AGROFORESTRY, MANGROVES],
      count: startCount(MANGROVES) + startCount(AGROFORESTRY),
    });

  await mangroves.click();
  await expect(mangroves).toHaveAttribute('aria-pressed', 'false');
  await expect(agroforestry).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(mapState, { message: 'every agroforestry project, and nothing else' })
    .toEqual({ types: [AGROFORESTRY], count: startCount(AGROFORESTRY) });
});

// The Salesforce Mangroves tenant page links to the project list this way.
test('a link with filters in its URL opens the project list already filtered', async ({
  page,
}) => {
  test.slow();

  await page.goto(
    `/${LOCALE}?filter=${MANGROVES}&donatable_projects_only=true`
  );

  await waitForProjectMarkers(page);
  await expect
    .poll(async () => summarize(await projectMarkers(page)), {
      message: 'only donatable mangrove projects on the map',
    })
    .toEqual({ types: [MANGROVES], nonDonatable: 0 });
  const filteredCount = (await projectMarkers(page)).length;

  // The header shows this count only while a filter is on, so it also proves the URL turned the filters on.
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

  await page.getByRole('button', { name: text.filterProjects }).click();
  await expect(
    filterOption(page, text.classificationTypes.mangroves)
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(filterOption(page, text.acceptingDonations)).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
