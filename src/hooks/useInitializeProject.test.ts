import type { Page } from '../stores/viewStore';

import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrencyStore, useProjectStore } from '../stores';
import {
  createMapProject,
  createMockRouter,
  requestsTo,
  resetAllStores,
} from '../test-utils';
import { useInitializeProject } from './useInitializeProject';

const { getApi } = vi.hoisted(() => ({ getApi: vi.fn() }));

vi.mock('next/router', () => ({ useRouter: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('./useApi', () => ({ useApi: () => ({ getApi }) }));

const PATHNAMES: Record<NonNullable<Page>, string> = {
  'project-list': '/sites/[slug]/[locale]',
  'project-details': '/sites/[slug]/[locale]/[p]',
};

const renderOnPage = (page: NonNullable<Page>) => {
  vi.mocked(useRouter).mockReturnValue(
    createMockRouter({ pathname: PATHNAMES[page] })
  );
  renderHook(() => useInitializeProject());
};

// Mirrors app start-up: use the saved currency if there is one, otherwise settle it the way storeConfig does when its config request fails, which keeps the default currency EUR.
// Blocked storage takes the same path, since storeConfig's session lookup reads storage first and throws.
const resolveCurrency = () =>
  act(() => {
    useCurrencyStore.getState().initializeCurrencyCode();
    useCurrencyStore.getState().resolveGeoCurrencyCode(null);
  });

const requestedCurrencies = () =>
  requestsTo(getApi, '/app/projects').map(
    ([, config]) => config.queryParams.currency
  );

const waitForFetchWith = (currency: string) =>
  waitFor(() =>
    expect(useProjectStore.getState().lastFetch?.currency).toBe(currency)
  );

describe('useInitializeProject', () => {
  beforeEach(() => {
    resetAllStores();
    localStorage.clear();
    getApi.mockResolvedValue([createMapProject('yucatan')]);
  });

  it('waits for the stored currency to resolve, then fetches once with it', async () => {
    localStorage.setItem('currencyCode', 'USD');
    renderOnPage('project-list');

    expect(getApi).not.toHaveBeenCalled();

    resolveCurrency();
    await waitForFetchWith('USD');

    expect(requestedCurrencies()).toEqual(['USD']);
  });

  it('waits for the config request when no currency is stored', () => {
    renderOnPage('project-list');
    act(() => useCurrencyStore.getState().initializeCurrencyCode());

    expect(getApi).not.toHaveBeenCalled();
  });

  it('fetches once with default currency (EUR) when no currency is stored and config request fails', async () => {
    renderOnPage('project-list');
    resolveCurrency();
    await waitForFetchWith('EUR');

    expect(requestedCurrencies()).toEqual(['EUR']);
  });

  // #3011: in a cross-origin embed every storage access throws, so no currency is read and storeConfig's catch resolves to EUR. The list must still load.
  it('fetches once with EUR when storage is blocked, as in a cross-origin embed', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    renderOnPage('project-list');
    resolveCurrency();
    await waitForFetchWith('EUR');

    expect(requestedCurrencies()).toEqual(['EUR']);
  });

  it('fetches again, once, for each currency change', async () => {
    renderOnPage('project-list');
    resolveCurrency();
    await waitForFetchWith('EUR');

    act(() => useCurrencyStore.getState().setCurrencyCode('USD'));
    await waitForFetchWith('USD');
    act(() => useCurrencyStore.getState().setCurrencyCode('GBP'));
    await waitForFetchWith('GBP');

    expect(requestedCurrencies()).toEqual(['EUR', 'USD', 'GBP']);
  });

  it('does not fetch the list away from the project list page', () => {
    renderOnPage('project-details');
    resolveCurrency();

    expect(getApi).not.toHaveBeenCalled();
  });
});
