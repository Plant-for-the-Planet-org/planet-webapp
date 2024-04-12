const config = {
  tenantName: 'ulmpflanzt',
  tenantURL: 'wald.ulm-pflanzt-bäume.de',
  languages: ['de'],
  fallbackCurrency: 'EUR',
  tenantGoal: 124781,
  font: {
    primaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    secondaryFontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  },
  meta: {
    title: 'Ulm pflanzt Bäume',
    description:
      '124.781 Bäume – für jede/n Ulmer Bürger/in einen. Das ist das Ziel von „Ulm pflanzt Bäume“ – der Klima-Initiative von Plant-for-the-Planet , dem unw (Ulmer Initiativkreis nachhaltige Wirtschaftsentwicklung e. V.), den Ulmer Unternehmen pervormance international, Trivis und der Volksbank Ulm sowie der Stadt Ulm und der lokalen agenda ulm 21.',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/ulmpflanzt/logo.svg`,
    tenantLogoLink: 'https://xn--ulm-pflanzt-bume-7nb.de/',
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
