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
  home: {
    title: 'Plant Trees with Nitro Snowboards',
    description:
      'Nitro Snowboards set a goal to support and mobilize the conservation, restoration, and growth of a forest.',
    image: `/tenants/nitrosb/background.jpeg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/nitrosb/logo.svg`,
    tenantLogoLink: 'https://www.nitrosnowboards.com',
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
