const config = {
  tenantName: 'salesforce',
  tenantURL: 'trees.salesforce.com',
  statusURL: 'https://status.pp.eco/785980197',
  languages: ['en'],
  fallbackCurrency: 'USD',
  tenantGoal:null,
  showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"SalesforceSans",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/salesforce/salesforce-sans.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`,
    tenantLogoLink: 'https://www.salesforce.com/sustainability/',
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
    title: 'Salesforce ❤️ Trees',
    description:
      'Salesforce set a goal to conserve, restore, and grow 100 million trees by 2030. We partnered with Plant-for-the-Planet to share our progress and...',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
