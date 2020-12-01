import { createContext } from 'react';

const currencyContext = createContext({
  currency: 'USD',
  setCurrency: (currency) => {},
});

export default currencyContext;
