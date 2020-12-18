const config = {
  tenantName: 'andalusia',
  tenantURL: 'andalucia.plant-for-the-planet.org',
  languages: ['es','de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  AUTH0_CLIENT_ID: 'XIAxajivQpvZ5eX1BflXjxyrEKFJkfls',
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Andalusia',
    description:
      'Plant trees with Plant-for-the-Planet in Andalusia',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'es_ES',
  },
  home: {
    title: 'Andalusia',
    description: 'Plant trees with Plant-for-the-Planet in Andalusia',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: true,
      },
      donate: {
        title: 'donate_gift',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://a.plant-for-the-planet.org/es-es',
        visible: true,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me:{
        title: 'me',
        onclick: '/me',
        visible: true,
      }
    }
  },
};

export default config;
