import sternConfig from './public/tenants/stern/config';
import planetConfig from './public/tenants/planet/config';
import salesforceConfig from './public/tenants/salesforce/config';
import planetConfigBeta from './public/tenants/planet/configBeta';

export default function tenantConfig() {
  switch (process.env.TENANT) {
    case 'planet': return planetConfig;
    case 'stern': return sternConfig;
    case 'salesforce': return salesforceConfig;
    case 'planetbeta': return planetConfigBeta;
    default: return planetConfig;
  }
}
