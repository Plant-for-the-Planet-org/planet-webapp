const config = {
  tenantName: 'sitex',
  tenantURL: 'wald.sitex.de',
  languages: ['de', 'en'],
  fallbackCurrency: 'EUR',
  tenantGoal: 500000,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  meta: {
    title: 'Sitex ❤️ Wald',
    description:
      'Die Klimarettung ist eine globale Aufgabe und lässt sich nur bewältigen, wenn wir alle zusammen vorgehen. Wir möchten unseren Kindern und Enkelkindern einen intakten Planeten hinterlassen. Darum unterstützen wir Plant-for-the-Planet und die Methode des Bäume-Pflanzens, um möglichst viel CO² aus der Atmosphäre zu binden. Unser Beitrag in der Sitex-Gruppe: durch kontinuierliches Pflanzen spenden wir mindestens 500.000 Bäume bis 2027.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/sitex/logo.png`,
    tenantLogoLink: 'https://wald.sitex.de/',
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
      me: {
        title: 'me',
        onclick: '/me',
        visible: false,
      },
    },
  },
  footerLinks: ['privacyAndTerms', 'imprint', 'contact', 'supportUs'],
};

export default config;
