const config = {
  tenantName: 'nitrosb',
  tenantURL: 'forest.nitrosnowboards.com',
  languages: ['en'],
  fallbackCurrency: 'EUR',
  tenantGoal:1000000,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
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
