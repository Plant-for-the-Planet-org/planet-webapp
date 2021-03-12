const config = {
  tenantName: 'senatDerWirtschaft',
  tenantURL: 'wald.senat-deutschland.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Senat Der Wirtschaft',
    description:
      'Die Klimakrise ist eine der größten gesellschaftlichen Herausforderungen und es muss sich etwas ändern. Der Senat der Wirtschaft ist eine Wertegemeinschaft. Wir stehen für eine motivierende und verbindende Vision, verknüpft mit praktischer Umsetzung. Deshalb pflanzen immer mehr unserer Mitglieder Wälder, zusammen mit ihren Mitarbeiter, Geschäftspartnern und Kunden. Jeder gepflanzte Baum bindet CO2 und schenkt uns Menschen wertvolle Zeit. Diese Zeit werden wir nutzen, um unsere CO2-Emissionen massiv zu reduzieren. Versprochen!',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/senatDerWirtschaft/logo.svg`,
    tenantLogoLink: 'https://www.senat-deutschland.de/',
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
