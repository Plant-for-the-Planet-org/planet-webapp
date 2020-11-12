const config = {
  tenantName: 'planetbeta',
  tenantURL: 'beta.plant-for-the-planet.org',
  tenantLogoURL: 'https://www.plant-for-the-planet.org',
  languages: ['en', 'de'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: 'https://www.plant-for-the-planet.org',
    items: [
      {
        id: 1,
        title: 'home',
        onclick: '/home',
        visible: false,
        key: 'home',
      },
      {
        id: 2,
        title: 'home',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 3,
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
        key: 'leaderboard',
      },

      {
        id: 4,
        title: 'me',
        onclick: '/me',
        visible: false,
        key: 'me',
      },
    ],
  },
  meta: {
    title: 'Plant trees around the world - Plant-for-the-Planet',
    description:
      "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@pftp_int',
    locale: 'en_US',
  },
};

export default config;
