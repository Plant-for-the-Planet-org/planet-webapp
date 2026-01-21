import { useEffect } from 'react';
import { useCurrencyStore } from '../stores/currencyStore';
import { useApi } from './useApi';

export const useInitializeCurrency = () => {
  const { getApi } = useApi();
  const fetchCurrencies = useCurrencyStore((state) => state.fetchCurrencies);

  useEffect(() => {
    fetchCurrencies(getApi);
  }, [fetchCurrencies]);
};
