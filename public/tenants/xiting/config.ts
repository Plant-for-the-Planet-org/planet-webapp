const config = {
  tenantName: 'xiting',
  tenantURL: 'trees.xiting.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:50000,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Planting trees – For a green future',
    description:
      'With this platform, we at Xiting would like to give our partners, customers, and supporters the opportunity to plant trees quickly and easily and thus join our commitment to climate protection. We are convinced that climate protection only makes sense if it is supported by a broad public and we work together towards a sustainable and green future. Trees are the ideal and most natural means for this, filtering CO2 from the air. Plant with us now!',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/xiting/logo.svg`,
    tenantLogoLink: 'https://www.xiting.de/',
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
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
