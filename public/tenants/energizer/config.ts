const config = {
  tenantName: 'energizer',
  tenantURL: 'wald.energizer.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  meta: {
    title: 'Energizer ❤️ Baeume',
    description:
      'Mit Plant-for-the-Planet pflanzen wir weltweit Bäume. So entsteht unser globaler EnergizerWald.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    title: 'Energizer ❤️ Baeume',
    description:
      'Mit Plant-for-the-Planet pflanzen wir weltweit Bäume. So entsteht unser globaler EnergizerWald.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/energizer/logo.svg`,
    tenantLogoLink: 'https://www.energizer.de',
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
