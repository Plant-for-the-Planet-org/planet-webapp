import type { Page } from '../stores/viewStore';

import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrencyStore, useProjectStore, useViewStore } from '../stores';
import {
  callsTo,
  createMapProject,
  createMockRouter,
  resetAllStores,
} from '../test-utils';
import { useInitializeProject } from './useInitializeProject';

const { getApi } = vi.hoisted(() => ({ getApi: vi.fn() }));

vi.mock('next/router', () => ({ useRouter: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('./useApi', () => ({ useApi: () => ({ getApi }) }));

const renderOnPage = (page: Page) => {
  useViewStore.setState({ page });
  vi.mocked(useRouter).mockReturnValue(createMockRouter());
  renderHook(() => useInitializeProject());
};

// What `useInitializeCurrency` does on mount in the browser.
const resolveCurrency = () =>
  act(() => useCurrencyStore.getState().initializeCurrencyCode());

const requestedCurrencies = () =>
  callsTo(getApi, '/app/projects').map(
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

  it('waits for the stored currency, then fetches once with it', async () => {
    localStorage.setItem('currencyCode', 'USD');
    renderOnPage('project-list');

    expect(getApi).not.toHaveBeenCalled();

    resolveCurrency();
    await waitForFetchWith('USD');

    expect(requestedCurrencies()).toEqual(['USD']);
  });

  it('fetches once with EUR when no currency is stored', async () => {
    renderOnPage('project-list');
    resolveCurrency();
    await waitForFetchWith('EUR');

    expect(requestedCurrencies()).toEqual(['EUR']);
  });

  // #3011: reading blocked storage used to throw before the currency was marked resolved, so no request ever went out.
  it('fetches once with EUR when storage is blocked, as in a cross-origin embed', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    renderOnPage('project-list');
    resolveCurrency();
    await waitForFetchWith('EUR');

    expect(requestedCurrencies()).toEqual(['EUR']);
  });

  it('fetches once more for each currency change', async () => {
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
