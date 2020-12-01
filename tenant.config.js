import sternConfig from './public/tenants/stern/config';
import nitrosbConfig from './public/tenants/nitrosb/config';
import planetConfig from './public/tenants/planet/config';
import salesforceConfig from './public/tenants/salesforce/config';
import planetConfigBeta from './public/tenants/planet/configBeta';
import energizerConfig from './public/tenants/energizer/config';
import lacoquetaConfig from './public/tenants/lacoqueta/config';

export default function tenantConfig() {
  switch (process.env.TENANT) {
    case 'planet': return planetConfig;
    case 'energizer': return energizerConfig;
    case 'stern': return sternConfig;
    case 'nitrosb': return nitrosbConfig;
    case 'salesforce': return salesforceConfig;
    case 'planetbeta': return planetConfigBeta;
    case 'lacoqueta': return lacoquetaConfig;
    default: return planetConfig;
  }
}
