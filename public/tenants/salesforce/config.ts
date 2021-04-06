const config = {
  tenantName: 'salesforce',
  tenantURL: 'trees.salesforce.com',
  languages: ['en'],
  fallbackCurrency: 'USD',
  tenantGoal:null,
  showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"SalesforceSans",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/salesforce/salesforce-sans.css?v1.0`,
    secondaryFontFamily: 'AvantGardeDemi,Helvetica,Arial,sans-serif',
    secondaryFontURL: "/tenants/salesforce/fonts/avantgarde.css",
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
    image: `/tenants/salesforce/images/trees-share.jpg`,
    twitterHandle: '@trilliontrees',
    locale: 'en_US',
  },
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
