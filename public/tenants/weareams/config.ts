const config = {
  tenantName: 'weareams',
  tenantURL: 'forest.weareams.com',
  languages: ['en'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  meta: {
    title: 'AMS ❤️ Trees',
    description:
      'From 2021 on AMS joins the TrillionTreeCampaign and together with Plant-for-the-Planet we start giving back to nature. We will use the opportunities we get to promote sustainability in our supply chain and through our relationships with clients and business partners. Join us and #StopTalkingStartPlanting!',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/weareams/logo-desktop.jpg`,
    mobileLogoURL: `/tenants/weareams/logo.png`,
    tenantLogoLink: 'https://forest.weareams.com',
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
