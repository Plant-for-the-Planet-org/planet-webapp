const config = {
  tenantName: 'stern',
  tenantURL: 'baeume.stern.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:1000000,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  meta: {
    title: 'Stern ❤️ Baeume',
    description:
      'Mit Plant-for-the-Planet pflanzen wir weltweit Bäume. So entsteht unser globaler sternWald. Pro verkauftem Exemplar der KeinGradWeiter-Ausgabe spendet die Redaktion einen Baum.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/stern.svg`,
    tenantLogoLink: 'https://www.stern.de',
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
