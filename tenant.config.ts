import { Tenant } from '@planet-sdk/common/build/types/tenant';

export const defaultTenant: Tenant = {
  id: 'ten_NxJq55pm',
  config: {
    appDomain: 'https://web.plant-for-the-planet.org/',
    externalUrl: 'https://web.plant-for-the-planet.org',
    customDomain: 'https://web.plant-for-the-planet.org',
    font: {
      primaryFontURL: null,
      secondaryFontURL: null,
      primaryFontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      secondaryFontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    },
    meta: {
      image:
        'https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg',
      title: 'Plant trees around the world - Plant-for-the-Planet',
      locale: 'en_US',
      appTitle: 'Plant for the Planet',
      description:
        "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
      twitterHandle: '',
    },
    slug: 'planet',
    header: {
      items: [
        { title: 'home', onclick: '/', visible: true, headerKey: 'home' },
        {
          title: 'aboutUs',
          onclick: 'https://www.plant-for-the-planet.org/',
          subMenu: [
            {
              title: 'overview',
              onclick: 'https://www.plant-for-the-planet.org/',
              visible: true,
            },
            {
              title: 'childrenAndYouth',
              onclick: 'https://www.plant-for-the-planet.org/children-youth/',
              visible: true,
            },
            {
              title: 'trillionTrees',
              onclick: 'https://www.plant-for-the-planet.org/trillion-trees/',
              visible: true,
            },
            {
              title: 'yucatan',
              onclick: 'https://www.plant-for-the-planet.org/yucatan/',
              visible: true,
            },
            {
              title: 'partners',
              onclick: 'https://www.plant-for-the-planet.org/partners/',
              visible: true,
            },
            {
              title: 'changeChocolate',
              onclick: 'https://www.plant-for-the-planet.org/change-chocolate/',
              visible: true,
            },
            {
              title: 'stopTalkingStartPlanting',
              onclick:
                'https://www.plant-for-the-planet.org/stop-talking-start-planting/',
              visible: true,
            },
          ],
          visible: true,
          headerKey: 'about',
        },
        {
          title: 'leaders',
          onclick: '/all',
          visible: true,
          headerKey: 'leaderboard',
        },
        {
          title: 'signIn',
          onclick: '/me',
          visible: true,
          headerKey: 'me',
          loggedInTitle: 'me',
        },
        {
          title: 'shop',
          onclick: 'https://thegoodshop.org',
          visible: false,
          headerKey: 'shop',
        },
      ],
      tenantLogoURL: 'https://cdn.plant-for-the-planet.org/logo/svg/planet.svg',
      tenantLogoLink: '/',
      isSecondaryTenant: false,
    },
    manifest: '/tenants/planet/manifest.json',
    languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR', 'cs'],
    tenantURL: 'web.plant-for-the-planet.org',
    tenantGoal: null,
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
    showUNEPLogo: true,
    showRedeemHint: true,
    darkModeEnabled: false,
    enableGuestSepa: false,
    fallbackCurrency: null,
    showUNDecadeLogo: true,
  },
  images: { featuredImage: null, bannerImage: null },
  name: 'Plant-for-the-Planet',
  description:
    'This Tenant is used for Beta version of the  Plant-for-the-Planet Web App. At the end of the beta period, all donations will be re-associated to the main Plant-for-the-Planet Tenant',
  topProjectsOnly: false,
  image: null,
  tenantGoal: 2147483647,
};
