import getsessionId from './apiRequests/getSessionId';
import countriesData from '../utils/countryCurrency/countriesData.json';
import { Tenant } from '@planet-sdk/common/build/types/tenant';

export async function storeConfig(tenantConfig: Tenant) {
  await fetch(`${process.env.CONFIG_URL}`, {
    headers: {
      'tenant-key': `${tenantConfig?.id}`,
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
    const jsonConfig = localStorage.getItem('config');
    if (jsonConfig) {
      storedConfig = JSON.parse(jsonConfig);
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
