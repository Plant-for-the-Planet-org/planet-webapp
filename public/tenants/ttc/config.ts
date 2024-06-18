const config = {
  tenantName: 'ttc',
  tenantURL: 'trilliontreecampaign.org',
  tenantLogoURL: 'https://www.trilliontreecampaign.org',
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR', 'cs'],
  fallbackCurrency: 'EUR',
  tenantGoal: 1000000000000,
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
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/ttc/logo.png`,
    tenantLogoLink: 'https://www.trilliontreecampaign.org',
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
        visible: false,
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
    },
  },
  meta: {
    title: "Together let's plant a Trillion Trees!",
    appTitle: 'Trillion Tree Campaign',
    description:
      "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
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
  manifest: '/tenants/ttc/manifest.json',
};

export default config;
