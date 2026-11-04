import type { Page } from '@playwright/test';
import type { ProjectIntervention, ProjectSite } from './data';

import { expect } from '../fixtures';
import { donateText, formatMessage, projectDetailsText } from '../i18n';

const selectionParams = (page: Page) => {
  const query = new URL(page.url()).searchParams;
  return { site: query.get('site'), ploc: query.get('ploc') };
};

/** Waits until the URL names exactly this site and intervention, `null` meaning the param is absent. */
export const expectSelectionInUrl = (
  page: Page,
  expected: { site: string | null; ploc: string | null }
) =>
  expect
    .poll(() => selectionParams(page), {
      message: 'the site and ploc params in the URL',
    })
    .toEqual(expected);

// The group keeps its name while the toggle's own text changes with the selection.
export const siteDropdown = (page: Page) =>
  page.getByRole('group', { name: projectDetailsText.projectSites });

// The toggle comes first in the group. The options follow it in a list once it opens.
export const siteToggle = (page: Page) =>
  siteDropdown(page).getByRole('button').first();

export const siteOptions = (page: Page) => siteDropdown(page).getByRole('list');

// Matched by the exact site name, because the toggle also shows the selected site's name, and one name can be part of another.
export const siteOption = (page: Page, site: ProjectSite) =>
  siteOptions(page)
    .getByRole('listitem')
    .filter({ has: page.getByText(site.name, { exact: true }) })
    .getByRole('button');

/** Checks the toggle shows the site at this position, as "Site 2 of 3" with its name. */
export const expectSelectedSite = async (
  page: Page,
  sites: ProjectSite[],
  index: number
) => {
  await expect(siteToggle(page)).toContainText(
    formatMessage(projectDetailsText.siteCount, {
      siteId: index + 1,
      totalCount: sites.length,
    })
  );
  // The toggle cuts long names to 40 characters.
  await expect(siteToggle(page)).toContainText(sites[index].name.slice(0, 40));
};

/** The name the app shows for an intervention type, such as "Multi Tree Planting" for `multi-tree-registration`. */
export const interventionTypeLabel = (type: string) => {
  const label =
    projectDetailsText.intervention[
      type as keyof typeof projectDetailsText.intervention
    ];
  if (!label)
    throw new Error(`No English label for intervention type ${type}.`);
  return label;
};

// Found by its group name, like the site dropdown, because the toggle's text changes with the chosen type.
export const interventionTypeDropdown = (page: Page) =>
  page.getByRole('group', { name: projectDetailsText.interventionTypes });

export const interventionTypeToggle = (page: Page) =>
  interventionTypeDropdown(page).getByRole('button').first();

export const interventionTypeOptions = (page: Page) =>
  interventionTypeDropdown(page).getByRole('list');

export const interventionTypeOption = (page: Page, type: string) =>
  interventionTypeOptions(page).getByRole('button', {
    name: interventionTypeLabel(type),
    exact: true,
  });

// The heading at the top of the project info, which the page swaps out for an intervention's details.
export const aboutProjectHeading = (page: Page) =>
  page.getByRole('heading', { name: donateText.aboutProject });

// Every intervention panel shows the intervention's hid split after three characters, as `formatHid` in src/utils/projectV2.ts does.
export const interventionHid = (page: Page, { hid }: ProjectIntervention) =>
  page.getByText(`${hid.slice(0, 3)}-${hid.slice(3)}`, { exact: true });
