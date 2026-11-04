import type { Page } from '@playwright/test';
import type { ProjectSite } from '../../support/projectDetails';

import { test, expect } from '../../support/fixtures';
import {
  allowSoftwareWebGL,
  boundsCenter,
  boundsContain,
  expectMapOnSite,
  waitForMapSites,
} from '../../support/map';
import {
  expectSelectionInUrl,
  openProject,
  projectPath,
  siteOption,
  siteToggle,
} from '../../support/projectDetails';

test.beforeEach(async ({ page }) => {
  await allowSoftwareWebGL(page);
  // The map renders in software without a GPU, as in CI, which is slow.
  test.slow();
});

/**
 * Returns the first site as the map holds it, and another site that does not overlap it.
 * The other site must not overlap, or a map that never left the first site would pass for it.
 */
const firstAndOtherSite = async (page: Page, sites: ProjectSite[]) => {
  const onMap = await waitForMapSites(page);
  const firstOnMap = onMap.find((site) => site.id === sites[0].id);
  if (!firstOnMap) {
    throw new Error(
      `The first site, ${sites[0].id}, is not on the map, so the page cannot zoom to it.`
    );
  }
  const otherOnMap = onMap.find(
    (site) =>
      site.id !== firstOnMap.id &&
      !boundsContain(site.bounds, boundsCenter(firstOnMap.bounds)) &&
      !boundsContain(firstOnMap.bounds, boundsCenter(site.bounds))
  );
  const otherSite = sites.find((site) => site.id === otherOnMap?.id);
  if (!otherOnMap || !otherSite) {
    throw new Error(
      'The project has no site apart from the first one, so these tests cannot tell them apart on the map.'
    );
  }
  return { firstOnMap, otherOnMap, otherSite };
};

test('the map draws every site of the project that has a shape', async ({
  page,
}) => {
  const { sites } = await openProject(page);

  const onMap = await waitForMapSites(page);

  const sortedIds = (list: { id: string }[]) => list.map(({ id }) => id).sort();
  expect(sortedIds(onMap)).toEqual(
    sortedIds(sites.filter((site) => site.hasShape))
  );
});

test('a shared site link moves the map to that site', async ({ page }) => {
  // The first load only reads the sites, as in the site selection tests.
  const { sites } = await openProject(page);
  const { otherOnMap } = await firstAndOtherSite(page, sites);

  await page.goto(projectPath(`?site=${otherOnMap.id}`));

  await expectSelectionInUrl(page, { site: otherOnMap.id, ploc: null });
  await expectMapOnSite(page, otherOnMap);
});

test('choosing a site from the dropdown moves the map to it', async ({
  page,
}) => {
  const { sites } = await openProject(page);
  const { firstOnMap, otherOnMap, otherSite } = await firstAndOtherSite(
    page,
    sites
  );
  await expectMapOnSite(page, firstOnMap);

  await siteToggle(page).click();
  await siteOption(page, otherSite).click();

  await expectSelectionInUrl(page, { site: otherOnMap.id, ploc: null });
  await expectMapOnSite(page, otherOnMap);
});
