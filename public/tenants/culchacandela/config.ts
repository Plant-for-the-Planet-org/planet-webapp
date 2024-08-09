const config = {
  tenantName: 'culchacandela',
  tenantURL: 'wald.culchacandela.de',
  languages: ['en', 'de'],
  fallbackCurrency: 'EUR',
  tenantGoal: 77700,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  meta: {
    title: 'STOP TALKING. START PLANTING',
    description: 'Culcha Candela X Plant-for-the-Planet',
    image: `/tenants/culchacandela/background.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `/tenants/culchacandela/background.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/culchacandela/logo.png`,
    tenantLogoLink: 'https://www.culchacandela.de/',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: true,
      },
      donate: {
        title: 'plant',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://www.plant-for-the-planet.org/',
        visible: false,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me: {
        title: 'me',
        onclick: '/me',
        visible: false,
      },
    },
  },
  footerLinks: ['privacy', 'terms', 'imprint', 'contact', 'supportUs'],
};

export default config;
