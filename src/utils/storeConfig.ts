import getsessionId from './apiRequests/getSessionId';
import countriesData from '../utils/countryCurrency/countriesData.json';
import { TENANT_ID } from './constants/environment';

export async function storeConfig() {
  let userLang;
  if (localStorage) {
    userLang = localStorage.getItem('language') || 'en';
  } else {
    userLang = 'en';
  }
  await fetch(`${process.env.CONFIG_URL}`, {
    headers: {
      'tenant-key': `${TENANT_ID}`,
      'X-SESSION-ID': await getsessionId(),
    },
  })
    .then(async (res) => {
      const config = await res.json();
      localStorage.setItem('config', JSON.stringify(config));
      const countryCode = localStorage.getItem('countryCode');
      const found = countriesData.some(
        (arrayCountry) =>
          arrayCountry.countryCode?.toUpperCase() ===
          config.country.toUpperCase()
      );
      if (!countryCode || !found) {
        if (found) {
          localStorage.setItem('countryCode', config.country);
        } else {
          localStorage.setItem('countryCode', 'DE');
        }
      }
      if (!localStorage.getItem('currencyCode')) {
        localStorage.setItem('currencyCode', config.currency);
      }
    })
    .catch((err) => console.log(`Something went wrong: ${err}`));
}

export function getStoredConfig(key: string) {
  let storedConfig;
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('config')) {
      storedConfig = JSON.parse(localStorage.getItem('config'));
      if (storedConfig) {
        switch (key) {
          case 'clientIp':
            if (storedConfig.clientIp) {
              return storedConfig.clientIp;
            } else {
              return null;
            }
          case 'country':
            if (storedConfig.country) {
              return storedConfig.country;
            } else {
              return null;
            }
          case 'currency':
            if (storedConfig.currency) {
              return storedConfig.currency;
            } else {
              return null;
            }
          case 'loc':
            if (storedConfig.loc) {
              return storedConfig.loc;
            } else {
              return null;
            }
          default:
            return null;
        }
      }
    } else {
      return null;
    }
  }
  return null;
}
