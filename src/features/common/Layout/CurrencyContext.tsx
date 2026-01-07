import type { APIError, CurrencyCode } from '@planet-sdk/common';
import type { ReactNode } from 'react';

import { handleError } from '@planet-sdk/common';
import { createContext, useState, useContext, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

type CurrencyList = {
  [key in CurrencyCode]?: string;
};

interface CurrencyContextInterface {
  supportedCurrencies: Set<CurrencyCode> | null;
}

const CurrencyContext = createContext<CurrencyContextInterface | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { getApi } = useApi();
  const [supportedCurrencies, setSupportedCurrencies] =
    useState<Set<CurrencyCode> | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  //store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const MAX_FETCH_TRIES = 2;

  const fetchCurrencies = async () => {
    try {
      const currencyData = await getApi<CurrencyList>('/app/currencies');
      setFetchCount(fetchCount + 1);
      setSupportedCurrencies(
        new Set(Object.keys(currencyData) as CurrencyCode[])
      );
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  useEffect(() => {
    if (supportedCurrencies === null && fetchCount < MAX_FETCH_TRIES) {
      fetchCurrencies();
    }
  }, [supportedCurrencies]);

  return (
    <CurrencyContext.Provider
      value={{
        supportedCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextInterface => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('CurrencyContext must be used within CurrencyProvider');
  }
  return context;
};
