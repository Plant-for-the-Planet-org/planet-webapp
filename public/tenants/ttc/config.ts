const config = {
  tenantName: 'ttc',
  tenantURL: 'trilliontreecampaign.org',
  tenantLogoURL: 'https://www.trilliontreecampaign.org',
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR'],
  fallbackCurrency: 'EUR',
  tenantGoal:1000000000000,
  showUNEPLogo:true,
  showUNDecadeLogo:true,
  showRedeemHint:true,
  enableGuestSepa:false,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/ttc/logo.png`,
    tenantLogoLink: 'https://www.trilliontreecampaign.org',
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
        visible: false,
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
    title: "Together let's plant a Trillion Trees!",
    appTitle: 'Trillion Tree Campaign',
    description:
      "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@trilliontrees',
    locale: 'en_US',
  },
  footerLinks:["shop","privacyAndTerms","imprint","contact","downloads","annualReports","team","jobs","supportUs","blogs", "faqs"],
  manifest: '/tenants/ttc/manifest.json',
};

export default config;
