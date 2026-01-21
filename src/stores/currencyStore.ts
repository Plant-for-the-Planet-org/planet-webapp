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
  supportedCurrencies: Set<CurrencyCode> | null;
  fetchAttempts: number;

  fetchCurrencies: (
    getApi: <T>(url: string, config?: ApiConfigBase) => Promise<T>
  ) => void;
}

const MAX_FETCH_ATTEMPTS = 2;

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    (set, get) => ({
      supportedCurrencies: null,
      fetchAttempts: 0,

      fetchCurrencies: async (getApi) => {
        const { supportedCurrencies, fetchAttempts } = get();
        const { setErrors } = useErrorHandlingStore.getState();

        if (supportedCurrencies !== null || fetchAttempts >= MAX_FETCH_ATTEMPTS)
          return;

        try {
          const currencyData = await getApi<CurrencyList>('/app/currencies');

          set(
            {
              fetchAttempts: fetchAttempts + 1,
              supportedCurrencies: new Set(
                Object.keys(currencyData) as CurrencyCode[]
              ),
            },
            undefined,
            'currencyStore/set_support_currency'
          );
        } catch (err) {
          setErrors(handleError(err as APIError));
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
