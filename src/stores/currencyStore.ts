import type { ApiConfigBase } from '../hooks/useApi';
import type { CurrencyCode, APIError } from '@planet-sdk/common';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useErrorHandlingStore } from './errorHandlingStore';
import { handleError } from '@planet-sdk/common';

type CurrencyList = {
  [key in CurrencyCode]?: string;
};

interface CurrencyStore {
  supportedCurrencies: Set<CurrencyCode>;
  currencyCode: CurrencyCode;
  /**
   * Whether `currencyCode` is settled and safe to key requests on.
   *
   * `currencyCode` starts at a placeholder `'EUR'`, which is indistinguishable
   * from a real choice, so callers that key requests on currency must wait for
   * this rather than reading the code straight away. It becomes `true` as soon
   * as one of these settles: a stored `localStorage` value (`initializeCurrencyCode`),
   * an explicit user selection (`setCurrencyCode`), or the geo-lookup piggybacked
   * on the tenant config fetch, success or failure (`resolveGeoCurrencyCode`,
   * called from `storeConfig`). On a first visit with nothing stored, this stays
   * `false` until the geo lookup settles, so no request goes out with the EUR
   * placeholder.
   */
  isCurrencyResolved: boolean;
  isFetching: boolean;

  fetchSupportedCurrencies: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>
  ) => void;
  setCurrencyCode: (code: CurrencyCode) => void;
  initializeCurrencyCode: () => void;
  resolveGeoCurrencyCode: (code: CurrencyCode | null) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    (set, get) => ({
      supportedCurrencies: new Set<CurrencyCode>(),
      currencyCode: 'EUR',
      isCurrencyResolved: false,
      isFetching: false,

      fetchSupportedCurrencies: async (getApi) => {
        const { supportedCurrencies, isFetching } = get();

        if (isFetching || supportedCurrencies.size > 0) return;

        set({ isFetching: true }, undefined, 'currencyStore/fetch_start');
        try {
          const currencyData = await getApi<CurrencyList>('/app/currencies');

          set(
            {
              supportedCurrencies: new Set(
                Object.keys(currencyData) as CurrencyCode[]
              ),
            },
            undefined,
            'currencyStore/fetch_success'
          );
        } catch (err) {
          useErrorHandlingStore
            .getState()
            .setErrors(handleError(err as APIError));
        } finally {
          set({ isFetching: false }, undefined, 'currencyStore/fetch_complete');
        }
      },

      setCurrencyCode: (code) =>
        set(
          { currencyCode: code, isCurrencyResolved: true },
          undefined,
          'currencyStore/set_currency_code'
        ),

      initializeCurrencyCode: () => {
        if (typeof window === 'undefined') return;

        let storedCurrency: CurrencyCode | null = null;
        try {
          storedCurrency = localStorage.getItem(
            'currencyCode'
          ) as CurrencyCode | null;
        } catch {
          // Storage can be blocked outright in a cross-origin embed. `resolveGeoCurrencyCode`
          // still resolves this to the default once `storeConfig`'s fetch settles.
        }

        // Resolve immediately only when a stored or explicitly selected currency exists.
        // Otherwise, wait for `resolveGeoCurrencyCode` to avoid using the EUR placeholder.
        if (!storedCurrency) return;

        set(
          { isCurrencyResolved: true, currencyCode: storedCurrency },
          undefined,
          'currencyStore/initialize_currency_code'
        );
      },

      resolveGeoCurrencyCode: (code) => {
        // A stored value or an explicit selection already resolved this in the
        // meantime, the geo lookup is stale and must not override it.
        if (get().isCurrencyResolved) return;

        set(
          {
            isCurrencyResolved: true,
            ...(code ? { currencyCode: code } : {}),
          },
          undefined,
          'currencyStore/resolve_geo_currency_code'
        );
      },
    }),
    {
      name: 'CurrencyStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
