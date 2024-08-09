export default function getStoredCurrency(fallbackCurrency = 'EUR') {
  let currencyCode = 'EUR';
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('currencyCode')) {
      currencyCode = localStorage.getItem('currencyCode') as string;
    } else {
      currencyCode = fallbackCurrency;
      //This should be based on tenant config
    }
  }
  return currencyCode;
}
