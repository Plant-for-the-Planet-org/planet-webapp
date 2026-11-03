import type { Page } from '@playwright/test';

import { expect } from './fixtures';
import { LOCALE, donateText, formatMessage, projectDetailsText } from './i18n';
import { PROJECT } from './projects';

/** `hasShape` is false for a site without geometry, which the map leaves out. */
export type ProjectSite = { id: string; name: string; hasShape: boolean };
export type ProjectIntervention = { hid: string };

type ProjectResponse = {
  sites?: { properties: { id: string; name: string }; geometry: unknown }[];
};
type InterventionsResponse = { data: { hid: string }[] | null };

const INTERVENTIONS_TIMEOUT = 30_000;

export const projectPath = (query = '') => `/${LOCALE}/${PROJECT.slug}${query}`;

const isProjectUrl = (url: URL) =>
  url.pathname.endsWith(`/app/projects/${PROJECT.slug}`);

// TreeMapper's host differs between environments, so match on the path only.
const isInterventionsUrl = (url: URL) =>
  /\/project\/[^/]+\/interventions$/.test(url.pathname);

/**
 * Resolves with the JSON of the first response whose URL matches, if it succeeds, and passes the response on to the page unchanged.
 * Read in the route, not with `waitForResponse`, because Chrome drops large bodies such as the interventions from its cache before a test can read them.
 */
const captureJson = <T>(page: Page, matches: (url: URL) => boolean) =>
  new Promise<T>((resolve) => {
    void page.route(
      matches,
      async (route) => {
        try {
          const response = await route.fetch();
          if (response.ok()) resolve(await response.json());
          await route.fulfill({ response });
        } catch {
          // A test that never reads interventions can end while TreeMapper is still answering, which closes the page mid-request.
        }
      },
      { times: 1 }
    );
  });

/**
 * Opens the project page and returns the project's sites and interventions as the page fetched them.
 * Staging data changes, so tests take ids and names from here instead of hard-coding them.
 */
export const openProject = async (page: Page, query = '') => {
  const projectJson = captureJson<ProjectResponse>(page, isProjectUrl);
  const interventionsJson = captureJson<InterventionsResponse>(
    page,
    isInterventionsUrl
  );

  await page.goto(projectPath(query));

  const project = await projectJson;
  const sites: ProjectSite[] = (project.sites ?? []).map((site) => ({
    id: site.properties.id,
    name: site.properties.name,
    hasShape: Boolean(site.geometry),
  }));

  // Only intervention tests wait for TreeMapper, so site tests do not depend on it.
  const interventions = async (): Promise<ProjectIntervention[]> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new Error(
              'The page never loaded interventions. Check that TREEMAPPER_URL is set for this environment.'
            )
          ),
        INTERVENTIONS_TIMEOUT
      );
    });
    try {
      const body = await Promise.race([interventionsJson, timeout]);
      return (body.data ?? []).map(({ hid }) => ({ hid }));
    } finally {
      clearTimeout(timer);
    }
  };

  return { sites, interventions };
};

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

// The heading at the top of the project info, which the page swaps out for an intervention's details.
export const aboutProjectHeading = (page: Page) =>
  page.getByRole('heading', { name: donateText.aboutProject });

// Every intervention panel shows the intervention's hid split after three characters, as `formatHid` in src/utils/projectV2.ts does.
export const interventionHid = (page: Page, { hid }: ProjectIntervention) =>
  page.getByText(`${hid.slice(0, 3)}-${hid.slice(3)}`, { exact: true });
