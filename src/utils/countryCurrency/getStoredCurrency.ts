import tenantConfig from '../../../tenant.config';

const config = tenantConfig();

export default function getStoredCurrency() {
  let currencyCode = 'EUR';
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('currencyCode')) {
      currencyCode = localStorage.getItem('currencyCode') as string;
    } else {
      currencyCode = config.fallbackCurrency ? config.fallbackCurrency : 'EUR';
      //This should be based on tenant config
    }
  }
  return currencyCode;
}
