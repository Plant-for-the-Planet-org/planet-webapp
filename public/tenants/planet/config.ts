 const config = {
  // name of tenant
  tenantName: 'planet',
  // url of tenant home page
  tenantURL: 'www.plant-for-the-planet.org',
  tenantGoal: null,
  showUNEPLogo: true,
  showUNDecadeLogo: true,
  showRedeemHint: true,
  enableGuestSepa: false,
  darkModeEnabled: false,
  // font family and it's property particular to tenant
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR','cs'],
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/',
        visible: true,
      },
      // donate: {
      //   title: 'home',
      //   onclick: '/',
      //   visible: true,
      // },
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
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
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
};

export default config;