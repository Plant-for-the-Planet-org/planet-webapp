export default function tenantConfig() {
  switch (process.env.TENANT) {
    case 'planet':
      return {
        // name of tenant
        tenantName: 'planet',
        // url of tenant home page
        tenantURL: 'www.trilliontreecampaign.org',
        // font family and it's property particular to tenant
        font: {
          primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
          primaryFontURL:
            'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap&subset=latin-ext',
          secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
          secondaryFontURL:
            'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap&subset=latin-ext',
        },
        header: {
          isSecondaryTenant: false, // This will mean that we have to load both the tenant logo and PFP logo
          tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
          tenantLogoLink: 'https://www.plant-for-the-planet.org',
          items: [
            {
              id: 1,
              order: 1,
              title: 'Donate/Gift',
              onclick: '/',
              visible: true,
              key: 'donate',
            },
            {
              id: 2,
              order: 2,
              title: 'Leaders',
              onclick: '/leaderboard',
              visible: true,
              key: 'leaderboard',
            },
            {
              id: 3,
              order: 4,
              title: 'Home',
              onclick: '/home',
              visible: false,
              key: 'home',
            },
            {
              id: 4,
              order: 3,
              title: 'Me',
              onclick: '/me',
              visible: true,
              key: 'me',
            },
          ],
        },
      };
    case 'salesforce':
      return {
        tenantName: 'salesforce',
        tenantURL: 'trees.salesforce.com',
        font: {
          primaryFontFamily: '"SalesforceSans",Helvetica,Arial,sans-serif',
          primaryFontURL:
            'https://cdn.pp.eco/media/fonts/salesforce/salesforce-sans.css?v1.0',
          secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
          secondaryFontURL:
            'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap&subset=latin-ext',
        },
        header: {
          isSecondaryTenant: true, // This will mean that we have to load both the tenant logo and PFP logo
          tenantLogoURL: `${process.env.CDN_URL}/logo/svg/${process.env.TENANT}.svg`,
          tenantLogoLink: 'https://www.salesforce.com/sustainability/',
          items: [
            {
              id: 1,
              order: 1,
              title: 'Home',
              onclick: '/leaderboard',
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
      };
      case 'planetbeta':
        return {
          tenantName: 'planetbeta',
          tenantURL: 'beta.plant-for-the-planet.org',
          tenantLogoURL: 'https://www.plant-for-the-planet.org',
          font: {
            primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
            primaryFontURL:
              'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap&subset=latin-ext',
            secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
            secondaryFontURL:
              'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap&subset=latin-ext',
          },
          header: {
            isSecondaryTenant: false, // This will mean that we have to load both the tenant logo and PFP logo
            tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
            tenantLogoLink: 'https://www.plant-for-the-planet.org',
            items: [
              {
                id: 1,
                order: 1,
                title: 'Donate/Gift',
                onclick: '/',
                visible: true,
                key: 'donate',
              },
            ],
        },
      },
    default:
      return {
        tenantName: 'planet',
        tenantURL: 'www.plant-for-the-planet.org',
        font: {
          primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
          primaryFontURL:
            'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap&subset=latin-ext',
          secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
          secondaryFontURL:
            'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap&subset=latin-ext',
        },
      };
  }
}
