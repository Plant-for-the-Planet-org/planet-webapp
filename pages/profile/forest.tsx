import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const { user, contextLoaded, token } = useUserProps();

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (user && contextLoaded) {
      setProfile(user);
      setAuthenticatedType('private');
    }
  }, [contextLoaded, user]);

  return (
    <UserLayout>
      <Head>
        <title>{t('myForest')}</title>
      </Head>
      {profile && (
        <MyTrees
          authenticatedType={authenticatedType}
          profile={profile}
          token={token}
        />
      )}
    </UserLayout>
  );
}

export default ProfilePage;

export async function getStaticProps({ locale }) {
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
