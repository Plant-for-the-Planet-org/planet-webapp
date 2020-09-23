const config = {
  tenantName: 'salesforce',
  tenantURL: 'trees.salesforce.com',
  font: {
    primaryFontFamily: '"SalesforceSans",Helvetica,Arial,sans-serif',
    primaryFontURL: `${process.env.CDN_URL}/media/fonts/salesforce/salesforce-sans.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`,
    tenantLogoLink: 'https://www.salesforce.com/sustainability/',
    items: [
      {
        id: 1,
        order: 1,
        title: 'Home',
        onclick: '/home',
        visible: true,
        key: 'home',
      },
      {
        id: 3,
        order: 2,
        title: 'Donate/Gift',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 2,
        order: 3,
        title: 'Leaders',
        onclick: '/',
        visible: false, // Leaders is false for Salesforce
        key: 'leaderboard',
      },

      {
        id: 4,
        order: 4,
        title: 'Me',
        onclick: '/me',
        visible: false, // Me is false for Salesforce
        key: 'me',
      },
    ],
  },
  meta: {
    title: 'Salesforce ❤️ Trees',
    description:
            'Salesforce set a goal to conserve, restore, and grow 100 million trees by 2030. We partnered with Plant-for-the-Planet to share our progress and...',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
  },
};

export default config;
