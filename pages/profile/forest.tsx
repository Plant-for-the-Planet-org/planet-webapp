import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import MyTrees from '../../src/features/user/ProfileV2/components/MyTrees/MyTrees';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { User } from '@planet-sdk/common';

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const { user, contextLoaded, token } = useUserProps();

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();
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
        <div style={{ marginTop: '189px' }}>
          <MyTrees profile={profile} token={token} />
        </div>
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
