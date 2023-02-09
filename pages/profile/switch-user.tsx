import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SwitchUser from '../../src/features/user/Settings/SwitchUser';

import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import { useContext } from 'react';
import Custom404 from '../404';

const SwitchUserPage = () => {
  const { user } = useContext(UserPropsContext);
  const { t, i18n } = useTranslation('me');

  return (
    <UserLayout>
      <Head>
        <title>{t('me:switchUser')}</title>
      </Head>
      {user?.allowedToSwitch ? (
        <SwitchUser />
      ) : (
        <Custom404 initialized={i18n.isInitialized} />
      )}
    </UserLayout>
  );
};

export default SwitchUserPage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
