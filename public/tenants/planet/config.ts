const config = {
  tenantName: 'planet',
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
    tenantLogoURL: `https://cdn.plant-for-the-planet.org/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://www.plant-for-the-planet.org/',
        visible: true,
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
            onclick: 'https://www.plant-for-the-planet.org/chocolate/',
            visible: true,
          },
          {
            title: 'stopTalkingStartPlanting',
            onclick:
              'https://www.plant-for-the-planet.org/stop-talking-start-planting/',
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
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
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
};

export default config;
