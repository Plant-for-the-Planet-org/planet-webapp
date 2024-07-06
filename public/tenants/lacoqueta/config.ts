const config = {
  tenantName: 'lacoqueta',
  tenantURL: 'forest.lacoquetakids.com',
  languages: ['en'],
  fallbackCurrency: 'GBP',
  tenantGoal: 1000000,
  font: {
    primaryFontFamily: '"Libre Baskerville",Helvetica,Arial,serif',
    primaryFontURL:
      'https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap',
  },
  meta: {
    title: 'La Coqueta ❤️ Trees',
    description:
      'Seeing her own children grow up and become increasingly interested in the climate crisis has inspired Celia to use her brand as a platform for positive change. After learning that trees are the most economical and effective means of binding CO2, allowing more time to reduce greenhouse gas emissions to zero and mitigate the climate crisis, they decided to embark on this exciting journey with Plant-for-the-Planet. You can also become part of that journey and donate some trees – in Granada, the hometown of Celia, or other areas around the world.',
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  home: {
    image: `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/lacoqueta/logo.svg`,
    tenantLogoLink: 'https://www.lacoquetakids.com',
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
