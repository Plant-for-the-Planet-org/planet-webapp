const config = {
  tenantName: 'sateins',
  tenantURL: 'waldrekord.de',
  fallbackCurrency: 'EUR',
  tenantGoal:null,
  showUNDecadeLogo:true,
  enableGuestSepa:true,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  languages: ['de','en'],
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: 'https://www.sat1.de/',
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
  meta: {
    title: `BÄUME SPENDEN: SO EINFACH GEHT'S`,
    description:
      'Für jeden gespendeten Euro im Rahmen der "SAT.1 Waldrekord-Woche" wird ein Baum gepflanzt. Aktionspartner Plant-for-the-Planet sorgt dafür, dass auf einer festgelegten Fläche auf der mexikanischen Halbinsel Yucatán im Bundesland Campeche der "SAT.1-Wald" gepflanzt wird - und pflegt die gespendeten Bäume, bis sie groß genug sind, um selbst weiter zu wachsen.',
    image: `/tenants/sateins/images/sat1-sign.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  footerLinks:["privacyAndTerms","imprint","contact","supportUs"]
};

export default config;
