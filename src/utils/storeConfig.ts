import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { CurrencyCode } from '@planet-sdk/common';

import getsessionId from './apiRequests/getSessionId';
import countriesData from '../utils/countryCurrency/countriesData.json';
import { useCurrencyStore } from '../stores/currencyStore';

export async function storeConfig(tenantConfig: Tenant) {
  const { resolveGeoCurrencyCode } = useCurrencyStore.getState();

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

      // Piggyback on this same fetch for the geo-detected currency rather than
      // firing a second request. Only used when nothing is stored yet; a
      // stored or explicitly selected currency always takes precedence.
      let geoCurrencyCode: CurrencyCode | null = null;
      if (!localStorage.getItem('currencyCode') && config.currency) {
        geoCurrencyCode = config.currency as CurrencyCode;
        localStorage.setItem('currencyCode', geoCurrencyCode);
      }
      resolveGeoCurrencyCode(geoCurrencyCode);
    })
    .catch((err) => {
      console.log(`Something went wrong: ${err}`);
      // A missing/failed geo response must still unblock currency-dependent
      // requests, falling back to the default currency rather than stalling.
      resolveGeoCurrencyCode(null);
    });
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
