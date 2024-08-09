import deepmerge from 'deepmerge';
import { AbstractIntlMessages } from 'next-intl';

// Update this when a new file is added
type TRANSLATION_FILE_NAMES =
  | 'allProjects'
  | 'bulkCodes'
  | 'common'
  | 'country'
  | 'donate'
  | 'donationLink'
  | 'editProfile'
  | 'giftfunds'
  | 'leaderboard'
  | 'managePayouts'
  | 'manageProjects'
  | 'maps'
  | 'me'
  | 'planet'
  | 'planetcash'
  | 'profile'
  | 'projectDetails'
  | 'project'
  | 'redeem'
  | 'registerTrees'
  | 'tenants'
  | 'treemapper'
  | 'treemapperAnalytics';

interface MessageConfig {
  /**
   * Provide 2 letter (ISO) locale.
   * If not provided, default locale will be applied
   * */
  locale?: string;
  /**
   * Array of json filenames containing translations.
   * Names should be specified without .json extension.
   * Files should be located within public/static/locales/{DEFAULT_LOCALE}
   * */
  filenames: TRANSLATION_FILE_NAMES[];
}

/** Returns default and locale specific messages for the page */
const getMessagesForPage = async ({
  locale = 'en',
  filenames,
}: MessageConfig): Promise<AbstractIntlMessages> => {
  const DEFAULT_LOCALE = 'en';

  if (!filenames || filenames.length === 0) return {};

  let userMessages = {};
  let defaultMessages = {};

  for (const filename of filenames) {
    userMessages = {
      ...userMessages,
      ...(
        await import(
          `../../../public/static/locales/${locale}/${filename}.json`
        )
      ).default,
    };
    defaultMessages = {
      ...defaultMessages,
      ...(
        await import(
          `../../../public/static/locales/${DEFAULT_LOCALE}/${filename}.json`
        )
      ).default,
    };
  }
  return deepmerge(defaultMessages, userMessages);
};

export default getMessagesForPage;
