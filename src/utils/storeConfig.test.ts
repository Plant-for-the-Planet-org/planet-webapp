import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrencyStore } from '../stores/currencyStore';
import { resetAllStores } from '../test-utils';
import { storeConfig } from './storeConfig';

const TENANT = { id: 'ten_NxJq55pm' } as Tenant;

const mockConfigResponse = (config: { country: string; currency: string }) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ json: () => Promise.resolve(config) })
  );
};

const currency = () => {
  const { isCurrencyResolved, currencyCode } = useCurrencyStore.getState();
  return { isCurrencyResolved, currencyCode };
};

describe('storeConfig currency', () => {
  beforeEach(() => {
    resetAllStores();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // #3011: in a cross-origin embed every storage access throws. The currency must still resolve, or the project pages never fetch.
  it('resolves to EUR when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    await storeConfig(TENANT);

    expect(currency()).toEqual({
      isCurrencyResolved: true,
      currencyCode: 'EUR',
    });
  });

  it('resolves to EUR when the config request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await storeConfig(TENANT);

    expect(currency()).toEqual({
      isCurrencyResolved: true,
      currencyCode: 'EUR',
    });
  });

  it('resolves to the config currency and saves it when none is stored', async () => {
    mockConfigResponse({ country: 'US', currency: 'USD' });

    await storeConfig(TENANT);

    expect(currency()).toEqual({
      isCurrencyResolved: true,
      currencyCode: 'USD',
    });
    expect(localStorage.getItem('currencyCode')).toBe('USD');
  });
});
