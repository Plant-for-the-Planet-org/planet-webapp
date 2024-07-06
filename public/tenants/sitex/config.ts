const config = {
  tenantName: 'sitex',
  tenantURL: 'wald.sitex.de',
  languages: ['de', 'en'],
  fallbackCurrency: 'EUR',
  tenantGoal: 500000,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  meta: {
    title: 'Sitex ❤️ Wald',
    description:
      'Die Klimarettung ist eine globale Aufgabe und lässt sich nur bewältigen, wenn wir alle zusammen vorgehen. Wir möchten unseren Kindern und Enkelkindern einen intakten Planeten hinterlassen. Darum unterstützen wir Plant-for-the-Planet und die Methode des Bäume-Pflanzens, um möglichst viel CO² aus der Atmosphäre zu binden. Unser Beitrag in der Sitex-Gruppe: Wir pflanzen mindestens 500.000 Bäume bis 2027.',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
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
