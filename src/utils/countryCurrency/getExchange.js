import countryExchange from './countryExchange.json';

export const getMinimumAmountForCurrency = (curreny) => {
  const exchange = countryExchange.find((element) => element.currencyCode === curreny);
  return (Math.round(exchange.value) * 2);
};
