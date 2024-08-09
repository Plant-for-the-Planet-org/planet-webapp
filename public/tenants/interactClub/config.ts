const config = {
  tenantName: 'interactClub',
  tenantURL: 'wald.interact-club.de',
  languages: ['de', 'en'],
  fallbackCurrency: 'EUR',
  tenantGoal: null,
  showUNDecadeLogo: true,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  meta: {
    title: 'Interact Club Wald',
    description:
      'Bäume pflanzen ist ein Generationenverbindendes, friedensstiftendes Projekt das uns Menschen und besonders jungen Menschen hoffnung gibt und auch Mut. ',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
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
