import { Tenant, TenantConfig } from '@planet-sdk/common/build/types/tenant';

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
import weareams from './public/tenants/weareams/config';

// pass a param
export default function tenantConfig(tenant: string): TenantConfig {
  switch (tenant) {
    case 'planet':
      return planetConfig;
    case 'planetbeta': // Not sure if we'll use this in future, there is no current deployment for this tenant.
      return planetConfigBeta;
    case 'ttc':
      return ttcConfig;
    case 'salesforce':
      return salesforceConfig;
    case 'stern': // The current status in White Label Tenant Apps table in notion for this tenant is stoped.
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
    case 'weareams':
      return weareams;
    default:
      return planetConfig;
  }
}

export const defaultTenant: Tenant = {
  id: 'ten_NxJq55pm',
  config: {
    appDomain: 'https://www1.plant-for-the-planet.org',
    slug: 'planet',
    tenantURL: 'www.plant-for-the-planet.org',
    tenantGoal: null,
    showUNEPLogo: true,
    showUNDecadeLogo: true,
    showRedeemHint: true,
    enableGuestSepa: false,
    darkModeEnabled: false,
    font: {
      primaryFontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      secondaryFontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    },
    languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR', 'cs'],
    header: {
      isSecondaryTenant: false,
      tenantLogoURL: 'https://cdn.plant-for-the-planet.org/logo/svg/planet.svg',
      tenantLogoLink: '/',
      items: {
        home: {
          title: 'home',
          onclick: '/',
          visible: true,
        },
        about: {
          title: 'aboutUs',
          onclick: 'https://a.plant-for-the-planet.org/',
          visible: true,
          subMenu: [
            {
              title: 'overview',
              onclick: 'https://a.plant-for-the-planet.org/',
              visible: true,
            },
            {
              title: 'childrenAndYouth',
              onclick: 'https://a.plant-for-the-planet.org/children-youth/',
              visible: true,
            },
            {
              title: 'trillionTrees',
              onclick: 'https://a.plant-for-the-planet.org/trillion-trees/',
              visible: true,
            },
            {
              title: 'yucatan',
              onclick: 'https://a.plant-for-the-planet.org/yucatan/',
              visible: true,
            },
            {
              title: 'partners',
              onclick: 'https://a.plant-for-the-planet.org/partners/',
              visible: true,
            },
            {
              title: 'changeChocolate',
              onclick: 'https://a.plant-for-the-planet.org/change-chocolate/',
              visible: true,
            },
            {
              title: 'stopTalkingStartPlanting',
              onclick:
                'https://a.plant-for-the-planet.org/stop-talking-start-planting/',
              visible: true,
            },
          ],
        },
        leaderboard: {
          title: 'leaders',
          onclick: '/all',
          visible: true,
        },
        me: {
          title: 'signIn',
          loggedInTitle: 'me',
          onclick: '/me',
          visible: true,
        },
        shop: {
          title: 'shop',
          onclick: 'https://thegoodshop.org',
          visible: true,
        },
      },
    },
    meta: {
      title: 'Plant trees around the world - Plant-for-the-Planet',
      appTitle: 'Plant for the Planet',
      description:
        "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
      image:
        'https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg',
      twitterHandle: '@trilliontrees',
      locale: 'en_US',
    },
    footerLinks: [
      'shop',
      'privacy',
      'terms',
      'imprint',
      'contact',
      'downloads',
      'annualReports',
      'team',
      'jobs',
      'supportUs',
      'blogs',
      'faqs',
    ],
    manifest: '/tenants/planet/manifest.json',
  },
  images: {
    featuredImage: null,
    bannerImage: null,
  },
  name: 'Plant-for-the-Planet',
  description:
    'This Tenant is used for Beta version of the  Plant-for-the-Planet Web App. At the end of the beta period, all donations will be re-associated to the main Plant-for-the-Planet Tenant',
  image: null,
  tenantGoal: null,
};
