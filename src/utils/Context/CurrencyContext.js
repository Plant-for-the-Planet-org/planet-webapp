import { createContext } from 'react';

const currencyContext = createContext({
  currency: 'EUR',
  setCurrency: (currency) => {},
});

export default currencyContext;
