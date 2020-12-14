const config = {
  // name of tenant
  tenantName: 'planet',
  // url of tenant home page
  tenantURL: 'www.plant-for-the-planet.org',
  showUNEPLogo:true,
  showUNDecadeLogo:true,
  // font family and it's property particular to tenant
  tenantGoal:null,
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
    items: [
      {
        id: 1,
        title: 'home',
        onclick: '/home',
        visible: false,
        key: 'home',
      },
      {
        id: 2,
        title: 'home',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 2,
        title: 'aboutUs',
        onclick: 'https://a.plant-for-the-planet.org/',
        visible: true,
        key: 'about',
      },
      {
        id: 3,
        title: 'leaders',
        onclick: '/all',
        visible: true,
        key: 'leaderboard',
      },
      {
        id: 4,
        title: 'me',
        onclick: '/me',
        visible: true,
        key: 'me',
      },
    ],
  },
  meta: {
    title: 'Plant trees around the world - Plant-for-the-Planet',
    description:
      "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@pftp_int',
    locale: 'en_US',
  },
  footerLinks:["shop","privacyAndTerms","imprint","contact","downloads","annualReports","team","jobs","supportUs","blogs", "faqs"]
};

export default config;
