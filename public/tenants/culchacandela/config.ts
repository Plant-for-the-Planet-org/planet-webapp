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
      '<p>Wir pflanzen B&auml;ume f&uuml;r ein besseres Weltklima, um uns so wichtige Zeit im Wettlauf gegen die Klimakrise zu verschaffen. Pflanz&rsquo; hier mit!&nbsp;<br />&hellip;und beim H&ouml;ren des neuen &bdquo;<a href="https://ffm.to/hamma-4-the-planet" target="_blank" rel="noopener noreferrer">Hamma (INVCTS &amp;Dorfkind J-P Remix)</a>&rdquo;&nbsp;auf&nbsp;s&auml;mtlichen Musik Streaming-Plattformen.<br />Wir spenden die kompletten Streaming Einnahmen des Songs an Plant-for-the-Planet! Powered by&nbsp;<a href="https://www.music-for-nature.net/" target="_blank" rel="noopener noreferrer">music-for-nature</a>!</p>',
    image: `/tenants/culchacandela/background.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/culchacandela/logo.png`,
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
