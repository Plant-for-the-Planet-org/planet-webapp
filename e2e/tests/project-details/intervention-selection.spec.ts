import type { Page } from '@playwright/test';

import { test, expect } from '../../support/fixtures';
import {
  aboutProjectHeading,
  expectSelectedSite,
  expectSelectionInUrl,
  interventionHid,
  openProject,
  projectPath,
  siteOption,
  siteToggle,
} from '../../support/projectDetails';

test.beforeEach(() => {
  // Interventions load from TreeMapper, which can take most of the 30 s a preview allows, and each test loads the page twice.
  test.slow();
});

// The first load only reads live ids from staging. Each test then opens its own link, as a visitor following a shared link would.
const readProjectData = async (page: Page) => {
  const { sites, interventions } = await openProject(page);
  const [intervention] = await interventions();
  expect(sites.length, 'sites on the project').toBeGreaterThan(1);
  expect(intervention, 'an intervention on the project').toBeDefined();
  return { sites, intervention };
};

test('a shared intervention link shows that intervention instead of a site', async ({
  page,
}) => {
  const { intervention } = await readProjectData(page);

  await page.goto(projectPath(`?ploc=${intervention.hid}`));

  // Interventions load after the project, so this also checks the page waits for them instead of falling back to a site.
  await expect(interventionHid(page, intervention)).toBeVisible();
  await expect(aboutProjectHeading(page)).toBeHidden();
  await expect(siteToggle(page)).toHaveText('-');
  await expectSelectionInUrl(page, { site: null, ploc: intervention.hid });
});

test('an intervention link with an unknown intervention falls back to the first site', async ({
  page,
}) => {
  const { sites, interventions } = await openProject(
    page,
    '?ploc=no-such-intervention'
  );
  // The fallback only happens once interventions arrive, so wait for them before checking.
  await interventions();

  await expectSelectionInUrl(page, { site: sites[0].id, ploc: null });
  await expectSelectedSite(page, sites, 0);
  await expect(aboutProjectHeading(page)).toBeVisible();
});

test('a link with both a site and an intervention opens the site and drops the intervention', async ({
  page,
}) => {
  const { sites, intervention } = await readProjectData(page);
  const second = sites[1];

  await page.goto(projectPath(`?site=${second.id}&ploc=${intervention.hid}`));

  await expectSelectionInUrl(page, { site: second.id, ploc: null });
  await expectSelectedSite(page, sites, 1);
  await expect(aboutProjectHeading(page)).toBeVisible();
  await expect(interventionHid(page, intervention)).toBeHidden();
});

test('choosing a site while an intervention is selected clears the intervention', async ({
  page,
}) => {
  const { sites, intervention } = await readProjectData(page);
  const second = sites[1];
  await page.goto(projectPath(`?ploc=${intervention.hid}`));
  await expect(interventionHid(page, intervention)).toBeVisible();

  await siteToggle(page).click();
  await siteOption(page, second).click();

  await expectSelectionInUrl(page, { site: second.id, ploc: null });
  await expectSelectedSite(page, sites, 1);
  await expect(interventionHid(page, intervention)).toBeHidden();
  await expect(aboutProjectHeading(page)).toBeVisible();
});
