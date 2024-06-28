import bulkCodes from '../public/static/locales/en/bulkCodes.json';
import common from '../public/static/locales/en/common.json';
import country from '../public/static/locales/en/country.json';
import donate from '../public/static/locales/en/donate.json';
import donationLink from '../public/static/locales/en/donationLink.json';
import editProfile from '../public/static/locales/en/editProfile.json';
import giftfunds from '../public/static/locales/en/giftfunds.json';
import leaderboard from '../public/static/locales/en/leaderboard.json';
import managePayouts from '../public/static/locales/en/managePayouts.json';
import manageProjects from '../public/static/locales/en/manageProjects.json';
import maps from '../public/static/locales/en/maps.json';
import me from '../public/static/locales/en/me.json';
import planet from '../public/static/locales/en/planet.json';
import planetcash from '../public/static/locales/en/planetcash.json';
import profile from '../public/static/locales/en/profile.json';
import redeem from '../public/static/locales/en/redeem.json';
import registerTrees from '../public/static/locales/en/registerTrees.json';
import tenants from '../public/static/locales/en/tenants.json';
import treemapper from '../public/static/locales/en/treemapper.json';
import treemapperAnalytics from '../public/static/locales/en/treemapperAnalytics.json';
import projectDetails from '../public/static/locales/en/projectDetails.json';
import allProjects from '../public/static/locales/en/allProjects.json';

import bulkCodesDE from '../public/static/locales/de/bulkCodes.json';
import commonDE from '../public/static/locales/de/common.json';
import countryDE from '../public/static/locales/de/country.json';
import donateDE from '../public/static/locales/de/donate.json';
import donationLinkDE from '../public/static/locales/de/donationLink.json';
import editProfileDE from '../public/static/locales/de/editProfile.json';
import giftfundsDE from '../public/static/locales/de/giftfunds.json';
import leaderboardDE from '../public/static/locales/de/leaderboard.json';
import managePayoutsDE from '../public/static/locales/de/managePayouts.json';
import manageProjectsDE from '../public/static/locales/de/manageProjects.json';
import mapsDE from '../public/static/locales/de/maps.json';
import meDE from '../public/static/locales/de/me.json';
import planetDE from '../public/static/locales/de/planet.json';
import planetcashDE from '../public/static/locales/de/planetcash.json';
import profileDE from '../public/static/locales/de/profile.json';
import redeemDE from '../public/static/locales/de/redeem.json';
import registerTreesDE from '../public/static/locales/de/registerTrees.json';
import tenantsDE from '../public/static/locales/de/tenants.json';
import treemapperDE from '../public/static/locales/de/treemapper.json';
import treemapperAnalyticsDE from '../public/static/locales/de/treemapperAnalytics.json';
import projectDetailsDE from '../public/static/locales/de/projectDetails.json';
import allProjectsDE from '../public/static/locales/de/allProjects.json';

import deepmerge from 'deepmerge';

const messages_en = {
  ...bulkCodes,
  ...common,
  ...country,
  ...donate,
  ...donationLink,
  ...editProfile,
  ...giftfunds,
  ...leaderboard,
  ...managePayouts,
  ...manageProjects,
  ...maps,
  ...me,
  ...planet,
  ...planetcash,
  ...profile,
  ...redeem,
  ...registerTrees,
  ...tenants,
  ...treemapper,
  ...treemapperAnalytics,
  ...projectDetails,
  ...allProjects,
};

const messages_de = {
  ...bulkCodesDE,
  ...commonDE,
  ...countryDE,
  ...donateDE,
  ...donationLinkDE,
  ...editProfileDE,
  ...giftfundsDE,
  ...leaderboardDE,
  ...managePayoutsDE,
  ...manageProjectsDE,
  ...mapsDE,
  ...meDE,
  ...planetDE,
  ...planetcashDE,
  ...profileDE,
  ...redeemDE,
  ...registerTreesDE,
  ...tenantsDE,
  ...treemapperDE,
  ...treemapperAnalyticsDE,
  ...projectDetailsDE,
  ...allProjectsDE,
};

const getMessages = (locale) => {
  if (locale === 'de') {
    return deepmerge(messages_en, messages_de);
  }
  return messages_en;
};

export default getMessages;
