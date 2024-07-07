const config = {
  tenantName: '3pleset',
  tenantURL: 'trees.3pleset.de',
  languages: ['de'],
  fallbackCurrency: 'EUR',
  tenantGoal: 50000,
  font: {
    primaryFontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    primaryFontURL: 'https://fonts.cdnfonts.com/css/helvetica-neue-9',
    secondaryFontFamily: '"Helvetica",Arial,sans-serif',
    secondaryFontURL: 'https://fonts.cdnfonts.com/css/helvetica-255',
  },
  meta: {
    title: 'Alife & Kickin ❤️ Bäume',
    description:
      '#WEAREALIFE Schreibfehler? Nö, Absicht! Ganz nach dem Motto CHOOSE LIFE seid ihr jetzt dran. Denn ab sofort könnt ihr mit Alife & Kickin und der Organisation Plant-for-the-Planet Bäume pflanzen und Leben schenken. Erschafft mit uns den Alife & Kickin Wald. Wie? Pro Onlinebestellung pflanzen wir in den nächsten 2 Monaten einen Baum mit Plant-for-the-Planet. Unser Ziel: 50.000 Bäume für eine nachhaltige Wiederaufforstung. Wo? Auf der Karte seht ihr, wo unser Alife & Kickin Wald realisiert wird. Jetzt anschauen, mithelfen und noch mehr Leben schenken. CHOOSE LIFE. ONE ORDER ONE TREE. #WEAREALIFE',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/3pleset/logo-mobile.svg`,
    mobileLogoURL: `/tenants/3pleset/logo-mobile.svg`,
    tenantLogoLink: 'https://www.3pleset.de',
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
