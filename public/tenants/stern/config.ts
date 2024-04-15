const config = {
  tenantName: 'stern',
  tenantURL: 'baeume.stern.de',
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
    title: 'Stern ❤️ Baeume',
    description:
      'Mit Plant-for-the-Planet pflanzen wir weltweit Bäume. So entsteht unser globaler sternWald. Pro verkauftem Exemplar der KeinGradWeiter-Ausgabe spendet die Redaktion einen Baum.',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'de_DE',
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `https://cdn.plant-for-the-planet.org/logo/svg/stern.svg`,
    tenantLogoLink: 'https://www.stern.de',
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
