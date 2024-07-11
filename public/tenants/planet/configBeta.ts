const config = {
  tenantName: 'planetbeta',
  tenantURL: 'beta.plant-for-the-planet.org',
  tenantLogoURL: 'https://www.plant-for-the-planet.org',
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  showUNEPLogo: true,
  showUNDecadeLogo: true,
  showRedeemHint: true,
  enableGuestSepa: false,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: 'https://www.plant-for-the-planet.org',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: false,
      },
      donate: {
        title: 'home',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://www.plant-for-the-planet.org/',
        visible: true,
      },
      leaderboard: {
        title: 'leaders',
        onclick: '/all',
        visible: true,
      },
      me: {
        title: 'me',
        onclick: '/me',
        visible: true,
      },
    },
  },
  meta: {
    title: 'Plant trees around the world - Plant-for-the-Planet',
    description:
      "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
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
};

export default config;
