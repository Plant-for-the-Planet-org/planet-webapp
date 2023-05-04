import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import Profile from '../../src/features/user/Profile';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@planet-sdk/common';

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = useUserProps();

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        setAuthenticatedType('private');
      }
    }
  }, [contextLoaded, user, router]);

  return (
    <UserLayout>
      <Head>
        <title>{t('profile')}</title>
      </Head>
      {profile && (
        <>
          <Profile
            userprofile={profile}
            authenticatedType={authenticatedType}
          />
          <MyTrees
            authenticatedType={authenticatedType}
            profile={profile}
            token={token}
          />
        </>
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
