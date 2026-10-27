import type { Intervention } from '@planet-sdk/common';
import type { NextRouter } from 'next/router';

import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useCurrencyStore,
  useInterventionStore,
  useQueryParamStore,
  useSingleProjectStore,
  useTenantStore,
} from '../stores';
import {
  createDeferred,
  createMockRouter,
  createProject,
  createSite,
  requestsTo,
  resetAllStores,
  SINGLE_PROJECT_PATH,
} from '../test-utils';
import { useInitializeSingleProject } from './useInitializeSingleProject';

const { getApi } = vi.hoisted(() => ({ getApi: vi.fn() }));

vi.mock('next/router', () => ({ useRouter: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('./useApi', () => ({ useApi: () => ({ getApi }) }));
// Time travel looks up imagery from Esri Wayback, which tests must not call.
vi.mock('../utils/mapsV2/timeTravel', () => ({
  getProjectTimeTravelConfig: async () => null,
}));

const renderAtQuery = (query: Record<string, string>) => {
  const router = createMockRouter({ query });
  vi.mocked(useRouter).mockReturnValue(router);
  renderHook(() => useInitializeSingleProject());
  return router;
};

/** Renders at a query, and returns a function that moves the same hook to another query, like a client-side navigation. */
const renderWithNavigation = (query: Record<string, string>) => {
  vi.mocked(useRouter).mockReturnValue(createMockRouter({ query }));
  const { rerender } = renderHook(() => useInitializeSingleProject());
  return (nextQuery: Record<string, string>) => {
    vi.mocked(useRouter).mockReturnValue(
      createMockRouter({ query: nextQuery })
    );
    rerender();
  };
};

const projectRequests = () => requestsTo(getApi, SINGLE_PROJECT_PATH);

const waitForProject = () =>
  waitFor(() =>
    expect(useSingleProjectStore.getState().singleProject).not.toBeNull()
  );

const SITES = [createSite('site_a'), createSite('site_b')];

const selectedSite = () => useSingleProjectStore.getState().selectedSite;

/** Puts a project in the store as if it had just loaded. */
const setLoadedProject = (slug: string) =>
  useSingleProjectStore.setState({
    singleProject: createProject({ slug, sites: SITES }),
    lastFetch: {
      slug,
      locale: 'en',
      currency: 'EUR',
      tenant: useTenantStore.getState().tenantConfig.id,
    },
  });

/** The URLs the site selection showed in the address bar, in order. */
const shownUrls = (router: NextRouter) =>
  vi.mocked(router.push).mock.calls.map(([, shownUrl]) => shownUrl);

describe('useInitializeSingleProject', () => {
  beforeEach(() => {
    resetAllStores();
    localStorage.clear();
    getApi.mockResolvedValue(createProject());
    useCurrencyStore.setState({ isCurrencyResolved: true });
  });

  it('fetches the project the URL names', async () => {
    renderAtQuery({ p: 'yucatan' });
    await waitForProject();

    expect(projectRequests()).toEqual([
      [
        '/app/projects/yucatan',
        {
          queryParams: {
            _scope: 'extended',
            currency: 'EUR',
            locale: 'en',
            tenant: useTenantStore.getState().tenantConfig.id,
          },
        },
      ],
    ]);
  });

  it('does not fetch when the URL names no project', () => {
    renderAtQuery({});

    expect(getApi).not.toHaveBeenCalled();
  });

  // #3010: the fetch used to live in a component that this embed configuration hides.
  it('still fetches when an embed hides the details pane', async () => {
    useQueryParamStore.setState({
      embed: 'true',
      showProjectDetails: 'false',
      isContextLoaded: true,
    });
    renderAtQuery({ p: 'yucatan', embed: 'true', project_details: 'false' });
    await waitForProject();

    expect(projectRequests()).toHaveLength(1);
  });

  it('waits for the currency to resolve, then fetches once with it', async () => {
    useCurrencyStore.setState({ isCurrencyResolved: false });
    localStorage.setItem('currencyCode', 'USD');
    renderAtQuery({ p: 'yucatan' });

    expect(getApi).not.toHaveBeenCalled();

    act(() => useCurrencyStore.getState().initializeCurrencyCode());
    await waitForProject();

    expect(projectRequests()).toHaveLength(1);
    expect(projectRequests()[0][1].queryParams.currency).toBe('USD');
  });

  it('redirects home when the project fails to load', async () => {
    getApi.mockRejectedValue(new Error('not found'));
    const router = renderAtQuery({ p: 'proj_DOESNOTEXIST' });

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/en'));
  });

  describe('site selection', () => {
    beforeEach(() => {
      getApi.mockResolvedValue(createProject({ sites: SITES }));
    });

    it('selects the first site once the project loads, and syncs the URL once', async () => {
      const router = renderAtQuery({ p: 'yucatan' });
      await waitFor(() => expect(selectedSite()).toBe(0));

      expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
    });

    it('selects the site the URL names', async () => {
      const router = renderAtQuery({ p: 'yucatan', site: 'site_b' });
      await waitFor(() => expect(selectedSite()).toBe(1));

      expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_b']);
    });

    it('falls back to the first site when the URL names an unknown site', async () => {
      const router = renderAtQuery({ p: 'yucatan', site: 'site_unknown' });
      await waitFor(() => expect(selectedSite()).toBe(0));

      expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
    });

    it('selects no site when the project has no sites', async () => {
      getApi.mockResolvedValue(createProject());
      const router = renderAtQuery({ p: 'yucatan' });
      await waitFor(() => expect(router.push).toHaveBeenCalled());

      expect(selectedSite()).toBeNull();
      expect(shownUrls(router)).toEqual(['/en/yucatan']);
    });

    it('leaves the selection to the intervention when the URL names only an intervention', async () => {
      const router = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });
      await waitForProject();

      expect(selectedSite()).toBeNull();
      expect(router.push).not.toHaveBeenCalled();
    });

    it('keeps an intervention that is already selected', async () => {
      const intervention = { id: 'int_1' } as Intervention;
      useInterventionStore.setState({ selectedIntervention: intervention });
      const router = renderAtQuery({ p: 'yucatan' });
      await waitForProject();

      expect(router.push).not.toHaveBeenCalled();
      expect(useInterventionStore.getState().selectedIntervention).toBe(
        intervention
      );
    });

    // #3120: the store keeps the previous project while the next one loads. Syncing the URL from it sent the user back to that project.
    it('does not sync the URL while the store still holds the previous project', async () => {
      setLoadedProject('koenigswald-ontananga');
      const response = createDeferred<unknown>();
      getApi.mockReturnValueOnce(response.promise);
      const router = renderAtQuery({ p: 'yucatan' });

      expect(router.push).not.toHaveBeenCalled();

      response.resolve(createProject({ sites: SITES }));
      await waitFor(() => expect(selectedSite()).toBe(0));

      expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
    });
  });

  // #3200: the last project used to outlive the project pages.
  describe('leaving the project', () => {
    it('clears the project when the URL no longer names one', async () => {
      getApi.mockResolvedValue(createProject({ sites: SITES }));
      const navigateTo = renderWithNavigation({ p: 'yucatan' });
      await waitFor(() => expect(selectedSite()).toBe(0));

      navigateTo({});

      const { singleProject, lastFetch } = useSingleProjectStore.getState();
      expect(singleProject).toBeNull();
      expect(lastFetch).toBeNull();
      expect(selectedSite()).toBeNull();
    });
  });
});
