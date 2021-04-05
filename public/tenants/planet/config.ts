const config = {
  // name of tenant
  tenantName: 'planet',
  statusURL: 'https://status.pp.eco/785878669',
  // url of tenant home page
  tenantURL: 'www.plant-for-the-planet.org',
  tenantGoal:null,
  showUNEPLogo:true,
  showUNDecadeLogo:true,
  showRedeemHint:true,
  enableGuestSepa:false,
  // font family and it's property particular to tenant
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR'],
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: false,
      },
      donate: {
        title: 'home',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://a.plant-for-the-planet.org/',
        visible: true,
      },
      leaderboard: {
        title: 'leaders',
        onclick: '/all',
        visible: true,
      },
      me:{
        title: 'signIn',
        loggedInTitle: 'me',
        onclick: '/me',
        visible: true,
      }
    }
  },
  meta: {
    title: 'Plant trees around the world - Plant-for-the-Planet',
    description:
      "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@trilliontrees',
    locale: 'en_US',
  },
  footerLinks:["shop","privacyAndTerms","imprint","contact","downloads","annualReports","team","jobs","supportUs","blogs", "faqs"]
};

export default config;
