import { useEffect } from 'react';
import { useCurrencyStore } from '../stores/currencyStore';
import { useApi } from './useApi';

export const useInitializeCurrency = () => {
  const { getApi } = useApi();
  // store: action
  const fetchCurrencies = useCurrencyStore((state) => state.fetchCurrencies);
  const initializeCurrencyCode = useCurrencyStore(
    (state) => state.initializeCurrencyCode
  );

  useEffect(() => {
    fetchCurrencies(getApi);
  }, [fetchCurrencies]);

  useEffect(() => {
    initializeCurrencyCode();
  }, [initializeCurrencyCode]);
};
