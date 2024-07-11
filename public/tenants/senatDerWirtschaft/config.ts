const config = {
  tenantName: 'senatDerWirtschaft',
  tenantURL: 'wald.senat-deutschland.de',
  languages: ['de', 'en'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  meta: {
    title: 'Senat Der Wirtschaft',
    description:
      'Die Klimakrise ist eine der größten gesellschaftlichen Herausforderungen und es muss sich etwas ändern. Der Senat der Wirtschaft ist eine Wertegemeinschaft. Wir stehen für eine motivierende und verbindende Vision, verknüpft mit praktischer Umsetzung. Deshalb pflanzen immer mehr unserer Mitglieder Wälder, zusammen mit ihren Mitarbeiter, Geschäftspartnern und Kunden. Jeder gepflanzte Baum bindet CO2 und schenkt uns Menschen wertvolle Zeit. Diese Zeit werden wir nutzen, um unsere CO2-Emissionen massiv zu reduzieren. Versprochen!',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/senatDerWirtschaft/logo.svg`,
    mobileLogoURL: `/tenants/senatDerWirtschaft/logo-mobile.png`,
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
        onclick: 'https://www.plant-for-the-planet.org/',
        visible: false,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me: {
        title: 'me',
        onclick: '/me',
        visible: false,
      },
    },
  },
  footerLinks: ['privacy', 'terms', 'imprint', 'contact', 'supportUs'],
};

export default config;
