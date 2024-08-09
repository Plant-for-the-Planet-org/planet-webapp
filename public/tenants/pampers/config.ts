const config = {
  tenantName: 'pampers',
  tenantURL: 'wald.pampers.de',
  languages: ['en', 'de'],
  fallbackCurrency: 'EUR',
  tenantGoal: 60000,
  font: {
    primaryFontFamily: '"HarmoniaSansPro",Helvetica,Arial,sans-serif',
    secondaryFontFamily: '"Pampers Script",Helvetica,Arial,sans-serif',
  },
  meta: {
    title: 'Pampers ❤️ Wald',
    description:
      'Bäume pflanzen für eine nachhaltigere Zukunft Gemeinsam mit euch wollen wir dabei helfen, unseren Kleinsten eine bessere Zukunft zu ermöglichen. Deshalb arbeiten wir mit der Kinder- und Jugendorganisation Plant-for-the-Planet an einem tollen Projekt: dem Pampers Wald. Pro verkaufter Packung Pampers Windeln spenden wir 0,01 EUR/CHF und insgesamt bis zu 100.000 EUR an Plant-for-the-Planet. Unser Ziel: 60.000 Bäume für eine nachhaltige Wiederaufforstung zu pflanzen. Auf der Karte seht ihr, wo das Projekt realisiert wird. Jetzt anschauen und mithelfen.',
    image: `/tenants/pampers/background.jpeg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  home: {
    image: `/tenants/pampers/background.jpeg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/pampers/logo.png`,
    tenantLogoLink: 'https://www.pampers.de/',
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
