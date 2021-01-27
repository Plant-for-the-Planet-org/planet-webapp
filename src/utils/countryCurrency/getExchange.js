import countryExchange from './countryExchangeForMinimumDonationAmount.json';

export const getMinimumAmountForCurrency = (curreny) => {
  const exchange = countryExchange.find((element) => element.currencyCode === curreny);
  if (exchange)
    return (Math.round(exchange.value) * 2);
  else 
    return -1;
};
