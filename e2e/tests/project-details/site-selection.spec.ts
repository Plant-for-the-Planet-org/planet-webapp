import type { Page } from '@playwright/test';

import { test, expect } from '../../support/fixtures';
import { LOCALE } from '../../support/i18n';
import { openProject, projectPath } from '../../support/projectDetails/data';
import {
  expectSelectedSite,
  expectSelectionInUrl,
  siteOption,
  siteOptions,
  siteToggle,
} from '../../support/projectDetails/page';
import { projectCards } from '../../support/projects/page';

// Most tests here pick the second site, so they fail with a clear message when staging has fewer than two.
const openProjectWithSites = async (page: Page, query?: string) => {
  const project = await openProject(page, query);
  expect(project.sites.length, 'sites on the project').toBeGreaterThan(1);
  return project;
};

test('a project link without a site selects the first site and adds it to the URL', async ({
  page,
}) => {
  const { sites } = await openProjectWithSites(page);

  await expectSelectionInUrl(page, { site: sites[0].id, ploc: null });
  await expectSelectedSite(page, sites, 0);
});

test('a shared site link opens that site and keeps the other params, such as UTM tags', async ({
  page,
}) => {
  // The first load only reads the site ids. The second site is used, because the page picks the first one anyway.
  const { sites } = await openProjectWithSites(page);
  const second = sites[1];

  await page.goto(projectPath(`?site=${second.id}&utm_source=e2e`));

  await expectSelectionInUrl(page, { site: second.id, ploc: null });
  await expect(page).toHaveURL(/[?&]utm_source=e2e(&|$)/);
  await expectSelectedSite(page, sites, 1);
});

test('a site link with an unknown site falls back to the first site', async ({
  page,
}) => {
  const { sites } = await openProject(page, '?site=no-such-site');

  await expectSelectionInUrl(page, { site: sites[0].id, ploc: null });
  await expectSelectedSite(page, sites, 0);
});

test('choosing a site from the dropdown selects it, updates the URL and closes the list', async ({
  page,
}) => {
  const { sites } = await openProjectWithSites(page);
  const second = sites[1];
  await expectSelectionInUrl(page, { site: sites[0].id, ploc: null });

  await siteToggle(page).click();
  await expect(siteToggle(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(siteOption(page, sites[0])).toHaveAttribute(
    'aria-current',
    'true'
  );

  await siteOption(page, second).click();

  await expectSelectionInUrl(page, { site: second.id, ploc: null });
  await expectSelectedSite(page, sites, 1);
  await expect(siteOptions(page)).toBeHidden();
  await expect(siteToggle(page)).toHaveAttribute('aria-expanded', 'false');
});

test('browser Back after choosing a site leaves the project in one step', async ({
  page,
}) => {
  await page.goto(`/${LOCALE}`);
  const { sites } = await openProjectWithSites(page);
  await expectSelectionInUrl(page, { site: sites[0].id, ploc: null });

  await siteToggle(page).click();
  await siteOption(page, sites[1]).click();
  await expectSelectionInUrl(page, { site: sites[1].id, ploc: null });

  // Site changes replace the history entry. If they pushed one, Back would land on the first site instead.
  await page.goBack();

  await expect(page).toHaveURL(new RegExp(`/${LOCALE}/?$`));
  await expect(projectCards(page).first()).toBeVisible();
});
