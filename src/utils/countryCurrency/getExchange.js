import countryExchange from './countryExchangeForMinimumDonationAmount.json';

export const getMinimumAmountForCurrency = (currency) => {
  const exchange = countryExchange.find((element) => element.currencyCode === currency);
  if (exchange)
    return (exchange.value * 2);
  else
    return -1;
};
