import { Tenant } from '@planet-sdk/common/build/types/tenant';

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
      items: [
        {
          title: 'home',
          onclick: '/',
          visible: true,
          headerKey: 'home',
        },
        {
          title: 'shop',
          onclick: 'https://thegoodshop.org',
          visible: true,
          headerKey: 'shop',
        },
        {
          title: 'aboutUs',
          onclick: 'https://a.plant-for-the-planet.org/',
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
      ],
    },
    meta: {
      title: 'Plant trees around the world - Plant-for-the-Planet',
      appTitle: 'Plant for the Planet',
      description:
        "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
      image:
        'https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg',
      twitterHandle: '',
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
