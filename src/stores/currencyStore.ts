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
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>
  ) => void;
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

        const storedCurrency = localStorage.getItem(
          'currencyCode'
        ) as CurrencyCode | null;

        // Nothing stored, so the initial `'EUR'` stands. Still resolved.
        if (!storedCurrency) {
          set(
            { isCurrencyResolved: true },
            undefined,
            'currencyStore/currency_code_resolved'
          );
          return;
        }

        set(
          { currencyCode: storedCurrency, isCurrencyResolved: true },
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
