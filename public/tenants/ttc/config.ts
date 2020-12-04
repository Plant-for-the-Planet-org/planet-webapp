const config = {
  tenantName: 'ttc',
  tenantURL: 'trilliontreecampaign.org',
  tenantLogoURL: 'https://www.trilliontreecampaign.org',
  languages: ['en', 'de'],
  fallbackCurrency: 'EUR',
  tenantGoal:1000000000000,
  showUNEPLogo:true,
  showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/ttc/logo.png`,
    tenantLogoLink: 'https://www.trilliontreecampaign.org',
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
        visible: true,
        key: 'leaderboard',
      },

      {
        id: 4,
        title: 'me',
        onclick: '/me',
        visible: true,
        key: 'me',
      },
    ],
  },
  meta: {
    title: "Together let's plant a Trillion Trees!",
    description:
      "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@pftp_int',
    locale: 'en_US',
  },
};

export default config;
