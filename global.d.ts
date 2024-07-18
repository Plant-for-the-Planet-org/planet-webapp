// Use type safe message keys with `next-intl`
type MessagesAllProjects =
  typeof import('./public/static/locales/en/allProjects.json');
type MessagesBulkCodes =
  typeof import('./public/static/locales/en/bulkCodes.json');
type MessagesCommon = typeof import('./public/static/locales/en/common.json');
type MessagesCountry = typeof import('./public/static/locales/en/country.json');
type MessagesDonate = typeof import('./public/static/locales/en/donate.json');
type MessagesDonationLink =
  typeof import('./public/static/locales/en/donationLink.json');
type MessagesEditProfile =
  typeof import('./public/static/locales/en/editProfile.json');
type MessagesGiftfunds =
  typeof import('./public/static/locales/en/giftfunds.json');
type MessagesLeaderboard =
  typeof import('./public/static/locales/en/leaderboard.json');
type MessagesManagePayouts =
  typeof import('./public/static/locales/en/managePayouts.json');
type MessagesManageProjects =
  typeof import('./public/static/locales/en/manageProjects.json');
type MessagesMaps = typeof import('./public/static/locales/en/maps.json');
type MessagesMe = typeof import('./public/static/locales/en/me.json');
type MessagesPlanet = typeof import('./public/static/locales/en/planet.json');
type MessagesPlanetcash =
  typeof import('./public/static/locales/en/planetcash.json');
type MessagesProfile = typeof import('./public/static/locales/en/profile.json');
type MessagesProjectDetails =
  typeof import('./public/static/locales/en/projectDetails.json');
type MessagesProject = typeof import('./public/static/locales/en/project.json');
type MessagesRedeem = typeof import('./public/static/locales/en/redeem.json');
type MessagesRegisterTrees =
  typeof import('./public/static/locales/en/registerTrees.json');
type MessagesTenants = typeof import('./public/static/locales/en/tenants.json');
type MessagesTreemapper =
  typeof import('./public/static/locales/en/treemapper.json');
type MessagesTreemapperAnalytics =
  typeof import('./public/static/locales/en/treemapperAnalytics.json');

type Messages = MessagesAllProjects &
  MessagesBulkCodes &
  MessagesCommon &
  MessagesCountry &
  MessagesDonate &
  MessagesDonationLink &
  MessagesEditProfile &
  MessagesGiftfunds &
  MessagesLeaderboard &
  MessagesManagePayouts &
  MessagesManageProjects &
  MessagesMaps &
  MessagesMe &
  MessagesPlanet &
  MessagesPlanetcash &
  MessagesProfile &
  MessagesProjectDetails &
  MessagesProject &
  MessagesRedeem &
  MessagesRegisterTrees &
  MessagesTenants &
  MessagesTreemapper &
  MessagesTreemapperAnalytics;

declare interface IntlMessages extends Messages {}
