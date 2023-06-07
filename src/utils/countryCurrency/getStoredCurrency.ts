import tenantConfig from '../../../tenant.config';

const config = tenantConfig();

export default function getStoredCurrency() {
  let currencyCode;
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('currencyCode')) {
      currencyCode = localStorage.getItem('currencyCode');
    } else {
      currencyCode =
        (config as { fallbackCurrency?: string }).fallbackCurrency || 'EUR';
      //This should be based on tenant config
    }
  }
  return currencyCode;
}
