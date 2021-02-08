const config = {
  tenantName: 'sateins',
  tenantURL: 'trees.sat1.de/',
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR'],
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: 'https://www.sat1.de/',
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
        onclick: 'https://a.plant-for-the-planet.org/',
        visible: false,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me:{
        title: 'me',
        onclick: '/me',
        visible: false,
      }
    }
  },
  meta: {
    title: 'Sat1',
    description:
      'Lorem Ipsum',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
