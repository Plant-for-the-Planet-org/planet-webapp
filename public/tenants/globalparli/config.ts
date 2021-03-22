const config = {
  tenantName: 'globalparli',
  tenantURL: 'donate.globalparli.org',
  languages: ['en'],
  fallbackCurrency: 'INR',
  tenantGoal:null,
  showUNDecadeLogo:false,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/globalparli/globalparli.png`,
    tenantLogoLink: 'http://globalparli.org/',
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
        onclick: 'http://globalparli.org/',
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
        visible: false,
      }
    }
  },
  meta: {
    title: 'Global Parli - Rural economic Revolution',
    description:
      'Transforming farmer`s life by increasing their income above 1 lakh Rs per acre',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
