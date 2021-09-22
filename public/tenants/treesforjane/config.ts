const config = {
  tenantName: 'treesforjane',
  tenantURL: 'map.treesforjane.org',
  languages: ['en'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  // showUNDecadeLogo:true,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  hideNavbar: true,
  meta: {
    title: 'Trees for Jane',
    description:
      '"When you donate to Trees for Jane or plant your own tree, you will receive a digital certificate in recognition of your simple but essential contribution to helping our planet become green again!"',
    // image: `/tenants/janegoodall/background.jpg`,
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  home: {
    descriptionTitle: '',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/janegoodall/logo.png`,
    tenantLogoLink: 'https://map.treesforjane.org/',
    items: {
      home: {
        title: 'home',
        onclick: 'https://www.treesforjane.org/',
        visible: true,
      },
      donate: {
        title: 'plant',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://www.treesforjane.org/about',
        visible: true,
      },
      leaderboard: {
        title: 'leaderboard',
        onclick: '/all',
        visible: false,
      },
      me: {
        title: 'me',
        onclick: '/me',
        visible: true,
      },
    },
  },
  footerLinks: ['privacyAndTerms', 'imprint', 'contact'],
};

export default config;
