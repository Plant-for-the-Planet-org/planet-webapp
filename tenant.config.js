import planetConfig from './public/tenants/planet/config';
import planetConfigBeta from './public/tenants/planet/configBeta';
import ttcConfig from './public/tenants/ttc/config';
import salesforceConfig from './public/tenants/salesforce/config';
import sternConfig from './public/tenants/stern/config';
import nitrosbConfig from './public/tenants/nitrosb/config';
import lacoquetaConfig from './public/tenants/lacoqueta/config';
import energizerConfig from './public/tenants/energizer/config';
import senatDerWirtschaft from './public/tenants/senatDerWirtschaft/config';
import pampersConfig from './public/tenants/pampers/config';
import interactClub from './public/tenants/interactClub/config';
import culchacandela from './public/tenants/culchacandela/config';
import xiting from './public/tenants/xiting/config';
import ulmpflanzt from './public/tenants/ulmpflanzt/config';
import sitex from './public/tenants/sitex/config';
import T3pleset from './public/tenants/3pleset/config';
import treesforjane from './public/tenants/treesforjane/config';

export default function tenantConfig() {
  switch (process.env.TENANT) {
    case 'planet':
      return planetConfig;
    case 'planetbeta':
      return planetConfigBeta;
    case 'ttc':
      return ttcConfig;
    case 'salesforce':
      return salesforceConfig;
    case 'stern':
      return sternConfig;
    case 'nitrosb':
      return nitrosbConfig;
    case 'lacoqueta':
      return lacoquetaConfig;
    case 'energizer':
      return energizerConfig;
    case 'senatDerWirtschaft':
      return senatDerWirtschaft;
    case 'pampers':
      return pampersConfig;
    case 'interactClub':
      return interactClub;
    case 'culchacandela':
      return culchacandela;
    case 'xiting':
      return xiting;
    case 'ulmpflanzt':
      return ulmpflanzt;
    case 'sitex':
      return sitex;
    case '3pleset':
      return T3pleset;
    case 'treesforjane':
      return treesforjane;
    default:
      return planetConfig;
  }
}
