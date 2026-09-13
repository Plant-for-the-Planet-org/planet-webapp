import type { CurrencyCode, APIError } from '@planet-sdk/common';
import type { ApiRequestFn } from '../hooks/useApi';

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
   * Whether `currencyCode` has been resolved against `localStorage`.
   *
   * `currencyCode` starts at a placeholder `'EUR'`, which is indistinguishable
   * from a real choice, so callers that key requests on currency must wait for
   * this rather than reading the code straight away. `initializeCurrencyCode`
   * sets it in every browser path, including when nothing is stored and the
   * placeholder turns out to be the answer.
   */
  isCurrencyResolved: boolean;
  isFetching: boolean;

  fetchSupportedCurrencies: (
    getApi: ApiRequestFn
  ) => Promise<void>;
  setCurrencyCode: (code: CurrencyCode) => void;
  initializeCurrencyCode: () => void;
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

      setCurrencyCode: (code) => set({ currencyCode: code }),

      initializeCurrencyCode: () => {
        if (typeof window === 'undefined') return;

        let storedCurrency: CurrencyCode | null = null;
        try {
          storedCurrency = localStorage.getItem(
            'currencyCode'
          ) as CurrencyCode | null;
        } catch {
          // Storage can be blocked outright in a cross-origin embed, keep the default currency in this case
        }

        // Resolve either way. Nothing stored, or no readable storage, means the initial `'EUR'` is the answer. Callers gate their fetches on this, so leaving it false would mean never fetching at all.
        set(
          {
            isCurrencyResolved: true,
            ...(storedCurrency ? { currencyCode: storedCurrency } : {}),
          },
          undefined,
          'currencyStore/initialize_currency_code'
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
