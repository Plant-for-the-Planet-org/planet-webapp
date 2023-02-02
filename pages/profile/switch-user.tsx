import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SwitchUser from '../../src/features/user/Settings/SwitchUser';

const SwitchUserPage = () => {
  const { t } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('me:switchUser')}</title>
      </Head>
      <SwitchUser />
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
