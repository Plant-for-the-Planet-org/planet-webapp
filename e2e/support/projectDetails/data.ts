import type { Page } from '@playwright/test';
import type { Geometry } from 'geojson';

import { LOCALE } from '../i18n';
import { PROJECT } from '../testProject';

/** `hasShape` is false for a site without geometry, which the map leaves out. */
export type ProjectSite = { id: string; name: string; hasShape: boolean };
/** `id` is what the map holds, `hid` is what the URL and the panel show. */
export type ProjectIntervention = {
  id: string;
  hid: string;
  type: string;
  geometry: Geometry | null;
};

type ProjectResponse = {
  sites?: { properties: { id: string; name: string }; geometry: unknown }[];
};
type InterventionsResponse = { data: ProjectIntervention[] | null };

// TreeMapper can be slow, so waits on intervention data allow more than the default Playwright timeout.
export const INTERVENTIONS_TIMEOUT = 30_000;

export const projectPath = (query = '') => `/${LOCALE}/${PROJECT.slug}${query}`;

const isProjectUrl = (url: URL) =>
  url.pathname.endsWith(`/app/projects/${PROJECT.slug}`);

// TreeMapper's host differs between environments, so match on the path only.
const isInterventionsUrl = (url: URL) =>
  /\/project\/[^/]+\/interventions$/.test(url.pathname);

/**
 * Resolves with the JSON of the first response whose URL matches, or rejects with its status if it fails, and passes the response on to the page unchanged.
 * Read in the route, not with `waitForResponse`, because Chrome drops large bodies such as the interventions from its cache before a test can read them.
 */
const captureJson = <T>(page: Page, matches: (url: URL) => boolean) =>
  new Promise<T>((resolve, reject) => {
    // Not awaited: the page requests this data only after it hydrates, long after the route is in place. Await the route here if a request ever starts earlier, such as during server rendering.
    void page.route(
      matches,
      async (route) => {
        try {
          const response = await route.fetch();
          if (response.ok()) resolve(await response.json());
          else
            reject(
              new Error(`${response.url()} answered ${response.status()}.`)
            );
          await route.fulfill({ response });
        } catch (error) {
          // A test that never reads interventions can end while TreeMapper is still answering, which closes the page mid-request. Nothing waits for the error then, so passing it on is harmless.
          reject(error);
          await route.abort().catch(() => {});
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
  // Site tests never read interventions, so a TreeMapper error must not fail them as an unhandled rejection. `interventions()` still sees it.
  interventionsJson.catch(() => {});

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
      return (body.data ?? []).map(({ id, hid, type, geometry }) => ({
        id,
        hid,
        type,
        geometry,
      }));
    } finally {
      clearTimeout(timer);
    }
  };

  return { sites, interventions };
};
