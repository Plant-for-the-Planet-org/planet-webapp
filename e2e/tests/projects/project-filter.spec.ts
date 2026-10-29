import type { Page } from '@playwright/test';
import type { E2EProjectMarker } from '../../../src/utils/e2eHooks';

import { test, expect } from '../../support/fixtures';
import {
  LOCALE,
  allProjectsText as text,
  countryText,
  formatMessage,
  projectText,
} from '../../support/i18n';
import { projectCards, projectListTab } from '../../support/projects';
import {
  allowSoftwareWebGL,
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
  nonDonatable: markers.filter((marker) => !marker.allowDonations).length,
});

// Sorted, so two sets of markers compare equal whatever order the map holds them in.
const slugs = (markers: E2EProjectMarker[]) =>
  markers.map((marker) => marker.slug).sort();

const mapSlugs = async (page: Page) => slugs(await projectMarkers(page));

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

  // Expected results come from the start markers, so a filter that hides a project it should keep fails too.
  const startMangroves = startMarkers.filter(
    (marker) => markerType(marker) === MANGROVES
  );
  const donatableMangroves = startMangroves.filter(
    (marker) => marker.allowDonations
  );
  // Staging data changes. Without a non-donatable mangrove project here, the donation check below would pass even if that filter did nothing.
  expect(
    summarize(startMangroves).nonDonatable,
    'non-donatable mangrove projects before Accepting Donations'
  ).toBeGreaterThan(0);

  await page.getByRole('button', { name: text.filterProjects }).click();
  const mangroves = filterOption(page, text.classificationTypes.mangroves);
  const donations = filterOption(page, text.acceptingDonations);

  await mangroves.click();
  await expect(mangroves).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => mapSlugs(page), {
      message: 'every mangrove project, and nothing else, on the map',
    })
    .toEqual(slugs(startMangroves));

  await donations.click();
  await expect(donations).toHaveAttribute('aria-pressed', 'true');

  // Donation is checked on the map, not the list: the list puts donatable projects first, so its top cards are donatable even without the filter.
  await expect
    .poll(() => mapSlugs(page), {
      message: 'every donatable mangrove project, and nothing else, on the map',
    })
    .toEqual(slugs(donatableMangroves));

  // The header counts the same projects the map shows. Every mangrove project has a pin, so the numbers match exactly.
  await expect(
    page.getByText(
      formatMessage(text.filterResult, {
        count: donatableMangroves.length,
      }).trim(),
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
    .poll(() => mapSlugs(page), {
      message: 'every project back on the map',
    })
    .toEqual(slugs(startMarkers));
});

test('Accepting Donations alone hides non-donatable projects from the map without filtering by project type', async ({
  page,
}) => {
  test.slow();

  const startMarkers = await waitForProjectMarkers(page);
  expect(summarize(startMarkers).nonDonatable).toBeGreaterThan(0);
  const startDonatable = startMarkers.filter((marker) => marker.allowDonations);
  // More than one type, so a donation filter that also filters by type fails the check below.
  expect(summarize(startDonatable).types.length).toBeGreaterThan(1);

  await page.getByRole('button', { name: text.filterProjects }).click();
  const donations = filterOption(page, text.acceptingDonations);
  await donations.click();
  await expect(donations).toHaveAttribute('aria-pressed', 'true');

  await expect
    .poll(() => mapSlugs(page), {
      message: 'every donatable project, and nothing else, on the map',
    })
    .toEqual(slugs(startDonatable));

  // Holds while every staging project has a known type: a project without one is counted in the header but gets no pin.
  await expect(
    page.getByText(
      formatMessage(text.filterResult, {
        count: startDonatable.length,
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

  // The unfiltered page from beforeEach gives the projects the link should keep. The link then gets a fresh page load, as when it is opened from another site.
  const startMarkers = await waitForProjectMarkers(page);
  const startMangroves = startMarkers.filter(
    (marker) => markerType(marker) === MANGROVES
  );
  const donatableMangroves = startMangroves.filter(
    (marker) => marker.allowDonations
  );
  // Without a non-donatable mangrove project, the check below would pass even if the URL did not turn on the donation filter.
  expect(
    summarize(startMangroves).nonDonatable,
    'non-donatable mangrove projects without the filters'
  ).toBeGreaterThan(0);

  await page.goto(
    `/${LOCALE}?filter=${MANGROVES}&donatable_projects_only=true`
  );

  await waitForProjectMarkers(page);
  await expect
    .poll(() => mapSlugs(page), {
      message: 'every donatable mangrove project, and nothing else, on the map',
    })
    .toEqual(slugs(donatableMangroves));

  // The header shows this count only while a filter is on, so it also proves the URL turned the filters on.
  await expect(
    page.getByText(
      formatMessage(text.filterResult, {
        count: donatableMangroves.length,
      }).trim(),
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

test('a search narrows the filtered projects, and clearing the search keeps the filter', async ({
  page,
}) => {
  test.slow();
  // On staging, Kenya has a few mangrove projects, many projects of other types, and most mangrove projects are elsewhere. Every mangrove project that matches "Kenya" is in Kenya.
  const kenya = countryText.ke;

  await waitForProjectMarkers(page);
  await page.getByRole('button', { name: text.filterProjects }).click();
  await filterOption(page, text.classificationTypes.mangroves).click();
  await expect
    .poll(async () => summarize(await projectMarkers(page)).types, {
      message: 'only mangrove projects on the map',
    })
    .toEqual([MANGROVES]);
  const mangroveCount = (await projectMarkers(page)).length;

  // While the search box is open, the filter panel is hidden, but the filter stays on.
  await page.getByRole('button', { name: text.searchProject }).click();
  await page.getByRole('textbox', { name: text.searchProject }).fill(kenya);

  // The search applies about a second after typing stops.
  await expect
    .poll(async () => (await projectMarkers(page)).length, {
      message: 'fewer markers once the search applies',
    })
    .toBeLessThan(mangroveCount);
  const searchedMarkers = await projectMarkers(page);
  expect(searchedMarkers.length).toBeGreaterThan(0);
  expect(summarize(searchedMarkers).types).toEqual([MANGROVES]);
  await expect(projectCards(page).first()).toBeVisible();
  await expect(
    projectCards(page).filter({
      hasNotText: projectText.classification.mangroves,
    })
  ).toHaveCount(0);
  await expect(projectCards(page).filter({ hasNotText: kenya })).toHaveCount(0);

  await page.getByRole('button', { name: text.clearSearch }).click();

  await expect
    .poll(async () => (await projectMarkers(page)).length, {
      message: 'every mangrove project back on the map',
    })
    .toBe(mangroveCount);
  await expect(
    page.getByText(
      formatMessage(text.filterResult, { count: mangroveCount }).trim(),
      { exact: true }
    )
  ).toBeVisible();
});
