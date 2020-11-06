const config = {
  tenantName: 'nitrosb',
  tenantURL: 'forest.nitrosnowboards.com',
  languages: ['en'],
  fallbackCurrency: 'EUR',
  tenantGoal:0,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  meta: {
    title: 'Nitro Snowboards ❤️ Trees',
    description:
      'Nitro Snowboards set a goal to support and mobilize the conservation, restoration, and growth of a forest.',
    image: `/tenants/nitrosb/background.jpeg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/nitrosb/logo.svg`,
    tenantLogoLink: 'https://www.nitrosnowboards.com',
    items: [
      {
        id: 1,
        title: 'home',
        onclick: '/home',
        visible: true,
        key: 'home',
      },
      {
        id: 2,
        title: 'plant',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 3,
        title: 'leaderboard',
        onclick: '/leaderboard',
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
};

export default config;
