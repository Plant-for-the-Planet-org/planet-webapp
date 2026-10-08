import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useCurrencyStore,
  useQueryParamStore,
  useSingleProjectStore,
  useTenantStore,
} from '../stores';
import {
  callsTo,
  createMockRouter,
  createProject,
  resetAllStores,
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

const projectRequests = () => callsTo(getApi, '/app/projects/');

const waitForProject = () =>
  waitFor(() =>
    expect(useSingleProjectStore.getState().singleProject).not.toBeNull()
  );

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
});
