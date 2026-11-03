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
  const first = onMap.find((site) => site.id === sites[0].id);
  if (!first) {
    throw new Error(
      `The first site, ${sites[0].id}, is not on the map, so the page cannot zoom to it.`
    );
  }
  const other = onMap.find(
    (site) =>
      site.id !== first.id &&
      !boundsContain(site.bounds, boundsCenter(first.bounds)) &&
      !boundsContain(first.bounds, boundsCenter(site.bounds))
  );
  const otherSite = sites.find((site) => site.id === other?.id);
  if (!other || !otherSite) {
    throw new Error(
      'The project has no site apart from the first one, so these tests cannot tell them apart on the map.'
    );
  }
  return { first, other, otherSite };
};

test('the map draws every site of the project that has a shape', async ({
  page,
}) => {
  const { sites } = await openProject(page);

  const onMap = await waitForMapSites(page);

  const ids = (list: { id: string }[]) => list.map(({ id }) => id).sort();
  expect(ids(onMap)).toEqual(ids(sites.filter((site) => site.hasShape)));
});

test('a shared site link moves the map to that site', async ({ page }) => {
  // The first load only reads the sites, as in the site selection tests.
  const { sites } = await openProject(page);
  const { other } = await firstAndOtherSite(page, sites);

  await page.goto(projectPath(`?site=${other.id}`));

  await expectSelectionInUrl(page, { site: other.id, ploc: null });
  await expectMapOnSite(page, other);
});

test('choosing a site from the dropdown moves the map to it', async ({
  page,
}) => {
  const { sites } = await openProject(page);
  const { first, other, otherSite } = await firstAndOtherSite(page, sites);
  await expectMapOnSite(page, first);

  await siteToggle(page).click();
  await siteOption(page, otherSite).click();

  await expectSelectionInUrl(page, { site: other.id, ploc: null });
  await expectMapOnSite(page, other);
});
