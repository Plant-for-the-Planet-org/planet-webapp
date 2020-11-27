import tenantConfig from '../../../tenant.config';

const config = tenantConfig();

export default function getStoredConfig(key: string) {
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
