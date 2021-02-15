const config = {
  tenantName: 'culchacandela',
  tenantURL: 'wald.culchacandela.de',
  languages: ['en', 'de'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  meta: {
    title: 'STOP TALKING. START PLANTING',
    description: 'Culcha Candela X Plant-for-the-Planet',
    image: `/tenants/culchacandela/background.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    title: 'Culcha Candela X Plant-for-the-Planet ',
    description:
      'Wir pflanzen Bäume für ein besseres Weltklima, um uns so wichtige Zeit im Wettlauf gegen die Klimakrise zu verschaffen. Pflanz’ hier mit! Und beim Hören des neuen „Hamma (INVCTS & Dorfkind J-P Remix)” auf music-for-nature & sämtlichen Musik Streaming-Plattformen. Die Streaming Einnahmen spenden wir an Plant-for-the-Planet!',
    image: `/tenants/culchacandela/background.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/culchacandela/logo.svg`,
    tenantLogoLink: 'https://www.culchacandela.de/',
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
