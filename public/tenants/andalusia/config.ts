const config = {
  tenantName: 'andalusia',
  tenantURL: 'wald.energizer.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  AUTH0_CLIENT_ID: 'XIAxajivQpvZ5eX1BflXjxyrEKFJkfls',
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Andalusia',
    description:
      'Mit Plant-for-the-Planet pflanzen wir weltweit Bäume. So entsteht unser globaler EnergizerWald.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    title: 'Andalusia',
    description:
      '"Das Richtige tun" ist für uns der zentrale Leitgedanke, an dem wir unser Handeln ausrichten. Seit der ersten quecksilberfreien Batterie im Jahre 1989 gelingt es uns, unsere Batterien immer weiter zu verbessern, langlebiger und damit umweltfreundlicher zu machen. Unsere Partnerschaft mit Plant-for-the-Planet steht genau in dieser Tradition, die Umwelt zu schonen und für mehr Nachhaltigkeit einzustehen. Gemeinsam pflanzen wir Bäume und veranstalten Bildungsprogramme für Kinder und Jugendliche, um ein Bewusstsein für globale Gerechtigkeit und die Klimakrise zu schaffen. Einbinden wollen wir dabei auch unsere Konsumenten und den Handel, denn nur gemeinsam kann diese zentrale Herausforderung unserer Zeit gelöst werden. Bist du dabei?',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: true,
      },
      donate: {
        title: 'donate_gift',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://a.plant-for-the-planet.org/es',
        visible: true,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me:{
        title: 'me',
        onclick: '/me',
        visible: true,
      }
    }
  },
};

export default config;
