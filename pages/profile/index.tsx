import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import Profile from '../../src/features/user/ProfileV2/components/ProfileInfo';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import MyContributions from '../../src/features/user/ProfileV2/components/MyContributions/MyContributions';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@planet-sdk/common';
import { GetStaticPropsContext } from 'next';
import { MyForestProvider } from '../../src/features/common/Layout/MyForestContext';

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = useUserProps();

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
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
          <MyForestProvider>
            <Profile userProfile={profile} />
            <MyContributions profile={profile} token={token} />
          </MyForestProvider>
        </>
      )}
    </UserLayout>
  );
}

export default ProfilePage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        [
          'me',
          'donate',
          'editProfile',
          'redeem',
          'common',
          'country',
          'donationLink',
          'giftfunds',
          'leaderboard',
          'maps',
          'planet',
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
