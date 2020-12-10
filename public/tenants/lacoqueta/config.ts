const config = {
  tenantName: 'lacoqueta',
  tenantURL: 'forest.lacoquetakids.com',
  languages: ['en'],
  fallbackCurrency: 'GBP',
  tenantGoal:1000000,
  font: {
    primaryFontFamily: '"Libre Baskerville",Helvetica,Arial,serif',
    primaryFontURL: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap',
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  meta: {
    title: 'La Coqueta ❤️ Trees',
    description:
      'Seeing her own children grow up and become increasingly interested in the climate crisis has inspired Celia to use her brand as a platform for positive change. After learning that trees are the most economical and effective means of binding CO2, allowing more time to reduce greenhouse gas emissions to zero and mitigate the climate crisis, they decided to embark on this exciting journey with Plant-for-the-Planet. You can also become part of that journey and donate some trees – in Granada, the hometown of Celia, or other areas around the world.',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
    locale: 'en_US',
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `/tenants/lacoqueta/logo.svg`,
    tenantLogoLink: 'https://www.lacoquetakids.com',
    items: [
      {
        id: 1,
        title: 'home',
        onclick: '/home',
        visible: true,
        key: 'home',
      },
      {
        id: 2,
        title: 'plant',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 3,
        title: 'leaderboard',
        onclick: '/leaderboard',
        visible: false,
        key: 'leaderboard',
      },
      {
        id: 4,
        title: 'me',
        onclick: '/me',
        visible: false,
        key: 'me',
      },
    ],
  },
};

export default config;
