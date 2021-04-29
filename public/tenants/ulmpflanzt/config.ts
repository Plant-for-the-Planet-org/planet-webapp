const config = {
  tenantName: 'ulmpflanzt',
  tenantURL: 'wald.xn--ulm-pflanzt-bume-7nb.de',
  languages: ['de'],
  fallbackCurrency: 'EUR',
  tenantGoal:124781,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Ulm pflanzt Bäume',
    description:
      '124.781 Bäume – für jede/n Ulmer Bürger/in einen. Das ist das Ziel von „Ulm pflanzt Bäume“ – der Klima-Initiative von Plant-for-the-Planet , dem unw (Ulmer Initiativkreis nachhaltige Wirtschaftsentwicklung e. V.), den Ulmer Unternehmen pervormance international, Trivis und der Volksbank Ulm sowie der Stadt Ulm und der lokalen agenda ulm 21.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `/tenants/pampers/background.jpeg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/ulmpflanzt/logo.svg`,
    tenantLogoLink: 'https://xn--ulm-pflanzt-bume-7nb.de/',
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
