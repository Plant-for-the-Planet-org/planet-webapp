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
  isFetching: boolean;

  fetchCurrencies: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>
  ) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    (set, get) => ({
      supportedCurrencies: new Set<CurrencyCode>(),
      isFetching: false,

      fetchCurrencies: async (getApi) => {
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
    }),
    {
      name: 'CurrencyStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);
