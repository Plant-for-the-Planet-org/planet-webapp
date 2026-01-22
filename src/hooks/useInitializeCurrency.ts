import { useEffect } from 'react';
import { useCurrencyStore } from '../stores/currencyStore';
import { useApi } from './useApi';

export const useInitializeCurrency = () => {
  const { getApi } = useApi();
  // store: action
  const fetchSupportedCurrencies = useCurrencyStore(
    (state) => state.fetchSupportedCurrencies
  );
  const initializeCurrencyCode = useCurrencyStore(
    (state) => state.initializeCurrencyCode
  );

  useEffect(() => {
    fetchSupportedCurrencies(getApi);
  }, [fetchSupportedCurrencies]);

  useEffect(() => {
    initializeCurrencyCode();
  }, [initializeCurrencyCode]);
};
