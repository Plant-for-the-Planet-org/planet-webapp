import planetConfig from './public/tenants/planet/config';
import planetConfigBeta from './public/tenants/planet/configBeta';
import ttcConfig from './public/tenants/ttc/config';
import salesforceConfig from './public/tenants/salesforce/config';
import sternConfig from './public/tenants/stern/config';
import nitrosbConfig from './public/tenants/nitrosb/config';
import lacoquetaConfig from './public/tenants/lacoqueta/config';
import energizerConfig from './public/tenants/energizer/config';
import senatDerWirtschaft from './public/tenants/senatDerWirtschaft/config';

export default function tenantConfig() {
  switch (process.env.TENANT) {
    case 'planet': return planetConfig;
    case 'planetbeta': return planetConfigBeta;
    case 'ttc': return ttcConfig;
    case 'salesforce': return salesforceConfig;
    case 'stern': return sternConfig;
    case 'nitrosb': return nitrosbConfig;
    case 'lacoqueta': return lacoquetaConfig;
    case 'energizer': return energizerConfig;
    case 'senatDerWirtschaft': return senatDerWirtschaft;
    default: return planetConfig;
  }
}
