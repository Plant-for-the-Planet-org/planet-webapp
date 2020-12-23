import countryExchange from './countryExchange.json';

export const getExchangeValue = (curreny) => {
  const exchange = countryExchange.find((element) => element.currencyCode === curreny);
  return exchange.value;
};
