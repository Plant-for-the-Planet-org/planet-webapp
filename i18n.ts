import { getRequestConfig } from 'next-intl/server';
import deepmerge from 'deepmerge';

// IMP - Import any new translation file here in `userMessages` add `defaultMessages`, to enable translation auto complete.
export default getRequestConfig(async ({ locale }) => {
  const userMessages = {
    ...(await import(`./public/static/locales/${locale}/allProjects.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/bulkCodes.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/common.json`)).default,
    ...(await import(`./public/static/locales/${locale}/country.json`)).default,
    ...(await import(`./public/static/locales/${locale}/donate.json`)).default,
    ...(await import(`./public/static/locales/${locale}/donationLink.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/editProfile.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/giftfunds.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/leaderboard.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/managePayouts.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/manageProjects.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/maps.json`)).default,
    ...(await import(`./public/static/locales/${locale}/me.json`)).default,
    ...(await import(`./public/static/locales/${locale}/planet.json`)).default,
    ...(await import(`./public/static/locales/${locale}/planetcash.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/profile.json`)).default,
    ...(await import(`./public/static/locales/${locale}/project.json`)).default,
    ...(await import(`./public/static/locales/${locale}/projectDetails.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/redeem.json`)).default,
    ...(await import(`./public/static/locales/${locale}/registerTrees.json`))
      .default,
    ...(await import(`./public/static/locales/${locale}/tenants.json`)).default,
    ...(await import(`./public/static/locales/${locale}/treemapper.json`))
      .default,
    ...(
      await import(`./public/static/locales/${locale}/treemapperAnalytics.json`)
    ).default,
  };

  const defaultMessages = {
    ...(await import(`./public/static/locales/en/allProjects.json`)).default,
    ...(await import(`./public/static/locales/en/bulkCodes.json`)).default,
    ...(await import(`./public/static/locales/en/common.json`)).default,
    ...(await import(`./public/static/locales/en/country.json`)).default,
    ...(await import(`./public/static/locales/en/donate.json`)).default,
    ...(await import(`./public/static/locales/en/donationLink.json`)).default,
    ...(await import(`./public/static/locales/en/editProfile.json`)).default,
    ...(await import(`./public/static/locales/en/giftfunds.json`)).default,
    ...(await import(`./public/static/locales/en/leaderboard.json`)).default,
    ...(await import(`./public/static/locales/en/managePayouts.json`)).default,
    ...(await import(`./public/static/locales/en/manageProjects.json`)).default,
    ...(await import(`./public/static/locales/en/maps.json`)).default,
    ...(await import(`./public/static/locales/en/me.json`)).default,
    ...(await import(`./public/static/locales/en/planet.json`)).default,
    ...(await import(`./public/static/locales/en/planetcash.json`)).default,
    ...(await import(`./public/static/locales/en/profile.json`)).default,
    ...(await import(`./public/static/locales/en/project.json`)).default,
    ...(await import(`./public/static/locales/en/projectDetails.json`)).default,
    ...(await import(`./public/static/locales/en/redeem.json`)).default,
    ...(await import(`./public/static/locales/en/registerTrees.json`)).default,
    ...(await import(`./public/static/locales/en/tenants.json`)).default,
    ...(await import(`./public/static/locales/en/treemapper.json`)).default,
    ...(await import(`./public/static/locales/en/treemapperAnalytics.json`))
      .default,
  };

  const messages: IntlMessages = deepmerge(defaultMessages, userMessages);

  // Single file, no fallback
  // messages: (await import(`./messages/${locale}.json`)).default,

  return { messages };
});
