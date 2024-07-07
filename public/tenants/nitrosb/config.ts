const config = {
  tenantName: 'nitrosb',
  tenantURL: 'forest.nitrosnowboards.com',
  languages: ['en'],
  fallbackCurrency: 'EUR',
  tenantGoal: 1000000,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  meta: {
    title: 'Nitro Snowboards ❤️ Trees',
    description:
      'Nitro Snowboards set a goal to support and mobilize the conservation, restoration, and growth of a forest.',
    image: `/tenants/nitrosb/background.jpeg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  home: {
    image: `/tenants/nitrosb/background.jpeg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/nitrosb/logo.svg`,
    tenantLogoLink: 'https://www.nitrosnowboards.com',
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
