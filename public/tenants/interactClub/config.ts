const config = {
  tenantName: 'interactClub',
  tenantURL: 'wald.interact-club.de',
  languages: ['de','en'],
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  meta: {
    title: 'Interact Club Wald',
    description:
      'Bäume pflanzen ist ein Generationenverbindendes, friedensstiftendes Projekt das uns Menschen und besonders jungen Menschen hoffnung gibt und auch Mut. ',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    title: 'Interact Club Wald',
    description:
      '“ Bäume pflanzen ist ein Generationenverbindendes, friedensstiftendes Projekt das uns Menschen und besonders jungen Menschen hoffnung gibt und auch Mut. Mut brauchen wir, um gemeinsam in dieser Klimakrise Lösungen beherzt anzupacken. Unser Ziel ist es als Kinder, Jugendliche und junge Erwachsene die Welt zu mobilisieren 1.000 Milliarden Bäume zu pflanzen damit diese Bäume uns wertvolle Zeit, etwa 15 Jahre, schenken können, die wir unbedingt nutzen sollten, um unsere CO2-Emissionen zu reduzieren. Wiederaufforstung, global skaliert, kann so zum größten Konjunkturprogramm besonders für Länder des Globalen Südens werden. Die Flächen, auf denen wir die 1.000 Milliarden zusätzlichen Bäume pflanzen können, liegen zur Hälfte in Afrika, der Rest in Lateinamerika und Südostasien, und damit in Ländern, die von der Klimakrise am stärksten betroffen sind. Diese Bäume schaffen Arbeitsplätze, sind gut für die Artenvielfalt und binden das Treibhausgas CO2. Die neue Area of Focus der Rotarischen Familie lautet: Umwelt. Wir fangen jetzt an unseren Beitrag zu leisten. Pflanz gemeinsam mit uns Bäume. ” ',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/interactClub/logo.svg`,
    tenantLogoLink: 'http://www.interact-club.de',
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
