const config = {
  tenantName: 'stern',
  tenantURL: 'baeume.stern.de',
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL:
                  `${process.env.CDN_URL}/media/fonts/raleway/raleway.css?v1.0`,
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL:
                  `${process.env.CDN_URL}/media/fonts/opensans/open-sans.css?v1.0`,
  },
  meta: {
    title: 'Stern ❤️ Baeume',
    description:
                  'Stern set a goal to conserve, restore, and grow trees by 2030. We partnered with Plant-for-the-Planet to share our progress and...',
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '',
  },
  header: {
    isSecondaryTenant: true,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/stern.svg`,
    tenantLogoLink: 'https://www.stern.de',
    items: [
      {
        id: 1,
        title: 'Home',
        onclick: '/home',
        visible: true,
        key: 'home',
      },
      {
        id: 2,
        title: 'Donate/Gift',
        onclick: '/',
        visible: true,
        key: 'donate',
      },
      {
        id: 3,
        title: 'Leaderboard',
        onclick: '/leaderboard',
        visible: false,
        key: 'leaderboard',
      },
      {
        id: 4,
        title: 'Me',
        onclick: '/me',
        visible: false,
        key: 'me',
      },
    ],
  },
};

export default config;
